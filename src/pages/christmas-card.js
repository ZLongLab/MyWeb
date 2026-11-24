const CARD_THEMES = {
  gold: {
    accent: "#ebce91",
    frameLine: "rgba(235, 206, 145, 0.25)",
    frameCorner: "rgba(235, 206, 145, 0.68)",
    forestLight: "rgba(186, 135, 76, 0.16)",
    snowLight: "rgba(196, 139, 68, 0.24)",
    merryStops: ["#fffaee", "#f7e3b9"],
    xmasStops: ["#fff0c9", "#edc77b"],
    glint: "#f4d798",
  },
  ice: {
    accent: "#bce5ff",
    frameLine: "rgba(164, 217, 250, 0.26)",
    frameCorner: "rgba(176, 224, 252, 0.72)",
    forestLight: "rgba(93, 155, 213, 0.22)",
    snowLight: "rgba(104, 156, 186, 0.26)",
    merryStops: ["#f7fcff", "#d8efff"],
    xmasStops: ["#e8f8ff", "#98d4fa"],
    glint: "#bde4ff",
  },
  rose: {
    accent: "#f7bfd2",
    frameLine: "rgba(245, 179, 204, 0.26)",
    frameCorner: "rgba(245, 179, 204, 0.72)",
    forestLight: "rgba(184, 94, 130, 0.20)",
    snowLight: "rgba(181, 99, 123, 0.24)",
    merryStops: ["#fff9fb", "#f8dce5"],
    xmasStops: ["#ffeef4", "#f2a4c0"],
    glint: "#f8c7d8",
  },
};

let forestImagePromise = null;

export function loadForestImage() {
  if (forestImagePromise) return forestImagePromise;
  forestImagePromise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    const base = import.meta.env.BASE_URL || "/";
    img.src = `${base}assets/images/christmas-snow-forest.webp`;
  });
  return forestImagePromise;
}

function drawCoverSource(ctx, source, srcW, srcH, width, height) {
  if (!source || !srcW || !srcH) return;
  const imgRatio = srcW / srcH;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;
  if (imgRatio > targetRatio) {
    sw = srcH * targetRatio;
    sx = (srcW - sw) / 2;
  } else {
    sh = srcW / targetRatio;
    sy = (srcH - sh) / 2;
  }
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, width, height);
}

function drawCoverImage(ctx, img, width, height) {
  if (!img) return;
  drawCoverSource(ctx, img, img.naturalWidth, img.naturalHeight, width, height);
}

function drawFourPointStar(ctx, cx, cy, outerR, color) {
  const innerR = outerR * .24;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function wrapWishLines(ctx, text, maxWidth) {
  const paragraphs = text.replace(/\r\n/g, "\n").split("\n");
  const lines = [];
  for (const para of paragraphs) {
    if (!para) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const ch of para) {
      const candidate = current + ch;
      if (ctx.measureText(candidate).width > maxWidth && current) {
        lines.push(current);
        current = ch;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines.slice(0, 4);
}

export function drawGreetingCard(canvas, {
  treeCanvas,
  snowCanvas,
  color = "gold",
  dateText = "12 月 25 日 · 圣诞节",
  wishText = "愿这个冬天，\n每一个小小的愿望，都有一束光。",
  signature = "",
  forestImage = null,
  snowing = false,
}) {
  const width = 1600;
  const height = 960;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const theme = CARD_THEMES[color] || CARD_THEMES.gold;
  ctx.clearRect(0, 0, width, height);

  // Base winter night & forest backdrop.
  ctx.fillStyle = "#081b14";
  ctx.fillRect(0, 0, width, height);
  drawCoverImage(ctx, forestImage, width, height);

  // Soft left scrim for effortless typography legibility.
  const leftScrim = ctx.createLinearGradient(0, 0, width * .62, 0);
  leftScrim.addColorStop(0, "rgba(6, 20, 15, 0.56)");
  leftScrim.addColorStop(.68, "rgba(6, 20, 15, 0.24)");
  leftScrim.addColorStop(1, "rgba(6, 20, 15, 0)");
  ctx.fillStyle = leftScrim;
  ctx.fillRect(0, 0, width, height);

  // Ambient theme lights behind the tree and snow floor.
  ctx.save();
  ctx.translate(width * .72, height * .50);
  ctx.scale(1, 1.35);
  const forestHalo = ctx.createRadialGradient(0, 0, 0, 0, 0, width * .30);
  forestHalo.addColorStop(0, theme.forestLight);
  forestHalo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = forestHalo;
  ctx.fillRect(-width, -height, width * 2, height * 2);
  ctx.restore();

  ctx.save();
  ctx.translate(width * .72, height * .89);
  ctx.scale(1.3, .45);
  const floorHalo = ctx.createRadialGradient(0, 0, 0, 0, 0, width * .26);
  floorHalo.addColorStop(0, theme.snowLight);
  floorHalo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = floorHalo;
  ctx.fillRect(-width, -height, width * 2, height * 2);
  ctx.restore();

  // Composite the live 3D particle tree while preserving aspect ratio.
  if (treeCanvas && treeCanvas.width && treeCanvas.height) {
    const srcRatio = treeCanvas.width / treeCanvas.height;
    const isPortraitSource = srcRatio < 1.05;
    if (isPortraitSource) {
      const targetH = height * .92;
      const targetW = targetH * srcRatio;
      const dx = width * .71 - targetW / 2;
      const dy = (height - targetH) / 2;
      ctx.drawImage(treeCanvas, dx, dy, targetW, targetH);
    } else {
      const slotW = width * .77;
      const slotH = height;
      const slotRatio = slotW / slotH;
      let drawW = slotW;
      let drawH = slotH;
      if (srcRatio > slotRatio) {
        drawH = slotW / srcRatio;
      } else {
        drawW = slotH * srcRatio;
      }
      const dx = width * .23 + (slotW - drawW) / 2;
      const dy = (slotH - drawH) / 2;
      ctx.drawImage(treeCanvas, dx, dy, drawW, drawH);
    }
  }

  // Composite multi-layer live snowfall without stretching flakes across aspect ratios.
  if (snowing && snowCanvas && snowCanvas.width && snowCanvas.height) {
    ctx.save();
    ctx.globalAlpha = .92;
    drawCoverSource(ctx, snowCanvas, snowCanvas.width, snowCanvas.height, width, height);
    ctx.restore();
  }

  // Delicate sky glints.
  for (const [gx, gy, gr] of [
    [.19, .20, 7], [.43, .17, 5], [.51, .34, 8], [.46, .68, 5], [.92, .28, 6],
  ]) {
    ctx.save();
    ctx.globalAlpha = .58;
    drawFourPointStar(ctx, width * gx, height * gy, gr, theme.glint);
    ctx.restore();
  }

  // Refined frame border & corner brackets.
  const inset = 30;
  const radius = 18;
  ctx.save();
  ctx.strokeStyle = theme.frameLine;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(inset, inset, width - inset * 2, height - inset * 2, radius);
  ctx.stroke();

  ctx.strokeStyle = theme.frameCorner;
  ctx.lineWidth = 2;
  const arm = 26;
  const corners = [
    [inset, inset, 1, 1],
    [width - inset, inset, -1, 1],
    [width - inset, height - inset, -1, -1],
    [inset, height - inset, 1, -1],
  ];
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + sy * arm);
    ctx.lineTo(cx, cy + sy * 10);
    ctx.quadraticCurveTo(cx, cy, cx + sx * 10, cy);
    ctx.lineTo(cx + sx * arm, cy);
    ctx.stroke();
  }
  ctx.restore();

  // Left editorial greeting copy.
  const leftX = 112;
  drawFourPointStar(ctx, leftX + 10, 266, 9, theme.accent);
  ctx.save();
  ctx.fillStyle = theme.accent;
  ctx.font = '500 22px "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  ctx.fillText(dateText, leftX + 32, 274);

  // Metallic foil Merry Christmas title.
  ctx.shadowColor = "rgba(3, 16, 11, 0.48)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;

  const merryGrad = ctx.createLinearGradient(leftX, 300, leftX + 360, 420);
  merryGrad.addColorStop(0, theme.merryStops[0]);
  merryGrad.addColorStop(1, theme.merryStops[1]);
  ctx.fillStyle = merryGrad;
  ctx.font = '400 132px Georgia, "Times New Roman", serif';
  ctx.fillText("Merry", leftX - 4, 418);

  const xmasGrad = ctx.createLinearGradient(leftX, 430, leftX + 520, 560);
  xmasGrad.addColorStop(0, theme.xmasStops[0]);
  xmasGrad.addColorStop(1, theme.xmasStops[1]);
  ctx.fillStyle = xmasGrad;
  ctx.font = 'italic 400 134px Georgia, "Times New Roman", serif';
  ctx.fillText("Christmas", leftX - 4, 540);
  ctx.restore();

  // Custom wish body.
  ctx.save();
  ctx.fillStyle = "#eae4cf";
  ctx.font = '400 27px "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  const wishLines = wrapWishLines(ctx, wishText.trim() || "愿这个冬天，\n每一个小小的愿望，都有一束光。", 540);
  let yCursor = 626;
  for (const line of wishLines) {
    ctx.fillText(line, leftX, yCursor);
    yCursor += 48;
  }

  const trimmedSig = signature.trim();
  if (trimmedSig) {
    ctx.fillStyle = theme.accent;
    ctx.font = '500 22px "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
    ctx.fillText(`—— ${trimmedSig}`, leftX, yCursor + 18);
  }

  // Quiet bottom-left colophon.
  ctx.fillStyle = "rgba(214, 212, 186, 0.68)";
  ctx.font = '400 19px "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  ctx.fillText("✦ 有间小站 · 圣诞特辑", leftX, height - 68);
  ctx.restore();
}

export async function downloadGreetingCard(options) {
  const offscreen = document.createElement("canvas");
  const forestImage = options.forestImage ?? (await loadForestImage());
  drawGreetingCard(offscreen, { ...options, forestImage });

  const blob = await new Promise((resolve) => offscreen.toBlob(resolve, "image/png"));
  const filename = `christmas-card-${options.color || "gold"}.png`;
  const link = document.createElement("a");
  if (blob) {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } else {
    link.href = offscreen.toDataURL("image/png");
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
