import factory from '@jsquash/webp/codec/enc/webp_enc.js';
import wasmUrl from '@jsquash/webp/codec/enc/webp_enc.wasm?url';
import { defaultOptions } from '@jsquash/webp/meta.js';
import { once, emscripten } from './initialize.js';

const initialize = once(() => emscripten(factory, wasmUrl));
export default async function encode(image, quality) {
  const codec = await initialize();
  const result = codec.encode(image.data, image.width, image.height, {
    ...defaultOptions, quality, thread_level: 0,
  });
  if (!result) throw Error('WebP 编码失败。');
  return result;
}
