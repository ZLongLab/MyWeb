import { useEffect, useRef, useState } from 'react';
import ImageToolsSettings from '../components/image-tools/ImageToolsSettings.jsx';
import ImageToolsQueue from '../components/image-tools/ImageToolsQueue.jsx';
import { ImageProcessor } from '../features/image-tools/processor.js';

const accept = 'image/png,image/jpeg,image/webp,image/avif,image/gif,image/bmp';
const supported = /\.(?:png|jpe?g|webp|avif|gif|bmp)$/i;

export default function ImageToolsPage() {
  "use memo";
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({ format: 'webp', quality: 80, width: 0 });
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState('选择图片，调整设置，再开始转换。');
  const [online, setOnline] = useState(navigator.onLine);
  const processor = useRef(null);
  const running = useRef(false);
  const mounted = useRef(false);
  const sequence = useRef(0);
  const generation = useRef(0);
  const urls = useRef(new Set());
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
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  function releaseResults() {
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
          patch(item.id, { status: 'done', phase: '已完成', result: { url, name, size: result.blob.size, width: result.width, height: result.height } });
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
  const completed = items.filter(item => item.status === 'done').length;
  return (
    <main className="image-tools" id="main">
      <header className="image-tools-hero">
        <p className="eyebrow">工作台里的小工具 / IMAGE WORKSHOP · 04</p>
        <h1>图片工坊<span className="title-period">。</span></h1>
        <p className="image-tools-lead">把几张图片放进来，调整格式与尺寸，再带走需要的文件。</p>
        <p className="image-tools-local">全程在当前浏览器本地处理，不上传图片。</p>
      </header>

      <section aria-label="选择图片与转换设置" className="image-tools-panel">
        <div className="image-tools-drop" data-dragging={dragging} data-disabled={busy || downloading}
          onDragOver={event => { event.preventDefault(); if (!busy && !downloading) setDragging(true); }}
          onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
          onDrop={event => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}>
          <span className="image-tools-drop-mark" aria-hidden="true">＋</span>
          <h2>拖放图片到这里</h2>
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
            <button type="button" onClick={downloadAll} disabled={!completed || busy || downloading}>{downloading ? '正在下载…' : '全部下载'}</button>
            <button type="button" disabled={!items.length || busy || downloading} onClick={() => { releaseResults(); setItems([]); setNotice('列表已清空。'); }}>清空列表</button>
          </div>
        </div>
        <p className="image-tools-notice" role="status" aria-live="polite">{notice}</p>
        {items.length ? <ImageToolsQueue items={items} downloadLinks={downloadLinks} /> : <p className="image-tools-empty">还没有图片。先放进几张想整理的文件。</p>}
      </section>
      <aside className="image-tools-notes" aria-label="使用说明">
        <p>支持浏览器可解码的静态图片；GIF 等动画只处理首帧。JPEG 的透明区域会填为白色，输出不保留原图附加元数据。单张最多 3200 万像素。</p>
        <p>文件只在当前页暂存，刷新后需要重新选择。全部下载会逐个保存，浏览器可能询问是否允许多个文件下载。</p>
        <p>离线时可打开本页；处理组件不预缓存，首次转换或重新加载组件需要联网。</p>
        <p>编解码来自 jSquash / Squoosh。<a href="THIRD-PARTY-LICENSES.txt">查看开源许可 ↗</a><a href="colophon.html#image-tools">阅读使用边界 →</a></p>
      </aside>
    </main>
  );
}
