function Breadcrumbs() {
  return (
    <nav className="breadcrumbs" aria-label="面包屑">
      <ol>
        <li>
          <a href="index.html">{"首页"}</a>
        </li>
        <li>
          <a href="projects.html" data-project-list-link="">
            {"作品"}
          </a>
        </li>
        <li>
          <span id="project-breadcrumb-title" aria-current="page">
            {"作品详情"}
          </span>
        </li>
      </ol>
    </nav>
  );
}

function DetailBack() {
  return (
    <a className="detail-back" href="projects.html" data-project-list-link="">
      <span aria-hidden="true">{"←"}</span>
      {" 返回作品列表"}
    </a>
  );
}

function ProjectContent() {
  return (
    <article
      className="project-reading"
      id="project-content"
      aria-labelledby="project-title"
    >
      {"\n      "}
      <header className="project-detail-header">
        <p className="eyebrow">{"PROJECT / 作品详情"}</p>
        <div className="portfolio-meta" id="project-meta"></div>
        <h1 id="project-title">{"作品详情"}</h1>
        <p className="project-detail-summary" id="project-summary"></p>
        <ul
          className="portfolio-tags"
          id="project-tags"
          aria-label="项目技术与特点"
        ></ul>
      </header>
      {"\n      "}
      <nav
        className="project-toc"
        id="project-toc"
        aria-labelledby="project-toc-heading"
        hidden={true}
      >
        <h2 id="project-toc-heading">{"本页目录"}</h2>
      </nav>
      {"\n      "}
      <figure
        className="project-figure"
        id="project-figure"
        hidden={true}
      ></figure>
      {"\n      "}
      <section
        className="project-detail-copy"
        aria-labelledby="project-body-heading"
      >
        <h2 id="project-body-heading">{"关于这个项目"}</h2>
        <div id="project-body"></div>
      </section>
      {"\n      "}
      <div className="project-detail-source" id="project-source"></div>
      {"\n      "}
      <nav className="detail-end" aria-label="作品详情导航">
        <a
          className="detail-back"
          href="projects.html"
          data-project-list-link=""
        >
          <span aria-hidden="true">{"←"}</span>
          {" 返回作品列表"}
        </a>
      </nav>
      {"\n    "}
    </article>
  );
}

function ProjectNotFound() {
  return (
    <section className="project-not-found" id="project-not-found" hidden={true}>
      <h1>{"这件作品，暂时没有找到。"}</h1>
      <p>{"链接可能有误，你可以回到作品列表继续浏览。"}</p>
      <a
        className="button button-primary"
        href="projects.html"
        data-project-list-link=""
      >
        {"返回作品列表 "}
        <span aria-hidden="true">{"→"}</span>
      </a>
    </section>
  );
}

export default function ProjectPage() {
  return (
    <>
      <main className="container project-main container-wide" id="main">
        {"\n    "}
        <Breadcrumbs />
        {"\n    "}
        <DetailBack />
        {"\n    "}
        <ProjectContent />
        {"\n    "}
        <ProjectNotFound />
        {"\n    "}
        {"\n  "}
      </main>
    </>
  );
}
