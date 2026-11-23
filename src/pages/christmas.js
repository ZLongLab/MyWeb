import { CAMERA_DEPTH, EmberTrail, makeEmberAtlas } from "./christmas-embers.js";

const cover = document.querySelector(".cover");
const lightSwitch = document.querySelector(".light-switch");
const lightLabel = document.querySelector(".light-label");
const controls = document.querySelector(".controls");
const colorButtons = [...document.querySelectorAll(".color")];
const snowSwitch = document.querySelector(".snow-switch");
const treeCanvas = document.querySelector(".tree-lights");
const snowCanvas = document.querySelector(".snow");
const treeContext = treeCanvas.getContext("2d");
const snowContext = snowCanvas.getContext("2d");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const TAU = Math.PI * 2;
const embers = new EmberTrail();
const LIGHT_UP_TIME = 2.3;
const TREE_GROUND = 1.086;
const palettes = {
  gold: {
    needles: ["#45826d", "#83b498", "#bbd5ac", "#ffe4a3"],
    glow: "#ffb646", core: "#fff1bb", ornaments: [["#ffe6a0", "#95601a"], ["#e46a65", "#561d26"]],
  },
  ice: {
    needles: ["#386d76", "#76a8b6", "#bbdce3", "#d8f5ff"],
    glow: "#539fff", core: "#e2faff", ornaments: [["#ffe6a0", "#95601a"], ["#81d7ff", "#235486"]],
  },
  rose: {
    needles: ["#605164", "#a08199", "#ddbcc3", "#ffd6df"],
    glow: "#ff78ad", core: "#ffe6ef", ornaments: [["#ffabca", "#912957"], ["#ffe2b2", "#a45c59"]],
  },
};

let frame = 0;
let lastTime = 0;
let time = 0;
let angle = .38;
let drag = null;
let litAt = -LIGHT_UP_TIME;
let lit = false;
let snowing = !reducedMotion.matches;
let treeView;
let snowView;
let flakes = [];

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
    const y = .055 + tier * .077;
    const radius = .035 + .404 * y ** .87;
    const branches = 10 + tier;
    const phase = random(0, TAU);
    for (let branch = 0; branch < branches; branch++) {
      const a = phase + branch / branches * TAU + random(-.095, .095);
      const length = radius * random(.79, 1.08);
      const tip = y + random(.02, .054);
      for (let needle = 0; needle < 33; needle++) {
        const along = random(.13, 1);
        const aSprig = a + random(-.4, .4) * (1 - .74 * along);
        const ySprig = tip - (1 - along) * .078 + random(-.019, .022);
        const tone = Math.min(3, Math.floor(random(0, 4.9) * (.48 + .48 * along)));
        needles[tone].push(point(aSprig, length * along, ySprig, random(.39, 1.35), tone));
      }
      if ((branch + tier) % 4 === 0) {
        ornaments.push(point(a, length * .83, tip + .023, random(.011, .022), (tier + branch) % 3 === 0 ? 1 : 0));
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
  const y = .035 + i / 280 * .939;
  return point(y * TAU * 4.1 + .35, .06 + .444 * y ** .94, y, 1);
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

function resize() {
  const view = canvasView(treeCanvas, treeContext);
  const stacked = matchMedia("(max-width: 43rem)").matches;
  const unit = Math.min(view.height * (stacked ? .80 : .72), view.width * (stacked ? .85 : .8));
  treeView = {
    ...view, unit,
    x: view.width * (stacked ? .5 : .63),
    y: (view.height - unit) * (stacked ? .46 : .42),
  };
  snowView = canvasView(snowCanvas, snowContext);
  const count = Math.min(115, Math.max(35, Math.round(snowView.width / 11)));
  flakes = Array.from({ length: count }, () => ({
    x: random(0, snowView.width), y: random(0, snowView.height),
    size: random(.55, 1.75), speed: random(14, 43),
    drift: random(4, 20), phase: random(0, TAU),
  }));
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
  const ctx = treeContext;
  ctx.globalAlpha = opacity;
  ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
}

function drawBackdrop(palette, power) {
  const ctx = treeContext;
  const { x, y, width, height, unit } = treeView;
  ctx.globalAlpha = .72;
  const halo = ctx.createRadialGradient(x, y + unit * .5, 0, x, y + unit * .54, unit * .68);
  halo.addColorStop(0, power > 0 ? palette.glow + "20" : "#2a6b561d");
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
  const floor = ctx.createRadialGradient(0, 0, 0, 0, 0, unit * .55);
  floor.addColorStop(0, palette.glow + "42");
  floor.addColorStop(.5, palette.glow + "18");
  floor.addColorStop(1, palette.glow + "00");
  ctx.globalAlpha = .40 + power * .5;
  ctx.fillStyle = floor;
  ctx.fillRect(-unit * .55, -unit * .55, unit * 1.1, unit * 1.1);
  ctx.restore();
}

function drawTrunk(palette, power) {
  const ctx = treeContext;
  const { x, y, unit } = treeView;
  ctx.save();
  ctx.translate(x, y + unit * TREE_GROUND);
  ctx.scale(unit, unit);
  ctx.globalAlpha = 1;

  // Flatten the contact shadow so the base sits on the snow plane.
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
function drawRibbon(projected, palette, progress, front) {
  const ctx = treeContext;
  const { unit } = treeView;
  const first = Math.ceil((1 - progress) * (projected.length - 1));
  if (first >= projected.length - 1) return;

  ctx.beginPath();
  let connected = false;
  for (let i = first; i < projected.length; i++) {
    const p = projected[i];
    if ((p.depth >= 0) !== front) {
      connected = false;
      continue;
    }
    if (connected) ctx.lineTo(p.x, p.y);
    else ctx.moveTo(p.x, p.y);
    connected = true;
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const ratio = unit / 500;
  const brightness = front ? 1 : .48;
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

  for (let i = first + (4 - first % 4) % 4; i < projected.length; i += 4) {
    const p = projected[i];
    if ((p.depth >= 0) !== front) continue;
    const flicker = .5 + .5 * Math.sin(i * 1.4 - time * 5.8);
    paintSprite(palette.light, p.x, p.y, unit * (.011 + flicker * .029), brightness * (.32 + .5 * flicker));
  }

  if (progress < 1 && (projected[first].depth >= 0) === front) {
    const { x, y } = projected[first];
    paintSprite(palette.light, x, y, unit * .10, 1);
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
  const progress = lit ? Math.min(1, (time - litAt) / LIGHT_UP_TIME) : 0;
  const flash = still || !lit ? 0 : Math.max(0, 1 - Math.abs(time - litAt - LIGHT_UP_TIME) / .6);
  const starPower = lit ? .26 + .74 * progress ** 4 : 0;
  const phase = angle + .21 * time;
  const c = Math.cos(phase);
  const s = Math.sin(phase);
  if (!still) embers.update(elapsed, time, ribbon, progress, c, s, lit);

  ctx.clearRect(0, 0, width, height);
  drawBackdrop(palette, progress);
  for (let i = 0; i < ribbon.length; i++) project(ribbon[i], c, s, projectedRibbon[i]);
  drawRibbon(projectedRibbon, palette, progress, false);
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
    const reached = lamp.y > 1 - progress;
    const alpha = (.15 + .30 * pulse + (reached ? .39 : 0)) * (p.depth < -.09 ? .36 : 1);
    const size = (reached ? .062 : .032) * unit * lamp.size * p.zoom;
    paintSprite(palette.light, p.x, p.y, size, alpha);
  }
  ctx.globalCompositeOperation = "source-over";

  drawRibbon(projectedRibbon, palette, progress, true);
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
  if (value && !lit) litAt = time - (reducedMotion.matches ? LIGHT_UP_TIME : 0);
  lit = value;
  cover.dataset.lit = String(lit);
  lightLabel.textContent = lit ? "调暗树灯" : "点亮圣诞树";
  render();
}

function setSnow(value) {
  snowing = value;
  snowSwitch.setAttribute("aria-pressed", String(value));
  render();
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
    });
  }

  treeCanvas.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, angle };
    treeCanvas.setPointerCapture(event.pointerId);
    treeCanvas.classList.add("dragging");
  });
  treeCanvas.addEventListener("pointermove", (event) => {
    if (drag?.id !== event.pointerId) return;
    angle = drag.angle + (event.clientX - drag.x) * .012;
    render();
  });
  treeCanvas.addEventListener("lostpointercapture", () => {
    drag = null;
    treeCanvas.classList.remove("dragging");
  });
  treeCanvas.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    angle += event.key === "ArrowLeft" ? -.17 : .17;
    render();
  });

  snowSwitch.addEventListener("click", () => setSnow(!snowing));
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      embers.clear();
      if (lit) litAt = time - LIGHT_UP_TIME;
    }
    setSnow(!reducedMotion.matches);
  });
  document.addEventListener("visibilitychange", () => {
    lastTime = 0;
    render();
  });

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(cover);
  observer.observe(treeCanvas);
}
