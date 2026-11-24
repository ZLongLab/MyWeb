export const CAMERA_DEPTH = 1 / .39;

const TAU = Math.PI * 2;
const CELL = 48;
const COLOR_FRAMES = 48;
const POOL_SIZE = 480;
const COLOR_TIMES = [0, .32, .60, .87, 1];

const emberColors = {
  gold: ["#fff8da", "#f4d198", "#f2763d", "#4fae91", "#143f34"],
  ice: ["#ffffff", "#dff6ff", "#7ac9ff", "#539ad8", "#17375c"],
  rose: ["#fff6fa", "#ffd4e4", "#f588b3", "#d89d86", "#392235"],
};

export function smoothstep(from, to, x) {
  const t = Math.max(0, Math.min(1, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

function sample(seed, channel) {
  let bits = seed ^ Math.imul(channel + 1, 0x9e3779b9);
  bits = Math.imul(bits ^ (bits >>> 16), 0x21f0aaad);
  bits = Math.imul(bits ^ (bits >>> 15), 0x735a2d97);
  return ((bits ^ (bits >>> 15)) >>> 0) / 0x100000000;
}

export function makeCurlModes(seed) {
  return Array.from({ length: 12 }, (_, i) => {
    const azimuth = sample(seed, i * 5) * TAU;
    const z = sample(seed, i * 5 + 1) * 2 - 1;
    const radial = Math.sqrt(1 - z * z);
    const dx = radial * Math.cos(azimuth);
    const dy = radial * Math.sin(azimuth);
    const tilt = sample(seed, i * 5 + 2) * TAU;
    const frequency = 9 * 1.17 ** i;
    const amplitude = .28 * .91 ** i;
    // Unit vector perpendicular to k, obtained by rotating in its tangent plane.
    const ax = -Math.sin(azimuth) * Math.cos(tilt) - z * Math.cos(azimuth) * Math.sin(tilt);
    const ay = Math.cos(azimuth) * Math.cos(tilt) - z * Math.sin(azimuth) * Math.sin(tilt);
    const az = radial * Math.sin(tilt);
    return {
      kx: dx * frequency, ky: dy * frequency, kz: z * frequency,
      ax: ax * amplitude, ay: ay * amplitude, az: az * amplitude,
      phase: sample(seed, i * 5 + 3) * TAU,
      rate: (sample(seed, i * 5 + 4) - .5) * (1.25 + i * .16),
    };
  });
}

// Each mode is the analytic curl of a Fourier term in the vector potential.
export function curlAt(modes, x, y, z, time, out) {
  out.x = out.y = out.z = 0;
  for (const m of modes) {
    const weight = Math.cos(m.kx * x + m.ky * y + m.kz * z + m.phase + time * m.rate);
    out.x += m.ax * weight;
    out.y += m.ay * weight;
    out.z += m.az * weight;
  }
}

function hexToRgb(hex) {
  const packed = parseInt(hex.slice(1), 16);
  return [packed >> 16, (packed >> 8) & 255, packed & 255];
}

function colorAt(stops, age) {
  let hi = 1;
  while (age > COLOR_TIMES[hi]) hi++;
  const f = smoothstep(COLOR_TIMES[hi - 1], COLOR_TIMES[hi], age);
  return stops[hi - 1].map((channel, i) => Math.round(channel + (stops[hi][i] - channel) * f)).join(", ");
}

function paintCell(ctx, tone, row) {
  const center = CELL / 2;
  const halo = ctx.createRadialGradient(center, center, 0, center, center, center - 1);
  const bokeh = row === 3;
  halo.addColorStop(0, `rgba(${tone}, ${bokeh ? .42 : 1})`);
  halo.addColorStop(bokeh ? .50 : .22, `rgba(${tone}, ${bokeh ? .29 : .58})`);
  halo.addColorStop(1, `rgba(${tone}, 0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, CELL, CELL);

  ctx.fillStyle = `rgb(${tone})`;
  if (row === 1) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = i * TAU / 8;
      const radius = i % 2 ? 2 : (i % 4 ? 19 : 15);
      ctx.lineTo(center + Math.cos(angle) * radius, center + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  }
  if (row === 2) {
    ctx.fillRect(center - 1, center - 10, 2, 20);
    ctx.fillRect(center - 2.2, center - 2.2, 4.4, 4.4);
  }
}

export function makeEmberAtlas(palette) {
  const canvas = document.createElement("canvas");
  canvas.width = CELL * COLOR_FRAMES;
  canvas.height = CELL * 4;
  const ctx = canvas.getContext("2d");
  const stops = emberColors[palette].map(hexToRgb);
  for (let frame = 0; frame < COLOR_FRAMES; frame++) {
    const color = colorAt(stops, frame / (COLOR_FRAMES - 1));
    for (let row = 0; row < 4; row++) {
      ctx.setTransform(1, 0, 0, 1, frame * CELL, row * CELL);
      paintCell(ctx, color, row);
    }
  }
  return canvas;
}

export function initializeEmber(p, seed, x, y, z) {
  const shape = sample(seed, 0);
  const spread = sample(seed, 1) * TAU;
  const speed = .055 + .18 * sample(seed, 2);
  const radial = .10 + .16 * sample(seed, 3);
  p.age = 0;
  p.lifespan = 1.05 + 1.45 * sample(seed, 4);
  p.size = .004 + .028 * sample(seed, 5) ** 3.6;
  p.shape = shape < .70 ? 0 : shape < .90 ? 1 : 2;
  p.x = x + Math.cos(spread) * .013;
  p.y = y + (sample(seed, 6) - .5) * .025;
  p.z = z + Math.sin(spread) * .013;
  p.vx = Math.cos(spread) * speed + x * radial - z * .12;
  p.vy = -.045 - sample(seed, 7) * .12;
  p.vz = Math.sin(spread) * speed + z * radial + x * .12;
}

export function advanceEmber(p, modes, t, dt, flow, drag) {
  p.age += dt;
  const drive = 1 - smoothstep(.52, 1, p.age / p.lifespan);
  curlAt(modes, p.x, p.y, p.z, t, flow);
  const impulse = dt * drive;
  p.vx = (p.vx + flow.x * impulse) * drag;
  p.vy = (p.vy + (flow.y - .09) * impulse) * drag;
  p.vz = (p.vz + flow.z * impulse) * drag;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.z += p.vz * dt;
}

function blit(ctx, atlas, column, row, x, y, size, alpha) {
  ctx.globalAlpha = alpha;
  ctx.drawImage(atlas, column * CELL, row * CELL, CELL, CELL,
    x - size / 2, y - size / 2, size, size);
}

export class EmberTrail {
  constructor() {
    this.pool = Array.from({ length: POOL_SIZE }, () => ({}));
    this.count = 0;
    this.carry = 0;
    this.modes = makeCurlModes(0x725ae128);
    this.flow = {};
    this.projected = {};
  }

  clear() {
    this.count = 0;
    this.carry = 0;
  }

  burst(x, y, z, amount = 30) {
    for (let i = 0; i < amount && this.count < this.pool.length; i++) {
      const seed = (Math.random() * 0x100000000) >>> 0;
      const p = this.pool[this.count++];
      initializeEmber(p, seed, x, y, z);
      const theta = sample(seed, 10) * TAU;
      const lift = .14 + .28 * sample(seed, 11);
      p.lifespan = .95 + 1.15 * sample(seed, 12);
      p.size = .006 + .026 * sample(seed, 13) ** 2.4;
      p.vx = Math.cos(theta) * lift;
      p.vy = -.08 - .24 * sample(seed, 14);
      p.vz = Math.sin(theta) * lift * .75;
    }
  }

  update(elapsed, time, ribbon, progress, cosine, sine, lit) {
    const dt = Math.min(elapsed, .05);
    const drag = Math.exp(-1.65 * dt);
    for (let i = this.count - 1; i >= 0; i--) {
      const p = this.pool[i];
      if (p.age + dt >= p.lifespan) {
        this.count--;
        this.pool[i] = this.pool[this.count];
        this.pool[this.count] = p;
      } else {
        advanceEmber(p, this.modes, time, dt, this.flow, drag);
      }
    }

    if (!lit || progress <= .01) return;
    const lightingUp = progress < 1;
    this.carry += dt * (lightingUp ? 210 : 158);
    const spawn = Math.floor(this.carry);
    this.carry -= spawn;
    for (let i = 0; i < spawn && this.count < this.pool.length; i++) {
      const seed = (Math.random() * 0x100000000) >>> 0;
      const head = lightingUp ? progress : (time * .27) % 1;
      const nearHead = sample(seed, 8) < (lightingUp ? .80 : .46);
      const location = nearHead
        ? Math.max(0, head - sample(seed, 9) * .14)
        : sample(seed, 9) * progress;
      const anchor = ribbon[Math.round((1 - location) * (ribbon.length - 1))];
      initializeEmber(this.pool[this.count++], seed,
        anchor.x * cosine - anchor.z * sine, anchor.y, anchor.z * cosine + anchor.x * sine);
    }
  }

  draw(ctx, atlas, project, unit, front) {
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < this.count; i++) {
      const p = this.pool[i];
      if ((p.z >= 0) !== front) continue;
      const distance = CAMERA_DEPTH - p.z;
      if (distance <= .1) continue;
      const focus = 1 - smoothstep(CAMERA_DEPTH - .68, CAMERA_DEPTH - .16, distance);
      const age = p.age / p.lifespan;
      const alpha = (1 - smoothstep(.47, 1, age)) * (front ? .86 : .63) * (1 - .62 * focus);
      const frame = Math.round(age * (COLOR_FRAMES - 1));
      const { x, y, zoom } = project(p, 1, 0, this.projected);
      const baseSize = Math.max(1.2, p.size * unit * zoom);

      if (focus < 1) blit(ctx, atlas, frame, p.shape, x, y, baseSize * (1 + .7 * focus), alpha * (1 - focus));
      if (focus > 0) blit(ctx, atlas, frame, 3, x, y, baseSize * (1 + 4.6 * focus), alpha * focus);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
}
