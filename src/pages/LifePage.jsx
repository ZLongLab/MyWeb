function RoomHeader() {
  return (
    <header className="room-header">
      <p className="room-kicker">{"有间 / 院子"}</p>
      <h1>
        {"给日常，留一点空白"}
        <span className="title-period">{"。"}</span>
      </h1>
      <p className="room-lead">
        {"不急着填满。读到的、听到的、看到的，都可以慢慢留下。"}
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

function LifeGrid() {
  return (
    <div className="life-grid">
      <section className="room-panel" id="reading">
        <p className="room-kicker">{"01 / READING"}</p>
        <h2>{"在读"}</h2>
        <div id="life-reading"></div>
      </section>
      <section className="room-panel" id="listening">
        <p className="room-kicker">{"02 / LISTENING"}</p>
        <h2>{"在听"}</h2>
        <div id="life-listening"></div>
      </section>
      <section className="room-panel" id="watching">
        <p className="room-kicker">{"03 / WATCHING"}</p>
        <h2>{"在看"}</h2>
        <div id="life-watching"></div>
      </section>
    </div>
  );
}

function Photos() {
  return (
    <section className="room-section" id="photos">
      <div className="room-section-head">
        <p className="room-kicker">{"04 / MOMENTS"}</p>
        <h2>{"拾起一些片刻"}</h2>
      </div>
      <div className="room-section-body">
        <div
          className="photo-strip"
          id="life-photos"
          aria-label="生活照片"
        ></div>
        <p className="room-note" id="life-photo-help" hidden={true}>
          {"照片只使用本地资源，可横向浏览、点击查看大图。"}
        </p>
      </div>
    </section>
  );
}

export default function LifePage() {
  return (
    <>
      <main className="room-page container" id="main">
        {"\n    "}
        <RoomHeader />
        {"\n"}
        <LifeGrid />
        <Photos />
        {"\n    "}
        {"\n  "}
      </main>
    </>
  );
}
