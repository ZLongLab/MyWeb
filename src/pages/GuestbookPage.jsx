function GuestbookIntro() {
  return (
    <section className="guestbook-intro" aria-labelledby="guestbook-title">
      {"\n      "}
      <div>
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true"></span>
          {" 本地随手便签 / LOCAL NOTES"}
        </p>
        <h1 id="guestbook-title">
          {"灵感草稿箱"}
          <span className="title-period">{"。"}</span>
        </h1>
        <p>{"记下还没展开的想法，留给下一次动手。"}</p>
      </div>
      {"\n\n    "}
    </section>
  );
}

function GuestbookScope() {
  return (
    <p className="guestbook-scope">
      <span aria-hidden="true">{"◎"}</span>
      <span>
        {"便签仅保存在当前浏览器，不会发送给站主，也不会跨设备同步。"}
      </span>
    </p>
  );
}

function GuestbookLayout() {
  return (
    <div className="guestbook-layout">
      {"\n      "}
      <section className="guestbook-compose" aria-labelledby="compose-heading">
        {"\n        "}
        <p className="eyebrow section-index">{"01 / LEAVE A NOTE"}</p>
        <h2 id="compose-heading">{"写一张便签。"}</h2>
        <p className="guestbook-compose-description">
          {"用一个称呼，和一段想留下的话。"}
        </p>
        {"\n        "}
        <form id="guestbook-form" novalidate="">
          {"\n          "}
          <div className="guestbook-field">
            <label htmlFor="guestbook-name">
              {"你的称呼 "}
              <span>{"必填"}</span>
            </label>
            <input
              id="guestbook-name"
              name="nickname"
              type="text"
              required={true}
              minLength="1"
              maxLength="30"
              autoComplete="nickname"
              aria-describedby="guestbook-name-hint"
            />
            <p className="guestbook-field-hint" id="guestbook-name-hint">
              {"1–30 个字符，可以使用昵称。"}
            </p>
          </div>
          {"\n          "}
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
          {"\n          "}
          <p
            className="guestbook-error"
            id="guestbook-error"
            role="alert"
            hidden={true}
          ></p>
          {"\n          "}
          <button
            className="button button-primary guestbook-submit"
            id="guestbook-submit"
            type="submit"
            disabled={true}
          >
            {"保存到本浏览器 "}
            <span aria-hidden="true">{"→"}</span>
          </button>
          {"\n          "}
          <p className="guestbook-form-note">
            {
              "最多保留 100 条。清除浏览器的网站数据会同时移除留言，重要内容可以导出一份。"
            }
          </p>
          {"\n        "}
        </form>
        {"\n        "}
        <p
          className="guestbook-status"
          id="guestbook-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        ></p>
        {"\n        "}
        {"\n      "}
      </section>
      {"\n      "}
      <section className="guestbook-saved" aria-labelledby="saved-heading">
        {"\n        "}
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
        {"\n        "}
        <p className="guestbook-backup-note" id="guestbook-import-note">
          {"导入会合并便签，完全相同的记录自动跳过。"}
        </p>
        {"\n        "}
        <p className="guestbook-count" id="guestbook-count">
          {"正在读取本地便签…"}
        </p>
        {"\n        "}
        <div className="guestbook-empty" id="guestbook-empty" hidden={true}>
          <h3>{"还没有便签。"}</h3>
          <p>{"留一句话，让这一页从你开始。"}</p>
        </div>
        {"\n        "}
        <div className="guestbook-list" id="guestbook-list"></div>
        {"\n      "}
      </section>
      {"\n    "}
    </div>
  );
}

export default function GuestbookPage() {
  return (
    <>
      <main className="container" id="main">
        {"\n    "}
        <GuestbookIntro />
        {"\n    "}
        <GuestbookScope />
        {"\n    "}
        <GuestbookLayout />
        {"\n  "}
      </main>
      <dialog
        className="site-dialog guestbook-delete-dialog"
        id="delete-message-dialog"
        aria-labelledby="delete-message-title"
        aria-describedby="delete-message-description"
      >
        {"\n    "}
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
          {"这条留言将从当前浏览器移除，删除后无法在此恢复。"}
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
        {"\n  "}
      </dialog>
    </>
  );
}
