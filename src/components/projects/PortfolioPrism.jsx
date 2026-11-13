import { useId } from "react";
import { workbench } from "../../data/site.js";

export default function PortfolioPrism() {
  const id = useId();
  return (
    <aside className="portfolio-glass-aside" aria-label="小站维护状态">
      <span className="portfolio-state">
        <i aria-hidden="true" />
        持续打磨 <span>v{workbench.updates[0].version}</span>
      </span>
      <svg viewBox="0 0 180 145" aria-hidden="true">
        <defs>
          <linearGradient id={id + "-glass"} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff" stopOpacity=".9" />
            <stop offset=".35" stopColor="#9dcfbe" stopOpacity=".5" />
            <stop offset=".65" stopColor="#ead6a7" stopOpacity=".58" />
            <stop offset="1" stopColor="#b2cad9" stopOpacity=".4" />
          </linearGradient>
          <linearGradient id={id + "-edge"}>
            <stop stopColor="#b6dfcc" />
            <stop offset=".45" stopColor="#fff" />
            <stop offset=".7" stopColor="#ffe4bf" />
            <stop offset="1" stopColor="#b3d6db" />
          </linearGradient>
          <radialGradient id={id + "-shadow"}>
            <stop stopColor="#7fb99f" stopOpacity=".2" />
            <stop offset="1" stopColor="#a6cdb6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="92" cy="122" rx="74" ry="12" fill={`url(#${id}-shadow)`} />
        <path
          d="M89 14 37 114 107 129 143 111Z"
          fill={`url(#${id}-glass)`}
          stroke="#fff"
          strokeOpacity=".7"
        />
        <path
          d="m89 14 18 115 36-18Z"
          fill="#83b6ac"
          fillOpacity=".16"
          stroke="#fff"
          strokeOpacity=".7"
        />
        <path d="m89 14-52 100 70 15Z" fill="#fff" fillOpacity=".2" />
        <path d="m61 68 58 51-29-10Z" fill={`url(#${id}-edge)`} opacity=".7" />
        <path
          d="m89 14 5 107m-12-94-5 90m22-69 23 70"
          stroke={`url(#${id}-edge)`}
          strokeWidth="1.3"
          fill="none"
        />
      </svg>
    </aside>
  );
}
