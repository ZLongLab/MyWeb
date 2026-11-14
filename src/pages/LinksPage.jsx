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
          {"这里收录本站使用的设计参考与文档资源，每条链接附上参考理由。"}
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
        <h2>{"来串个门"}</h2>
      </div>
      <div className="room-section-body">
        <p>
          {
            "小站已经开放访问。欢迎分享你的网站、项目或实用工具，可以通过关于页的 GitHub 入口交流，并附上一句介绍或使用感受。"
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
