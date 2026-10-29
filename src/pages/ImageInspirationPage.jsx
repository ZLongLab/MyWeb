function ImageRoomHero() {
  return (
    <section className="image-room-hero" aria-labelledby="image-room-title">
      {"\n      "}
      <div>
        <p className="eyebrow">{"工作台里的小工具 / IMAGE STUDIO · 03"}</p>
        <h1 id="image-room-title">
          {"图片灵感室"}
          <span>{"。"}</span>
        </h1>
        <p className="image-room-lead">
          {
            "先找一种喜欢的画面，再把它写成自己的想法。20 个图片提示词起点，留给下一张想做的图。"
          }
        </p>
        <p className="image-room-steps">
          <span>{"看构图"}</span>
          <i aria-hidden="true">{"→"}</i>
          <span>{"选一个起点"}</span>
          <i aria-hidden="true">{"→"}</i>
          <span>{"复制，继续打磨"}</span>
        </p>
      </div>
      {"\n      "}
      <div className="image-room-preview" aria-label="两张本站原创构图示意">
        <a
          href="image-prompts.html?example=amber-bottle"
          data-image-example="amber-bottle"
          aria-label="查看琥珀瓶的光"
        >
          <img
            src="assets/images/inspiration/amber-bottle.svg"
            width="500"
            height="350"
            alt="琥珀色瓶子和植物影的构图示意"
          />
        </a>
        <a
          className="image-room-preview-small"
          href="image-prompts.html?example=paper-mountains"
          data-image-example="paper-mountains"
          aria-label="查看层层纸片里的山"
        >
          <img
            src="assets/images/inspiration/paper-mountains.svg"
            width="500"
            height="350"
            alt="剪纸山峦与河流的构图示意"
          />
        </a>
        <p className="image-room-preview-label">{"构图示意 / STUDIES"}</p>
      </div>
      {"\n    "}
    </section>
  );
}

function ImageRoomNotice() {
  return (
    <div className="image-room-notice">
      <span>
        {"配图是本站绘制的构图示意，不是 AI 生成效果。浏览与复制不调用 AI。"}
      </span>
      <a href="#image-sources">{"来源与使用说明 ↓"}</a>
    </div>
  );
}

function ImageLibrary() {
  return (
    <section aria-label="图片提示词起点">
      {"\n      "}
      <h2 className="visually-hidden">{"选择图片起点"}</h2>
      {"\n      "}
      <div className="image-room-tools">
        <div
          className="image-room-filters"
          role="group"
          aria-label="筛选图片起点"
        >
          <button
            className="image-room-filter"
            type="button"
            data-image-category="全部"
            aria-pressed="true"
          >
            {"全部"}
          </button>
          <button
            className="image-room-filter"
            type="button"
            data-image-category="人物"
            aria-pressed="false"
          >
            {"人物"}
          </button>
          <button
            className="image-room-filter"
            type="button"
            data-image-category="产品"
            aria-pressed="false"
          >
            {"产品"}
          </button>
          <button
            className="image-room-filter"
            type="button"
            data-image-category="海报"
            aria-pressed="false"
          >
            {"海报"}
          </button>
          <button
            className="image-room-filter"
            type="button"
            data-image-category="场景"
            aria-pressed="false"
          >
            {"场景"}
          </button>
          <button
            className="image-room-filter"
            type="button"
            data-image-category="插画"
            aria-pressed="false"
          >
            {"插画"}
          </button>
          <button
            className="image-room-filter"
            id="image-only-favorites"
            type="button"
            aria-pressed="false"
          >
            {"我的收藏"}
          </button>
        </div>
        <label className="image-room-search">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="m16 16 5 5"></path>
          </svg>
          <span className="visually-hidden">{"搜索图片起点"}</span>
          <input
            id="image-search"
            type="search"
            maxLength="100"
            placeholder="试试：自然光、产品、水彩"
            autoComplete="off"
          />
        </label>
      </div>
      {"\n      "}
      <div className="image-room-meta">
        <p id="image-result-count" aria-live="polite"></p>
        <div className="image-room-backup">
          <button type="button" id="image-export">
            {"导出收藏"}
          </button>
          <button type="button" id="image-import">
            {"导入收藏"}
          </button>
          <input
            type="file"
            id="image-import-file"
            accept="application/json,.json"
            hidden={true}
          />
        </div>
      </div>
      {"\n      "}
      <p
        className="image-room-status"
        id="image-status"
        role="status"
        aria-live="polite"
      ></p>
      {"\n      "}
      <div className="image-room-grid" id="image-card-list"></div>
      {"\n      "}
      <div className="image-room-empty" id="image-no-results" hidden={true}>
        <h2>{"这里暂时没有匹配的起点。"}</h2>
        <p>{"换个关键词，或看看其他分类。喜欢的条目可以先收藏。"}</p>
        <button className="image-room-reset" id="image-reset" type="button">
          {"清除筛选，看看全部 →"}
        </button>
      </div>
      {"\n    "}
    </section>
  );
}

function ImageSources() {
  return (
    <section
      className="image-room-sources"
      id="image-sources"
      aria-labelledby="image-sources-title"
    >
      <div>
        <p className="eyebrow">{"CREDITS / ABOUT THESE STARTING POINTS"}</p>
        <h2 id="image-sources-title">{"给灵感留一条来路。"}</h2>
      </div>
      <div>
        <p>
          {"18 条提示词由本站编写，2 条参考改写自 "}
          <a
            href="https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"YouMind OpenLab 的提示词收录项目 ↗"}
          </a>
          {"。改写条目在详情中保留作者、原帖、收录链接与修改说明，按 "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"CC BY 4.0 ↗"}
          </a>
          {"署名。"}
        </p>
        <p>
          {
            "20 张配图均为本站原创 SVG 构图示意，没有搬运社区生成图；提示词未做真实模型生成验证。模型、入口和实际附件不同，结果也会不同。"
          }
        </p>
        <p>
          {
            "收藏只保存在当前浏览器，不包含 API 配置。清理浏览器或换设备前，可以导出收藏。复制后可去"
          }
          <a href="prompt-optimizer/" target="_blank" rel="noopener noreferrer">
            {"提示词优化器 ↗"}
          </a>
          {"继续改写，也可到"}
          <a
            href="video-prompts.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"视频灵感室 ↗"}
          </a>
          {"补充动作与镜头。"}
        </p>
      </div>
    </section>
  );
}

export default function ImageInspirationPage() {
  return (
    <>
      <main className="image-room" id="main">
        {"\n    "}
        <ImageRoomHero />
        {"\n    "}
        <ImageRoomNotice />
        {"\n    "}
        {"\n    "}
        <ImageLibrary />
        {"\n    "}
        <ImageSources />
        {"\n  "}
      </main>
      <dialog
        id="image-detail"
        className="image-room-dialog"
        aria-labelledby="image-detail-title"
      >
        <header className="image-room-dialog-top">
          <div>
            <p className="image-room-category" id="image-detail-category"></p>
            <h2 id="image-detail-title"></h2>
          </div>
          <button
            className="image-room-close"
            type="button"
            data-close-dialog=""
            aria-label="关闭图片起点详情"
          >
            {"×"}
          </button>
        </header>
        <div className="image-room-detail">
          <div className="image-room-detail-art">
            <img id="image-detail-art" width="500" height="350" alt="" />
            <p>{"本站构图示意 · 不是实际生成结果"}</p>
            <p id="image-detail-summary"></p>
            <dl className="image-room-palette">
              <dt>{"配色方向"}</dt>
              <dd id="image-palette"></dd>
              <dt>{"风格与光线"}</dt>
              <dd id="image-look"></dd>
            </dl>
            <div
              className="image-room-attribution"
              id="image-attribution"
            ></div>
          </div>
          <div className="image-room-detail-output">
            <label htmlFor="image-prompt-text">{"可以复制的图片提示词"}</label>
            <textarea
              id="image-prompt-text"
              readOnly={true}
              spellCheck="false"
            ></textarea>
            <div className="image-room-detail-actions">
              <button
                id="image-copy"
                className="button button-primary"
                type="button"
              >
                {"复制提示词 ↗"}
              </button>
              <button
                id="image-dialog-save"
                className="image-room-save"
                type="button"
                aria-pressed="false"
              >
                {"收藏这个起点"}
              </button>
            </div>
            <p id="image-dialog-status" role="status" aria-live="polite"></p>
            <div className="image-room-detail-links">
              <a
                href="prompt-optimizer/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"去优化器完善 ↗"}
              </a>
              <a
                id="image-video-link"
                href="video-prompts.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"去写视频想法 ↗"}
              </a>
            </div>
            <p className="image-room-detail-note">
              {
                "先复制，再粘贴到对应工具。不会自动传送提示词或覆盖已有草稿；实际生成需要使用你自己的模型服务。"
              }
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
