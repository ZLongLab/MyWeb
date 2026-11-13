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

function CodeVisual() {
  return (
    <div className="project-visual code-visual" aria-hidden="true">
      <div className="code-window">
        <div className="code-toolbar">
          <i />
          <i />
          <i />
          <span>LOCAL / WORKSPACE</span>
        </div>
        <div className="code-lines">
          {[54, 83, 63, 91, 48, 72].map((width, i) => (
            <span key={i} style={{ width: `${width}%` }}>
              <i />
              <b />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function NetworkVisual() {
  const points = [
    [28, 65],
    [94, 25],
    [166, 47],
    [202, 111],
    [118, 135],
    [59, 112],
    [119, 80],
  ];
  const edges = [
    [0, 1],
    [0, 5],
    [0, 6],
    [1, 2],
    [1, 6],
    [2, 3],
    [2, 6],
    [3, 4],
    [3, 6],
    [4, 5],
    [4, 6],
    [5, 6],
  ];
  return (
    <div className="project-visual network-visual" aria-hidden="true">
      <svg viewBox="0 0 230 160">
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={points[a][0]}
            y1={points[a][1]}
            x2={points[b][0]}
            y2={points[b][1]}
          />
        ))}
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 6 ? 5 : 3.5}
            className={"node-" + (i % 3)}
          />
        ))}
        <text x="94" y="14">
          ideas / connections
        </text>
      </svg>
    </div>
  );
}

export default function ProjectVisual({ project }) {
  if (project.id === "image-tools") return <ConversionVisual />;
  if (project.id === "image-prompts") return <InspirationVisual />;
  if (["recallai", "document-assistant"].includes(project.id))
    return <CodeVisual />;
  return <NetworkVisual />;
}
