function GuestbookIntro() {
  return (
    <section className="guestbook-intro" aria-labelledby="guestbook-title">
      <div>
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true"></span>
          {" 本地随手便签 / LOCAL NOTES"}
        </p>
        <h1 id="guestbook-title">
          {"灵感草稿箱"}
          <span className="title-period">{"。"}</span>
        </h1>
        <p>{"记下还没展开的想法、待办或摘录，支持快捷分类、置顶、原位编辑与一键筛选。"}</p>
      </div>
      <div className="guestbook-hero-card glass-card" aria-hidden="true">
        <div className="guestbook-hero-card-top">
          <span>本地记事本</span>
          <b>仅存于当前浏览器</b>
        </div>
        <div className="guestbook-hero-stats">
          <span><b id="guestbook-stat-total">0</b> 已存便签</span>
          <span><b id="guestbook-stat-pinned">0</b> 已置顶</span>
          <span><b id="guestbook-stat-tags">0</b> 分类数</span>
        </div>
      </div>
    </section>
  );
}

function GuestbookScope() {
  return (
    <p className="guestbook-scope">
      <span aria-hidden="true">{"◎"}</span>
      <span>
        {"便签仅保存在当前浏览器，不会发送给站主；可在下方导出 JSON，或前往"}
        <a href="workbench.html#vault">{"工作台本地数据保险箱"}</a>
        {"统一备份。"}
      </span>
    </p>
  );
}

function GuestbookLayout() {
  return (
    <div className="guestbook-layout">
      <section className="guestbook-compose" aria-labelledby="compose-heading">
        <p className="eyebrow section-index">{"01 / LEAVE A NOTE"}</p>
        <h2 id="compose-heading">{"写一张便签。"}</h2>
        <p className="guestbook-compose-description">
          {"直接写下内容就能保存；分类或称呼可以留空，也可以点快捷标签。"}
        </p>
        <form id="guestbook-form" noValidate>
          <div className="guestbook-field">
            <label htmlFor="guestbook-name">
              {"分类或称呼 "}
              <span>{"选填 · 默认「随手记」"}</span>
            </label>
            <input
              id="guestbook-name"
              name="nickname"
              type="text"
              maxLength="30"
              autoComplete="nickname"
              placeholder="例如：灵感、待办、摘录，或留空"
              aria-describedby="guestbook-name-hint"
            />
            <div className="guestbook-quick-tags" role="group" aria-label="快捷分类标签">
              {["灵感", "待办", "摘录", "碎碎念"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="guestbook-tag-chip"
                  data-note-tag={tag}
                >
                  {tag}
                </button>
              ))}
            </div>
            <p className="guestbook-field-hint" id="guestbook-name-hint">
              {"1–30 个字符；留空时自动记作「随手记」。"}
            </p>
          </div>
          <div className="guestbook-field">
            <label htmlFor="guestbook-content">
              {"想留下的话 "}
              <span>{"必填"}</span>
            </label>
            <textarea
              id="guestbook-content"
              name="content"
              rows="6"
              required={true}
              minLength="1"
              maxLength="600"
              aria-describedby="guestbook-content-hint guestbook-character-count"
              placeholder="今天，有什么想记下来的？"
            ></textarea>
            <div className="guestbook-field-footer">
              <p className="guestbook-field-hint" id="guestbook-content-hint">
                {"1–600 个字符。"}
              </p>
              <span id="guestbook-character-count">{"0 / 600"}</span>
            </div>
          </div>
          <p
            className="guestbook-error"
            id="guestbook-error"
            role="alert"
            hidden={true}
          ></p>
          <button
            className="button button-primary guestbook-submit"
            id="guestbook-submit"
            type="submit"
            disabled={true}
          >
            {"保存到本浏览器 "}
            <span aria-hidden="true">{"→"}</span>
          </button>
          <p className="guestbook-form-note">
            {
              "最多保留 100 条。清除浏览器的网站数据会同时移除便签，重要内容可以导出一份。"
            }
          </p>
        </form>
        <p
          className="guestbook-status"
          id="guestbook-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        ></p>
      </section>
      <section className="guestbook-saved" aria-labelledby="saved-heading">
        <div className="guestbook-saved-heading">
          <div>
            <p className="eyebrow section-index">{"02 / WORDS KEPT HERE"}</p>
            <h2 id="saved-heading" tabIndex="-1">
              {"收好的灵感。"}
            </h2>
          </div>
          <div className="guestbook-backup-actions">
            <button
              className="guestbook-export"
              id="guestbook-import"
              type="button"
              aria-describedby="guestbook-import-note"
              disabled={true}
            >
              {"导入 JSON"}
            </button>
            <button
              className="guestbook-export"
              id="guestbook-export"
              type="button"
              disabled={true}
            >
              {"导出 JSON "}
              <span aria-hidden="true">{"→"}</span>
            </button>
            <input
              id="guestbook-import-file"
              type="file"
              accept=".json,application/json"
              aria-label="选择便签备份文件"
              hidden={true}
            />
          </div>
        </div>
        <p className="guestbook-backup-note" id="guestbook-import-note">
          {"导入会合并便签，完全相同的记录自动跳过。"}
        </p>
        <div className="guestbook-toolbar">
          <p className="guestbook-count" id="guestbook-count">
            {"正在读取本地便签…"}
          </p>
          <input
            id="guestbook-filter"
            className="guestbook-filter"
            type="search"
            maxLength="60"
            placeholder="筛选分类或正文…"
            aria-label="筛选本地便签"
          />
        </div>
        <div className="guestbook-filter-chips" role="group" aria-label="按分类筛选便签">
          {[
            { id: "all", label: "全部" },
            { id: "pinned", label: "仅看置顶" },
            { id: "灵感", label: "灵感" },
            { id: "待办", label: "待办" },
            { id: "摘录", label: "摘录" },
            { id: "碎碎念", label: "碎碎念" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="guestbook-filter-chip"
              data-filter-chip={chip.id}
              aria-pressed={chip.id === "all" ? "true" : "false"}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="guestbook-empty" id="guestbook-empty" hidden={true}>
          <h3>{"还没有便签。"}</h3>
          <p>{"留一句话，让这一页从你开始。"}</p>
        </div>
        <div className="guestbook-list" id="guestbook-list"></div>
      </section>
    </div>
  );
}

export default function GuestbookPage() {
  return (
    <>
      <main className="container" id="main">
        <GuestbookIntro />
        <GuestbookScope />
        <GuestbookLayout />
      </main>
      <dialog
        className="site-dialog guestbook-delete-dialog"
        id="delete-message-dialog"
        aria-labelledby="delete-message-title"
        aria-describedby="delete-message-description"
      >
        <button
          className="dialog-close"
          type="button"
          data-close-dialog=""
          aria-label="取消删除"
        >
          {"×"}
        </button>
        <p className="eyebrow">{"REMOVE THIS NOTE"}</p>
        <h2 id="delete-message-title">{"删除这张便签？"}</h2>
        <p id="delete-message-description">
          {"这条便签将从当前浏览器移除，删除后无法在此恢复。"}
        </p>
        <p className="guestbook-delete-preview" id="delete-message-preview"></p>
        <p
          className="guestbook-error"
          id="delete-message-error"
          role="alert"
          hidden={true}
        ></p>
        <div className="guestbook-dialog-actions">
          <button
            className="button guestbook-button-secondary"
            type="button"
            data-close-dialog=""
            autoFocus={true}
          >
            {"再想想"}
          </button>
          <button
            className="button button-primary"
            type="button"
            id="delete-message-confirm"
          >
            {"确认删除"}
          </button>
        </div>
      </dialog>
    </>
  );
}
