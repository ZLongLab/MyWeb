const TAU = Math.PI * 2;

const THEME_TINTS = {
  gold: "#ffe8b5",
  ice: "#bce7ff",
  rose: "#ffd0e2",
};

function random(low, high) {
  return low + (high - low) * Math.random();
}

function makeSprite(size, paint) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) paint(ctx, size / 2, size);
  return canvas;
}

function makeSoftFlakeSprite(coreColor, haloColor, sharpness = .24) {
  return makeSprite(64, (ctx, c) => {
    const grad = ctx.createRadialGradient(c, c, 0, c, c, c - 1);
    grad.addColorStop(0, coreColor);
    grad.addColorStop(sharpness, coreColor);
    grad.addColorStop(.55, haloColor);
    grad.addColorStop(1, "rgba(240, 250, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  });
}

function makeBokehSprite() {
  return makeSprite(96, (ctx, c) => {
    const grad = ctx.createRadialGradient(c, c, 0, c, c, c - 2);
    grad.addColorStop(0, "rgba(244, 251, 255, 0.56)");
    grad.addColorStop(.52, "rgba(232, 246, 255, 0.42)");
    grad.addColorStop(.78, "rgba(222, 242, 255, 0.16)");
    grad.addColorStop(1, "rgba(220, 242, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 96, 96);
  });
}

function makeCrystalSprite() {
  return makeSprite(96, (ctx, c) => {
    // Soft frosty aura behind the crystal.
    const aura = ctx.createRadialGradient(c, c, 0, c, c, c * .92);
    aura.addColorStop(0, "rgba(255, 255, 255, 0.45)");
    aura.addColorStop(.38, "rgba(226, 245, 255, 0.18)");
    aura.addColorStop(1, "rgba(215, 240, 255, 0)");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, 96, 96);

    ctx.save();
    ctx.translate(c, c);
    ctx.strokeStyle = "rgba(248, 253, 255, 0.94)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let arm = 0; arm < 6; arm++) {
      ctx.save();
      ctx.rotate((arm * TAU) / 6);

      // Main crystalline spoke.
      ctx.lineWidth = 2.1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -34);
      ctx.stroke();

      // Inner and outer dendritic chevrons.
      ctx.lineWidth = 1.55;
      for (const [yPos, len] of [[-14, 8.5], [-23, 10.5], [-30, 5.2]]) {
        ctx.beginPath();
        ctx.moveTo(-len * .76, yPos - len * .66);
        ctx.lineTo(0, yPos);
        ctx.lineTo(len * .76, yPos - len * .66);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Center ice hexagon jewel.
    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, TAU);
    ctx.fill();
    ctx.restore();
  });
}

function layerCounts(width) {
  const scale = Math.min(1.2, Math.max(.46, width / 1220));
  return [
    Math.round(136 * scale), // 0: far fine snow mist
    Math.round(82 * scale),  // 1: mid fluffy snow
    Math.round(24 * scale),  // 2: mid-near 6-point ice crystals
    Math.round(18 * scale),  // 3: foreground bokeh snow
  ];
}

function createFlake(layer, width, height, spawnAtTop = false) {
  const y = spawnAtTop ? random(-36, -6) : random(-18, height + 18);
  const x = random(-24, width + 24);
  if (layer === 0) {
    return {
      layer, x, y,
      size: random(3.0, 5.6),
      speed: random(16, 34),
      drift: random(5, 15),
      windFactor: random(.38, .62),
      alpha: random(.26, .52),
      phase: random(0, TAU),
      swayRate: random(.55, 1.05),
      rot: 0,
      rotSpeed: 0,
    };
  }
  if (layer === 1) {
    return {
      layer, x, y,
      size: random(6.4, 12.2),
      speed: random(32, 64),
      drift: random(10, 26),
      windFactor: random(.75, 1.05),
      alpha: random(.48, .84),
      phase: random(0, TAU),
      swayRate: random(.65, 1.25),
      rot: 0,
      rotSpeed: 0,
    };
  }
  if (layer === 2) {
    return {
      layer, x, y,
      size: random(12.5, 21.5),
      speed: random(26, 52),
      drift: random(12, 28),
      windFactor: random(.82, 1.12),
      alpha: random(.46, .80),
      phase: random(0, TAU),
      swayRate: random(.55, 1.0),
      rot: random(0, TAU),
      rotSpeed: random(-.62, .62),
    };
  }
  return {
    layer: 3, x, y,
    size: random(21, 38),
    speed: random(58, 98),
    drift: random(16, 34),
    windFactor: random(1.18, 1.52),
    alpha: random(.15, .30),
    phase: random(0, TAU),
    swayRate: random(.45, .85),
    rot: 0,
    rotSpeed: 0,
  };
}

export class SnowField {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.flakes = [];
    this.gust = 0;
    this.sprites = null;
  }

  ensureSprites() {
    if (this.sprites) return;
    const tinted = {};
    for (const [key, hex] of Object.entries(THEME_TINTS)) {
      tinted[key] = makeSoftFlakeSprite("#ffffff", hex + "78", .22);
    }
    this.sprites = {
      far: makeSoftFlakeSprite("rgba(244, 251, 255, 0.95)", "rgba(218, 238, 252, 0.36)", .18),
      mid: makeSoftFlakeSprite("rgba(255, 255, 255, 0.98)", "rgba(226, 244, 255, 0.45)", .24),
      crystal: makeCrystalSprite(),
      bokeh: makeBokehSprite(),
      tinted,
    };
  }

  resize(width, height) {
    this.ensureSprites();
    const prevW = this.width;
    const prevH = this.height;
    this.width = width;
    this.height = height;
    const targets = layerCounts(width);

    if (this.flakes.length && prevW > 0 && prevH > 0) {
      const sx = width / prevW;
      const sy = height / prevH;
      const byLayer = [[], [], [], []];
      for (const flake of this.flakes) {
        flake.x *= sx;
        flake.y *= sy;
        byLayer[flake.layer].push(flake);
      }
      const next = [];
      for (let layer = 0; layer < 4; layer++) {
        const list = byLayer[layer];
        if (list.length > targets[layer]) list.length = targets[layer];
        while (list.length < targets[layer]) list.push(createFlake(layer, width, height, false));
        next.push(...list);
      }
      this.flakes = next;
    } else {
      const next = [];
      for (let layer = 0; layer < 4; layer++) {
        for (let i = 0; i < targets[layer]; i++) next.push(createFlake(layer, width, height, false));
      }
      this.flakes = next;
    }
  }

  impulse(vx) {
    this.gust = Math.max(-140, Math.min(140, this.gust + vx));
  }

  draw(ctx, elapsed, time, { active, color = "gold", lit = false, treeCenterX = .72, stacked = false }) {
    const { width, height } = this;
    ctx.clearRect(0, 0, width, height);
    if (!active || !width || !height) return;
    this.ensureSprites();

    const dt = Math.min(elapsed, .05);
    if (dt > 0) {
      this.gust *= Math.exp(-2.6 * dt);
      if (Math.abs(this.gust) < .15) this.gust = 0;
    }

    // Calm nocturnal winter breeze with subtle organic swells.
    const ambientWind = -14 + Math.sin(time * .26) * 11 + Math.sin(time * .68) * 5;
    const wind = ambientWind + this.gust;
    const treeX = width * treeCenterX;
    const treeRadius = Math.min(width, height) * (stacked ? .44 : .34);
    const tintedSprite = this.sprites.tinted[color] || this.sprites.tinted.gold;

    for (const flake of this.flakes) {
      if (dt > 0) {
        flake.y += flake.speed * dt;
        const sway = Math.sin(time * flake.swayRate + flake.phase) * flake.drift;
        flake.x += (sway + wind * flake.windFactor) * dt;
        if (flake.rotSpeed) flake.rot += flake.rotSpeed * dt;

        const pad = flake.size + 12;
        if (flake.y > height + pad) {
          flake.y = -pad;
          flake.x = random(-20, width + 20);
        }
        if (flake.x < -pad) flake.x = width + pad;
        if (flake.x > width + pad) flake.x = -pad;
      }

      // Gently preserve crisp legibility over the editorial typography zone on desktop.
      let alpha = flake.alpha;
      if (!stacked && flake.x < width * .40 && flake.y > height * .18 && flake.y < height * .76) {
        alpha *= flake.layer === 3 ? .62 : .80;
      }

      // Subtle twinkle for crystals and mid snow near the lit tree.
      const dx = flake.x - treeX;
      const dy = flake.y - height * (stacked ? .62 : .50);
      const nearTree = lit && (dx * dx + dy * dy) < treeRadius * treeRadius;

      const half = flake.size * .5;
      if (flake.layer === 2) {
        const sparkle = .82 + .18 * Math.sin(time * 2.2 + flake.phase);
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rot);
        ctx.globalAlpha = alpha * sparkle;
        ctx.drawImage(this.sprites.crystal, -half, -half, flake.size, flake.size);
        if (nearTree) {
          ctx.globalAlpha = alpha * .32;
          ctx.drawImage(tintedSprite, -half * 1.15, -half * 1.15, flake.size * 1.15, flake.size * 1.15);
        }
        ctx.restore();
      } else {
        const sprite = flake.layer === 0
          ? this.sprites.far
          : flake.layer === 3
            ? this.sprites.bokeh
            : (nearTree ? tintedSprite : this.sprites.mid);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, flake.x - half, flake.y - half, flake.size, flake.size);
      }
    }
    ctx.globalAlpha = 1;
  }
}
