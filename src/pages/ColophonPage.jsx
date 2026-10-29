function RoomHeader() {
  return (
    <header className="room-header">
      <p className="room-kicker">{"有间 / 房屋说明书"}</p>
      <h1>
        {"这间小站，是怎样做的"}
        <span className="title-period">{"。"}</span>
      </h1>
      <p className="room-lead">
        {"一页讲清制作方式、内容原则，以及数据留在哪里。"}
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

function SiteStructure() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"01 / BUILT WITH"}</p>
        <h2>{"简单一点，住得久一点"}</h2>
      </div>
      <div className="room-section-body">
        <p>
          {
            "使用原生 HTML、CSS 与 JavaScript。没有框架、构建步骤或网站运行依赖；双击本地文件与本机预览服务都能浏览。"
          }
        </p>
        <p>
          {
            "预览只提供明确允许的页面与资源。页面不请求远程字体、图床、天气或 GitHub API；GitHub 活动由本地脚本生成公开日历快照，人工核对后才放进网站。"
          }
        </p>
        <p>
          {
            "在本机预览或 HTTPS 完整加载后可离线浏览。安装功能由浏览器决定，双击文件打开时不请求 manifest 或注册离线服务。"
          }
        </p>
      </div>
    </section>
  );
}

function ColorPalette() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"02 / TYPE & COLOUR"}</p>
        <h2>{"纸、墨与四季"}</h2>
      </div>
      <div className="room-section-body">
        <p>
          {
            "中文优先本机 Noto Sans SC / Noto Serif SC，再回退系统字体；小字使用 Cascadia Code / Consolas。没有远程字体请求。"
          }
        </p>
        <p>
          {
            "季节只改变玄关与全局点缀，各房间的身份色保持一致。顶栏切换纸色与夜色，工作台可选择季节。"
          }
        </p>
        <div className="palette-grid" id="colophon-palette"></div>
        <p
          id="palette-status"
          className="room-note"
          role="status"
          aria-live="polite"
        >
          {"点击色卡，复制颜色。"}
        </p>
      </div>
    </section>
  );
}

function SitePrinciples() {
  return (
    <section className="room-section">
      <div className="room-section-head">
        <p className="room-kicker">{"03 / PRINCIPLES"}</p>
        <h2>{"留在这里的原则"}</h2>
      </div>
      <div className="room-section-body">
        <ul className="room-list">
          <li>{"零追踪、无访问统计，不加载第三方分析脚本。"}</li>
          <li>{"内容人工核对，不把本地时段说成实时在线。"}</li>
          <li>{"动效可减少，键盘可进入每个房间。"}</li>
          <li>{"个人生活内容未提供时就留空，不生成假的书评、设备或照片。"}</li>
          <li>
            {
              "本地便签是自己的灵感箱，不是公开留言；只保存在当前浏览器，不发给站主。重要便签请另行导出 JSON。"
            }
          </li>
        </ul>
        <p>
          {"源码在"}
          <a
            href="https://github.com/ZLongLab/MyWeb"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"GitHub 公开仓库 ↗"}
          </a>
          {"保存；源码备份不包含浏览器里的便签。"}
        </p>
      </div>
    </section>
  );
}

function Changelog() {
  return (
    <section className="room-section" id="changelog">
      <div className="room-section-head">
        <p className="room-kicker">{"04 / CHANGELOG"}</p>
        <h2>{"一间一间，慢慢修缮"}</h2>
      </div>
      <div className="room-section-body">
        <div id="colophon-changelog"></div>
      </div>
    </section>
  );
}

export default function ColophonPage() {
  return (
    <>
      <main className="room-page container" id="main">
        {"\n    "}
        <RoomHeader />
        {"\n"}
        <SiteStructure />
        <ColorPalette />
        <SitePrinciples />
        <Changelog />
        {"\n    "}
        {"\n  "}
      </main>
    </>
  );
}
