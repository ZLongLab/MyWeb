function RoomHeader() {
  return (
    <header className="room-header">
      <p className="room-kicker">{"有间 / 门牌"}</p>
      <h1>
        {"最近在做的事"}
        <span className="title-period">{"。"}</span>
      </h1>
      <p className="room-lead">{"一张带日期的近况，不把忙碌当作进展。"}</p>
      <p className="room-updated">
        {"更新于 "}
        <time data-room-updated="" dateTime="2026-10-26">
          {"2026-10-26"}
        </time>
      </p>
    </header>
  );
}

function RoomPanels() {
  return (
    <div className="room-panels">
      {"\n  "}
      <section className="room-panel">
        <p className="room-kicker">{"01 / MAKING"}</p>
        <h2>{"正在做"}</h2>
        <ul className="room-list" id="now-doing"></ul>
      </section>
      {"\n  "}
      <section className="room-panel">
        <p className="room-kicker">{"02 / READING"}</p>
        <h2>{"正在读"}</h2>
        <div id="now-reading"></div>
        <a href="life.html#reading">{"去院子看看 →"}</a>
      </section>
      {"\n  "}
      <section className="room-panel">
        <p className="room-kicker">{"03 / LISTENING"}</p>
        <h2>{"正在听"}</h2>
        <div id="now-listening"></div>
        <a href="life.html#listening">{"给音乐留个位置 →"}</a>
      </section>
      {"\n  "}
      <section className="room-panel">
        <p className="room-kicker">{"04 / NOT NOW"}</p>
        <h2>{"暂时不做"}</h2>
        <ul className="room-list" id="now-not-doing"></ul>
      </section>
      {"\n"}
    </div>
  );
}

function RoomNote() {
  return (
    <p className="room-note">
      {"项目近况来自同一份人工维护记录。书影音尚未公开，留空也没关系。"}
    </p>
  );
}

export default function NowPage() {
  return (
    <>
      <main className="room-page container" id="main">
        {"\n    "}
        <RoomHeader />
        {"\n\n"}
        <RoomPanels />
        {"\n"}
        <RoomNote />
        {"\n\n    "}
        {"\n  "}
      </main>
    </>
  );
}
