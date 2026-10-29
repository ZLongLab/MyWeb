function RoomHeader() {
  return (
    <header className="room-header">
      <p className="room-kicker">{"有间 / 工具墙"}</p>
      <h1>
        {"顺手的工具，留在手边"}
        <span className="title-period">{"。"}</span>
      </h1>
      <p className="room-lead">
        {"记录已经确认的开发工具，以及为什么在这个小站里用它。"}
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

function Software() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"01 / SOFTWARE"}</p>
        <h2>{"开发与维护"}</h2>
      </div>
      <div className="room-section-body">
        <ul className="room-list" id="uses-software"></ul>
      </div>
    </section>
  );
}

function Hardware() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"02 / HARDWARE"}</p>
        <h2>{"桌面与设备"}</h2>
      </div>
      <div className="room-section-body">
        <ul className="room-list" id="uses-hardware"></ul>
      </div>
    </section>
  );
}

function Preferences() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"03 / DEFAULTS"}</p>
        <h2>{"默认应用"}</h2>
      </div>
      <div className="room-section-body">
        <p>{"日常默认应用还没有填写，以下位置等站主确认。"}</p>
        <dl className="room-defaults" id="uses-defaults"></dl>
      </div>
    </section>
  );
}

function ToolNotes() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"04 / SETUP"}</p>
        <h2>{"怎样放在一起"}</h2>
      </div>
      <div className="room-section-body">
        <p>
          {
            "这间小站的内容留在本地文件；预览、检查和快照脚本也在本机运行。源码保存到 GitHub，重要版本留有恢复标记。"
          }
        </p>
        <p>
          {"项目实际用到的 Electron、React、Python 和 SQLite 等技术，另放在"}
          <a href="workbench.html#tools">{"工作台的实现技术"}</a>
          {"中。"}
        </p>
      </div>
    </section>
  );
}

export default function UsesPage() {
  return (
    <>
      <main className="room-page container" id="main">
        {"\n    "}
        <RoomHeader />
        {"\n"}
        <Software />
        <Hardware />
        <Preferences />
        <ToolNotes />
        {"\n    "}
        {"\n  "}
      </main>
    </>
  );
}
