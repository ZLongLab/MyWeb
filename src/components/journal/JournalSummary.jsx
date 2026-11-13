import { articles } from "../../data/site.js";
import JournalPrism from "./JournalPrism.jsx";

export default function JournalSummary() {
  const categories = new Set(articles.map((article) => article.category));
  const latest = articles
    .flatMap((article) => [article.date, article.tended])
    .filter(
      (date) => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date),
    )
    .sort()
    .at(-1);
  return (
    <aside className="journal-overview" aria-label="文章概览">
      <div className="journal-summary">
        <span>
          <strong>{articles.length}</strong> 篇文章
        </span>
        <span>
          <strong>{categories.size}</strong> 类主题
        </span>
        {latest && (
          <span className="journal-updated">
            最近更新{" "}
            <time dateTime={latest}>{latest.replaceAll("-", ".")}</time>
          </span>
        )}
      </div>
      <JournalPrism />
    </aside>
  );
}
