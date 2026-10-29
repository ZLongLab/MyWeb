// One successful initialization per codec in the single processing worker.
// A failed network load may be retried after reconnecting.
export function once(load) {
  let ready;
  return () => ready ||= Promise.resolve().then(load).catch(error => {
    ready = undefined;
    throw error;
  });
}

export function emscripten(factory, wasmUrl) {
  return factory({ noInitialRun: true, locateFile: () => wasmUrl });
}
