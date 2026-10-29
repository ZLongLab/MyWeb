// Import the ST factory directly. The package's generic encode.js can select
// a pthread variant; it is deliberately absent from this module graph.
import factory from '@jsquash/avif/codec/enc/avif_enc.js';
import wasmUrl from '@jsquash/avif/codec/enc/avif_enc.wasm?url';
import { defaultOptions } from '@jsquash/avif/meta.js';
import { once, emscripten } from './initialize.js';

const initialize = once(() => emscripten(factory, wasmUrl));
export default async function encode(image, quality) {
  const codec = await initialize();
  const result = codec.encode(image.data, image.width, image.height, { ...defaultOptions, quality });
  if (!result) throw Error('AVIF 编码失败。');
  return result;
}
