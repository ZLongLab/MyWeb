import { homeData } from "./home-data";
import { useState } from "react";
export default function GitHubActivityCard() {
  const snapshot = homeData.snapshot,
    github = snapshot.github;
  const [today] = useState(() =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(
      new Date(),
    ),
  );
  const elapsed = Math.max(
    1,
    Math.floor(
      (Date.parse(today) - Date.parse(snapshot.siteStarted)) / 86400000,
    ) + 1,
  );
  const tones = ["#e7ede8", "#c6e3d3", "#a4d9be", "#6ee7b7", "#34d399"];
  return (
    <section className="activity-card" aria-labelledby="github-heading">
      <div className="gallery-card-heading">
        <h2 id="github-heading">
          <span aria-hidden="true">◉</span> GitHub
        </h2>
        <a
          href={`https://github.com/${github.login}`}
          target="_blank"
          rel="noreferrer"
        >
          Activity ↗
        </a>
      </div>
      <svg
        className="gallery-heatmap"
        viewBox="0 0 370 116"
        role="img"
        aria-label={`${github.from} 至 ${github.to} 的公开贡献快照，共 ${github.total} 次贡献`}
      >
        {github.weeks.slice(0, 26).map((week, x) =>
          week.days.map((day, y) => (
            <rect
              key={day.date}
              x={10 + x * 13.5}
              y={10 + y * 13.5}
              width="9"
              height="9"
              rx="2.5"
              fill={tones[day.level] || tones[0]}
            >
              <title>
                {day.date} · {day.count} 次贡献
              </title>
            </rect>
          )),
        )}
      </svg>
      <p className="activity-caption">
        已核对快照 · {github.from} — {github.to}
      </p>
      <dl className="gallery-metrics">
        {[
          [snapshot.statistics.projects, "Projects"],
          [github.total, "Contributions"],
          [snapshot.statistics.articles, "Notes"],
          [elapsed, "Days"],
        ].map(([value, label]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{Number(value).toLocaleString("en-US")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
