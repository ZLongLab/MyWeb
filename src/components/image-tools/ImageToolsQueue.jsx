function size(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImageToolsQueue({ items, downloadLinks }) {
  "use memo";
  return (
    <ol className="image-tools-list" aria-label="图片处理队列">
      {items.map((item, index) => {
        const change = item.result ? (1 - item.result.size / item.file.size) * 100 : 0;
        return (
          <li key={item.id} className="image-tools-item" data-image-status={item.status}>
            <span className="image-tools-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div className="image-tools-file">
              <h3>{item.file.name}</h3>
              <p>原图 {size(item.file.size)}{item.result && <> → 输出 {size(item.result.size)}<span className="image-tools-dimensions">{item.result.width} × {item.result.height} px</span></>}</p>
              {item.error && <p className="image-tools-error">{item.error}</p>}
            </div>
            <div className="image-tools-outcome">
              <span className="image-tools-status">{item.phase || '待处理'}</span>
              {item.result && <span className="image-tools-ratio">{change >= 0 ? '减少' : '增加'} {Math.abs(change).toFixed(1)}%</span>}
            </div>
            {item.result ? (
              <a className="image-tools-download" href={item.result.url} download={item.result.name}
                ref={node => { if (node) downloadLinks.current.set(item.id, node); else downloadLinks.current.delete(item.id); }}
                aria-label={`下载 ${item.result.name}`}>下载 <span aria-hidden="true">↓</span></a>
            ) : <span className="image-tools-download-placeholder" aria-hidden="true">—</span>}
          </li>
        );
      })}
    </ol>
  );
}
