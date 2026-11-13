import { useEffect, useRef } from "react";

export default function PrismSphereCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current!;
    const context = element.getContext("2d");
    if (!context) return;
    let angle = 0;
    function draw() {
      const width = element.clientWidth,
        height = element.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(devicePixelRatio, 2);
      element.width = width * ratio;
      element.height = height * ratio;
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      context!.clearRect(0, 0, width, height);
      const radius = Math.min(width * 0.31, height * 0.36),
        cx = width * 0.51,
        cy = height * 0.46;
      for (let i = 0; i < 2600; i++) {
        const y = 1 - (2 * i) / 2599,
          ring = Math.sqrt(1 - y * y),
          phi = i * 2.399963 + angle;
        const x = Math.cos(phi) * ring,
          z = Math.sin(phi) * ring;
        const tiltY = y * 0.92 - x * 0.38,
          tiltX = x * 0.92 + y * 0.38;
        context!.beginPath();
        context!.arc(
          cx + tiltX * radius,
          cy + tiltY * radius,
          z > 0.3 ? 0.8 : 0.5,
          0,
          Math.PI * 2,
        );
        context!.fillStyle = `hsla(${148 + y * 42 + z * 40},42%,${54 + z * 10}%,${0.13 + (z + 1) * 0.14})`;
        context!.fill();
      }
    }
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    const move = (event: PointerEvent) => {
      angle = (event.offsetX / element.clientWidth) * 0.4;
      draw();
    };
    element.addEventListener("pointermove", move);
    draw();
    return () => {
      observer.disconnect();
      element.removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <div
      className="prism-scene"
      role="img"
      aria-label="晨雾中的折射玻璃球与三棱镜"
    >
      <div className="sphere-glow" />
      <div className="glass-orbit orbit-one" />
      <div className="glass-orbit orbit-two" />
      <canvas ref={canvas} aria-hidden="true" />
      <div className="prism-object">
        <i />
        <i />
        <i />
      </div>
      <span className="light-spill" />
    </div>
  );
}
