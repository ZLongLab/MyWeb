import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/frame-studio.css";

const BACKDROPS = [
  {
    id: "porcelain",
    label: "晨光瓷白",
    swatch: "linear-gradient(135deg, #f9eee2, #e5f3ec)",
    stops: ["#faf4ec", "#f5f7f4", "#e4f2eb"],
    dark: false,
  },
  {
    id: "mint",
    label: "薄荷清雾",
    swatch: "linear-gradient(135deg, #d7eee3, #e4eff7)",
    stops: ["#d6ede2", "#edf7f2", "#e2eff8"],
    dark: false,
  },
  {
    id: "apricot",
    label: "暖杏微光",
    swatch: "linear-gradient(135deg, #f8dfc7, #f4d6cf)",
    stops: ["#f7e0c9", "#fbf3e9", "#f2d8d0"],
    dark: false,
  },
  {
    id: "mist",
    label: "雾海晴蓝",
    swatch: "linear-gradient(135deg, #d9eaf7, #e6e7f7)",
    stops: ["#d8eaf7", "#eef5fb", "#e6e7f6"],
    dark: false,
  },
  {
    id: "pine",
    label: "深松夜林",
    swatch: "linear-gradient(135deg, #10251d, #234536)",
    stops: ["#0f231b", "#1a3529", "#244738"],
    dark: true,
  },
  {
    id: "transparent",
    label: "透明底",
    swatch:
      "repeating-conic-gradient(#e7e6e1 0% 25%, #ffffff 0% 50%) 50% / 12px 12px",
    stops: null,
    dark: false,
  },
];

const RATIOS = [
  { id: "auto", label: "自适应", value: null },
  { id: "16:9", label: "16:9 宽屏", value: 16 / 9 },
  { id: "4:3", label: "4:3 展示", value: 4 / 3 },
  { id: "1:1", label: "1:1 方形", value: 1 },
  { id: "3:4", label: "3:4 竖图", value: 3 / 4 },
];

const FRAMES = [
  { id: "mac", label: "极简窗口" },
  { id: "glass", label: "细线玻璃" },
  { id: "clean", label: "纯圆角" },
];

const STUDIO_MODES = [
  { id: "image", label: "图片截图" },
  { id: "code", label: "代码卡片" },
  { id: "quote", label: "引文摘录" },
];

const STYLE_PRESETS = [
  {
    id: "gallery-morning",
    label: "画廊晨光",
    backdropId: "porcelain",
    frameStyle: "mac",
    ratioId: "auto",
    padding: 72,
    radius: 18,
    shadow: 55,
  },
  {
    id: "pine-showcase",
    label: "暗夜展示",
    backdropId: "pine",
    frameStyle: "glass",
    ratioId: "16:9",
    padding: 84,
    radius: 20,
    shadow: 75,
  },
  {
    id: "social-square",
    label: "方图分享",
    backdropId: "apricot",
    frameStyle: "mac",
    ratioId: "1:1",
    padding: 64,
    radius: 16,
    shadow: 45,
  },
  {
    id: "clear-glass",
    label: "清透浮窗",
    backdropId: "mint",
    frameStyle: "glass",
    ratioId: "4:3",
    padding: 80,
    radius: 22,
    shadow: 40,
  },
];

const DEFAULT_CODE = `// Local-first: every render stays in your browser
export function formatGreeting(name: string) {
  const hour = new Date().getHours();
  const mood = hour < 12 ? "晨光正好" : hour < 19 ? "午后静谧" : "晚风轻柔";
  return \`\${mood}，欢迎来到 \${name}。\`;
}`;

const DEFAULT_QUOTE = "把想法做出来，也给生活留一点空隙。\n慢一点没关系，把每一件小事做扎实。";

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function createSampleImage() {
  const sample = document.createElement("canvas");
  sample.width = 1120;
  sample.height = 680;
  const ctx = sample.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, sample.width, sample.height);
  grad.addColorStop(0, "#1d2723");
  grad.addColorStop(1, "#263630");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, sample.width, sample.height);

  ctx.fillStyle = "rgba(255,255,255,0.06)";
  drawRoundedRect(ctx, 48, 46, 300, 588, 18);
  ctx.fill();
  drawRoundedRect(ctx, 376, 46, 696, 260, 18);
  ctx.fill();
  drawRoundedRect(ctx, 376, 334, 334, 300, 18);
  ctx.fill();
  drawRoundedRect(ctx, 738, 334, 334, 300, 18);
  ctx.fill();

  ctx.fillStyle = "#8cd6b6";
  ctx.font = "600 22px system-ui, sans-serif";
  ctx.fillText("有间小站 · 示例画布", 80, 108);
  ctx.fillStyle = "rgba(240,236,227,0.68)";
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillText("拖入图片，或按 Ctrl+V 粘贴你的截图", 80, 146);

  const bars = [200, 160, 220, 130, 185];
  bars.forEach((w, i) => {
    ctx.fillStyle = i === 0 ? "rgba(140,214,182,0.45)" : "rgba(255,255,255,0.12)";
    drawRoundedRect(ctx, 80, 200 + i * 44, w, 18, 9);
    ctx.fill();
  });

  ctx.fillStyle = "#f4ece0";
  ctx.font = "600 32px Georgia, serif";
  ctx.fillText("Local-First Screenshot Frame", 416, 132);
  ctx.fillStyle = "rgba(232,226,214,0.72)";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("所有渲染均在当前浏览器 Canvas 完成，绝不上传原图。", 416, 178);

  const pills = [
    ["PNG / WebP 导出", "#375e4d", "#d8f2e6"],
    ["代码 / 引文卡片", "#5b4832", "#f5e3cc"],
    ["Ctrl+V 粘贴即得", "#2d4b5e", "#d8ecf8"],
  ];
  pills.forEach(([label, bg, fg], i) => {
    ctx.fillStyle = bg;
    drawRoundedRect(ctx, 416 + i * 204, 220, 186, 42, 21);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.font = "500 15px system-ui, sans-serif";
    ctx.fillText(label, 442 + i * 204, 246);
  });

  ctx.fillStyle = "#ebd095";
  ctx.font = "500 16px Consolas, monospace";
  ctx.fillText("01 / PRIVACY", 414, 392);
  ctx.fillStyle = "#f0ece3";
  ctx.font = "600 42px Georgia, serif";
  ctx.fillText("100% 本地", 414, 464);
  ctx.fillStyle = "rgba(232,226,214,0.65)";
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillText("断网离线依然可用", 414, 514);

  ctx.fillStyle = "#9ad3ba";
  ctx.font = "500 16px Consolas, monospace";
  ctx.fillText("02 / RESOLUTION", 776, 392);
  ctx.fillStyle = "#f0ece3";
  ctx.font = "600 42px Georgia, serif";
  ctx.fillText("2x 高清", 776, 464);
  ctx.fillStyle = "rgba(232,226,214,0.65)";
  ctx.font = "15px system-ui, sans-serif";
  ctx.fillText("保留原始清晰细节", 776, 514);

  return sample;
}

function tokenizeCodeLine(line) {
  if (/^\s*(\/\/|#|--)/.test(line)) return [{ text: line, kind: "comment" }];
  const tokens = [];
  const regex =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|export|from|const|let|var|function|return|if|else|for|while|async|await|def|class|try|catch|new|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;
  let last = 0;
  for (const match of line.matchAll(regex)) {
    if (match.index > last) {
      tokens.push({ text: line.slice(last, match.index), kind: "plain" });
    }
    const token = match[0];
    const kind =
      /^['"`]/.test(token)
        ? "string"
        : /^\d/.test(token)
          ? "number"
          : "keyword";
    tokens.push({ text: token, kind });
    last = match.index + token.length;
  }
  if (last < line.length) tokens.push({ text: line.slice(last), kind: "plain" });
  return tokens.length ? tokens : [{ text: " ", kind: "plain" }];
}

function createCodeCardSource(codeText, codeTheme) {
  const lines = (codeText || " ").replace(/\r\n/g, "\n").split("\n").slice(0, 24);
  const lineH = 38;
  const padX = 48;
  const padY = 44;
  const width = 1040;
  const height = Math.max(380, padY * 2 + lines.length * lineH);
  const dark = codeTheme === "dark";

  const surface = document.createElement("canvas");
  surface.width = width;
  surface.height = height;
  const ctx = surface.getContext("2d");

  ctx.fillStyle = dark ? "#14221d" : "#fbfaf7";
  ctx.fillRect(0, 0, width, height);

  const colors = dark
    ? {
        gutter: "rgba(182, 207, 194, 0.36)",
        plain: "#eef4f0",
        keyword: "#8bd9b5",
        string: "#f5d393",
        number: "#a6d4ff",
        comment: "#7fa090",
      }
    : {
        gutter: "rgba(56, 78, 68, 0.34)",
        plain: "#24302b",
        keyword: "#2b6b52",
        string: "#9c6334",
        number: "#30648f",
        comment: "#7c8c84",
      };

  ctx.font = '500 22px "Cascadia Code", Consolas, "Courier New", monospace';
  ctx.textBaseline = "middle";

  lines.forEach((rawLine, index) => {
    const y = padY + index * lineH + lineH / 2;
    ctx.fillStyle = colors.gutter;
    ctx.textAlign = "right";
    ctx.fillText(String(index + 1).padStart(2, " "), padX + 28, y);

    ctx.textAlign = "left";
    let x = padX + 54;
    for (const part of tokenizeCodeLine(rawLine.slice(0, 84))) {
      ctx.fillStyle = colors[part.kind] || colors.plain;
      ctx.fillText(part.text, x, y);
      x += ctx.measureText(part.text).width;
    }
  });

  return surface;
}

function wrapEditorialLines(ctx, text, maxWidth) {
  const result = [];
  for (const para of (text || "").replace(/\r\n/g, "\n").split("\n")) {
    if (!para.trim()) {
      result.push("");
      continue;
    }
    let current = "";
    for (const ch of para) {
      if (ctx.measureText(current + ch).width > maxWidth && current) {
        result.push(current);
        current = ch;
      } else {
        current += ch;
      }
    }
    if (current) result.push(current);
  }
  return result.slice(0, 10);
}

function createQuoteCardSource(quoteText, authorText) {
  const width = 1040;
  const measureCanvas = document.createElement("canvas");
  const mCtx = measureCanvas.getContext("2d");
  mCtx.font = '500 38px "Songti SC", "STSong", "Noto Serif SC", Georgia, serif';
  const lines = wrapEditorialLines(mCtx, quoteText.trim() || DEFAULT_QUOTE, 820);
  const height = Math.max(460, 240 + lines.length * 64);

  const surface = document.createElement("canvas");
  surface.width = width;
  surface.height = height;
  const ctx = surface.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#fdfcfa");
  bg.addColorStop(1, "#f4f6f2");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(67, 97, 83, 0.16)";
  ctx.font = '400 112px Georgia, serif';
  ctx.fillText("“", 88, 146);

  ctx.fillStyle = "#222925";
  ctx.font = '500 38px "Songti SC", "STSong", "Noto Serif SC", Georgia, serif';
  ctx.textBaseline = "middle";
  let y = 178;
  for (const line of lines) {
    ctx.fillText(line, 110, y);
    y += 64;
  }

  ctx.strokeStyle = "rgba(67, 97, 83, 0.24)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, height - 92);
  ctx.lineTo(164, height - 92);
  ctx.stroke();

  ctx.fillStyle = "#52695c";
  ctx.font = '500 22px "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  ctx.fillText(authorText.trim() || "ZL · 有间小站", 182, height - 92);

  return surface;
}

function computeCanvasGeometry(srcW, srcH, frameStyle, ratioId, padding, caption) {
  const scaleLimit = Math.min(1, 2200 / Math.max(srcW, srcH));
  const imgW = Math.round(srcW * scaleLimit);
  const imgH = Math.round(srcH * scaleLimit);
  const barH =
    frameStyle === "mac"
      ? Math.round(Math.max(30, Math.min(44, imgW * 0.036)))
      : 0;
  const frameW = imgW;
  const frameH = imgH + barH;
  const captionSpace = caption.trim() ? 42 : 0;
  let outW = frameW + padding * 2;
  let outH = frameH + padding * 2 + captionSpace;
  const ratio = RATIOS.find((item) => item.id === ratioId)?.value;
  if (ratio) {
    if (outW / outH < ratio) outW = Math.round(outH * ratio);
    else outH = Math.round(outW / ratio);
  }
  return { imgW, imgH, barH, frameW, frameH, captionSpace, outW, outH };
}

export default function FrameStudioPage() {
  const [studioMode, setStudioMode] = useState("image");
  const [backdropId, setBackdropId] = useState("porcelain");
  const [frameStyle, setFrameStyle] = useState("mac");
  const [ratioId, setRatioId] = useState("auto");
  const [padding, setPadding] = useState(72);
  const [radius, setRadius] = useState(18);
  const [shadow, setShadow] = useState(55);
  const [caption, setCaption] = useState("");
  const [codeText, setCodeText] = useState(DEFAULT_CODE);
  const [codeTitle, setCodeTitle] = useState("greeting.ts");
  const [codeTheme, setCodeTheme] = useState("dark");
  const [quoteText, setQuoteText] = useState(DEFAULT_QUOTE);
  const [quoteAuthor, setQuoteAuthor] = useState("ZL · 有间小站");
  const [fileName, setFileName] = useState("示例画布");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("已载入示例画布。拖入图片、按 Ctrl+V 粘贴截图，或切换代码/引文卡片模式。");
  const [sourceSize, setSourceSize] = useState({ width: 1120, height: 680 });
  const [sourceTick, setSourceTick] = useState(0);

  const canvasRef = useRef(null);
  const sourceRef = useRef(null);
  const objectUrlRef = useRef(null);

  const activeDimensionsSource =
    studioMode === "image"
      ? sourceSize
      : studioMode === "code"
        ? {
            width: 1040,
            height: Math.max(
              380,
              88 + Math.min(24, (codeText || " ").split("\n").length) * 38,
            ),
          }
        : {
            width: 1040,
            height: Math.max(
              460,
              240 + Math.min(10, Math.max(2, quoteText.split("\n").length + 1)) * 64,
            ),
          };

  const geometry = computeCanvasGeometry(
    activeDimensionsSource.width,
    activeDimensionsSource.height,
    frameStyle,
    ratioId,
    padding,
    caption,
  );
  const dimensions = { width: geometry.outW, height: geometry.outH };

  const loadImageFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) {
      setStatus("请放入 PNG、JPEG、WebP 或其他常见图片文件。");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = url;
      sourceRef.current = img;
      setStudioMode("image");
      setSourceSize({ width: img.naturalWidth, height: img.naturalHeight });
      setFileName(file.name.replace(/\.[^.]+$/, "") || "screenshot");
      setStatus(`已载入「${file.name}」（${img.naturalWidth} × ${img.naturalHeight}）。`);
      setSourceTick((tick) => tick + 1);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setStatus("无法读取这张图片，请换一张再试。");
    };
    img.src = url;
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    function handlePaste(event) {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            loadImageFile(
              new File([file], "pasted-screenshot.png", { type: file.type }),
            );
            break;
          }
        }
      }
    }
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [loadImageFile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!sourceRef.current) sourceRef.current = createSampleImage();

    const source =
      studioMode === "code"
        ? createCodeCardSource(codeText, codeTheme)
        : studioMode === "quote"
          ? createQuoteCardSource(quoteText, quoteAuthor)
          : sourceRef.current;

    const { imgW, imgH, barH, frameW, frameH, captionSpace, outW, outH } =
      computeCanvasGeometry(
        source.naturalWidth || source.width,
        source.naturalHeight || source.height,
        frameStyle,
        ratioId,
        padding,
        caption,
      );

    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, outW, outH);

    const backdrop = BACKDROPS.find((item) => item.id === backdropId) || BACKDROPS[0];
    if (backdrop.stops) {
      const bg = ctx.createLinearGradient(0, 0, outW, outH);
      bg.addColorStop(0, backdrop.stops[0]);
      bg.addColorStop(0.52, backdrop.stops[1]);
      bg.addColorStop(1, backdrop.stops[2]);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, outW, outH);
    }

    const frameX = Math.round((outW - frameW) / 2);
    const frameY = Math.round((outH - captionSpace - frameH) / 2);
    const darkBar = studioMode === "code" && codeTheme === "dark";

    ctx.save();
    if (shadow > 0) {
      ctx.shadowColor = backdrop.dark
        ? `rgba(0, 0, 0, ${(shadow / 100) * 0.55})`
        : `rgba(24, 42, 34, ${(shadow / 100) * 0.24})`;
      ctx.shadowBlur = Math.round(shadow * 0.95);
      ctx.shadowOffsetY = Math.round(shadow * 0.38);
    }
    ctx.fillStyle = darkBar ? "#1a2b25" : frameStyle === "mac" ? "#f4f3ef" : "#ffffff";
    drawRoundedRect(ctx, frameX, frameY, frameW, frameH, radius);
    ctx.fill();
    ctx.restore();

    ctx.save();
    drawRoundedRect(ctx, frameX, frameY, frameW, frameH, radius);
    ctx.clip();

    if (frameStyle === "mac") {
      ctx.fillStyle = darkBar ? "#1b2c26" : "#f2f1ed";
      ctx.fillRect(frameX, frameY, frameW, barH);
      const dotY = frameY + barH / 2;
      const dotR = Math.max(4.5, barH * 0.16);
      ["#e67c73", "#ecc064", "#72b88f"].forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(frameX + 20 + idx * (dotR * 3.1), dotY, dotR, 0, Math.PI * 2);
        ctx.fill();
      });
      if (studioMode === "code" && codeTitle.trim()) {
        ctx.fillStyle = darkBar ? "rgba(220, 236, 228, 0.7)" : "rgba(52, 66, 58, 0.65)";
        ctx.font = `500 ${Math.max(13, Math.round(barH * 0.38))}px "Cascadia Code", Consolas, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(codeTitle.trim(), frameX + frameW / 2, dotY);
      }
      ctx.fillStyle = darkBar ? "rgba(255, 255, 255, 0.08)" : "rgba(34, 34, 34, 0.06)";
      ctx.fillRect(frameX, frameY + barH - 1, frameW, 1);
    }

    ctx.drawImage(source, frameX, frameY + barH, imgW, imgH);
    ctx.restore();

    if (frameStyle === "glass") {
      ctx.save();
      drawRoundedRect(ctx, frameX - 6, frameY - 6, frameW + 12, frameH + 12, radius + 5);
      ctx.strokeStyle = backdrop.dark
        ? "rgba(255, 255, 255, 0.24)"
        : "rgba(255, 255, 255, 0.78)";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    drawRoundedRect(ctx, frameX + 0.5, frameY + 0.5, frameW - 1, frameH - 1, radius);
    ctx.strokeStyle = backdrop.dark
      ? "rgba(255, 255, 255, 0.16)"
      : "rgba(26, 48, 38, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    if (caption.trim()) {
      ctx.save();
      ctx.fillStyle = backdrop.dark
        ? "rgba(244, 238, 224, 0.8)"
        : "rgba(56, 68, 61, 0.72)";
      ctx.font = `500 ${Math.max(15, Math.round(outW * 0.015))}px "Songti SC", "Microsoft YaHei", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(caption.trim(), outW / 2, frameY + frameH + captionSpace / 2 + 6);
      ctx.restore();
    }
  }, [
    studioMode,
    backdropId,
    frameStyle,
    ratioId,
    padding,
    radius,
    shadow,
    caption,
    codeText,
    codeTitle,
    codeTheme,
    quoteText,
    quoteAuthor,
    sourceTick,
  ]);

  function exportStem() {
    if (studioMode === "code") {
      return (codeTitle.trim().replace(/\.[^.]+$/, "") || "code-card").replace(/[^\w\u4e00-\u9fa5-]+/g, "-");
    }
    if (studioMode === "quote") return "quote-card";
    return fileName;
  }

  function exportImage(mime, ext) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stem = exportStem();
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${stem}-framed.${ext}`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus(`已导出 ${stem}-framed.${ext}（${canvas.width} × ${canvas.height}）。`);
      },
      mime,
      mime === "image/webp" ? 0.92 : undefined,
    );
  }

  function copyImage() {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.clipboard?.write || !window.ClipboardItem) {
      setStatus("当前浏览器不支持直接复制图片，请点击下载 PNG。");
      return;
    }
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
        setStatus("已复制高清 PNG 到剪贴板，可直接粘贴使用。");
        window.SITE_FEEDBACK?.show("高清图片已复制到剪贴板。");
      } catch {
        setStatus("复制未获得授权，可以直接点击下载 PNG。");
      }
    }, "image/png");
  }

  function resetSample() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    sourceRef.current = createSampleImage();
    setStudioMode("image");
    setSourceSize({ width: 1120, height: 680 });
    setFileName("示例画布");
    setSourceTick((tick) => tick + 1);
    setStatus("已恢复示例画布。");
  }

  return (
    <main className="container frame-studio" id="main">
      <header className="frame-studio-hero">
        <div className="frame-studio-hero-copy">
          <p className="eyebrow">工作台里的小工具 / FRAME STUDIO</p>
          <h1>
            画框工坊<span className="title-period">。</span>
          </h1>
          <p className="room-lead">
            拖入图片或按 <kbd>Ctrl+V</kbd> 粘贴截图，也可以切到代码片段或引文卡片模式，一键套上画廊背景与投影带走。
          </p>
          <p className="image-tools-local">纯前端 Canvas 实时合成，不上传原图，断网也能正常使用。</p>
        </div>
        <div className="frame-studio-hero-card glass-card" aria-hidden="true">
          <div className="frame-studio-hero-card-top">
            <span>Canvas 实时渲染</span>
            <b>3 模式 · 2x 高清</b>
          </div>
          <div className="frame-studio-hero-tags">
            <span className={studioMode === "image" ? "is-active" : ""}><b>01</b> 截图套框</span>
            <span className={studioMode === "code" ? "is-active" : ""}><b>02</b> 语法高亮代码卡</span>
            <span className={studioMode === "quote" ? "is-active" : ""}><b>03</b> 衬线引文摘录</span>
          </div>
        </div>
      </header>

      <div className="frame-studio-grid">
        <section
          className="frame-stage-panel glass-card"
          data-dragging={dragging}
          aria-label="画框实时预览区"
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) loadImageFile(file);
          }}
        >
          <div className="frame-stage-top">
            <div className="frame-mode-tabs" role="group" aria-label="画框内容类型">
              {STUDIO_MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={studioMode === item.id}
                  onClick={() => {
                    setStudioMode(item.id);
                    setStatus(`已切换至「${item.label}」模式。`);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="frame-stage-picks">
              <span className="frame-stage-meta">
                {dimensions.width} × {dimensions.height} px
              </span>
              {studioMode === "image" && (
                <>
                  <label className="frame-pick-btn" htmlFor="frame-file-input">
                    选择图片
                  </label>
                  <input
                    id="frame-file-input"
                    type="file"
                    accept="image/*"
                    className="visually-hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) loadImageFile(file);
                      event.target.value = "";
                    }}
                  />
                  <button type="button" className="frame-reset-btn" onClick={resetSample}>
                    示例图
                  </button>
                </>
              )}
            </div>
          </div>

          <div
            className="frame-canvas-wrap"
            data-transparent={backdropId === "transparent"}
          >
            <canvas
              ref={canvasRef}
              className="frame-preview-canvas"
              aria-label="美化后的画框预览"
            />
          </div>

          {studioMode === "code" && (
            <div className="frame-inline-editor">
              <div className="frame-inline-row">
                <label>
                  <span>文件名</span>
                  <input
                    type="text"
                    maxLength={40}
                    value={codeTitle}
                    onChange={(event) => setCodeTitle(event.target.value)}
                    placeholder="greeting.ts"
                  />
                </label>
                <div className="frame-pills" role="group" aria-label="代码底色">
                  <button
                    type="button"
                    aria-pressed={codeTheme === "dark"}
                    onClick={() => setCodeTheme("dark")}
                  >
                    深松代码底
                  </button>
                  <button
                    type="button"
                    aria-pressed={codeTheme === "light"}
                    onClick={() => setCodeTheme("light")}
                  >
                    浅纸代码底
                  </button>
                </div>
              </div>
              <label>
                <span>代码片段（最多 24 行）</span>
                <textarea
                  id="frame-code-input"
                  rows={6}
                  value={codeText}
                  onChange={(event) => setCodeText(event.target.value)}
                  spellCheck={false}
                />
              </label>
            </div>
          )}

          {studioMode === "quote" && (
            <div className="frame-inline-editor">
              <label>
                <span>摘录正文</span>
                <textarea
                  id="frame-quote-input"
                  rows={4}
                  maxLength={240}
                  value={quoteText}
                  onChange={(event) => setQuoteText(event.target.value)}
                />
              </label>
              <label>
                <span>出处或署名</span>
                <input
                  id="frame-quote-author"
                  type="text"
                  maxLength={40}
                  value={quoteAuthor}
                  onChange={(event) => setQuoteAuthor(event.target.value)}
                />
              </label>
            </div>
          )}

          <p className="frame-studio-status" role="status" aria-live="polite">
            {status}
          </p>
        </section>

        <aside className="frame-controls-panel glass-card" aria-label="画框样式设置">
          <div className="frame-control-group">
            <h2>一键组合预设</h2>
            <div className="frame-pills">
              {STYLE_PRESETS.map((preset) => {
                const matched =
                  backdropId === preset.backdropId &&
                  frameStyle === preset.frameStyle &&
                  ratioId === preset.ratioId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={matched}
                    onClick={() => {
                      setBackdropId(preset.backdropId);
                      setFrameStyle(preset.frameStyle);
                      setRatioId(preset.ratioId);
                      setPadding(preset.padding);
                      setRadius(preset.radius);
                      setShadow(preset.shadow);
                      setStatus(`已套用「${preset.label}」画框预设。`);
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="frame-control-group">
            <h2>背景氛围</h2>
            <div className="frame-swatches">
              {BACKDROPS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="frame-swatch"
                  aria-pressed={backdropId === item.id}
                  onClick={() => setBackdropId(item.id)}
                >
                  <i style={{ background: item.swatch }} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="frame-control-group">
            <h2>画框风格</h2>
            <div className="frame-pills">
              {FRAMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={frameStyle === item.id}
                  onClick={() => setFrameStyle(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="frame-control-group">
            <h2>画幅比例</h2>
            <div className="frame-pills">
              {RATIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={ratioId === item.id}
                  onClick={() => setRatioId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="frame-control-group frame-sliders">
            <label>
              <span>留白边距 <b>{padding}px</b></span>
              <input
                type="range"
                min="24"
                max="140"
                step="4"
                value={padding}
                onChange={(event) => setPadding(Number(event.target.value))}
              />
            </label>
            <label>
              <span>画面圆角 <b>{radius}px</b></span>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={radius}
                onChange={(event) => setRadius(Number(event.target.value))}
              />
            </label>
            <label>
              <span>阴影深度 <b>{shadow}%</b></span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={shadow}
                onChange={(event) => setShadow(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="frame-control-group">
            <label htmlFor="frame-caption-input" className="frame-caption-label">
              底部落款（可选）
            </label>
            <input
              id="frame-caption-input"
              type="text"
              maxLength={40}
              placeholder="例如：有间小站 · 作品预览"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
          </div>

          <div className="frame-export-actions">
            <button
              type="button"
              className="button frame-export-primary"
              onClick={() => exportImage("image/png", "png")}
            >
              下载高清 PNG
            </button>
            <button
              type="button"
              className="button"
              onClick={() => exportImage("image/webp", "webp")}
            >
              下载 WebP
            </button>
            <button type="button" className="button" onClick={copyImage}>
              复制图片
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
