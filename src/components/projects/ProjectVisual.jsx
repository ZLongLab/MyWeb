import { useId } from "react";

function ConversionVisual() {
  const id = useId();
  return (
    <div className="project-visual conversion-visual" aria-hidden="true">
      <svg viewBox="0 0 250 180">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f8fffc" stopOpacity=".98" />
            <stop offset="1" stopColor="#d5eee5" stopOpacity=".7" />
          </linearGradient>
        </defs>
        <rect
          x="10"
          y="25"
          width="230"
          height="137"
          rx="14"
          fill={`url(#${id})`}
          stroke="#fff"
        />
        {[29, 148].map((x) => (
          <g key={x} className="conversion-file">
            <path
              d={`M${x} 38h44l22 23v82h-66Z`}
              fill="#fcfffd"
              stroke="#d6e5dd"
            />
            <path d={`m${x + 44} 38v23h22`} fill="#e6f1eb" stroke="#d6e5dd" />
          </g>
        ))}
        <path
          d="M105 92h26m-8-7 8 7-8 7"
          stroke="#659f87"
          strokeWidth="1.5"
          fill="none"
        />
        <text x="62" y="103" textAnchor="middle" className="widget-format">
          PNG
        </text>
        <text x="62" y="122" textAnchor="middle">
          4.2MB
        </text>
        <text x="181" y="98" textAnchor="middle" className="widget-format">
          WebP
        </text>
        <text x="181" y="116" textAnchor="middle">
          680KB (-84%)
        </text>
        <rect x="159" y="127" width="45" height="4" rx="2" fill="#e0ede5" />
        <rect x="159" y="127" width="34" height="4" rx="2" fill="#599e80" />
      </svg>
      <span className="widget-caption">格式转换示意</span>
    </div>
  );
}

function InspirationVisual() {
  return (
    <div className="project-visual inspiration-visual" aria-hidden="true">
      <div className="palette-fan">
        {["#29383b", "#bfd2c7", "#d8d6bd", "#cd896f", "#eeeee2"].map(
          (color, i) => (
            <span
              key={color}
              style={{
                "--swatch-angle": `${(i - 2) * 16}deg`,
                "--spread-angle": `${(i - 2) * 22}deg`,
              }}
            >
              <i style={{ background: color }} />
              <b />
            </span>
          ),
        )}
      </div>
      <svg viewBox="0 0 170 120" className="composition-grid">
        <rect
          x="8"
          y="8"
          width="154"
          height="104"
          rx="9"
          fill="#fff"
          fillOpacity=".38"
          stroke="#fff"
        />
        <path
          d="M15 15h140v90H15ZM62 15v90m46-90v90M15 45h140M15 75h140"
          fill="none"
          stroke="#a99b7b"
          strokeOpacity=".48"
          strokeWidth=".7"
        />
        <path
          d="M155 105C78 105 49 71 62 44c13-28 46-18 46 1 0 14-16 23-25 12-7-9 7-18 11-9"
          stroke="#948465"
          strokeWidth=".8"
          fill="none"
        />
        <circle cx="91" cy="48" r="2" fill="#a98f63" />
      </svg>
    </div>
  );
}

function OptimizerVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface optimizer-mini">
        <div className="mini-bar">
          <span>原始草稿</span>
          <span className="mini-pill">→ 精修输出</span>
        </div>
        <div className="optimizer-panes">
          <div className="optimizer-draft">
            <b>输入</b>
            <span>帮我润色一段项目介绍…</span>
          </div>
          <div className="optimizer-refined">
            <b>优化后</b>
            <span>角色 · 约束 · 结构化输出 ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryboardVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface storyboard-mini">
        <div className="mini-bar">
          <span>分镜时间轴</span>
          <span className="mini-mono">10s · 3 镜</span>
        </div>
        <div className="storyboard-shots">
          <div className="shot-chip is-mint">
            <b>S01</b>
            <span>0–3s 缓推</span>
          </div>
          <div className="shot-chip is-warm">
            <b>S02</b>
            <span>3–7s 特写</span>
          </div>
          <div className="shot-chip is-mist">
            <b>S03</b>
            <span>7–10s 定格</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecallVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface recall-mini">
        <div className="recall-search">
          <span>⌕ 离线 OCR · 关键词</span>
          <b>0.04s</b>
        </div>
        <div className="recall-hits">
          <div>
            <span>notes/lab-04.pdf</span>
            <b>命中 3 处</b>
          </div>
          <div>
            <span>docs/paper-outline.md</span>
            <span>全文索引</span>
          </div>
          <div>
            <span>slides/week-07.png</span>
            <span>图片文字</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchiveVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface archive-mini">
        <div className="mini-bar">
          <span>分类建议</span>
          <span className="mini-pill">待确认归档</span>
        </div>
        <div className="archive-rows">
          <div>
            <span>实验报告.docx</span>
            <i>→</i>
            <b>课程 / 实验</b>
          </div>
          <div>
            <span>综述文献.pdf</span>
            <i>→</i>
            <b>参考资料</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioVisual() {
  const heights = [38, 86, 58, 96, 46, 78, 64, 90, 42, 68];
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface audio-mini">
        <div className="audio-cover">♪</div>
        <div className="audio-body">
          <div className="audio-meta">
            <b>Local Audio</b>
            <span>Android 适配</span>
          </div>
          <div className="audio-bars">
            {heights.map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorplanVisual() {
  const rooms = [
    ["玄关", "is-mint"],
    ["客厅", ""],
    ["书房", ""],
    ["工作台", "is-warm"],
    ["院子", ""],
    ["说明书", ""],
  ];
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface floorplan-mini">
        <div className="mini-bar">
          <span>有间平面图</span>
          <span className="mini-mono">10 ROOMS</span>
        </div>
        <div className="floorplan-grid">
          {rooms.map(([name, tone]) => (
            <span key={name} className={tone}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FrameVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface frame-mini">
        <div className="mini-bar">
          <span>画框预览</span>
          <span className="mini-pill">PNG · WebP</span>
        </div>
        <div className="frame-mini-stage">
          <div className="frame-mini-window">
            <div className="frame-mini-dots">
              <i />
              <i />
              <i />
            </div>
            <div className="frame-mini-lines">
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface focus-mini">
        <div className="mini-bar">
          <span>25:00 专注</span>
          <span className="mini-mono">WEB AUDIO</span>
        </div>
        <div className="focus-mini-pills">
          <span className="is-mint">☂ 细雨</span>
          <span className="is-warm">✦ 壁炉</span>
          <span className="is-mist">〰 微风</span>
        </div>
      </div>
    </div>
  );
}

function StarlightVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface xmas-mini">
        <div className="mini-bar">
          <span>星轨八音盒</span>
          <span className="mini-pill">♪ 4 种音色</span>
        </div>
        <div className="xmas-mini-row">
          <span className="xmas-star">✦</span>
          <div className="xmas-mini-tags">
            <span>16 拍五声音阶 · 3D 星环</span>
            <b>键盘 A–K 弹奏 · 分享链接</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function FireworksVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface xmas-mini">
        <div className="mini-bar">
          <span>夜空烟花湖</span>
          <span className="mini-pill">✧ 5 种形态</span>
        </div>
        <div className="xmas-mini-row">
          <span className="xmas-star">✧</span>
          <div className="xmas-mini-tags">
            <span>菊花 · 垂柳 · 星环 · 星芒</span>
            <b>湖面实时倒影 · 壁纸 PNG</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChristmasVisual() {
  return (
    <div className="project-visual custom-card-visual" aria-hidden="true">
      <div className="mini-surface xmas-mini">
        <div className="mini-bar">
          <span>冬夜粒子树</span>
          <span className="mini-pill">❄ 三层飘雪</span>
        </div>
        <div className="xmas-mini-row">
          <span className="xmas-star">✦</span>
          <div className="xmas-mini-tags">
            <span>暖金 · 冰蓝 · 玫瑰</span>
            <b>♪ 八音盒 · 贺卡 PNG</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectVisual({ project }) {
  if (project.id === "image-tools") return <ConversionVisual />;
  if (project.id === "image-prompts") return <InspirationVisual />;
  if (project.id === "prompt-optimizer") return <OptimizerVisual />;
  if (project.id === "video-prompts") return <StoryboardVisual />;
  if (project.id === "recallai") return <RecallVisual />;
  if (project.id === "document-assistant") return <ArchiveVisual />;
  if (project.id === "folia-android") return <AudioVisual />;
  if (project.id === "frame-studio") return <FrameVisual />;
  if (project.id === "focus-lab") return <FocusVisual />;
  if (project.id === "starlight-box") return <StarlightVisual />;
  if (project.id === "fireworks") return <FireworksVisual />;
  if (project.id === "christmas") return <ChristmasVisual />;
  return <FloorplanVisual />;
}
