// Only Lanczos3 is used. Avoid importing the package index, which also exposes
// hqx and magic-kernel binaries that this page does not need.
import initializeWasm, { resize } from '@jsquash/resize/lib/resize/pkg/squoosh_resize.js';
import wasmUrl from '@jsquash/resize/lib/resize/pkg/squoosh_resize_bg.wasm?url';
import { once } from './initialize.js';

const initialize = once(() => initializeWasm(wasmUrl));
export default async function scale(image, width, height) {
  await initialize();
  const pixels = resize(new Uint8Array(image.data.buffer), image.width, image.height,
    width, height, 3, true, true);
  return new ImageData(pixels, width, height);
}
