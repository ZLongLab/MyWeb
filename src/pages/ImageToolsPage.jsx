import { useEffect, useRef, useState } from 'react';
import ImageToolsSettings from '../components/image-tools/ImageToolsSettings.jsx';
import ImageToolsQueue from '../components/image-tools/ImageToolsQueue.jsx';
import { ImageProcessor } from '../features/image-tools/processor.js';
import { createZipBlob } from '../features/image-tools/zip.js';

const accept = 'image/png,image/jpeg,image/webp,image/avif,image/gif,image/bmp';
const supported = /\.(?:png|jpe?g|webp|avif|gif|bmp)$/i;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageToolsPage() {
  "use memo";
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({ format: 'webp', quality: 80, width: 0 });
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState('选择图片，或直接按 Ctrl+V 粘贴截图，调整设置后开始转换。');
  const [online, setOnline] = useState(navigator.onLine);
  const [compareItem, setCompareItem] = useState(null);
  const [compareSplit, setCompareSplit] = useState(50);
  const processor = useRef(null);
  const running = useRef(false);
  const mounted = useRef(false);
  const sequence = useRef(0);
  const generation = useRef(0);
  const urls = useRef(new Set());
  const compareUrlRef = useRef(null);
  const compareDialogRef = useRef(null);
  const downloadLinks = useRef(new Map());

  useEffect(() => {
    mounted.current = true;
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    const allocatedUrls = urls.current;
    return () => {
      mounted.current = false;
      generation.current += 1;
      running.current = false;
      processor.current?.dispose();
      processor.current = null;
      allocatedUrls.forEach(url => URL.revokeObjectURL(url));
      allocatedUrls.clear();
      if (compareUrlRef.current) {
        URL.revokeObjectURL(compareUrlRef.current);
        compareUrlRef.current = null;
      }
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    function handlePaste(event) {
      if (running.current) return;
      const clipItems = event.clipboardData?.items;
      if (!clipItems) return;
      const pasted = [];
      for (const entry of clipItems) {
        if (entry.type.startsWith('image/')) {
          const file = entry.getAsFile();
          if (file) {
            const ext = file.type.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
            pasted.push(new File([file], `clipboard-${Date.now().toString(36)}.${ext}`, { type: file.type }));
          }
        }
      }
      if (pasted.length) {
        event.preventDefault();
        const added = pasted.map(file => ({ id: ++sequence.current, file, status: 'pending', phase: '待处理' }));
        setItems(previous => [...previous, ...added]);
        setNotice(`已粘贴加入 ${added.length} 张剪贴板图片。`);
      }
    }
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  function closeCompare() {
    if (compareDialogRef.current?.open) compareDialogRef.current.close();
    if (compareUrlRef.current) {
      URL.revokeObjectURL(compareUrlRef.current);
      compareUrlRef.current = null;
    }
    setCompareItem(null);
  }

  function openCompare(item) {
    if (!item?.result) return;
    if (compareUrlRef.current) URL.revokeObjectURL(compareUrlRef.current);
    const originalUrl = URL.createObjectURL(item.file);
    compareUrlRef.current = originalUrl;
    setCompareSplit(50);
    setCompareItem({ item, originalUrl });
    if (compareDialogRef.current && !compareDialogRef.current.open) {
      compareDialogRef.current.showModal();
    }
  }

  function releaseResults() {
    closeCompare();
    urls.current.forEach(url => URL.revokeObjectURL(url));
    urls.current.clear();
  }
  function addFiles(files) {
    if (running.current || downloading) return;
    const accepted = Array.from(files).filter(file => supported.test(file.name));
    const added = accepted.map(file => ({ id: ++sequence.current, file, status: 'pending', phase: '待处理' }));
    setItems(previous => [...previous, ...added]);
    setNotice(added.length === files.length ? `已加入 ${added.length} 张图片。` : `已加入 ${added.length} 张图片；仅支持 PNG、JPEG、WebP、AVIF、GIF、BMP。`);
  }
  async function start() {
    if (running.current || downloading || !items.length) return;
    if (!navigator.onLine) {
      setNotice('当前处于离线状态。请先联网，首次转换需要加载处理组件。');
      return;
    }
    if (!globalThis.Worker || !globalThis.OffscreenCanvas || !globalThis.createImageBitmap) {
      setNotice('当前浏览器缺少图片处理能力，请使用较新的 Chrome、Edge、Firefox 或 Safari。');
      return;
    }
    running.current = true;
    const run = ++generation.current;
    const current = () => mounted.current && generation.current === run;
    setBusy(true);
    releaseResults();
    const batch = items.map(item => ({ id: item.id, file: item.file, status: 'pending', phase: '待处理' }));
    setItems(batch);
    const options = { ...settings };
    const patch = (id, changes) => {
      if (current()) setItems(previous => previous.map(item => item.id === id ? { ...item, ...changes } : item));
    };
    let done = 0;
    try {
      processor.current ||= new ImageProcessor();
      for (const [index, item] of batch.entries()) {
        if (!current()) break;
        setNotice(`正在处理第 ${index + 1} / ${batch.length} 张。`);
        patch(item.id, { status: 'processing', phase: '准备处理' });
        try {
          const result = await processor.current.convert(item.file, options, phase => patch(item.id, { phase }));
          if (!current()) break;
          const url = URL.createObjectURL(result.blob);
          urls.current.add(url);
          const stem = item.file.name.replace(/\.[^.]*$/, '') || 'image';
          const extension = options.format === 'jpeg' ? 'jpg' : options.format;
          const name = `${stem}-${String(index + 1).padStart(2, '0')}.${extension}`;
          patch(item.id, { status: 'done', phase: '已完成', result: { url, blob: result.blob, name, size: result.blob.size, width: result.width, height: result.height } });
          done += 1;
        } catch (error) {
          const message = navigator.onLine ? `处理失败：${error.message} 可联网后重试，或换一张浏览器可读取的图片。` : '网络已断开，处理组件尚未加载完成，请联网后重试。';
          patch(item.id, { status: 'error', phase: '未完成', error: message });
        }
        // Give React an opportunity to paint each completion before the next job.
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      if (current()) setNotice(`处理结束：${done} / ${batch.length} 张已完成${done < batch.length ? '，未完成项可重新转换。' : '。'}`);
    } catch {
      if (current()) setNotice('图片处理组件启动失败，请联网后重新打开本页重试。');
    } finally {
      if (current()) { running.current = false; setBusy(false); }
    }
  }
  async function downloadAll() {
    if (busy || downloading) return;
    setDownloading(true);
    const run = generation.current;
    try {
      for (const item of items) {
        if (!mounted.current || generation.current !== run) break;
        if (item.result) {
          downloadLinks.current.get(item.id)?.click();
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }
    } finally {
      if (mounted.current && generation.current === run) setDownloading(false);
    }
  }
  async function downloadZip() {
    if (busy || downloading) return;
    const ready = items.filter(item => item.result?.blob);
    if (!ready.length) return;
    setDownloading(true);
    try {
      const zipBlob = await createZipBlob(ready.map(item => ({ name: item.result.name, blob: item.result.blob })));
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-workshop-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setNotice(`已将 ${ready.length} 张成图打包为 ZIP 并开始下载。`);
    } catch {
      setNotice('ZIP 打包失败，可以直接点击单张下载或全部下载。');
    } finally {
      if (mounted.current) setDownloading(false);
    }
  }
  const completed = items.filter(item => item.status === 'done').length;
  return (
    <main className="image-tools" id="main">
      <header className="image-tools-hero">
        <p className="eyebrow">工作台里的小工具 / IMAGE WORKSHOP · 04</p>
        <h1>图片工坊<span className="title-period">。</span></h1>
        <p className="image-tools-lead">把几张图片放进来，调整格式与尺寸，可滑动对比画质并一键打包带走。</p>
        <p className="image-tools-local">全程在当前浏览器本地处理，支持 Ctrl+V 粘贴截图，绝不上传原图。</p>
      </header>

      <section aria-label="选择图片与转换设置" className="image-tools-panel">
        <div className="image-tools-drop" data-dragging={dragging} data-disabled={busy || downloading}
          onDragOver={event => { event.preventDefault(); if (!busy && !downloading) setDragging(true); }}
          onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
          onDrop={event => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}>
          <span className="image-tools-drop-mark" aria-hidden="true">＋</span>
          <h2>拖放图片到这里，或按 Ctrl+V 粘贴</h2>
          <p>可一次选择多张，按顺序逐张处理。</p>
          <label className="image-tools-pick" htmlFor="image-tools-input">选择图片</label>
          <input className="visually-hidden" id="image-tools-input" type="file" multiple accept={accept}
            aria-label="选择需要转换的图片" disabled={busy || downloading}
            onChange={event => { addFiles(event.target.files); event.target.value = ''; }} />
        </div>
        <ImageToolsSettings settings={settings} onChange={setSettings} busy={busy || downloading} />
        <div className="image-tools-actions">
          <button className="button button-primary" type="button" onClick={start} disabled={!items.length || busy || downloading}>{busy ? '正在逐张处理…' : '开始转换'}</button>
          <p>AVIF 编码较慢，请稍等。PNG 输出不使用质量设置。</p>
        </div>
        {!online && <p className="image-tools-offline" role="status">当前离线：页面可以打开，首次转换需要联网加载处理组件。</p>}
      </section>

      <section className="image-tools-queue" aria-labelledby="image-tools-queue-title">
        <div className="image-tools-queue-heading">
          <div><p className="eyebrow">QUEUE / 本页暂存</p><h2 id="image-tools-queue-title">处理队列 <span>{items.length}</span></h2></div>
          <div className="image-tools-queue-actions">
            <button type="button" className="image-tools-zip-btn" onClick={downloadZip} disabled={!completed || busy || downloading}>打包 ZIP</button>
            <button type="button" onClick={downloadAll} disabled={!completed || busy || downloading}>{downloading ? '正在下载…' : '全部下载'}</button>
            <button type="button" disabled={!items.length || busy || downloading} onClick={() => { releaseResults(); setItems([]); setNotice('列表已清空。'); }}>清空列表</button>
          </div>
        </div>
        <p className="image-tools-notice" role="status" aria-live="polite">{notice}</p>
        {items.length ? <ImageToolsQueue items={items} downloadLinks={downloadLinks} onCompare={openCompare} /> : <p className="image-tools-empty">还没有图片。先放进几张想整理的文件。</p>}
      </section>

      <dialog
        ref={compareDialogRef}
        className="image-compare-dialog"
        aria-labelledby="image-compare-title"
        onCancel={event => { event.preventDefault(); closeCompare(); }}
        onClick={event => { if (event.target === compareDialogRef.current) closeCompare(); }}
      >
        {compareItem && (
          <div className="image-compare-shell">
            <div className="image-compare-head">
              <div>
                <p className="eyebrow">BEFORE / AFTER</p>
                <h2 id="image-compare-title">{compareItem.item.file.name}</h2>
              </div>
              <button type="button" className="image-compare-close" onClick={closeCompare} aria-label="关闭画质对比">×</button>
            </div>
            <div className="image-compare-meta">
              <span>原图：{formatBytes(compareItem.item.file.size)}</span>
              <span>成图：{formatBytes(compareItem.item.result.size)}（{compareItem.item.result.width} × {compareItem.item.result.height}）</span>
            </div>
            <div className="image-compare-stage">
              <img src={compareItem.item.result.url} alt="转换后的图片" className="image-compare-img" />
              <div className="image-compare-overlay" style={{ clipPath: `inset(0 ${100 - compareSplit}% 0 0)` }}>
                <img src={compareItem.originalUrl} alt="原始图片" className="image-compare-img" />
              </div>
              <div className="image-compare-divider" style={{ left: `${compareSplit}%` }} aria-hidden="true" />
              <span className="image-compare-tag is-left">原图</span>
              <span className="image-compare-tag is-right">成图</span>
            </div>
            <label className="image-compare-slider">
              <span>拖动滑块对比细节</span>
              <input
                type="range"
                min="0"
                max="100"
                value={compareSplit}
                onChange={event => setCompareSplit(Number(event.target.value))}
              />
            </label>
          </div>
        )}
      </dialog>

      <aside className="image-tools-notes" aria-label="使用说明">
        <p><a href="article.html?id=image-workshop-batch-guide">阅读批量转换入门教程 →</a></p>
        <p>支持浏览器可解码的静态图片；GIF 等动画只处理首帧。JPEG 的透明区域会填为白色，输出不保留原图附加元数据。单张最多 3200 万像素。</p>
        <p>文件只在当前页暂存，刷新后需要重新选择。多张成图推荐使用「打包 ZIP」一次保存，避免浏览器拦截连续下载。</p>
        <p>离线时可打开本页；处理组件不预缓存，首次转换或重新加载组件需要联网。</p>
        <p>编解码来自 jSquash / Squoosh。<a href="THIRD-PARTY-LICENSES.txt">查看开源许可 ↗</a><a href="colophon.html#image-tools">阅读使用边界 →</a></p>
      </aside>
    </main>
  );
}
