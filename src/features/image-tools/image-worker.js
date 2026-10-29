const encoders = {
  webp: () => import('./codecs/webp.js'),
  jpeg: () => import('./codecs/jpeg.js'),
  avif: () => import('./codecs/avif.js'),
};
const mime = { webp: 'image/webp', jpeg: 'image/jpeg', avif: 'image/avif', png: 'image/png' };
let busy = false;

self.onmessage = async ({ data: { id, file, settings } }) => {
  if (busy) return self.postMessage({ id, error: '已有图片正在处理，请稍后重试。' });
  busy = true;
  let bitmap;
  const phase = value => self.postMessage({ id, phase: value });
  try {
    if (!mime[settings.format]) throw Error('不支持的输出格式。');
    phase('读取图片');
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    if (bitmap.width * bitmap.height > 32_000_000) throw Error('图片超过 3200 万像素，请先缩小原图。');
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw Error('当前浏览器无法创建图片画布。');
    if (settings.format === 'jpeg') {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0);
    bitmap.close();
    bitmap = undefined;
    let image = context.getImageData(0, 0, canvas.width, canvas.height);
    const width = settings.width ? Math.min(image.width, settings.width) : image.width;
    const height = Math.max(1, Math.round(image.height * width / image.width));
    // Release the original canvas allocation before loading large encoders.
    canvas.width = canvas.height = 1;
    if (width !== image.width) {
      phase('调整尺寸');
      const { default: resize } = await import('./codecs/resize.js');
      image = await resize(image, width, height);
    }
    phase('编码中');
    let blob;
    if (settings.format === 'png') {
      const output = new OffscreenCanvas(width, height);
      const outputContext = output.getContext('2d');
      if (!outputContext) throw Error('当前浏览器无法导出 PNG。');
      outputContext.putImageData(image, 0, 0);
      blob = await output.convertToBlob({ type: mime.png });
      output.width = output.height = 1;
    } else {
      const { default: encode } = await encoders[settings.format]();
      const bytes = await encode(image, settings.quality);
      blob = new Blob([bytes], { type: mime[settings.format] });
    }
    if (!blob.size) throw Error('没有生成有效的图片。');
    self.postMessage({ id, blob, width, height });
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : '图片处理失败。' });
  } finally {
    bitmap?.close();
    busy = false;
  }
};
