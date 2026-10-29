function PromptHero() {
  return (
    <section className="prompt-hero" aria-labelledby="prompt-title">
      {"\n      "}
      <div className="prompt-hero-copy">
        <p className="eyebrow">{"工作台里的小工具 / VIDEO STUDIO · 01"}</p>
        <h1 id="prompt-title">
          {"视频灵感室"}
          <span>{"。"}</span>
        </h1>
        <p>
          {
            "从一个想法，到一段能用的提示词。选一个拍摄方向，填进自己的故事，再慢慢打磨。"
          }
        </p>
      </div>
      {"\n      "}
      <svg
        className="prompt-hero-art"
        viewBox="0 0 180 110"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="17"
          y="20"
          width="138"
          height="78"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.2"
        ></rect>
        <path
          d="M17 37h138M17 80h138M65 37v43M113 37v43M27 26h14m10 0h14m10 0h14m10 0h14m10 0h14M27 91h14m10 0h14m10 0h14m10 0h14m10 0h14"
          stroke="currentColor"
          strokeWidth="1.2"
        ></path>
        <circle cx="41" cy="58" r="9" stroke="currentColor"></circle>
        <path
          d="m78 69 12-22 12 22Zm46-11 10-10 10 10-10 10Z"
          stroke="currentColor"
        ></path>
        <path
          d="m143 5 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z"
          fill="currentColor"
        ></path>
      </svg>
      {"\n    "}
    </section>
  );
}

function PromptPath() {
  return (
    <div className="prompt-path">
      <b>{"01 选一个方向"}</b>
      <span aria-hidden="true">{"→"}</span>
      <b>{"02 填进你的想法"}</b>
      <span aria-hidden="true">{"→"}</span>
      <b>{"03 复制，去创作"}</b>
      <a href="projects.html">{"回客厅看作品 ↗"}</a>
    </div>
  );
}

function PromptGrid() {
  return (
    <div className="prompt-grid">
      {"\n      "}
      <section
        className="prompt-panel prompt-library"
        aria-labelledby="prompt-library-title"
      >
        <div className="prompt-panel-head">
          <p className="prompt-step">{"01 / FIND YOUR FRAME"}</p>
          <h2 id="prompt-library-title">{"找一个起点"}</h2>
        </div>
        <div className="prompt-panel-body">
          {"\n        "}
          <label className="prompt-search-label" htmlFor="prompt-search">
            {"搜索模板"}
          </label>
          <input
            id="prompt-search"
            type="search"
            maxLength="100"
            placeholder="试试：动画、宠物、节奏"
            autoComplete="off"
          />
          {"\n        "}
          <div className="prompt-filter-row" role="group" aria-label="筛选模板">
            <button
              type="button"
              className="prompt-filter"
              data-prompt-filter="全部"
              aria-pressed="true"
            >
              {"全部"}
            </button>
            <button
              type="button"
              className="prompt-filter"
              data-prompt-filter="叙事"
              aria-pressed="false"
            >
              {"叙事"}
            </button>
            <button
              type="button"
              className="prompt-filter"
              data-prompt-filter="动画"
              aria-pressed="false"
            >
              {"动画"}
            </button>
            <button
              type="button"
              className="prompt-filter"
              data-prompt-filter="展示"
              aria-pressed="false"
            >
              {"展示"}
            </button>
            <button
              type="button"
              className="prompt-filter"
              data-prompt-filter="收藏"
              aria-pressed="false"
            >
              {"我的收藏"}
            </button>
          </div>
          {"\n        "}
          <p
            className="prompt-result-count"
            id="prompt-result-count"
            aria-live="polite"
          ></p>
          <div className="prompt-template-list" id="prompt-template-list"></div>
          <p className="prompt-empty" id="prompt-no-results" hidden={true}>
            {"这里还没有匹配的模板。换个词，或回到“全部”看看。"}
          </p>
          {"\n      "}
        </div>
      </section>
      {"\n      "}
      <section className="prompt-panel" aria-labelledby="prompt-editor-heading">
        <div className="prompt-panel-head">
          <p className="prompt-step">{"02 / MAKE IT YOURS"}</p>
          <div className="prompt-heading-row">
            <h2 id="prompt-editor-heading" tabIndex="-1">
              <span id="prompt-template-title">{"电影短片"}</span>
            </h2>
            <button
              className="prompt-text-button"
              id="prompt-example"
              type="button"
            >
              {"填入示例 ↗"}
            </button>
          </div>
          <p
            className="prompt-description"
            id="prompt-template-description"
          ></p>
        </div>
        {"\n        "}
        <div className="prompt-panel-body">
          <form id="prompt-form">
            <div className="prompt-fields">
              {"\n          "}
              <div className="prompt-field">
                <label htmlFor="prompt-subject">
                  {"画面主角"}
                  <span>{"必填"}</span>
                </label>
                <input
                  id="prompt-subject"
                  name="subject"
                  required={true}
                  maxLength="1000"
                  placeholder="人物、动物或物品，以及它的外观"
                />
              </div>
              {"\n          "}
              <div className="prompt-field">
                <label htmlFor="prompt-scene">
                  {"故事发生在哪里"}
                  <span>{"必填"}</span>
                </label>
                <textarea
                  id="prompt-scene"
                  name="scene"
                  required={true}
                  maxLength="1000"
                  rows="2"
                  placeholder="地点、时间，以及能看见的环境细节"
                ></textarea>
              </div>
              {"\n          "}
              <div className="prompt-field">
                <label htmlFor="prompt-action">
                  {"镜头里发生什么"}
                  <span>{"必填"}</span>
                </label>
                <textarea
                  id="prompt-action"
                  name="action"
                  required={true}
                  maxLength="1000"
                  rows="3"
                  placeholder="从开始到结束，描述一件具体发生的事"
                ></textarea>
              </div>
              {"\n          "}
              <div className="prompt-field">
                <label htmlFor="prompt-look">
                  {"画风与光线"}
                  <span>{"可选"}</span>
                </label>
                <textarea
                  id="prompt-look"
                  name="look"
                  maxLength="1000"
                  rows="2"
                  placeholder="例如：水彩纸纹、柔和晨光、低饱和色彩"
                ></textarea>
              </div>
              {"\n          "}
              <div className="prompt-field">
                <label htmlFor="prompt-extra" id="prompt-extra-label">
                  {"结尾与情绪变化"}
                </label>
                <textarea
                  id="prompt-extra"
                  name="extra"
                  maxLength="1000"
                  rows="2"
                  aria-describedby="prompt-extra-hint"
                ></textarea>
                <p className="prompt-field-hint" id="prompt-extra-hint"></p>
              </div>
              {"\n          "}
              <details className="prompt-advanced">
                <summary>{"再补一点镜头细节 · 可选"}</summary>
                <div className="prompt-field">
                  <label htmlFor="prompt-camera">{"摄影机怎么移动"}</label>
                  <input
                    id="prompt-camera"
                    name="camera"
                    maxLength="1000"
                    placeholder="固定机位 / 缓慢推近 / 侧面跟拍"
                  />
                </div>
                <div className="prompt-field-pair">
                  <div className="prompt-field">
                    <label htmlFor="prompt-duration">{"预计时长"}</label>
                    <input
                      id="prompt-duration"
                      name="duration"
                      maxLength="40"
                      placeholder="例如：约 10 秒"
                    />
                  </div>
                  <div className="prompt-field">
                    <label htmlFor="prompt-aspect">{"构图意图"}</label>
                    <select id="prompt-aspect" name="aspect">
                      <option value="">{"暂不指定"}</option>
                      {"横屏 16:9"}
                      <option>{"竖屏 9:16"}</option>
                      <option>{"方形 1:1"}</option>
                    </select>
                  </div>
                </div>
                <p className="prompt-field-hint">
                  {"这些是创作目标，实际可选项以你使用的视频平台为准。"}
                </p>
              </details>
              {"\n        "}
            </div>
          </form>
          <details className="prompt-guidance">
            <summary>{"拍摄小提醒与容易踩的坑"}</summary>
            <h3>{"试试这样写"}</h3>
            <ul id="prompt-tips"></ul>
            <h3>{"优先避免"}</h3>
            <ul id="prompt-pitfalls"></ul>
            <a
              className="prompt-source-link"
              id="prompt-source"
              href="https://github.com/LearnPrompt/awesome-seedance"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"阅读上游模板与案例（新标签页） ↗"}
            </a>
          </details>
          <button
            className="prompt-text-button"
            id="prompt-clear"
            type="button"
          >
            {"清空当前填写"}
          </button>
        </div>
        {"\n      "}
      </section>
      {"\n      "}
      <section
        className="prompt-panel prompt-result-panel"
        aria-labelledby="prompt-result-title"
      >
        <div className="prompt-panel-head">
          <p className="prompt-step">{"03 / READY TO TAKE AWAY"}</p>
          <h2 id="prompt-result-title">{"把想法带走"}</h2>
        </div>
        <div className="prompt-panel-body">
          {"\n        "}
          <div className="prompt-modes" role="group" aria-label="输出类型">
            <button
              className="prompt-mode"
              type="button"
              data-output-mode="draft"
              aria-pressed="true"
            >
              {"提示词草稿"}
            </button>
            <button
              className="prompt-mode"
              type="button"
              data-output-mode="brief"
              aria-pressed="false"
            >
              {"给 AI 完善"}
            </button>
          </div>
          {"\n        "}
          <label
            className="prompt-output-label"
            id="prompt-output-label"
            htmlFor="prompt-output"
          >
            {"可编辑的文字草稿。"}
          </label>
          <textarea
            className="prompt-output"
            id="prompt-output"
            maxLength="20000"
            spellCheck="false"
            aria-describedby="prompt-output-state"
          ></textarea>
          {"\n        "}
          <div className="prompt-output-meta">
            <span id="prompt-output-count"></span>
            <button
              className="prompt-text-button"
              id="prompt-regenerate"
              type="button"
            >
              {"重新整理 ↻"}
            </button>
          </div>
          <p className="prompt-field-hint" id="prompt-output-state">
            {"已按填写内容整理"}
          </p>
          {"\n        "}
          <button className="prompt-main-action" id="prompt-copy" type="button">
            {"复制提示词草稿 ↗"}
          </button>
          <button
            className="prompt-secondary-action"
            id="prompt-save"
            type="button"
          >
            {"保存到我的草稿"}
          </button>
          <p
            className="prompt-status"
            id="prompt-status"
            role="status"
            aria-live="polite"
          ></p>
          <p className="prompt-storage-note">
            {
              "这里按模板整理文字，不调用 AI，也不生成视频。你的填写不会发送给站主，收藏和草稿只留在当前浏览器。"
            }
          </p>
          <p className="prompt-storage-note">
            {"想继续打磨？复制后"}
            <a
              className="text-link"
              href="prompt-optimizer/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"打开提示词优化器 ↗"}
            </a>
            {"，粘贴草稿并配置自己的模型。不自动传送你的填写。"}
          </p>
          <p className="prompt-storage-note">
            {"想先找画面方向？"}
            <a
              className="text-link"
              href="image-prompts.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"去图片灵感室找构图 ↗"}
            </a>
            {"，再回来补充动作与镜头。"}
          </p>
          {"\n      "}
        </div>
      </section>
      {"\n    "}
    </div>
  );
}

function PromptNotebook() {
  return (
    <section
      className="prompt-notebook"
      aria-labelledby="prompt-notebook-title"
    >
      <div className="prompt-notebook-head">
        <div>
          <h2 id="prompt-notebook-title">{"留给下次的想法"}</h2>
          <p id="prompt-draft-count">{"0 / 50 份 · 只保存在当前浏览器"}</p>
        </div>
        <div className="prompt-backup-actions">
          <button
            className="prompt-text-button"
            id="prompt-import"
            type="button"
          >
            {"导入备份 ↗"}
          </button>
          <button
            className="prompt-text-button"
            id="prompt-export"
            type="button"
          >
            {"导出备份 ↗"}
          </button>
          <input
            id="prompt-import-file"
            type="file"
            accept=".json,application/json"
            hidden={true}
            aria-label="选择视频灵感室备份"
          />
        </div>
      </div>
      <div className="prompt-drafts" id="prompt-drafts"></div>
      <p className="prompt-empty" id="prompt-drafts-empty">
        {"还没有保存的草稿。先从上面的示例改起，把自己的版本留下来。"}
      </p>
    </section>
  );
}

function PromptOriginNote() {
  return (
    <div className="prompt-origin-note">
      <p>
        {"方法参考 "}
        <a
          href="https://github.com/LearnPrompt/awesome-seedance"
          target="_blank"
          rel="noopener noreferrer"
        >
          {"LearnPrompt / Awesome Seedance ↗"}
        </a>
        {
          "，按 CC BY 4.0 署名改编。本站重新编写了中文示例、表单与文字整理逻辑，没有复制原作者的视频、图片或完整案例提示词。"
        }
        <a
          href="https://github.com/LearnPrompt/awesome-seedance#copyright--takedown-notice"
          target="_blank"
          rel="noopener noreferrer"
        >
          {"来源与许可说明 ↗"}
        </a>
      </p>
      <p>
        {
          "内容整理于 2026-10-28，不自动抓取更新。清理浏览器数据会删除本地收藏与草稿；GitHub 网址与 ChatGPT 展示网址的资料分别保存，需要迁移时请导出、导入。"
        }
      </p>
    </div>
  );
}

export default function VideoStudioPage() {
  return (
    <>
      <main className="prompt-shell" id="main">
        {"\n    "}
        <PromptHero />
        {"\n    "}
        <PromptPath />
        {"\n    "}
        {"\n    "}
        <PromptGrid />
        {"\n    "}
        <PromptNotebook />
        {"\n    "}
        <PromptOriginNote />
        {"\n  "}
      </main>
    </>
  );
}
