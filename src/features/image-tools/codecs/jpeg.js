import factory from '@jsquash/jpeg/codec/enc/mozjpeg_enc.js';
import wasmUrl from '@jsquash/jpeg/codec/enc/mozjpeg_enc.wasm?url';
import { defaultOptions } from '@jsquash/jpeg/meta.js';
import { once, emscripten } from './initialize.js';

const initialize = once(() => emscripten(factory, wasmUrl));
export default async function encode(image, quality) {
  const codec = await initialize();
  const result = codec.encode(image.data, image.width, image.height, { ...defaultOptions, quality });
  if (!result) throw Error('JPEG 编码失败。');
  return result;
}
