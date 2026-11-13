import { useEffect, useRef } from "react";
import { createPrismScene } from "./prism-renderer";

export default function PrismSphereCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const animation = useRef<number | null>(null);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d", { alpha: true });
    if (!element || !context) return;
    const draw = createPrismScene(context);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0 },
      tilt = { x: 0, y: 0, z: 0 };
    let width = element.clientWidth,
      height = element.clientHeight;
    let phase = 0,
      lastTime = 0,
      inView = true,
      disposed = false;
    function paint() {
      if (!width || !height || disposed) return;
      const ratio = window.devicePixelRatio || 1;
      const pixelWidth = Math.round(width * ratio),
        pixelHeight = Math.round(height * ratio);
      if (element!.width !== pixelWidth || element!.height !== pixelHeight) {
        element!.width = pixelWidth;
        element!.height = pixelHeight;
      }
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(width, height, phase, tilt);
    }
    function stop() {
      if (animation.current !== null) cancelAnimationFrame(animation.current);
      animation.current = null;
      lastTime = 0;
    }
    function tick(time: number) {
      animation.current = null;
      if (disposed || document.hidden || !inView) return;
      // Limit drawing to 30fps and use elapsed time for monitor-independent motion.
      if (!lastTime || time - lastTime >= 1000 / 30 - 1) {
        const delta = lastTime
          ? Math.min((time - lastTime) / 1000, 0.08)
          : 1 / 30;
        lastTime = time;
        phase += delta;
        const lerp = 1 - Math.exp(-delta * 5);
        tilt.x += (target.x - tilt.x) * lerp;
        tilt.y += (target.y - tilt.y) * lerp;
        paint();
      }
      animation.current = requestAnimationFrame(tick);
    }
    function synchronize() {
      stop();
      if (disposed || document.hidden || !inView || !width || !height) return;
      paint();
      if (!motion.matches) animation.current = requestAnimationFrame(tick);
    }
    function resize() {
      width = element!.clientWidth;
      height = element!.clientHeight;
      synchronize();
    }
    function move(event: PointerEvent) {
      const bounds = element!.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      target.x = Math.max(
        -1,
        Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
      );
      target.y = Math.max(
        -1,
        Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      );
      if (motion.matches) {
        tilt.x = target.x;
        tilt.y = target.y;
        paint();
      }
    }
    function leave() {
      target.x = 0;
      target.y = 0;
      if (motion.matches) {
        tilt.x = 0;
        tilt.y = 0;
        paint();
      }
    }
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      synchronize();
    });
    observer.observe(element);
    intersection.observe(element);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", synchronize);
    window.addEventListener("resize", resize);
    motion.addEventListener("change", synchronize);
    synchronize();
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      intersection.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", synchronize);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", synchronize);
    };
  }, []);
  return (
    <div
      className="prism-scene"
      role="img"
      aria-label="缓慢自转的薄荷金色粒子球、轨道与透明玻璃三棱镜"
    >
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
}
