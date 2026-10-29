function Hero() {
  return (
    <section
      className="home-opening container container-wide"
      aria-labelledby="home-title"
    >
      {"\n      "}
      <div className="home-opening-copy">
        {"\n        "}
        <p className="home-room-kicker">{"玄关 / A PLACE OF MY OWN"}</p>
        {"\n        "}
        <p className="home-overline">
          <span data-site-name="">{"ZL"}</span>
          <span className="site-role" data-site-role="">
            {"计算机学生"}
          </span>
        </p>
        {"\n        "}
        <h1 id="home-title">
          <span data-site-title="">{"有间小站"}</span>
          <span className="home-title-dot">{"。"}</span>
        </h1>
        {"\n        "}
        <p className="home-bio" data-site-bio="">
          {"做一些实用的小工具，也记录把想法做出来的过程。"}
        </p>
        {"\n        "}
        <div className="home-opening-actions">
          <a className="home-text-link home-primary-link" href="projects.html">
            {"去客厅看作品 "}
            <span aria-hidden="true">{"→"}</span>
          </a>
          <a className="home-text-link home-about-link" href="about.html">
            {"认识 ZL"}
          </a>
          <div
            className="home-social-links"
            data-social-links=""
            data-social-scope="home"
            role="group"
            aria-label="我的其他主页，在新标签页打开"
          ></div>
        </div>
        {"\n        "}
        <div className="home-local-meta home-status-band" aria-label="小站此刻">
          <span data-home-count="projects">{"作品统计待核对"}</span>
          <span data-home-count="articles">{"记录统计待核对"}</span>
          <span>
            <span data-home-weather="">{"此刻"}</span>{" "}
            <time data-local-clock="">{"--:--"}</time>
          </span>
        </div>
        {"\n        "}
        <p className="home-season-greeting" data-season-greeting="">
          {"欢迎来坐坐，慢慢逛。"}
        </p>
        {"\n      "}
      </div>
      {"\n      "}
      <div className="home-showcase" aria-label="最近做的两件作品与近况">
        {"\n        "}
        <svg
          className="home-house-watermark"
          viewBox="8 8 48 48"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="m12 29 20-16 20 16M18 27v24h28V27m-18 8 9-3v20l-9-3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth=".7"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        {"\n        "}
        <div className="desk-seasons" role="group" aria-label="换一季颜色">
          <button
            type="button"
            data-desk-season="spring"
            aria-pressed="false"
            aria-label="春日配色"
          >
            {"春"}
          </button>
          <button
            type="button"
            data-desk-season="summer"
            aria-pressed="false"
            aria-label="夏日配色"
          >
            {"夏"}
          </button>
          <button
            type="button"
            data-desk-season="autumn"
            aria-pressed="false"
            aria-label="秋日配色"
          >
            {"秋"}
          </button>
          <button
            type="button"
            data-desk-season="winter"
            aria-pressed="false"
            aria-label="冬日配色"
          >
            {"冬"}
          </button>
        </div>
        {"\n        "}
        <div className="desk-stamp" aria-label="小站版本">
          <span>{"有间"}</span>
          <strong data-desk-version=""></strong>
        </div>
        {"\n        "}
        <div className="home-showcase-stage" id="home-showcase"></div>
        {"\n        "}
        <aside className="home-now" aria-labelledby="home-now-title">
          {"\n          "}
          <div className="home-now-heading">
            <h2 id="home-now-title">{"门口的便签"}</h2>
            <p className="home-now-overline">{"A LITTLE NOTE"}</p>
          </div>
          {"\n          "}
          <ul className="home-now-list">
            <li>
              <span className="home-now-label">{"维护"}</span>
              <span data-now-recall="">{"RecallAI · 本地检索"}</span>
            </li>
            <li>
              <span className="home-now-label">{"记录"}</span>
              <span data-now-article="">{"把做工具的过程写下来"}</span>
            </li>
          </ul>
          {"\n          "}
          <div className="home-now-footer">
            <a href="now.html">{"看看近况 →"}</a>
            <time data-workbench-updated="">{"2026-10-26"}</time>
          </div>
          {"\n        "}
        </aside>
        {"\n      "}
      </div>
      {"\n    "}
    </section>
  );
}

function RoomPath() {
  return (
    <nav
      className="home-path container container-wide"
      aria-label="从玄关往里走"
    >
      <a href="index.html" aria-current="page">
        <i aria-hidden="true"></i>
        {"玄关"}
      </a>
      <a href="projects.html">
        <i aria-hidden="true"></i>
        {"客厅"}
      </a>
      <a href="articles.html">
        <i aria-hidden="true"></i>
        {"书房"}
      </a>
      <a href="workbench.html">
        <i aria-hidden="true"></i>
        {"工作台"}
      </a>
      <a href="life.html">
        <i aria-hidden="true"></i>
        {"院子"}
      </a>
      <a href="colophon.html">
        <i aria-hidden="true"></i>
        {"说明书"}
      </a>
    </nav>
  );
}

function HouseOverview() {
  return (
    <section
      className="home-section home-overview container container-wide"
      aria-labelledby="overview-title"
    >
      {"\n      "}
      <div className="home-section-heading">
        <div>
          <p className="home-section-kicker">{"AROUND THE HOUSE — 01"}</p>
          <h2 id="overview-title">{"先在这儿坐一会儿"}</h2>
          <p>{"项目的进展、最近的记录，以及小站此刻的样子。"}</p>
        </div>
        <a className="home-text-link" href="workbench.html">
          {"展开工作台 "}
          <span aria-hidden="true">{"→"}</span>
        </a>
      </div>
      {"\n      "}
      <div className="home-bento-grid">
        {"\n        "}
        <article className="home-bento home-bento-now">
          <p className="home-bento-kicker">{"门牌 / NOW"}</p>
          <div id="home-bento-now">
            <p className="home-bento-empty">{"近况整理在门牌页。"}</p>
          </div>
          <a className="home-bento-link" href="now.html">
            {"最近在做什么 "}
            <span aria-hidden="true">{"→"}</span>
          </a>
        </article>
        {"\n        "}
        <article className="home-bento home-bento-pulse">
          <div className="home-bento-topline">
            <p className="home-bento-kicker">{"脉搏 / GITHUB"}</p>
            <span className="home-bento-badge">{"静态快照"}</span>
          </div>
          <div id="home-bento-pulse">
            <p className="home-bento-empty">{"活动快照尚未生成。"}</p>
          </div>
        </article>
        {"\n        "}
        <article className="home-bento home-bento-stats">
          <p className="home-bento-kicker">{"这所小站 / IN NUMBERS"}</p>
          <div id="home-bento-stats">
            <p className="home-bento-empty">{"内容统计尚未生成。"}</p>
          </div>
          <a className="home-bento-link" href="colophon.html">
            {"翻翻房屋说明书 "}
            <span aria-hidden="true">{"→"}</span>
          </a>
        </article>
        {"\n        "}
        <article className="home-bento home-bento-latest">
          <p className="home-bento-kicker">{"书房 / LATEST NOTE"}</p>
          <div id="home-bento-latest">
            <p className="home-bento-empty">{"下一篇记录会放在这里。"}</p>
          </div>
        </article>
        {"\n      "}
      </div>
      {"\n      "}
      <nav className="home-room-links" aria-label="逛逛其他房间">
        <span>{"再往里走"}</span>
        <a href="uses.html">
          {"工具墙 "}
          <span aria-hidden="true">{"→"}</span>
        </a>
        <a href="life.html">
          {"院子 "}
          <span aria-hidden="true">{"→"}</span>
        </a>
        <a href="links.html">
          {"邻居 "}
          <span aria-hidden="true">{"→"}</span>
        </a>
        <a href="colophon.html">
          {"房屋说明书 "}
          <span aria-hidden="true">{"→"}</span>
        </a>
      </nav>
      {"\n    "}
    </section>
  );
}

function FeaturedWorks() {
  return (
    <section
      className="home-section home-works"
      aria-labelledby="selected-work"
    >
      {"\n      "}
      <div className="home-works-inner container container-wide">
        {"\n      "}
        <div className="home-section-heading">
          <div>
            <p className="home-section-kicker">{"LIVING ROOM — 02"}</p>
            <h2 id="selected-work">{"做过的东西"}</h2>
            <p>{"把日常的问题，慢慢做成工具。"}</p>
          </div>
          <a className="home-text-link" href="projects.html">
            {"全部作品 "}
            <span aria-hidden="true">{"→"}</span>
          </a>
        </div>
        {"\n      "}
        <div className="home-work-list" id="home-featured-projects"></div>
        {"\n      "}
      </div>
      {"\n    "}
    </section>
  );
}

function Marquee() {
  return (
    <div className="home-marquee" aria-hidden="true">
      <div className="home-marquee-track">
        <span>
          {"本地检索 · OCR 识别 · 文档整理 · Android 适配 · 把想法做出来 · "}
        </span>
        <span>
          {"本地检索 · OCR 识别 · 文档整理 · Android 适配 · 把想法做出来 · "}
        </span>
      </div>
    </div>
  );
}

function GardenPreview() {
  return (
    <section
      className="home-garden-band"
      id="home-garden-band"
      aria-labelledby="home-garden-title"
      hidden={true}
    >
      <div className="container home-garden-inner container-wide">
        <div>
          <p className="home-room-kicker">{"GARDEN / 园子里的路"}</p>
          <h2 id="home-garden-title">{"想法之间，也有小径。"}</h2>
          <p>{"从第一天的记录，走到后来长出的枝叶。"}</p>
          <p className="home-garden-meta" data-garden-summary=""></p>
          <a
            className="home-text-link"
            href="articles.html?view=topics#garden-map"
          >
            {"去书房看关系图 "}
            <span aria-hidden="true">{"→"}</span>
          </a>
        </div>
        <div className="home-garden-preview">
          <img
            src="assets/images/garden-graph.svg"
            width="900"
            height="300"
            loading="lazy"
            alt="文章花园缩略图"
          />
          <p className="home-garden-caption">
            {"实线表示引用，虚线仅为分组。"}
          </p>
        </div>
      </div>
    </section>
  );
}

function RecentWriting() {
  return (
    <section
      className="home-section home-writing container container-wide"
      aria-labelledby="writing-title"
    >
      <div className="home-section-heading">
        <div>
          <p className="home-section-kicker">{"STUDY — 03"}</p>
          <h2 id="writing-title">{"最近的记录"}</h2>
          <p>{"关于开始，也关于动手的过程。"}</p>
        </div>
        <a className="home-text-link" href="articles.html">
          {"全部文章 "}
          <span aria-hidden="true">{"→"}</span>
        </a>
      </div>
      <div id="home-article-list"></div>
    </section>
  );
}

function HouseQuote() {
  return (
    <aside
      className="home-signoff container container-wide"
      aria-label="小站寄语"
    >
      <span className="home-signoff-mark" aria-hidden="true">
        {"“"}
      </span>
      <p data-house-quote="">{"把想法做出来，也给生活留一点空白。"}</p>
      <span className="home-signoff-source">{"有间 · 小站寄语"}</span>
    </aside>
  );
}

export default function HomePage() {
  return (
    <>
      <main className="home-page" id="main">
        {"\n    "}
        <Hero />
        {"\n    "}
        <RoomPath />
        {"\n    "}
        <HouseOverview />
        {"\n    "}
        <FeaturedWorks />
        {"\n    "}
        <Marquee />
        {"\n    "}
        <GardenPreview />
        {"\n    "}
        <RecentWriting />
        {"\n    "}
        <HouseQuote />
        {"\n  "}
      </main>
    </>
  );
}
