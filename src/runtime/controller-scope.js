// Native browser integrations share one React lifetime. No global APIs are patched.
export function createControllerScope() {
  const abort = new AbortController();
  const cleanups = [];
  const timers = new Set();
  const frames = new Set();
  let active = true;
  return {
    get active() {
      return active;
    },
    cleanup(fn) {
      cleanups.push(fn);
    },
    url(blob) {
      const url = URL.createObjectURL(blob);
      cleanups.push(() => URL.revokeObjectURL(url));
      return url;
    },
    listen(target, type, handler, options) {
      if (!active || !target) return;
      if (
        target === window &&
        type === "load" &&
        document.readyState === "complete"
      ) {
        this.frame(() => handler(new Event("load")));
        return;
      }
      const settings =
        typeof options === "boolean" ? { capture: options } : options || {};
      target.addEventListener(type, handler, {
        ...settings,
        signal: abort.signal,
      });
    },
    legacyListen(target, handler) {
      if (!active) return;
      target.addListener(handler);
      cleanups.push(() => target.removeListener(handler));
    },
    observer(callback, options) {
      const observer = new IntersectionObserver(callback, options);
      cleanups.push(() => observer.disconnect());
      return observer;
    },
    timeout(fn, ms) {
      if (!active) return 0;
      const id = setTimeout(() => {
        timers.delete(id);
        if (active) fn();
      }, ms);
      timers.add(id);
      return id;
    },
    interval(fn, ms) {
      if (!active) return 0;
      const id = setInterval(() => {
        if (active) fn();
      }, ms);
      timers.add(id);
      return id;
    },
    frame(fn) {
      if (!active) return 0;
      const id = requestAnimationFrame((time) => {
        frames.delete(id);
        if (active) fn(time);
      });
      frames.add(id);
      return id;
    },
    dispose() {
      if (!active) return;
      active = false;
      abort.abort();
      timers.forEach(clearTimeout);
      timers.forEach(clearInterval);
      frames.forEach(cancelAnimationFrame);
      cleanups.reverse().forEach((fn) => fn());
    },
  };
}
