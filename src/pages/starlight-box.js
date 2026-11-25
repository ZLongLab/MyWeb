import { SCALE_NOTES, createStarlightSynth } from "./starlight-audio.js";

const ROWS = SCALE_NOTES.length;
const COLS = 16;

const PALETTES = {
  nebula: {
    ring: "rgba(243, 210, 133, 0.2)",
    ringGlow: "#f3d285",
    sweep: "rgba(243, 210, 133, 0.14)",
    particles: ["#f9e1a3", "#f4b1c0", "#ffffff", "#e2ba69", "#ffd7a8"],
    core: "rgba(243, 210, 133, 0.22)",
  },
  aurora: {
    ring: "rgba(116, 239, 195, 0.2)",
    ringGlow: "#74efc3",
    sweep: "rgba(116, 239, 195, 0.14)",
    particles: ["#74efc3", "#79d8ff", "#ffffff", "#b8f7e4", "#9be7ff"],
    core: "rgba(116, 239, 195, 0.2)",
  },
  frost: {
    ring: "rgba(149, 215, 255, 0.22)",
    ringGlow: "#95d7ff",
    sweep: "rgba(149, 215, 255, 0.14)",
    particles: ["#a8e0ff", "#d8c4ff", "#ffffff", "#7ec4ff", "#eef7ff"],
    core: "rgba(149, 215, 255, 0.22)",
  },
};

const PRESETS = {
  starlight: {
    label: "星河漫步",
    bpm: 98,
    timbre: "celesta",
    notes: [
      [5, 0], [3, 2], [2, 4], [1, 6], [0, 8], [2, 10], [3, 12], [4, 14],
      [7, 0], [7, 8], [6, 4], [6, 12], [2, 14],
    ],
  },
  rainbox: {
    label: "雨夜回响",
    bpm: 84,
    timbre: "epiano",
    notes: [
      [6, 0], [4, 0], [2, 3], [3, 5], [5, 7], [6, 8], [3, 10], [1, 12],
      [2, 14], [7, 4], [7, 12], [0, 15],
    ],
  },
  morning: {
    label: "冬日晨光",
    bpm: 112,
    timbre: "harp",
    notes: [
      [5, 0], [4, 1], [3, 2], [2, 4], [0, 6], [1, 7], [2, 8], [3, 10],
      [4, 12], [5, 14], [7, 0], [6, 6], [7, 8], [6, 14],
    ],
  },
};

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false));
}

function encodePattern(grid, timbre, bpm) {
  const rows = grid.map((row) => {
    let bits = 0;
    for (let c = 0; c < COLS; c++) if (row[c]) bits |= 1 << c;
    return bits.toString(36).padStart(4, "0");
  });
  return `${timbre}.${bpm}.${rows.join("")}`;
}

function decodePattern(hash) {
  const match = /^#m=([a-z]+)\.(\d{2,3})\.([0-9a-z]{32})$/.exec(hash || "");
  if (!match) return null;
  const [, timbre, bpmRaw, payload] = match;
  if (!["celesta", "epiano", "harp", "nebula"].includes(timbre)) return null;
  const bpm = Math.max(68, Math.min(144, Number(bpmRaw) || 98));
  const grid = createEmptyGrid();
  for (let r = 0; r < ROWS; r++) {
    const bits = parseInt(payload.slice(r * 4, r * 4 + 4), 36);
    if (!Number.isFinite(bits)) return null;
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = Boolean(bits & (1 << c));
    }
  }
  return { grid, timbre, bpm };
}

function init() {
  const app = document.getElementById("starlight-app");
  const canvas = document.getElementById("star-canvas");
  const matrixEl = document.getElementById("star-matrix");
  const playBtn = document.getElementById("star-play");
  const playLabel = playBtn?.querySelector(".star-play-label");
  const playIcon = playBtn?.querySelector(".star-play-icon");
  const bpmInput = document.getElementById("star-bpm");
  const bpmOutput = document.getElementById("star-bpm-value");
  const statusEl = document.getElementById("star-status");
  const collapseBtn = document.getElementById("star-collapse");
  const gridWrap = document.getElementById("star-grid-wrap");
  if (!app || !canvas || !matrixEl) return;

  const ctx = canvas.getContext("2d");
  const synth = createStarlightSynth();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let grid = createEmptyGrid();
  let timbre = "celesta";
  let paletteKey = "nebula";
  let bpm = 98;
  let playing = false;
  let currentStep = -1;
  let stepTimer = 0;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let orbitAngle = 0;
  let tiltX = 0;
  let tiltY = 0;
  let rafId = 0;
  let lastTs = performance.now();

  // Background stars, blooming shockwave ripples, and stardust sparks.
  const bgStars = Array.from({ length: 220 }, (_, i) => ({
    x: ((i * 73.137) % 100) / 100,
    y: ((i * 41.913 + 17) % 100) / 100,
    r: 0.55 + ((i * 19) % 10) * 0.14,
    phase: i * 0.67,
    speed: 0.7 + (i % 5) * 0.3,
  }));
  const ripples = [];
  const sparks = [];
  const noteFlash = Array(ROWS).fill(0);
  const cellNodes = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const noteButtons = Array(ROWS).fill(null);

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function orbitCenter() {
    const collapsed = gridWrap?.hidden;
    const dockAllowance = collapsed ? 90 : Math.min(340, height * 0.42);
    return {
      cx: width * 0.5,
      cy: Math.max(150, (height - dockAllowance) * 0.52 + 24),
      maxR: Math.max(96, Math.min(width * 0.34, (height - dockAllowance) * 0.43, 280)),
    };
  }

  function spawnNoteVisual(rowIndex, customX, customY) {
    const palette = PALETTES[paletteKey] || PALETTES.nebula;
    const { cx, cy, maxR } = orbitCenter();
    const orbitR = maxR * (0.28 + ((ROWS - 1 - rowIndex) / (ROWS - 1)) * 0.72);
    const angle = orbitAngle + rowIndex * 0.78 + (currentStep >= 0 ? (currentStep / COLS) * Math.PI * 2 : 0);
    const px = customX ?? cx + Math.cos(angle) * orbitR;
    const py = customY ?? cy + Math.sin(angle) * orbitR * 0.48;
    const color = palette.particles[rowIndex % palette.particles.length];

    noteFlash[rowIndex] = 1;
    const noteBtn = noteButtons[rowIndex];
    if (noteBtn) {
      noteBtn.classList.add("is-flash");
      window.setTimeout(() => noteBtn.classList.remove("is-flash"), 210);
    }

    ripples.push({ x: px, y: py, r: 6, maxR: 52 + (ROWS - rowIndex) * 7, alpha: 0.92, color });
    const count = reducedMotion.matches ? 5 : 16;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const spd = 0.8 + Math.random() * 2.8;
      sparks.push({
        x: px,
        y: py,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 0.3,
        r: 1.2 + Math.random() * 2.1,
        life: 1,
        decay: 0.014 + Math.random() * 0.015,
        color,
      });
    }
  }

  function triggerNote(rowIndex, velocity = 0.85, x, y) {
    synth.playNote(rowIndex, timbre, velocity);
    spawnNoteVisual(rowIndex, x, y);
  }

  function syncGridUI() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = cellNodes[r][c];
        if (!cell) continue;
        cell.setAttribute("aria-pressed", grid[r][c] ? "true" : "false");
        cell.classList.toggle("is-step", playing && c === currentStep);
      }
    }
  }

  function buildMatrix() {
    matrixEl.replaceChildren();
    for (let r = 0; r < ROWS; r++) {
      const note = SCALE_NOTES[r];
      const rowEl = document.createElement("div");
      rowEl.className = "star-row";
      rowEl.setAttribute("role", "row");

      const noteBtn = document.createElement("button");
      noteBtn.type = "button";
      noteBtn.className = "star-note-btn";
      noteBtn.setAttribute("aria-label", `试听音符 ${note.label}（快捷键 ${note.key}）`);
      noteBtn.innerHTML = `<span>${note.label}</span><kbd>${note.key}</kbd>`;
      noteBtn.addEventListener("click", () => triggerNote(r, 0.9));
      noteButtons[r] = noteBtn;
      rowEl.appendChild(noteBtn);

      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "star-cell" + (c % 4 === 0 ? " is-beat" : "");
        cell.setAttribute("aria-label", `${note.label} 第 ${c + 1} 拍`);
        cell.setAttribute("aria-pressed", grid[r][c] ? "true" : "false");
        cell.addEventListener("click", () => {
          grid[r][c] = !grid[r][c];
          cell.setAttribute("aria-pressed", grid[r][c] ? "true" : "false");
          if (grid[r][c]) triggerNote(r, 0.82);
        });
        cellNodes[r][c] = cell;
        rowEl.appendChild(cell);
      }
      matrixEl.appendChild(rowEl);
    }
  }

  function applyTimbre(nextTimbre) {
    timbre = nextTimbre;
    document.querySelectorAll("[data-timbre]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.timbre === timbre ? "true" : "false");
    });
  }

  function applyPalette(nextPalette) {
    paletteKey = nextPalette;
    app.dataset.palette = nextPalette;
    document.querySelectorAll(".star-swatch").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.palette === nextPalette ? "true" : "false");
    });
  }

  function applyBpm(nextBpm) {
    bpm = Math.max(68, Math.min(144, Number(nextBpm) || 98));
    if (bpmInput) bpmInput.value = String(bpm);
    if (bpmOutput) bpmOutput.textContent = String(bpm);
    if (playing) restartTimer();
  }

  function loadPreset(key, autoPlay = false) {
    const preset = PRESETS[key];
    if (!preset) return;
    grid = createEmptyGrid();
    for (const [r, c] of preset.notes) {
      if (grid[r] && c >= 0 && c < COLS) grid[r][c] = true;
    }
    applyTimbre(preset.timbre);
    applyBpm(preset.bpm);
    syncGridUI();
    setStatus(`已载入示范旋律「${preset.label}」· ${preset.bpm} BPM`);
    if (autoPlay && !playing) startPlayback();
  }

  function randomizePattern() {
    grid = createEmptyGrid();
    // Melodic contour walk with gentle bass foundation so random patterns sound musical.
    let cursor = Math.floor(Math.random() * 4) + 1;
    for (let c = 0; c < COLS; c++) {
      if (c % 4 === 0) grid[ROWS - 1 - (c % 8 === 0 ? 0 : 1)][c] = true;
      if (c % 2 === 0 || Math.random() > 0.58) {
        cursor = Math.max(0, Math.min(ROWS - 3, cursor + Math.floor(Math.random() * 3) - 1));
        grid[cursor][c] = true;
      }
    }
    syncGridUI();
    setStatus("已生成一段随机五声音阶星轨灵感。");
    if (!playing) startPlayback();
  }

  function advanceStep() {
    currentStep = (currentStep + 1) % COLS;
    for (let r = 0; r < ROWS; r++) {
      if (grid[r][currentStep]) {
        triggerNote(r, currentStep % 4 === 0 ? 0.92 : 0.72);
      }
    }
    syncGridUI();
  }

  function restartTimer() {
    window.clearInterval(stepTimer);
    const intervalMs = Math.round((60 / bpm / 4) * 1000);
    stepTimer = window.setInterval(advanceStep, intervalMs);
  }

  function startPlayback() {
    synth.ensureContext();
    playing = true;
    playBtn?.setAttribute("aria-pressed", "true");
    if (playLabel) playLabel.textContent = "暂停星轨";
    if (playIcon) playIcon.textContent = "❚❚";
    advanceStep();
    restartTimer();
  }

  function stopPlayback() {
    playing = false;
    window.clearInterval(stepTimer);
    currentStep = -1;
    playBtn?.setAttribute("aria-pressed", "false");
    if (playLabel) playLabel.textContent = "播放星轨";
    if (playIcon) playIcon.textContent = "▶";
    syncGridUI();
  }

  function render(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    const palette = PALETTES[paletteKey] || PALETTES.nebula;

    if (!reducedMotion.matches) {
      orbitAngle += dt * (playing ? 0.42 : 0.14);
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Twinkling starfield backdrop.
    const t = ts * 0.001;
    for (const s of bgStars) {
      const alpha = reducedMotion.matches ? 0.48 : 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.fillStyle = `rgba(255, 250, 240, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Central 3D tilted celestial armillary rings.
    const { cx, cy, maxR } = orbitCenter();
    const ox = cx + tiltX * 18;
    const oy = cy + tiltY * 12;

    const coreGrad = ctx.createRadialGradient(ox, oy, 4, ox, oy, maxR * 0.58);
    coreGrad.addColorStop(0, palette.core);
    coreGrad.addColorStop(1, "transparent");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, maxR * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // Draw 8 pitch orbit ellipses in pseudo-3D tilt.
    for (let r = 0; r < ROWS; r++) {
      const radius = maxR * (0.28 + ((ROWS - 1 - r) / (ROWS - 1)) * 0.72);
      const flash = noteFlash[r];
      if (flash > 0) noteFlash[r] = Math.max(0, flash - dt * 2.4);

      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(Math.sin(orbitAngle * 0.35 + r * 0.2) * 0.06);
      ctx.scale(1, 0.48);

      ctx.strokeStyle = flash > 0.05 ? palette.ringGlow : palette.ring;
      ctx.globalAlpha = flash > 0.05 ? 0.32 + flash * 0.6 : 0.52;
      ctx.lineWidth = flash > 0.05 ? 1.8 : 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Active scheduled notes appear as softly orbiting star jewels.
      for (let c = 0; c < COLS; c++) {
        if (!grid[r][c]) continue;
        const a = orbitAngle + (c / COLS) * Math.PI * 2;
        const nx = Math.cos(a) * radius;
        const ny = Math.sin(a) * radius;
        const isNow = playing && c === currentStep;
        ctx.globalAlpha = isNow ? 1 : 0.75;
        ctx.fillStyle = isNow ? "#ffffff" : palette.particles[r % palette.particles.length];
        ctx.beginPath();
        ctx.arc(nx, ny, isNow ? 5.2 : 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Sweeping celestial playhead ray when playing.
    if (playing && currentStep >= 0) {
      const sweepA = orbitAngle + (currentStep / COLS) * Math.PI * 2;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.strokeStyle = palette.sweep;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(sweepA) * maxR * 1.06, Math.sin(sweepA) * maxR * 0.51);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Expanding note ripples.
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += dt * 115;
      rp.alpha -= dt * 1.15;
      if (rp.alpha <= 0 || rp.r >= rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = rp.color;
      ctx.globalAlpha = rp.alpha * 0.72;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Stardust burst particles.
    for (let i = sparks.length - 1; i >= 0; i--) {
      const sp = sparks[i];
      sp.x += sp.vx * (dt * 60);
      sp.y += sp.vy * (dt * 60);
      sp.vx *= 0.965;
      sp.vy *= 0.965;
      sp.life -= sp.decay * (dt * 60);
      if (sp.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = sp.life;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r * sp.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    rafId = window.requestAnimationFrame(render);
  }

  // Event bindings.
  playBtn?.addEventListener("click", () => {
    if (playing) stopPlayback();
    else startPlayback();
  });

  document.querySelectorAll("[data-timbre]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTimbre(btn.dataset.timbre);
      triggerNote(2, 0.75);
      setStatus(`已切换音色：${btn.textContent}`);
    });
  });

  document.querySelectorAll(".star-swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyPalette(btn.dataset.palette);
      setStatus(`已切换星空配色：${btn.getAttribute("aria-label")}`);
    });
  });

  bpmInput?.addEventListener("input", () => applyBpm(bpmInput.value));

  document.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => loadPreset(btn.dataset.preset, true));
  });

  document.getElementById("star-random")?.addEventListener("click", randomizePattern);

  document.getElementById("star-clear")?.addEventListener("click", () => {
    grid = createEmptyGrid();
    syncGridUI();
    setStatus("已清空星轨矩阵，点击任意格子重新创作。");
  });

  document.getElementById("star-share")?.addEventListener("click", async () => {
    const hash = "#m=" + encodePattern(grid, timbre, bpm);
    const shareUrl = `${location.origin}${location.pathname}${hash}`;
    history.replaceState(null, "", hash);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus("已复制旋律分享链接，发给朋友即可打开同一段星轨。");
    } catch {
      setStatus("旋律已写入当前网址栏，直接复制网址即可分享。");
    }
  });

  collapseBtn?.addEventListener("click", () => {
    const nextHidden = !gridWrap.hidden;
    gridWrap.hidden = nextHidden;
    collapseBtn.setAttribute("aria-expanded", nextHidden ? "false" : "true");
    collapseBtn.textContent = nextHidden ? "展开编曲台" : "收起面板";
  });

  // Direct canvas click plays pitch mapped by vertical position & blooms stardust there.
  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ratio = Math.max(0, Math.min(0.999, y / Math.max(1, rect.height * 0.72)));
    const row = Math.floor(ratio * ROWS);
    triggerNote(row, 0.88, x, y);
  });

  window.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches) return;
    tiltX = (event.clientX / Math.max(1, width) - 0.5) * 2;
    tiltY = (event.clientY / Math.max(1, height) - 0.5) * 2;
  });

  const keyToRow = new Map(SCALE_NOTES.map((n, idx) => [n.key.toLowerCase(), idx]));
  window.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    const tag = event.target?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.code === "Space") {
      event.preventDefault();
      if (playing) stopPlayback();
      else startPlayback();
      return;
    }
    const row = keyToRow.get(event.key.toLowerCase());
    if (row !== undefined) {
      event.preventDefault();
      triggerNote(row, 0.9);
    }
  });

  window.addEventListener("resize", resize);
  window.addEventListener("pagehide", () => {
    stopPlayback();
    window.cancelAnimationFrame(rafId);
    synth.dispose();
  });

  // Initialize from shareable URL hash or default "starlight" preset.
  const decoded = decodePattern(location.hash);
  if (decoded) {
    grid = decoded.grid;
    applyTimbre(decoded.timbre);
    applyBpm(decoded.bpm);
    setStatus("已从分享链接载入这段星轨旋律，点击「播放星轨」开始欣赏。");
  } else {
    loadPreset("starlight", false);
  }

  buildMatrix();
  resize();
  rafId = window.requestAnimationFrame(render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
