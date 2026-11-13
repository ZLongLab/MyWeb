import { homeData, detailHref } from "./home-data";
export default function ReadingNotesList() {
  const articles = [...homeData.articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  return (
    <section className="gallery-reading">
      <div className="gallery-section-heading">
        <h2>看过的书 / 碎碎念</h2>
        <a href="articles.html">所有记录 ↗</a>
      </div>
      {homeData.reading.map((book) => (
        <a className="gallery-list-row" key={book.title} href="life.html">
          <span>{book.title}</span>
          <small>书架</small>
        </a>
      ))}
      {articles.map((article) => (
        <a
          className="gallery-list-row"
          key={article.id}
          href={detailHref("article", article.id)}
        >
          <span>{article.title}</span>
          <div>
            <time dateTime={article.date}>
              {article.date.replaceAll("-", ".")}
            </time>
            <small>{article.tags?.[0] || "手记"}</small>
          </div>
        </a>
      ))}
    </section>
  );
}
