function Breadcrumbs() {
  return (
    <nav className="breadcrumbs" aria-label="面包屑">
      <ol>
        <li>
          <a href="index.html">{"首页"}</a>
        </li>
        <li>
          <a href="articles.html" data-article-list-link="">
            {"文章"}
          </a>
        </li>
        <li>
          <span id="article-breadcrumb-title" aria-current="page">
            {"阅读文章"}
          </span>
        </li>
      </ol>
    </nav>
  );
}

function ReadingBack() {
  return (
    <a
      className="reading-back text-link"
      href="articles.html"
      data-article-list-link=""
    >
      <span aria-hidden="true">{"←"}</span>
      {" 返回文章列表"}
    </a>
  );
}

function ArticleContent() {
  return (
    <article
      className="reading-content"
      id="article-content"
      aria-labelledby="article-title"
    >
      {"\n      "}
      <header className="reading-header">
        <p className="eyebrow">{"小站记录 / JOURNAL"}</p>
        <h1 id="article-title">{"小站记录"}</h1>
        <div className="reading-meta" id="article-meta"></div>
        <p className="reading-summary" id="article-summary"></p>
      </header>
      {"\n      "}
      <div className="reading-body" id="article-body"></div>
      {"\n      "}
      <div id="article-garden-references"></div>
      {"\n      "}
      <div className="reading-end">
        <p>{"感谢你读到这里。"}</p>
        <a className="text-link" href="articles.html" data-article-list-link="">
          {"返回文章列表 "}
          <span aria-hidden="true">{"→"}</span>
        </a>
      </div>
      {"\n      "}
      <section className="related-section" aria-labelledby="related-heading">
        <p className="eyebrow section-index">{"KEEP READING"}</p>
        <h2 id="related-heading">{"继续阅读"}</h2>
        <div id="article-related" className="related-articles"></div>
      </section>
      {"\n    "}
    </article>
  );
}

function ArticleNotFound() {
  return (
    <section
      className="article-not-found"
      id="article-not-found"
      hidden={true}
      aria-label="文章不存在"
    >
      <h1>
        {"这篇记录，"}
        <br />
        {"暂时还没找到。"}
      </h1>
      <p>{"链接可能有误，也可以先看看小站里的其他文章。"}</p>
      <a
        className="button button-primary"
        href="articles.html"
        data-article-list-link=""
      >
        {"返回文章列表 "}
        <span aria-hidden="true">{"→"}</span>
      </a>
    </section>
  );
}

export default function ArticlePage() {
  return (
    <>
      <main className="container reading-main" id="main">
        {"\n    "}
        <Breadcrumbs />
        {"\n    "}
        <ReadingBack />
        {"\n    "}
        <ArticleContent />
        {"\n    "}
        <ArticleNotFound />
        {"\n    "}
        {"\n  "}
      </main>
    </>
  );
}
