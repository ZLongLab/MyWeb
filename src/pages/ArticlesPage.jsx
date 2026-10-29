function WritingIntro() {
  return (
    <section className="writing-intro" aria-labelledby="writing-title">
      {"\n      "}
      <div>
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true"></span>
          {" 记录 / JOURNAL"}
        </p>
        <h1 id="writing-title">
          {"写下来的事"}
          <span className="title-period">{"。"}</span>
        </h1>
        <p>{"记下想法、取舍，还有一步步实现的过程。"}</p>
      </div>
      {"\n\n    "}
    </section>
  );
}

function WritingCollection() {
  return (
    <section className="writing-collection" aria-label="浏览文章与笔记">
      {"\n      "}
      <div className="writing-tools">
        <div
          className="article-filters"
          role="group"
          aria-label="按文章分类筛选"
        >
          <button type="button" data-article-filter="all" aria-pressed="true">
            {"全部文章"}
          </button>
          <button
            type="button"
            data-article-filter="建站手记"
            aria-pressed="false"
          >
            {"建站手记"}
          </button>
          <button
            type="button"
            data-article-filter="开发记录"
            aria-pressed="false"
          >
            {"开发记录"}
          </button>
          <button
            type="button"
            data-article-filter="小站计划"
            aria-pressed="false"
          >
            {"小站计划"}
          </button>
        </div>
        <label className="article-search-label" htmlFor="article-search">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="m16 16 4 4"></path>
          </svg>
          <span className="visually-hidden">{"搜索文章标题、标签和正文"}</span>
          <input
            type="search"
            id="article-search"
            placeholder="搜索文章…"
            autoComplete="off"
            maxLength="100"
          />
        </label>
      </div>
      {"\n      "}
      <p
        className="article-count visually-hidden"
        id="article-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {"正在整理文章…"}
      </p>
      {"\n      "}
      <div className="garden-view-switch" role="group" aria-label="文章视图">
        <button type="button" data-article-view="time" aria-pressed="true">
          {"按时间"}
        </button>
        <button type="button" data-article-view="topics" aria-pressed="false">
          {"按主题丛"}
        </button>
      </div>
      {"\n      "}
      <div className="garden-tag-filter" id="garden-tag-filter" hidden={true}>
        <span></span>
        <button type="button" id="garden-clear-tag">
          {"清除主题筛选"}
        </button>
      </div>
      {"\n      "}
      <div
        id="article-clusters"
        className="garden-clusters"
        hidden={true}
      ></div>
      {"\n      "}
      <section id="garden-map" hidden={true} aria-labelledby="garden-map-title">
        <h2 id="garden-map-title">{"园子里的路"}</h2>
        <div className="garden-graph-stage"></div>
        <p className="garden-graph-caption">
          {
            "实线表示引用；虚线圈起的记录暂未连上小径，不表示互引。空心／半填／实心代表种子／生长中／常青，点的大小随被引次数变化。图可横向浏览，完整标题见下方文字入口。"
          }
        </p>
        <div id="garden-graph-text">
          <ul className="garden-graph-text"></ul>
        </div>
      </section>
      {"\n      "}
      <div id="article-list" className="article-list"></div>
      {"\n      "}
      <div className="article-empty" id="article-empty" hidden={true}>
        <span aria-hidden="true">{"⌕"}</span>
        <h2>{"这次还没找到。"}</h2>
        <p>{"试试其他关键词，或回到全部文章。"}</p>
        <button
          className="button button-primary"
          type="button"
          id="clear-article-filters"
        >
          {"查看全部文章 "}
          <span aria-hidden="true">{"→"}</span>
        </button>
      </div>
      {"\n      "}
      {"\n    "}
    </section>
  );
}

export default function ArticlesPage() {
  return (
    <>
      <main className="container" id="main">
        {"\n    "}
        <WritingIntro />
        {"\n    "}
        <WritingCollection />
        {"\n  "}
      </main>
    </>
  );
}
