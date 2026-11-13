export type Point = { x: number; y: number; z: number };
const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function rotate(point: Point, pitch: number, yaw: number): Point {
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const z = point.z * Math.cos(yaw) - point.x * Math.sin(yaw);
  return {
    x,
    y: point.y * Math.cos(pitch) - z * Math.sin(pitch),
    z: point.y * Math.sin(pitch) + z * Math.cos(pitch),
  };
}
function project(point: Point, x: number, y: number, radius: number) {
  const scale = 4.8 / (4.8 + point.z);
  return {
    x: x + point.x * radius * scale,
    y: y + point.y * radius * scale,
    z: point.z,
    scale,
  };
}
function polygon(context: CanvasRenderingContext2D, points: Point[]) {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.closePath();
}
function glow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  context.fill();
}
function drawPrism(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number,
  tilt: Point,
) {
  const x = width * 0.79,
    y = height * 0.71,
    size = radius * 0.48;
  context.save();
  context.translate(x - size * 0.35, height * 0.89);
  context.rotate(-0.22);
  context.scale(2.7, 0.32);
  glow(context, 0, 0, size * 1.5, "rgba(94,234,212,.22)");
  glow(context, size * 0.38, 0, size, "rgba(253,186,116,.26)");
  context.restore();
  const vertices = [
    { x: 0, y: -1.3, z: -0.3 },
    { x: -0.85, y: 0.65, z: -0.3 },
    { x: 0.85, y: 0.65, z: -0.3 },
    { x: 0.18, y: -1.04, z: 0.55 },
    { x: -0.67, y: 0.91, z: 0.55 },
    { x: 1.03, y: 0.91, z: 0.55 },
  ].map((point) =>
    project(
      rotate(point, 0.05 + tilt.y * 0.08, -0.16 + tilt.x * 0.12),
      x,
      y,
      size,
    ),
  );
  const faces = [
    [3, 4, 5],
    [0, 3, 4, 1],
    [1, 4, 5, 2],
    [0, 2, 5, 3],
    [0, 1, 2],
  ];
  faces.sort(
    (a, b) =>
      b.reduce((sum, i) => sum + vertices[i].z, 0) / b.length -
      a.reduce((sum, i) => sum + vertices[i].z, 0) / a.length,
  );
  faces.forEach((face, index) => {
    const gradient = context.createLinearGradient(
      x - size,
      y - size,
      x + size,
      y + size,
    );
    gradient.addColorStop(0, "rgba(255,255,255,.64)");
    gradient.addColorStop(0.26, `rgba(143,203,192,${0.19 + index * 0.025})`);
    gradient.addColorStop(0.48, "rgba(247,224,174,.22)");
    gradient.addColorStop(0.65, "rgba(163,191,211,.20)");
    gradient.addColorStop(0.83, "rgba(224,199,215,.16)");
    gradient.addColorStop(1, "rgba(255,255,255,.45)");
    polygon(
      context,
      face.map((i) => vertices[i]),
    );
    context.fillStyle = gradient;
    context.fill();
    context.strokeStyle = "rgba(255,255,255,.68)";
    context.lineWidth = 0.85;
    context.stroke();
  });
  context.save();
  polygon(context, [vertices[0], vertices[1], vertices[2]]);
  context.clip();
  const spectrum = context.createLinearGradient(
    x - size,
    y,
    x + size,
    y + size,
  );
  [
    "rgba(94,234,212,0)",
    "rgba(94,234,212,.45)",
    "rgba(255,255,255,.80)",
    "rgba(253,186,116,.48)",
    "rgba(209,175,221,.30)",
    "rgba(94,234,212,0)",
  ].forEach((color, i) => spectrum.addColorStop(i / 5, color));
  context.fillStyle = spectrum;
  polygon(context, [
    { x: x - size, y: y + size * 0.5, z: 0 },
    { x: x + size, y: y - size * 0.45, z: 0 },
    { x: x + size, y: y - size * 0.15, z: 0 },
    { x: x - size, y: y + size * 0.74, z: 0 },
  ]);
  context.fill();
  for (let i = 0; i < 3; i++) {
    context.beginPath();
    context.moveTo(vertices[0].x + i * 2, vertices[0].y);
    context.lineTo(x + size * (i * 0.28 - 0.28), y + size);
    context.strokeStyle =
      i === 1 ? "rgba(255,255,255,.72)" : "rgba(122,221,206,.35)";
    context.lineWidth = i === 1 ? 1.1 : 2.2;
    context.stroke();
  }
  context.restore();
}

export function createPrismScene(context: CanvasRenderingContext2D) {
  const particles: Point[] = Array.from({ length: 1800 }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / 1800,
      ring = Math.sqrt(1 - y * y);
    return {
      x: Math.cos(i * GOLDEN_ANGLE) * ring,
      y,
      z: Math.sin(i * GOLDEN_ANGLE) * ring,
    };
  });
  return function draw(
    width: number,
    height: number,
    phase: number,
    tilt: Point,
  ) {
    context.clearRect(0, 0, width, height);
    const radius = Math.min(width * 0.29, height * 0.33),
      cx = width * 0.46 + tilt.x * 10,
      cy = height * 0.43 + tilt.y * 8;
    const pitch = -0.18 + tilt.y * 0.16,
      yaw = phase * 0.16 + tilt.x * 0.22;
    const screen = (point: Point) =>
      project(rotate(point, pitch, yaw), cx, cy, radius);
    context.save();
    context.translate(cx - radius * 0.2, height * 0.86);
    context.scale(1.8, 0.18);
    glow(context, 0, 0, radius, "rgba(98,145,124,.15)");
    context.restore();
    glow(
      context,
      cx - radius * 0.23,
      cy - radius * 0.2,
      radius * 1.25,
      "rgba(94,234,212,.10)",
    );
    glow(
      context,
      cx + radius * 0.4,
      cy - radius * 0.38,
      radius,
      "rgba(253,186,116,.09)",
    );
    function orbits(front: boolean) {
      for (let ring = 0; ring < 2; ring++) {
        context.beginPath();
        let connected = false;
        for (let i = 0; i <= 180; i++) {
          const a = (i / 180) * TAU;
          const p = screen(
            rotate(
              {
                x: Math.cos(a) * (1.49 - ring * 0.11),
                y: Math.sin(a) * 1.17,
                z: 0,
              },
              ring ? 0.75 : 1.2,
              ring ? -0.65 : 0.45,
            ),
          );
          if (p.z < 0 !== front) {
            connected = false;
            continue;
          }
          if (connected) context.lineTo(p.x, p.y);
          else context.moveTo(p.x, p.y);
          connected = true;
        }
        context.lineWidth = 0.7;
        context.strokeStyle = front
          ? "rgba(96,142,125,.26)"
          : "rgba(131,165,150,.15)";
        context.stroke();
        const a = phase * 0.14 + ring * 2;
        const satellite = screen(
          rotate(
            {
              x: Math.cos(a) * (1.49 - ring * 0.11),
              y: Math.sin(a) * 1.17,
              z: 0,
            },
            ring ? 0.75 : 1.2,
            ring ? -0.65 : 0.45,
          ),
        );
        if (satellite.z < 0 === front)
          glow(context, satellite.x, satellite.y, 4, "rgba(102,189,161,.60)");
      }
    }
    orbits(false);
    context.save();
    context.shadowBlur = radius * 0.03;
    context.shadowColor = "rgba(94,234,212,.18)";
    for (let strand = 0; strand < 3; strand++) {
      context.beginPath();
      for (let i = 0; i <= 100; i++) {
        const y = i / 50 - 1,
          r = Math.sqrt(Math.max(0, 1 - y * y)) * 0.94,
          a = y * 3.9 + phase * 0.3 + (strand * TAU) / 3;
        const p = screen({ x: Math.cos(a) * r, y, z: Math.sin(a) * r });
        if (i) context.lineTo(p.x, p.y);
        else context.moveTo(p.x, p.y);
      }
      context.strokeStyle =
        strand === 1 ? "rgba(253,186,116,.11)" : "rgba(94,234,212,.15)";
      context.lineWidth = radius * 0.035;
      context.lineCap = "round";
      context.stroke();
    }
    context.restore();
    particles.forEach((point, i) => {
      const ripple =
        1 +
        0.025 *
          Math.sin(
            point.y * 9 + Math.atan2(point.z, point.x) * 3 - phase * 0.8,
          );
      const p = screen({
        x: point.x * ripple,
        y: point.y * ripple,
        z: point.z * ripple,
      });
      const gold = Math.max(0, Math.min(1, (point.y + point.x + 0.8) * 0.5));
      context.fillStyle = `rgba(${Math.round(94 + gold * 159)},${Math.round(234 - gold * 48)},${Math.round(212 - gold * 96)},${0.23 + (1 - p.z) * 0.21})`;
      context.beginPath();
      context.arc(p.x, p.y, (i % 17 === 0 ? 1 : 0.62) * p.scale, 0, TAU);
      context.fill();
      if (i % 13 === 0) {
        const halo = screen({
          x: point.x * 1.075,
          y: point.y * 1.075,
          z: point.z * 1.075,
        });
        context.fillStyle = "rgba(124,188,168,.19)";
        context.beginPath();
        context.arc(halo.x, halo.y, 0.5 * halo.scale, 0, TAU);
        context.fill();
      }
    });
    orbits(true);
    drawPrism(context, width, height, radius, tilt);
  };
}
