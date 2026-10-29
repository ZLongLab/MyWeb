// The page creates one worker on the first conversion, never during rendering.
// Only one request is allowed at a time, even if a caller bypasses the UI queue.
export class ImageProcessor {
  constructor() {
    this.worker = new Worker(new URL('./image-worker.js', import.meta.url), { type: 'module' });
    this.pending = null;
    this.sequence = 0;
    this.worker.onmessage = ({ data }) => {
      const current = this.pending;
      if (!current || data.id !== current.id) return;
      if (data.phase) return current.progress(data.phase);
      this.pending = null;
      if (data.error) current.reject(Error(data.error));
      else current.resolve(data);
    };
    this.worker.onerror = event => {
      event.preventDefault();
      const current = this.pending;
      this.pending = null;
      this.failed = true;
      this.worker.terminate();
      current?.reject(Error('图片处理组件加载失败，请联网后重新打开本页重试。'));
    };
  }
  convert(file, settings, progress) {
    if (this.failed) return Promise.reject(Error('处理组件已停止，请联网后重新打开本页。'));
    if (this.pending) return Promise.reject(Error('队列仍在处理中。'));
    return new Promise((resolve, reject) => {
      const id = ++this.sequence;
      this.pending = { id, resolve, reject, progress };
      this.worker.postMessage({ id, file, settings });
    });
  }
  dispose() {
    this.worker.terminate();
    this.pending?.reject(Error('页面已关闭。'));
    this.pending = null;
  }
}
