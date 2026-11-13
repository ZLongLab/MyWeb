import { useState } from "react";
const nodes = [
  {
    id: "recall",
    title: "本地检索",
    x: 105,
    y: 110,
    href: "project.html?id=recallai",
  },
  {
    id: "docs",
    title: "资料整理",
    x: 212,
    y: 56,
    href: "project.html?id=document-assistant",
  },
  {
    id: "video",
    title: "视频灵感",
    x: 326,
    y: 104,
    href: "video-prompts.html",
  },
  {
    id: "image",
    title: "图片灵感",
    x: 390,
    y: 191,
    href: "image-prompts.html",
  },
  { id: "tools", title: "图片工坊", x: 310, y: 246, href: "image-tools.html" },
  { id: "notes", title: "创作手记", x: 181, y: 233, href: "articles.html" },
  { id: "center", title: "想法的交汇", x: 246, y: 160, href: "workbench.html" },
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
export default function IdeaNetworkGraph() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="idea-card glass-card">
      <div className="gallery-card-heading">
        <h2>想法与连接</h2>
        <span>CONNECTED NOTES</span>
      </div>
      <svg viewBox="0 0 490 300" aria-label="创作与工具导航网络图">
        <g>
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              className={active === a || active === b ? "is-connected" : ""}
            />
          ))}
        </g>
        {nodes.map((node, index) => (
          <a
            href={node.href}
            key={node.id}
            aria-label={node.title}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            <circle className="node-hit" cx={node.x} cy={node.y} r="23" />
            <circle
              className={"network-node tone-" + (index % 3)}
              cx={node.x}
              cy={node.y}
              r={index === 6 ? 7 : 5}
            />
            <text x={node.x + 12} y={node.y - 13}>
              {node.title}
            </text>
          </a>
        ))}
      </svg>
      <a className="gallery-text-link" href="articles.html#garden">
        在记录之间，找到新的连接 ↗
      </a>
    </section>
  );
}
