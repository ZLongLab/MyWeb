import ToolShortcut from "../components/ToolShortcut.jsx";
function ImageShortcut() {
  return (
    <ToolShortcut
      eyebrow="新添的小工具 / IMAGE STUDIO"
      href="image-prompts.html"
      label="打开图片灵感室 →"
      offset={20}
    >
      {"20 个图片提示词起点，按风格找灵感，复制与本地收藏。"}
    </ToolShortcut>
  );
}

function OptimizerShortcut() {
  return (
    <ToolShortcut
      eyebrow="开源工具 / PROMPT OPTIMIZER"
      href="prompt-optimizer/"
      label="打开提示词优化器 →"
      offset={20}
    >
      {"优化、测试与收藏；实际使用前在模型管理中配置自己的服务。"}
    </ToolShortcut>
  );
}

function VideoShortcut() {
  return (
    <ToolShortcut
      eyebrow="新添的小工具 / VIDEO STUDIO"
      href="video-prompts.html"
      label="打开视频灵感室 →"
      offset={28}
    >
      {"选模板、填想法，把下一条视频的提示词留在这里。"}
    </ToolShortcut>
  );
}

function WorkbenchHero() {
  return (
    <header className="workbench-hero">
      {"\n      "}
      <p className="eyebrow">{"工作台 / DESK"}</p>
      {"\n      "}
      <h1>
        {"此刻，正在做的事"}
        <span className="title-period">{"。"}</span>
      </h1>
      {"\n      "}
      <p className="workbench-intro">
        {"把最近的项目、实现用到的技术和小站的变化，留在同一张工作台上。"}
      </p>
      {"\n      "}
      <p className="workbench-updated">
        {"最近整理 "}
        <time dateTime="2026-10-26" data-workbench-updated="">
          {"2026.10.26"}
        </time>
      </p>
      {"\n      "}
      <nav className="workbench-index" aria-label="工作台内容">
        <a href="#now">
          {"当前近况 "}
          <span aria-hidden="true">{"↓"}</span>
        </a>
        <a href="#tools">
          {"实现技术 "}
          <span aria-hidden="true">{"↓"}</span>
        </a>
        <a href="#appearance">
          {"外观与快照 "}
          <span aria-hidden="true">{"↓"}</span>
        </a>
        <a href="#updates">
          {"小站更新 "}
          <span aria-hidden="true">{"↓"}</span>
        </a>
        <a href="#colophon">
          {"关于本站 "}
          <span aria-hidden="true">{"↓"}</span>
        </a>
      </nav>
      {"\n    "}
    </header>
  );
}

function Appearance() {
  return (
    <section
      className="workbench-section"
      id="appearance"
      aria-labelledby="workbench-appearance-title"
      tabIndex="-1"
    >
      {"\n      "}
      <div className="workbench-section-heading">
        <p className="workbench-section-index">{"LIGHT / SEASON"}</p>
        <h2 id="workbench-appearance-title">{"换一束光"}</h2>
        <p>{"只改变季节的天气，不改变房间的身份。"}</p>
      </div>
      {"\n      "}
      <div className="workbench-section-content">
        <div className="season-preferences">
          <label htmlFor="season-picker">{"季节外观"}</label>
          <select
            id="season-picker"
            data-season-picker=""
            aria-label="季节外观"
          >
            <option value="auto">{"跟随本地月份"}</option>
            <option value="spring">{"春 · 青瓷"}</option>
            <option value="summer">{"夏 · 松针"}</option>
            <option value="autumn">{"秋 · 陶土"}</option>
            <option value="winter">{"冬 · 雾蓝"}</option>
          </select>
        </div>
        <p data-season-status="" role="status"></p>
        <p className="room-note" data-snapshot-review=""></p>
        <a className="home-text-link" href="colophon.html">
          {"阅读房屋说明书 →"}
        </a>
      </div>
      {"\n    "}
    </section>
  );
}

function Now() {
  return (
    <section
      className="workbench-section"
      id="now"
      aria-labelledby="workbench-now-title"
      tabIndex="-1"
    >
      {"\n      "}
      <div className="workbench-section-heading">
        <p className="workbench-section-index">{"01 / NOW"}</p>
        <h2 id="workbench-now-title">{"当前近况"}</h2>
        <p>{"项目在推进，记录也慢慢补上。"}</p>
      </div>
      {"\n      "}
      <div className="workbench-section-content">
        <p>
          <a className="home-text-link" href="now.html">
            {"正式门牌：正在做、正在读与暂时不做 →"}
          </a>
        </p>
        <div id="workbench-now-list"></div>
      </div>
      {"\n    "}
    </section>
  );
}

function Tools() {
  return (
    <section
      className="workbench-section"
      id="tools"
      aria-labelledby="workbench-tools-title"
      tabIndex="-1"
    >
      {"\n      "}
      <div className="workbench-section-heading">
        <p className="workbench-section-index">{"02 / BUILD"}</p>
        <h2 id="workbench-tools-title">{"用什么实现"}</h2>
        <p>{"来自已展示项目的技术，按实际用途整理。"}</p>
      </div>
      {"\n      "}
      <div className="workbench-section-content" id="workbench-tools-list">
        <noscript />
      </div>
      {"\n    "}
    </section>
  );
}

function Updates() {
  return (
    <section
      className="workbench-section"
      id="updates"
      aria-labelledby="workbench-updates-title"
      tabIndex="-1"
    >
      {"\n      "}
      <div className="workbench-section-heading">
        <p className="workbench-section-index">{"03 / LOG"}</p>
        <h2 id="workbench-updates-title">{"小站更新"}</h2>
        <p>{"给每次完成的改动，留下一行记录。"}</p>
      </div>
      {"\n      "}
      <div
        className="workbench-section-content"
        id="workbench-update-list"
      ></div>
      {"\n    "}
    </section>
  );
}

function Colophon() {
  return (
    <section
      className="workbench-section"
      id="colophon"
      aria-labelledby="workbench-colophon-title"
      tabIndex="-1"
    >
      {"\n      "}
      <div className="workbench-section-heading">
        <p className="workbench-section-index">{"04 / COLOPHON"}</p>
        <h2 id="workbench-colophon-title">{"关于本站"}</h2>
        <p>{"这个小站的制作方式，以及数据留在哪里。"}</p>
      </div>
      {"\n      "}
      <div className="workbench-section-content">
        {"\n        "}
        <dl className="workbench-colophon-list">
          {"\n          "}
          <div>
            <dt>{"制作方式"}</dt>
            <dd>
              {
                "原生 HTML、CSS 与 JavaScript 静态页面，不依赖框架或外部运行库；本地预览可使用本机服务。内容随文件维护，通过 GitHub Pages 和 ChatGPT 展示版本发布。"
              }
            </dd>
          </div>
          {"\n          "}
          <div>
            <dt>{"字体与颜色"}</dt>
            <dd>
              {
                "优先使用本机的中文无衬线与衬线字体，缺少时回退到系统字体。暖纸底、暖沙色带，搭配松针绿、暖陶土、琥珀金与青瓷灰蓝，没有在线字体请求。"
              }
              <span className="workbench-palette" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </span>
            </dd>
          </div>
          {"\n          "}
          <div>
            <dt>{"外观与离线"}</dt>
            <dd>
              {
                "顶栏可切换纸色与夜色，选择留在当前浏览器。使用本地预览或 HTTPS 完整加载一次后，可离线浏览与搜索；浏览器支持时页脚会提供安装入口。双击文件打开同样可阅读与切换外观。"
              }
            </dd>
          </div>
          {"\n          "}
          <div>
            <dt>{"搜索与便签"}</dt>
            <dd>
              {"搜索在浏览器内完成，不上传关键词。"}
              <a href="guestbook.html">{"随手便签"}</a>
              {
                "只保存在当前浏览器，不发送给站主；重要内容可在便签页导出 JSON 备份。"
              }
            </dd>
          </div>
          {"\n          "}
          <div>
            <dt>{"版本与交流"}</dt>
            <dd>
              {
                "源码使用公开仓库保存版本，可供阅读和审核；代码备份不包含浏览器里的便签。项目交流入口放在"
              }
              <a href="about.html#contact">{"关于页的联系区"}</a>
              {"。"}
            </dd>
          </div>
          {"\n        "}
        </dl>
        {"\n      "}
      </div>
      {"\n    "}
    </section>
  );
}

export default function WorkbenchPage() {
  return (
    <>
      <main className="container workbench-page" id="main">
        {"\n    "}
        <ImageShortcut />
        {"\n    "}
        <OptimizerShortcut />
        {"\n    "}
        <VideoShortcut />
        {"\n    "}
        <WorkbenchHero />
        {"\n\n    "}
        <Appearance />
        {"\n\n    "}
        <Now />
        {"\n\n    "}
        <Tools />
        {"\n\n    "}
        <Updates />
        {"\n\n    "}
        <Colophon />
        {"\n  "}
      </main>
    </>
  );
}
