import { CAMERA_DEPTH, EmberTrail, makeEmberAtlas, smoothstep } from "./christmas-embers.js";
import { createMusicBox } from "./christmas-audio.js";
import { downloadGreetingCard, drawGreetingCard, loadForestImage } from "./christmas-card.js";

const cover = document.querySelector(".cover");
const dateTextEl = document.querySelector(".date-text");
const wishEl = document.querySelector(".wish");
const lightSwitch = document.querySelector(".light-switch");
const lightLabel = document.querySelector(".light-label");
const controls = document.querySelector(".controls");
const colorButtons = [...document.querySelectorAll(".color")];
const snowSwitch = document.querySelector(".snow-switch");
const musicSwitch = document.querySelector(".music-switch");
const cardTrigger = document.querySelector(".card-trigger");
const cardDialog = document.querySelector("#card-dialog");
const cardPreview = document.querySelector(".card-preview");
const cardWishInput = document.querySelector("#card-wish-input");
const cardSignInput = document.querySelector("#card-sign-input");
const cardPresetButtons = [...document.querySelectorAll("[data-wish-preset]")];
const cardDownloadButton = document.querySelector("#card-download");
const cardCloseButton = document.querySelector("#card-close");
const treeCanvas = document.querySelector(".tree-lights");
const snowCanvas = document.querySelector(".snow");
const treeContext = treeCanvas.getContext("2d");
const snowContext = snowCanvas.getContext("2d");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const TAU = Math.PI * 2;
const embers = new EmberTrail();
const musicBox = createMusicBox();
const LIGHT_UP_TIME = 2.3;
const LIGHT_DOWN_TIME = .65;
const TREE_GROUND = 1.086;
const DEFAULT_WISH = "愿这个冬天，\n每一个小小的愿望，都有一束光。";

const palettes = {
  gold: {
    needles: ["#45826d", "#83b498", "#bbd5ac", "#ffe4a3"],
    glow: "#ffb646",
    core: "#fff1bb",
    ornaments: [["#ffe6a0", "#95601a"], ["#e46a65", "#561d26"]],
  },
  ice: {
    needles: ["#386d76", "#76a8b6", "#bbdce3", "#d8f5ff"],
    glow: "#539fff",
    core: "#e2faff",
    ornaments: [["#eef8ff", "#6e8eab"], ["#7ed6ff", "#1f5388"]],
  },
  rose: {
    needles: ["#605164", "#a08199", "#ddbcc3", "#ffd6df"],
    glow: "#ff78ad",
    core: "#ffe6ef",
    ornaments: [["#ffabca", "#912957"], ["#ffe2b2", "#a45c59"]],
  },
};

let frame = 0;
let lastTime = 0;
let time = 0;
let angle = .38;
let spinVelocity = 0;
let drag = null;
let lit = false;
let lightProgress = 0;
let flashAt = -10;
let snowing = !reducedMotion.matches;
let treeView;
let snowView;
let flakes = [];
let forestImage = null;

function formatChristmasDate(now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const year = Number(parts.find((item) => item.type === "year")?.value);
    const month = Number(parts.find((item) => item.type === "month")?.value);
    const day = Number(parts.find((item) => item.type === "day")?.value);
    if (!year || !month || !day) return "12 月 25 日 · 圣诞节";

    const todayUtc = Date.UTC(year, month - 1, day);
    const thisChristmas = Date.UTC(year, 11, 25);
    const target = todayUtc > thisChristmas ? Date.UTC(year + 1, 11, 25) : thisChristmas;
    const days = Math.round((target - todayUtc) / 86400000);
    if (days === 0) return "12 月 25 日 · 圣诞快乐";
    if (days === 1) return "12 月 24 日 · 平安夜快乐";
    return `12 月 25 日 · 距圣诞节还有 ${days} 天`;
  } catch {
    return "12 月 25 日 · 圣诞节";
  }
}

function random(low, high) {
  return low + (high - low) * Math.random();
}

function point(a, radius, y, size, tone = 0) {
  return { x: Math.cos(a) * radius, z: Math.sin(a) * radius, y, size, tone };
}

function makeTree() {
  const needles = [[], [], [], []];
  const ornaments = [];
  const lamps = [];

  for (let tier = 0; tier < 12; tier++) {
    const y = .052 + tier * .071;
    const radius = .034 + .412 * y ** .87;
    const branches = 10 + tier;
    const phase = random(0, TAU);
    for (let branch = 0; branch < branches; branch++) {
      const a = phase + branch / branches * TAU + random(-.095, .095);
      const length = radius * random(.79, 1.07);
      const tip = y + random(.018, .048);
      for (let needle = 0; needle < 33; needle++) {
        const along = random(.13, 1);
        const aSprig = a + random(-.4, .4) * (1 - .74 * along);
        const ySprig = tip - (1 - along) * .074 + random(-.018, .02);
        const tone = Math.min(3, Math.floor(random(0, 4.9) * (.48 + .48 * along)));
        needles[tone].push(point(aSprig, length * along, ySprig, random(.39, 1.35), tone));
      }
      // Keep bottom-most ornaments tucked cleanly inside the pine skirt above the snow plane.
      if (tier < 11 && (branch + tier) % 4 === 0) {
        ornaments.push(point(a, length * .82, tip + .014, random(.011, .021), (tier + branch) % 3 === 0 ? 1 : 0));
      }
      if ((branch + 2 * tier) % 3 !== 1) {
        lamps.push(point(a, length * random(.68, 1), tip, random(.55, 1.28)));
      }
    }
  }

  return { needles, ornaments, lamps };
}

const model = makeTree();
const sky = Array.from({ length: 120 }, () => [Math.random(), Math.random(), random(.3, 1.1)]);
const ribbon = Array.from({ length: 281 }, (_, i) => {
  const t = i / 280;
  const y = .035 + t * .835;
  const tailIn = smoothstep(.86, 1, t);
  const radius = (.055 + .402 * t ** .92) * (1 - .14 * tailIn);
  return point(t * TAU * 3.95 + .45, radius, y, 1, t);
});

function sprite(paint) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 96;
  paint(canvas.getContext("2d"));
  return canvas;
}

function makeGlow(color) {
  return sprite((ctx) => {
    const gradient = ctx.createRadialGradient(48, 48, 0, 48, 48, 47);
    gradient.addColorStop(0, "#fffdf0");
    gradient.addColorStop(.11, color);
    gradient.addColorStop(.31, color + "75");
    gradient.addColorStop(1, color + "00");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 96, 96);
  });
}

function makeOrnament(light, shade) {
  return sprite((ctx) => {
    ctx.fillStyle = "#c1ad79";
    ctx.fillRect(41, 4, 14, 12);
    const sphere = ctx.createRadialGradient(32, 33, 1, 49, 53, 40);
    sphere.addColorStop(0, "#fffbef");
    sphere.addColorStop(.22, light);
    sphere.addColorStop(.57, shade);
    sphere.addColorStop(.85, "#171b1d");
    sphere.addColorStop(1, light);
    ctx.fillStyle = sphere;
    ctx.beginPath();
    ctx.arc(48, 53, 39, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffffffab";
    ctx.beginPath();
    ctx.ellipse(32, 34, 7, 3.5, -.64, 0, TAU);
    ctx.fill();
  });
}

function canvasView(canvas, ctx) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  return { width, height };
}

function makeFlake(width, height) {
  return {
    x: random(0, width),
    y: random(0, height),
    size: random(.55, 1.75),
    speed: random(14, 43),
    drift: random(4, 20),
    phase: random(0, TAU),
  };
}

function resize() {
  const view = canvasView(treeCanvas, treeContext);
  const stacked = matchMedia("(max-width: 43rem)").matches;
  const unit = Math.min(view.height * (stacked ? .76 : .72), view.width * (stacked ? .84 : .8));
  treeView = {
    ...view,
    unit,
    x: view.width * (stacked ? .5 : .63),
    y: (view.height - unit) * (stacked ? .37 : .42),
  };

  const prevWidth = snowView?.width || 0;
  const prevHeight = snowView?.height || 0;
  snowView = canvasView(snowCanvas, snowContext);
  const count = Math.min(115, Math.max(35, Math.round(snowView.width / 11)));

  if (flakes.length && prevWidth > 0 && prevHeight > 0) {
    const sx = snowView.width / prevWidth;
    const sy = snowView.height / prevHeight;
    for (const flake of flakes) {
      flake.x *= sx;
      flake.y *= sy;
    }
    if (flakes.length > count) flakes.length = count;
    while (flakes.length < count) flakes.push(makeFlake(snowView.width, snowView.height));
  } else {
    flakes = Array.from({ length: count }, () => makeFlake(snowView.width, snowView.height));
  }
  render();
}

function project(p, cosine, sine, out) {
  const { x, y, unit } = treeView;
  const front = p.z * cosine + p.x * sine;
  const zoom = CAMERA_DEPTH / (CAMERA_DEPTH - front);
  out.x = x + (p.x * cosine - p.z * sine) * unit * zoom;
  out.y = y + unit * (p.y + front * .135) * zoom - unit * .48 * (zoom - 1);
  out.depth = front;
  out.zoom = zoom;
  return out;
}

function paintSprite(img, x, y, size, opacity) {
  if (opacity <= .002) return;
  const ctx = treeContext;
  ctx.globalAlpha = opacity;
  ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
}

function drawBackdrop(palette, power) {
  const ctx = treeContext;
  const { x, y, width, height, unit } = treeView;
  ctx.globalAlpha = .72;
  const halo = ctx.createRadialGradient(x, y + unit * .5, 0, x, y + unit * .54, unit * .68);
  halo.addColorStop(0, power > .02 ? palette.glow + "20" : "#2a6b561d");
  halo.addColorStop(1, "#0a201800");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#b5d3b7";
  for (const [px, py, size] of sky) {
    ctx.globalAlpha = size * .27;
    ctx.fillRect(px * width, py * height, size, size);
  }

  ctx.save();
  ctx.translate(x, y + unit * TREE_GROUND);
  ctx.scale(1, .22);
  const floor = ctx.createRadialGradient(0, 0, 0, 0, 0, unit * .52);
  floor.addColorStop(0, palette.glow + "42");
  floor.addColorStop(.5, palette.glow + "18");
  floor.addColorStop(1, palette.glow + "00");
  ctx.globalAlpha = .38 + power * .5;
  ctx.fillStyle = floor;
  ctx.fillRect(-unit * .52, -unit * .52, unit * 1.04, unit * 1.04);
  ctx.restore();
}

function drawTrunk(palette, power) {
  const ctx = treeContext;
  const { x, y, unit } = treeView;
  ctx.save();
  ctx.translate(x, y + unit * TREE_GROUND);
  ctx.scale(unit, unit);
  ctx.globalAlpha = 1;

  // Flatten the contact shadow so the base sits cleanly on the snow plane.
  ctx.save();
  ctx.scale(1, .23);
  const shadow = ctx.createRadialGradient(0, 0, .006, 0, 0, .155);
  shadow.addColorStop(0, "#050b08cf");
  shadow.addColorStop(.42, "#050b0869");
  shadow.addColorStop(1, "#050b0800");
  ctx.fillStyle = shadow;
  ctx.fillRect(-.155, -.155, .31, .31);
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(-.014, -.305);
  ctx.bezierCurveTo(-.022, -.218, -.013, -.113, -.027, -.043);
  ctx.bezierCurveTo(-.031, -.022, -.04, -.01, -.054, -.003);
  ctx.bezierCurveTo(-.042, .004, -.018, -.009, -.009, -.004);
  ctx.bezierCurveTo(.003, .004, .013, -.005, .024, -.005);
  ctx.bezierCurveTo(.038, -.004, .046, .002, .058, -.003);
  ctx.bezierCurveTo(.033, -.016, .029, -.028, .027, -.056);
  ctx.bezierCurveTo(.015, -.144, .021, -.237, .012, -.305);
  ctx.closePath();

  const bark = ctx.createLinearGradient(-.036, 0, .044, 0);
  bark.addColorStop(0, "#30241a");
  bark.addColorStop(.28, "#62442d");
  bark.addColorStop(.53, "#4e3525");
  bark.addColorStop(.78, "#37291f");
  bark.addColorStop(1, "#2b2119");
  ctx.fillStyle = bark;
  ctx.fill();
  ctx.clip();

  ctx.lineWidth = .0013;
  for (const [line, color] of [
    [-.023, "#211911b8"], [-.014, "#b57c4e74"], [-.007, "#241a16b0"],
    [.001, "#e1aa6662"], [.009, "#2b1b15a0"], [.017, "#ae714740"],
  ]) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(line * .6, -.287);
    ctx.bezierCurveTo(line + .006, -.187, line - .008, -.055, line * 1.75, -.005);
    ctx.stroke();
  }

  const shade = ctx.createLinearGradient(0, -.305, 0, -.08);
  shade.addColorStop(0, "#102119");
  shade.addColorStop(.37, "#101d16a3");
  shade.addColorStop(1, "#101d1600");
  ctx.fillStyle = shade;
  ctx.fillRect(-.06, -.306, .12, .31);

  ctx.globalAlpha = .26 + power * .35;
  ctx.strokeStyle = palette.core;
  ctx.lineWidth = .0014;
  ctx.beginPath();
  ctx.moveTo(-.013, -.166);
  ctx.bezierCurveTo(-.017, -.103, -.017, -.022, -.039, -.008);
  ctx.stroke();
  ctx.restore();
}

function strokeRibbonBand(ctx, projected, startIdx, endIdx, front, palette, ratio, brightness) {
  if (endIdx <= startIdx) return;
  ctx.beginPath();
  let connected = false;
  for (let i = startIdx; i <= endIdx; i++) {
    const p = projected[i];
    if ((p.depth >= 0) !== front) {
      connected = false;
      continue;
    }
    if (connected) ctx.lineTo(p.x, p.y);
    else ctx.moveTo(p.x, p.y);
    connected = true;
  }
  ctx.strokeStyle = palette.glow;
  ctx.globalAlpha = .1 * brightness;
  ctx.lineWidth = 11 * ratio;
  ctx.stroke();
  ctx.globalAlpha = .29 * brightness;
  ctx.lineWidth = 5.4 * ratio;
  ctx.stroke();
  ctx.strokeStyle = palette.core;
  ctx.globalAlpha = .9 * brightness;
  ctx.lineWidth = 1.35 * ratio;
  ctx.stroke();
}

function drawRibbon(projected, palette, progress, front, fadeAlpha) {
  if (fadeAlpha <= .005) return;
  const ctx = treeContext;
  const { unit } = treeView;
  const lastIndex = projected.length - 1;
  const first = Math.ceil((1 - progress) * lastIndex);
  if (first >= lastIndex) return;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const ratio = unit / 500;
  const brightness = (front ? 1 : .48) * fadeAlpha;
  const tailStart = Math.max(first, Math.floor(lastIndex * .88));

  // Main continuous ribbon body.
  strokeRibbonBand(ctx, projected, first, tailStart, front, palette, ratio, brightness);

  // Taper and fade the lower tail softly into the pine skirt instead of hard-clipping.
  const tailChunks = 6;
  const tailSpan = lastIndex - tailStart;
  if (tailSpan > 0) {
    for (let step = 0; step < tailChunks; step++) {
      const s0 = tailStart + Math.floor((step / tailChunks) * tailSpan);
      const s1 = tailStart + Math.ceil(((step + 1) / tailChunks) * tailSpan);
      const falloff = 1 - smoothstep(0, 1, (step + .5) / tailChunks);
      strokeRibbonBand(ctx, projected, s0, Math.min(lastIndex, s1), front, palette, ratio * (.55 + .45 * falloff), brightness * falloff);
    }
  }

  for (let i = first + (4 - first % 4) % 4; i < projected.length; i += 4) {
    const p = projected[i];
    if ((p.depth >= 0) !== front) continue;
    const t = i / lastIndex;
    const tailFade = 1 - smoothstep(.87, 1, t);
    if (tailFade <= .02) continue;
    const flicker = .5 + .5 * Math.sin(i * 1.4 - time * 5.8);
    paintSprite(palette.light, p.x, p.y, unit * (.011 + flicker * .029), brightness * tailFade * (.32 + .5 * flicker));
  }

  if (lit && progress < 1 && (projected[first].depth >= 0) === front) {
    const { x, y } = projected[first];
    paintSprite(palette.light, x, y, unit * .10, fadeAlpha);
  }
}

function drawStar(palette, power, flash) {
  const ctx = treeContext;
  const { x, y, unit } = treeView;
  const centerY = y - unit * .045;
  const size = unit * (.055 + .007 * power);

  paintSprite(palette.light, x, centerY, unit * (.215 + .10 * power + .18 * flash),
    .39 + .40 * power + .19 * flash);

  ctx.globalAlpha = .27 + .52 * power;
  ctx.lineWidth = Math.max(.55, unit / 650);
  const rayX = size * (1.2 + 2 * power + 1.8 * flash);
  const rayY = size * (1.3 + .65 * power);
  for (const [dx, dy] of [[rayX, 0], [0, rayY]]) {
    const tint = ctx.createLinearGradient(x - dx, centerY - dy, x + dx, centerY + dy);
    tint.addColorStop(0, palette.core + "00");
    tint.addColorStop(.5, palette.core);
    tint.addColorStop(1, palette.core + "00");
    ctx.strokeStyle = tint;
    ctx.beginPath();
    ctx.moveTo(x - dx, centerY - dy);
    ctx.lineTo(x + dx, centerY + dy);
    ctx.stroke();
  }

  ctx.globalAlpha = .67 + .33 * power;
  for (let i = 0; i < 10; i++) {
    const a = i * TAU / 10 - Math.PI / 2;
    const b = a + TAU / 10;
    const r = size * (i % 2 ? .36 : 1);
    const s = size * (i % 2 ? 1 : .36);
    ctx.beginPath();
    ctx.moveTo(x, centerY);
    ctx.lineTo(x + Math.cos(a) * r, centerY + Math.sin(a) * r);
    ctx.lineTo(x + Math.cos(b) * s, centerY + Math.sin(b) * s);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? palette.glow : power > .9 ? "#fffce7" : palette.core;
    ctx.fill();
  }
}

const projectedRibbon = ribbon.map(() => ({}));
const projectedOrnaments = model.ornaments.map((item) => ({ item }));
const scratch = {};

function drawTree(elapsed) {
  const ctx = treeContext;
  const { width, height, unit } = treeView;
  const palette = palettes[cover.dataset.color];
  const still = reducedMotion.matches;
  const dt = Math.min(elapsed, .05);

  if (still) {
    lightProgress = lit ? 1 : 0;
  } else if (lit) {
    const prev = lightProgress;
    lightProgress = Math.min(1, lightProgress + dt / LIGHT_UP_TIME);
    if (prev < 1 && lightProgress >= 1) flashAt = time;
  } else if (lightProgress > 0) {
    lightProgress = Math.max(0, lightProgress - dt / LIGHT_DOWN_TIME);
  }

  if (!drag && !still && Math.abs(spinVelocity) > .002) {
    angle += spinVelocity * dt;
    spinVelocity *= Math.exp(-2.8 * dt);
    if (Math.abs(spinVelocity) <= .002) spinVelocity = 0;
  }

  const progress = lightProgress;
  const flash = still || !lit || flashAt < 0 ? 0 : Math.max(0, 1 - (time - flashAt) / .65);
  const starPower = progress > 0 ? .26 * smoothstep(0, .25, progress) + .74 * progress ** 4 : 0;
  const ribbonFade = lit ? 1 : smoothstep(0, .45, progress);
  const phase = angle + .21 * time;
  const c = Math.cos(phase);
  const s = Math.sin(phase);
  if (!still) embers.update(elapsed, time, ribbon, progress, c, s, lit);

  ctx.clearRect(0, 0, width, height);
  drawBackdrop(palette, progress);
  for (let i = 0; i < ribbon.length; i++) project(ribbon[i], c, s, projectedRibbon[i]);
  drawRibbon(projectedRibbon, palette, progress, false, ribbonFade);
  embers.draw(ctx, palette.emberAtlas, project, unit, false);
  drawTrunk(palette, progress);

  const particleScale = Math.max(.64, unit / 400);
  for (let tone = 0; tone < model.needles.length; tone++) {
    ctx.fillStyle = palette.needles[tone];
    ctx.globalAlpha = [.38, .57, .73, .88][tone] * (.85 + .15 * progress);
    for (const needle of model.needles[tone]) {
      const p = project(needle, c, s, scratch);
      const size = needle.size * particleScale * p.zoom;
      ctx.fillRect(p.x, p.y, size * 1.54, size);
    }
  }

  for (const ornament of projectedOrnaments) project(ornament.item, c, s, ornament);
  projectedOrnaments.sort((first, second) => first.depth - second.depth);
  for (const p of projectedOrnaments) {
    const opacity = Math.max(.2, .65 + p.depth * 1.2);
    const size = p.item.size * unit * p.zoom * (p.depth < 0 ? 1.24 : 1.9);
    paintSprite(palette.baubles[p.item.tone], p.x, p.y, size, opacity);
  }

  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < model.lamps.length; i++) {
    const lamp = model.lamps[i];
    const p = project(lamp, c, s, scratch);
    const pulse = .65 + .33 * Math.sin(time * 2.4 + i * 7.83);
    const reached = progress > 0 && lamp.y > .92 * (1 - progress);
    const glowBoost = reached ? .39 * smoothstep(0, .18, progress) : 0;
    const alpha = (.15 + .30 * pulse + glowBoost) * (p.depth < -.09 ? .36 : 1);
    const size = (.032 + (reached ? .030 * smoothstep(0, .18, progress) : 0)) * unit * lamp.size * p.zoom;
    paintSprite(palette.light, p.x, p.y, size, alpha);
  }
  ctx.globalCompositeOperation = "source-over";

  drawRibbon(projectedRibbon, palette, progress, true, ribbonFade);
  embers.draw(ctx, palette.emberAtlas, project, unit, true);
  drawStar(palette, starPower, flash);
  ctx.globalAlpha = 1;
}

function drawSnow(elapsed) {
  const { width, height } = snowView;
  snowContext.clearRect(0, 0, width, height);
  if (!snowing) return;

  snowContext.fillStyle = "#f2faf6";
  for (const flake of flakes) {
    flake.y += flake.speed * elapsed;
    flake.x += Math.sin(time * .6 + flake.phase) * flake.drift * elapsed;

    if (flake.y > height + 4) flake.y = -4;
    if (flake.x < -4) flake.x = width + 4;
    if (flake.x > width + 4) flake.x = -4;

    snowContext.globalAlpha = .22 + flake.size * .24;
    snowContext.beginPath();
    snowContext.arc(flake.x, flake.y, flake.size, 0, TAU);
    snowContext.fill();
  }
}

function render(now = performance.now()) {
  cancelAnimationFrame(frame);
  const elapsed = lastTime ? Math.max(0, (now - lastTime) / 1000) : 0;
  lastTime = now;
  if (!reducedMotion.matches) time += elapsed;
  drawTree(elapsed);
  drawSnow(Math.min(elapsed, .05));

  if (!document.hidden && (!reducedMotion.matches || snowing)) frame = requestAnimationFrame(render);
  else lastTime = 0;
}

function setLit(value) {
  const changed = value !== lit;
  lit = value;
  if (reducedMotion.matches) lightProgress = lit ? 1 : 0;
  if (!lit) flashAt = -10;
  cover.dataset.lit = String(lit);
  lightLabel.textContent = lit ? "调暗树灯" : "点亮圣诞树";
  if (changed) musicBox.playLightChime(lit);
  render();
}

function setSnow(value) {
  snowing = value;
  snowSwitch.setAttribute("aria-pressed", String(value));
  render();
}

function handleTreeTap(clientX, clientY) {
  if (!treeView) return;
  const rect = treeCanvas.getBoundingClientRect();
  const cx = clientX - rect.left;
  const cy = clientY - rect.top;
  const nx = (cx - treeView.x) / treeView.unit;
  const ny = (cy - treeView.y) / treeView.unit;
  const insideCone = ny >= -.10 && ny <= 1.10 && Math.abs(nx) <= .14 + Math.max(0, ny) * .44;
  if (!insideCone) return;

  if (!lit) setLit(true);
  if (!reducedMotion.matches) {
    const clampedY = Math.max(.02, Math.min(.92, ny));
    embers.burst(nx * .78, clampedY, .16 + clampedY * .20, 32);
  }
  musicBox.playTapNote();
  render();
}

function updateCardPreview() {
  if (!cardPreview || !cardDialog?.open) return;
  drawGreetingCard(cardPreview, {
    treeCanvas,
    snowCanvas,
    color: cover.dataset.color,
    dateText: dateTextEl?.textContent?.trim() || "12 月 25 日 · 圣诞节",
    wishText: cardWishInput?.value || DEFAULT_WISH,
    signature: cardSignInput?.value || "",
    forestImage,
    snowing,
  });
}

function applyWishToPage(text) {
  if (!wishEl) return;
  const lines = (text.trim() || DEFAULT_WISH).replace(/\r\n/g, "\n").split("\n").slice(0, 3);
  wishEl.replaceChildren();
  lines.forEach((line, idx) => {
    if (idx > 0) wishEl.appendChild(document.createElement("br"));
    wishEl.appendChild(document.createTextNode(line));
  });
}

if (dateTextEl) {
  dateTextEl.textContent = formatChristmasDate();
}

if (treeContext && snowContext) {
  for (const [name, palette] of Object.entries(palettes)) {
    palette.emberAtlas = makeEmberAtlas(name);
    palette.light = makeGlow(palette.glow);
    palette.baubles = palette.ornaments.map(([light, shade]) => makeOrnament(light, shade));
  }

  lightSwitch.hidden = false;
  controls.hidden = false;
  document.querySelector(".rotation-hint").hidden = false;
  treeCanvas.tabIndex = 0;
  snowSwitch.setAttribute("aria-pressed", String(snowing));

  lightSwitch.addEventListener("click", () => setLit(!lit));
  for (const button of colorButtons) {
    button.addEventListener("click", () => {
      cover.dataset.color = button.dataset.select;
      for (const option of colorButtons) option.setAttribute("aria-pressed", String(button === option));
      setLit(true);
      updateCardPreview();
    });
  }

  treeCanvas.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    spinVelocity = 0;
    drag = {
      id: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      angle,
      moved: 0,
      velocity: 0,
    };
    treeCanvas.setPointerCapture(event.pointerId);
    treeCanvas.classList.add("dragging");
  });
  treeCanvas.addEventListener("pointermove", (event) => {
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    drag.moved += Math.hypot(dx, dy);
    const dtMs = Math.max(4, event.timeStamp - drag.lastTime);
    angle = drag.angle + (event.clientX - drag.startX) * .0115;
    const instVel = (dx * .0115) / (dtMs / 1000);
    drag.velocity = Math.max(-6.5, Math.min(6.5, drag.velocity * .55 + instVel * .45));
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    render();
  });
  treeCanvas.addEventListener("pointerup", (event) => {
    if (drag?.id !== event.pointerId) return;
    const released = drag;
    drag = null;
    treeCanvas.classList.remove("dragging");
    if (released.moved < 7) {
      handleTreeTap(event.clientX, event.clientY);
    } else if (!reducedMotion.matches && event.timeStamp - released.lastTime < 90) {
      spinVelocity = released.velocity;
    }
  });
  treeCanvas.addEventListener("lostpointercapture", () => {
    drag = null;
    treeCanvas.classList.remove("dragging");
  });
  treeCanvas.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowLeft" ? -.18 : .18;
    angle += step;
    if (!reducedMotion.matches) spinVelocity = step * 3.5;
    render();
  });

  snowSwitch.addEventListener("click", () => setSnow(!snowing));

  if (musicSwitch) {
    musicSwitch.addEventListener("click", () => {
      const active = musicBox.toggle();
      musicSwitch.setAttribute("aria-pressed", String(active));
    });
  }

  if (cardTrigger && cardDialog) {
    cardTrigger.addEventListener("click", async () => {
      if (!cardDialog.open) cardDialog.showModal();
      updateCardPreview();
      if (!forestImage) {
        forestImage = await loadForestImage();
        updateCardPreview();
      }
    });
    cardCloseButton?.addEventListener("click", () => cardDialog.close());
    cardDialog.addEventListener("click", (event) => {
      if (event.target === cardDialog) cardDialog.close();
    });
    cardWishInput?.addEventListener("input", () => {
      applyWishToPage(cardWishInput.value);
      updateCardPreview();
    });
    cardSignInput?.addEventListener("input", updateCardPreview);
    for (const preset of cardPresetButtons) {
      preset.addEventListener("click", () => {
        if (!cardWishInput) return;
        cardWishInput.value = preset.dataset.wishPreset.replace(/\\n/g, "\n");
        applyWishToPage(cardWishInput.value);
        updateCardPreview();
      });
    }
    cardDownloadButton?.addEventListener("click", async () => {
      const original = cardDownloadButton.textContent;
      cardDownloadButton.disabled = true;
      try {
        await downloadGreetingCard({
          treeCanvas,
          snowCanvas,
          color: cover.dataset.color,
          dateText: dateTextEl?.textContent?.trim() || "12 月 25 日 · 圣诞节",
          wishText: cardWishInput?.value || DEFAULT_WISH,
          signature: cardSignInput?.value || "",
          forestImage,
          snowing,
        });
        cardDownloadButton.textContent = "已保存贺卡 ✓";
        window.setTimeout(() => {
          cardDownloadButton.textContent = original;
          cardDownloadButton.disabled = false;
        }, 1600);
      } catch {
        cardDownloadButton.disabled = false;
      }
    });
  }

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      embers.clear();
      spinVelocity = 0;
      lightProgress = lit ? 1 : 0;
    }
    setSnow(!reducedMotion.matches);
  });
  document.addEventListener("visibilitychange", () => {
    lastTime = 0;
    musicBox.setVisibility(document.hidden);
    render();
  });

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(cover);
  observer.observe(treeCanvas);
}
