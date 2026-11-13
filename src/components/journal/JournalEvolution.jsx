import { useId } from "react";

export default function JournalEvolution() {
  const id = useId();
  return (
    <svg
      width="0"
      height="0"
      className="journal-evolution-defs"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={id + "-halo"}>
          <stop stopColor="#b8e2d3" stopOpacity=".48" />
          <stop offset="1" stopColor="#d9eee5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id + "-glass"} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#fff" stopOpacity=".88" />
          <stop offset="1" stopColor="#bad8cb" stopOpacity=".25" />
        </linearGradient>
        <symbol id="journal-evolution-symbol" viewBox="0 0 350 235">
          <ellipse
            cx="180"
            cy="128"
            rx="156"
            ry="98"
            fill={`url(#${id}-halo)`}
          />
          <ellipse
            cx="176"
            cy="126"
            rx="133"
            ry="66"
            transform="rotate(-14 176 126)"
            className="journal-orbit"
          />
          <path
            d="M42 160 118 81 212 141 301 62M42 160l170-19M118 81l183-19"
            className="journal-connections"
          />
          <path
            d="m169 147 23-57 35 46-28 31Z"
            fill={`url(#${id}-glass)`}
            stroke="#a5c5b4"
            strokeWidth=".7"
          />
          <path
            d="m192 90 7 77 28-31m-58 11 30 20"
            fill="none"
            stroke="#fff"
            strokeOpacity=".85"
          />
          {[
            { x: 42, y: 160, label: "起点", tone: "warm" },
            { x: 118, y: 81, label: "体验", tone: "mint" },
            { x: 212, y: 141, label: "房间", tone: "mint" },
            { x: 301, y: 62, label: "连接", tone: "warm" },
          ].map(({ x, y, label, tone }) => (
            <g key={label}>
              <circle cx={x} cy={y} r="12" className="journal-node-halo" />
              <circle cx={x} cy={y} r="5" className={"journal-node " + tone} />
              <text
                x={x}
                y={y + 28}
                textAnchor="middle"
                className="journal-evolution-label"
              >
                {label}
              </text>
            </g>
          ))}
          <circle cx="76" cy="64" r="2" className="journal-satellite" />
          <circle cx="264" cy="177" r="3" className="journal-satellite" />
        </symbol>
      </defs>
    </svg>
  );
}
