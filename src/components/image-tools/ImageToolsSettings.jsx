export default function ImageToolsSettings({ settings, onChange, busy }) {
  "use memo";
  return (
    <fieldset className="image-tools-settings" disabled={busy}>
      <legend>统一转换设置</legend>
      <label>
        <span>目标格式</span>
        <select aria-label="目标格式" value={settings.format} onChange={event => onChange({ ...settings, format: event.target.value })}>
          <option value="webp">WebP</option>
          <option value="jpeg">JPEG</option>
          <option value="avif">AVIF</option>
          <option value="png">PNG</option>
        </select>
      </label>
      <label className="image-tools-quality">
        <span>质量 <output>{settings.quality}</output></span>
        <input aria-label="输出质量" type="range" min="1" max="100" value={settings.quality}
          disabled={settings.format === 'png'}
          onChange={event => onChange({ ...settings, quality: Number(event.target.value) })} />
        <small>{settings.format === 'png' ? 'PNG 无损输出，不使用质量设置。' : '数值越高，通常保留更多细节。'}</small>
      </label>
      <label>
        <span>尺寸档</span>
        <select aria-label="尺寸档" value={settings.width} onChange={event => onChange({ ...settings, width: Number(event.target.value) })}>
          <option value="0">原尺寸</option>
          <option value="1920">最大宽度 1920 px</option>
          <option value="960">最大宽度 960 px</option>
          <option value="640">最大宽度 640 px</option>
        </select>
        <small>保持比例，小图不放大。</small>
      </label>
    </fieldset>
  );
}
