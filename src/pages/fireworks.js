import { createFireworksAudio } from "./fireworks-audio.js";

const PALETTES = {
  festival: {
    sky: ["#040712", "#0b142c", "#152344"],
    lake: ["#091326", "#050915"],
    mountainFar: "#0b162d",
    mountainNear: "#070f20",
    moon: "#f9edc9",
    colors: ["#ffe29a", "#ff9e78", "#fff3cf", "#82cfff", "#f4b95c", "#f6a2b9"],
    willow: ["#ffe6a3", "#f2bd64", "#fff4d1"],
  },
  aurora: {
    sky: ["#030b11", "#071f28", "#0d333c"],
    lake: ["#072027", "#030c12"],
    mountainFar: "#072029",
    mountainNear: "#04141b",
    moon: "#dffbf0",
    colors: ["#78f3c6", "#78d6ff", "#d4bfff", "#ffffff", "#5ee3be", "#9ee7ff"],
    willow: ["#9cf6d7", "#74d4ff", "#e8fff7"],
  },
  sakura: {
    sky: ["#090612", "#1a102a", "#2a193d"],
    lake: ["#160e24", "#080510"],
    mountainFar: "#1a1129",
    mountainNear: "#110a1c",
    moon: "#fce3ea",
    colors: ["#ffb8ce", "#ffd7a6", "#fff1f5", "#e89cff", "#ff99b8", "#ffe4c4"],
    willow: ["#ffd6e3", "#ffcca3", "#fff4f7"],
  },
};

const SHAPES = ["chrysanthemum", "willow", "ring", "star", "spiral"];
const SHAPE_LABELS = {
  mixed: "混合形态",
  chrysanthemum: "菊花球",
  willow: "垂柳金雨",
  ring: "双层星环",
  star: "五芒星芒",
  spiral: "螺旋花束",
};

function init() {
  const app = document.getElementById("fireworks-app");
  const canvas = document.getElementById("fw-canvas");
  const statusEl = document.getElementById("fw-status");
  const autoBtn = document.getElementById("fw-auto");
  const soundBtn = document.getElementById("fw-sound");
  const salvoBtn = document.getElementById("fw-salvo");
  const saveBtn = document.getElementById("fw-save");
  if (!app || !canvas) return;

  const ctx = canvas.getContext("2d");
  const audio = createFireworksAudio();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let paletteKey = "festival";
  let selectedShape = "mixed";
  let autoShow = !reducedMotion.matches;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let horizonY = height * 0.72;
  let rafId = 0;
  let lastTs = performance.now();
  let autoCooldown = 0.55;
  let flashAlpha = 0;
  let flashColor = "#ffe29a";

  const rockets = [];
  const particles = [];
  const glowSprites = new Map();

  function getGlowSprite(color) {
    let sprite = glowSprites.get(color);
    if (sprite) return sprite;
    sprite = document.createElement("canvas");
    sprite.width = 32;
    sprite.height = 32;
    const gctx = sprite.getContext("2d");
    const grad = gctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.24, color);
    grad.addColorStop(0.55, `${color}55`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 32, 32);
    glowSprites.set(color, sprite);
    return sprite;
  }

  const stars = Array.from({ length: 170 }, (_, i) => ({
    x: ((i * 61.37) % 100) / 100,
    y: ((i * 29.71) % 66) / 100,
    r: 0.55 + (i % 7) * 0.16,
    phase: i * 0.83,
    speed: 0.8 + (i % 5) * 0.35,
  }));

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    horizonY = Math.round(height * 0.71);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pickShape() {
    if (selectedShape !== "mixed") return selectedShape;
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
  }

  function pickColor(palette, shape) {
    const pool = shape === "willow" ? palette.willow : palette.colors;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function launchRocket(targetX, targetY, forcedShape) {
    const palette = PALETTES[paletteKey] || PALETTES.festival;
    const shape = forcedShape || pickShape();
    const tx = Math.max(width * 0.08, Math.min(width * 0.92, targetX));
    const ty = Math.max(height * 0.12, Math.min(horizonY - 60, targetY));
    const startX = tx + (Math.random() - 0.5) * Math.min(180, width * 0.16);
    const startY = horizonY + 4;
    const travelTime = 0.55 + Math.random() * 0.25;
    const vx = (tx - startX) / travelTime;
    const vy = (ty - startY) / travelTime;
    const color = pickColor(palette, shape);

    rockets.push({
      x: startX,
      y: startY,
      tx,
      ty,
      vx,
      vy,
      age: 0,
      duration: travelTime,
      color,
      shape,
      trail: [],
    });

    const pan = (tx / Math.max(1, width)) * 2 - 1;
    audio.playLaunch(pan);
  }

  function explode(x, y, shape, primaryColor) {
    const palette = PALETTES[paletteKey] || PALETTES.festival;
    const secondary = pickColor(palette, "chrysanthemum");
    const pan = (x / Math.max(1, width)) * 2 - 1;
    flashAlpha = Math.min(0.24, flashAlpha + 0.15);
    flashColor = primaryColor;

    audio.playBurst(shape === "willow" ? 1.15 : 0.95, pan, shape === "willow" || shape === "spiral");

    const addSpark = (vx, vy, color, opts = {}) => {
      particles.push({
        x,
        y,
        vx,
        vy,
        color,
        gravity: opts.gravity ?? 72,
        drag: opts.drag ?? 0.968,
        life: 1,
        decay: opts.decay ?? (0.58 + Math.random() * 0.34),
        size: opts.size ?? (1.6 + Math.random() * 1.2),
        twinkle: opts.twinkle ?? (Math.random() > 0.45),
        maxTrail: opts.maxTrail ?? 7,
        trail: [{ x, y }],
      });
    };

    if (shape === "chrysanthemum") {
      const count = 88;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.08;
        const speed = 110 + Math.random() * 165;
        addSpark(Math.cos(a) * speed, Math.sin(a) * speed, i % 3 === 0 ? secondary : primaryColor, {
          gravity: 82,
          drag: 0.962,
          decay: 0.62 + Math.random() * 0.28,
        });
      }
      return;
    }

    if (shape === "willow") {
      const count = 78;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.14;
        const speed = 65 + Math.random() * 145;
        addSpark(Math.cos(a) * speed, Math.sin(a) * speed - 22, primaryColor, {
          gravity: 118,
          drag: 0.976,
          decay: 0.38 + Math.random() * 0.18,
          size: 1.5 + Math.random() * 0.9,
          twinkle: true,
          maxTrail: 12,
        });
      }
      return;
    }

    if (shape === "ring") {
      const tilt = (Math.random() - 0.5) * 0.7;
      const outer = 62;
      for (let i = 0; i < outer; i++) {
        const a = (Math.PI * 2 * i) / outer;
        const rx = Math.cos(a) * 215;
        const ry = Math.sin(a) * 95;
        const vx = rx * Math.cos(tilt) - ry * Math.sin(tilt);
        const vy = rx * Math.sin(tilt) + ry * Math.cos(tilt);
        addSpark(vx, vy, primaryColor, { gravity: 56, drag: 0.96, decay: 0.65 });
      }
      for (let i = 0; i < 28; i++) {
        const a = (Math.PI * 2 * i) / 28;
        const s = 60 + Math.random() * 48;
        addSpark(Math.cos(a) * s, Math.sin(a) * s, secondary, { gravity: 64, drag: 0.96, decay: 0.72 });
      }
      return;
    }

    if (shape === "star") {
      const points = 5;
      const count = 75;
      for (let i = 0; i < count; i++) {
        const t = (i / count) * points;
        const idx = Math.floor(t);
        const frac = t - idx;
        const a1 = (idx * 2 * Math.PI) / points - Math.PI / 2;
        const aMid = a1 + Math.PI / points;
        const a2 = ((idx + 1) * 2 * Math.PI) / points - Math.PI / 2;
        const rOuter = 210;
        const rInner = 88;
        let vx, vy;
        if (frac < 0.5) {
          const u = frac * 2;
          vx = Math.cos(a1) * rOuter * (1 - u) + Math.cos(aMid) * rInner * u;
          vy = Math.sin(a1) * rOuter * (1 - u) + Math.sin(aMid) * rInner * u;
        } else {
          const u = (frac - 0.5) * 2;
          vx = Math.cos(aMid) * rInner * (1 - u) + Math.cos(a2) * rOuter * u;
          vy = Math.sin(aMid) * rInner * (1 - u) + Math.sin(a2) * rOuter * u;
        }
        addSpark(vx, vy, i % 2 === 0 ? primaryColor : secondary, {
          gravity: 54,
          drag: 0.962,
          decay: 0.62,
          size: 2.1,
        });
      }
      return;
    }

    // "spiral": dual swirling arms + shimmering halo.
    const count = 82;
    for (let i = 0; i < count; i++) {
      const arm = i % 2;
      const frac = i / count;
      const a = frac * Math.PI * 5 + arm * Math.PI;
      const speed = 55 + frac * 190;
      addSpark(Math.cos(a) * speed, Math.sin(a) * speed, arm === 0 ? primaryColor : secondary, {
        gravity: 66,
        drag: 0.968,
        decay: 0.55 + Math.random() * 0.25,
        twinkle: true,
      });
    }
  }

  function launchSalvo() {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const x = width * (0.18 + (i / (count - 1)) * 0.64) + (Math.random() - 0.5) * 32;
      const y = height * (0.2 + (i % 2 === 0 ? 0.05 : 0.14));
      window.setTimeout(() => launchRocket(x, y, SHAPES[i % SHAPES.length]), i * 160);
    }
    setStatus("五发全景齐放升空！");
  }

  function drawBackdrop(targetCtx, w, h, hy, ts) {
    const palette = PALETTES[paletteKey] || PALETTES.festival;

    // 1. Twilight night sky gradient.
    const sky = targetCtx.createLinearGradient(0, 0, 0, hy);
    sky.addColorStop(0, palette.sky[0]);
    sky.addColorStop(0.58, palette.sky[1]);
    sky.addColorStop(1, palette.sky[2]);
    targetCtx.fillStyle = sky;
    targetCtx.fillRect(0, 0, w, hy);

    // Subtle atmospheric flash from bursts.
    if (flashAlpha > 0.005) {
      targetCtx.save();
      targetCtx.globalAlpha = flashAlpha * 0.35;
      const glow = targetCtx.createRadialGradient(w * 0.5, hy * 0.45, 20, w * 0.5, hy * 0.45, w * 0.6);
      glow.addColorStop(0, flashColor);
      glow.addColorStop(1, "transparent");
      targetCtx.fillStyle = glow;
      targetCtx.fillRect(0, 0, w, hy);
      targetCtx.restore();
    }

    // 2. Twinkling stars.
    const t = ts * 0.001;
    for (const s of stars) {
      const alpha = reducedMotion.matches ? 0.55 : 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      targetCtx.fillStyle = `rgba(255, 250, 240, ${alpha.toFixed(2)})`;
      targetCtx.beginPath();
      targetCtx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      targetCtx.fill();
    }

    // 3. True geometric crescent moon + subtle halo (no cutout mask disc).
    const mx = w * 0.82;
    const my = h * 0.19;
    const moonHalo = targetCtx.createRadialGradient(mx - 4, my + 2, 6, mx, my, 82);
    moonHalo.addColorStop(0, "rgba(255, 244, 212, 0.28)");
    moonHalo.addColorStop(0.55, "rgba(255, 240, 200, 0.08)");
    moonHalo.addColorStop(1, "transparent");
    targetCtx.fillStyle = moonHalo;
    targetCtx.beginPath();
    targetCtx.arc(mx, my, 82, 0, Math.PI * 2);
    targetCtx.fill();

    targetCtx.save();
    targetCtx.translate(mx, my);
    targetCtx.rotate(-0.42);
    const outerR = 18;
    const innerR = 15.5;
    const offset = 8.5;
    const cosA = (outerR * outerR + offset * offset - innerR * innerR) / (2 * outerR * offset);
    const alpha = Math.acos(cosA);
    const beta = Math.atan2(outerR * Math.sin(alpha), outerR * cosA - offset);
    targetCtx.fillStyle = palette.moon;
    targetCtx.beginPath();
    targetCtx.arc(0, 0, outerR, alpha, -alpha, false);
    targetCtx.arc(offset, 0, innerR, -beta, beta, true);
    targetCtx.closePath();
    targetCtx.fill();
    targetCtx.restore();

    // 4. Far & near layered mountain silhouettes along horizon.
    targetCtx.fillStyle = palette.mountainFar;
    targetCtx.beginPath();
    targetCtx.moveTo(0, hy);
    targetCtx.lineTo(0, hy - 34);
    targetCtx.quadraticCurveTo(w * 0.16, hy - 82, w * 0.34, hy - 36);
    targetCtx.quadraticCurveTo(w * 0.54, hy - 94, w * 0.74, hy - 42);
    targetCtx.quadraticCurveTo(w * 0.88, hy - 74, w, hy - 28);
    targetCtx.lineTo(w, hy);
    targetCtx.closePath();
    targetCtx.fill();

    targetCtx.fillStyle = palette.mountainNear;
    targetCtx.beginPath();
    targetCtx.moveTo(0, hy);
    targetCtx.lineTo(0, hy - 18);
    targetCtx.quadraticCurveTo(w * 0.22, hy - 48, w * 0.45, hy - 14);
    targetCtx.quadraticCurveTo(w * 0.72, hy - 56, w, hy - 16);
    targetCtx.lineTo(w, hy);
    targetCtx.closePath();
    targetCtx.fill();

    // 5. Midnight mirror lake surface.
    const lake = targetCtx.createLinearGradient(0, hy, 0, h);
    lake.addColorStop(0, palette.lake[0]);
    lake.addColorStop(1, palette.lake[1]);
    targetCtx.fillStyle = lake;
    targetCtx.fillRect(0, hy, w, h - hy);

    // Moon shimmer column on water.
    targetCtx.save();
    for (let i = 0; i < 16; i++) {
      const wy = hy + 10 + i * ((h - hy - 16) / 16);
      const sway = reducedMotion.matches ? 0 : Math.sin(t * 1.8 + i * 0.9) * 8;
      const rw = Math.max(8, 36 - i * 1.4);
      targetCtx.fillStyle = `rgba(255, 245, 214, ${(0.18 - i * 0.008).toFixed(3)})`;
      targetCtx.fillRect(mx - rw / 2 + sway, wy, rw, 1.8);
    }
    targetCtx.restore();

    // Horizon hairline sheen.
    targetCtx.fillStyle = "rgba(255, 250, 236, 0.12)";
    targetCtx.fillRect(0, hy, w, 1);
  }

  function drawFireworkEntities(targetCtx, hy, ts) {
    const t = ts * 0.001;

    // Rockets + lake reflection.
    for (const rk of rockets) {
      targetCtx.save();
      targetCtx.strokeStyle = rk.color;
      targetCtx.lineWidth = 2.2;
      targetCtx.lineCap = "round";
      if (rk.trail.length > 1) {
        targetCtx.beginPath();
        targetCtx.moveTo(rk.trail[0].x, rk.trail[0].y);
        for (let i = 1; i < rk.trail.length; i++) targetCtx.lineTo(rk.trail[i].x, rk.trail[i].y);
        targetCtx.stroke();
      }
      targetCtx.fillStyle = "#ffffff";
      targetCtx.beginPath();
      targetCtx.arc(rk.x, rk.y, 2.6, 0, Math.PI * 2);
      targetCtx.fill();

      // Mirror reflection in lake.
      const ry = hy + (hy - rk.y) * 0.44;
      if (ry > hy && ry < height) {
        targetCtx.globalAlpha = 0.28;
        targetCtx.fillStyle = rk.color;
        targetCtx.beginPath();
        targetCtx.ellipse(rk.x + Math.sin(t * 4 + ry * 0.1) * 4, ry, 5, 1.8, 0, 0, Math.PI * 2);
        targetCtx.fill();
      }
      targetCtx.restore();
    }

    // Burst particles + feathered optical glow + comet ribbons + shimmering water reflections.
    for (const p of particles) {
      const flicker = p.twinkle ? 0.68 + 0.32 * Math.sin(t * 28 + p.x) : 1;
      const alpha = Math.max(0, p.life * flicker);

      targetCtx.save();
      targetCtx.globalCompositeOperation = "lighter";

      // Tapered luminous comet ribbon across recent trail points.
      const trail = p.trail;
      if (trail.length > 1) {
        targetCtx.lineCap = "round";
        for (let j = 1; j < trail.length; j++) {
          const frac = j / (trail.length - 1);
          targetCtx.globalAlpha = alpha * frac * 0.78;
          targetCtx.strokeStyle = p.color;
          targetCtx.lineWidth = Math.max(0.7, p.size * (0.35 + frac * 0.75));
          targetCtx.beginPath();
          targetCtx.moveTo(trail[j - 1].x, trail[j - 1].y);
          targetCtx.lineTo(trail[j].x, trail[j].y);
          targetCtx.stroke();
        }
      }

      // Feathered optical radial glow sprite (no hard bokeh edges).
      const glowRadius = p.size * 4.4;
      targetCtx.globalAlpha = alpha * 0.72;
      targetCtx.drawImage(
        getGlowSprite(p.color),
        p.x - glowRadius,
        p.y - glowRadius,
        glowRadius * 2,
        glowRadius * 2,
      );

      // Mirrored water-ripple shimmer below horizon.
      if (p.y < hy) {
        const refY = hy + (hy - p.y) * 0.44;
        if (refY < height) {
          const rippleX = reducedMotion.matches ? 0 : Math.sin(t * 3.4 + refY * 0.14) * 7;
          targetCtx.globalAlpha = alpha * 0.36;
          targetCtx.fillStyle = p.color;
          targetCtx.fillRect(p.x + rippleX - p.size * 2.8, refY, p.size * 5.6, 1.9);
          if (refY + 6 < height) {
            targetCtx.globalAlpha = alpha * 0.16;
            targetCtx.fillRect(p.x - rippleX * 0.7 - p.size * 1.9, refY + 6, p.size * 3.8, 1.3);
          }
        }
      }
      targetCtx.restore();
    }
  }

  function render(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    if (flashAlpha > 0) flashAlpha = Math.max(0, flashAlpha - dt * 0.9);

    if (autoShow && !document.hidden) {
      autoCooldown -= dt;
      if (autoCooldown <= 0) {
        launchRocket(width * (0.16 + Math.random() * 0.68), height * (0.16 + Math.random() * 0.3));
        autoCooldown = 1.05 + Math.random() * 1.15;
      }
    }

    // Step rockets.
    for (let i = rockets.length - 1; i >= 0; i--) {
      const rk = rockets[i];
      rk.age += dt;
      rk.trail.push({ x: rk.x, y: rk.y });
      if (rk.trail.length > 9) rk.trail.shift();
      rk.x += rk.vx * dt;
      rk.y += rk.vy * dt;
      if (rk.age >= rk.duration) {
        explode(rk.tx, rk.ty, rk.shape, rk.color);
        rockets.splice(i, 1);
      }
    }

    // Step particles.
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const damp = Math.pow(p.drag, dt * 60);
      p.vx *= damp;
      p.vy = p.vy * damp + p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > p.maxTrail) p.trail.shift();
      p.life -= p.decay * dt;
      if (p.life <= 0 || p.y > horizonY + 8) {
        particles.splice(i, 1);
      }
    }

    drawBackdrop(ctx, width, height, horizonY, ts);
    drawFireworkEntities(ctx, horizonY, ts);

    rafId = window.requestAnimationFrame(render);
  }

  function exportWallpaper() {
    const out = document.createElement("canvas");
    out.width = 1600;
    out.height = 960;
    const octx = out.getContext("2d");
    const scaleX = 1600 / Math.max(1, width);
    const scaleY = 960 / Math.max(1, height);
    octx.save();
    octx.scale(scaleX, scaleY);
    drawBackdrop(octx, width, height, horizonY, performance.now());
    drawFireworkEntities(octx, horizonY, performance.now());
    octx.restore();

    octx.fillStyle = "rgba(255, 248, 234, 0.72)";
    octx.font = '500 22px "Songti SC", "STSong", Georgia, serif';
    octx.textAlign = "right";
    octx.fillText("有间小站 · 夜空烟花湖", 1548, 916);

    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fireworks-lake-${paletteKey}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
      setStatus(`已导出高清壁纸 fireworks-lake-${paletteKey}.png（1600×960）。`);
    }, "image/png");
  }

  // Bind UI controls.
  document.querySelectorAll(".fw-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      paletteKey = btn.dataset.palette;
      app.dataset.palette = paletteKey;
      document.querySelectorAll(".fw-swatch").forEach((other) => {
        other.setAttribute("aria-pressed", other === btn ? "true" : "false");
      });
      setStatus(`已切换配色：${btn.getAttribute("aria-label")}`);
      launchRocket(width * 0.5, height * 0.28);
    });
  });

  document.querySelectorAll("[data-shape]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedShape = btn.dataset.shape;
      document.querySelectorAll("[data-shape]").forEach((other) => {
        other.setAttribute("aria-pressed", other === btn ? "true" : "false");
      });
      setStatus(`烟花形态：${SHAPE_LABELS[selectedShape] || selectedShape}`);
      launchRocket(width * (0.35 + Math.random() * 0.3), height * 0.27);
    });
  });

  autoBtn?.addEventListener("click", () => {
    autoShow = !autoShow;
    autoBtn.setAttribute("aria-pressed", autoShow ? "true" : "false");
    setStatus(autoShow ? "已开启自动烟花秀。" : "已切换为手动发射模式，点击夜空即可升空。");
  });

  soundBtn?.addEventListener("click", () => {
    const next = !audio.isEnabled();
    audio.setEnabled(next);
    soundBtn.setAttribute("aria-pressed", next ? "true" : "false");
    setStatus(next ? "已开启 Web Audio 烟花声效。" : "已静音烟花声效。");
    if (next) launchRocket(width * 0.5, height * 0.28);
  });

  salvoBtn?.addEventListener("click", launchSalvo);
  saveBtn?.addEventListener("click", exportWallpaper);

  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();
    launchRocket(event.clientX - rect.left, event.clientY - rect.top);
  });

  window.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    if (event.code === "Space") {
      event.preventDefault();
      launchSalvo();
    }
  });

  window.addEventListener("resize", resize);
  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(rafId);
    audio.dispose();
  });

  resize();
  autoBtn?.setAttribute("aria-pressed", autoShow ? "true" : "false");

  // Seed opening display (graceful static bloom under reduced motion, live opening duo otherwise).
  if (reducedMotion.matches) {
    explode(width * 0.34, height * 0.28, "chrysanthemum", PALETTES.festival.colors[0]);
    explode(width * 0.64, height * 0.24, "ring", PALETTES.festival.colors[3]);
    for (let step = 0; step < 18; step++) {
      for (const p of particles) {
        p.x += p.vx * 0.016;
        p.y += p.vy * 0.016;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + p.gravity * 0.016;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) p.trail.shift();
      }
    }
  } else {
    launchRocket(width * 0.36, height * 0.28, "chrysanthemum");
    window.setTimeout(() => launchRocket(width * 0.64, height * 0.24, "willow"), 360);
  }

  rafId = window.requestAnimationFrame(render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
