function RoomHeader() {
  return (
    <header className="room-header">
      <p className="room-kicker">{"有间 / 邻居"}</p>
      <h1>
        {"一些值得打开的窗口"}
        <span className="title-period">{"。"}</span>
      </h1>
      <p className="room-lead">
        {"链接后面应当有一句理由，也应当分清参考与朋友。"}
      </p>
      <p className="room-updated">
        {"更新于 "}
        <time data-room-updated="" dateTime="2026-10-26">
          {"2026-10-26"}
        </time>
      </p>
    </header>
  );
}

function Neighbors() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"01 / FRIENDS"}</p>
        <h2>{"慢慢认识的小站"}</h2>
      </div>
      <div className="room-section-body">
        <ul className="friend-list" id="links-friends"></ul>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"02 / REFERENCES"}</p>
        <h2>{"设计参考与资源"}</h2>
      </div>
      <div className="room-section-body">
        <p className="room-note">
          {
            "这些是本站的设计参考与文档来源，不表示站主与作者之间存在友链或互访关系。"
          }
        </p>
        <ul className="friend-list" id="links-resources"></ul>
      </div>
    </section>
  );
}

function ExchangeLinks() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"03 / NEXT DOOR"}</p>
        <h2>{"以后再串门"}</h2>
      </div>
      <div className="room-section-body">
        <p>
          {
            "邻居环等到小站开放、认识更多人以后再考虑。现在这里保留一条安静的路。"
          }
        </p>
        <a href="about.html#contact">{"联系 ZL →"}</a>
      </div>
    </section>
  );
}

export default function LinksPage() {
  return (
    <>
      <main className="room-page container" id="main">
        {"\n    "}
        <RoomHeader />
        {"\n"}
        <Neighbors />
        <Resources />
        <ExchangeLinks />
        {"\n    "}
        {"\n  "}
      </main>
    </>
  );
}
