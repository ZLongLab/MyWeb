import ToolShortcut from "../components/ToolShortcut.jsx";
import LocalDataVault from "../components/LocalDataVault.jsx";
function ImageToolsShortcut() {
  return (
    <ToolShortcut
      eyebrow="IMAGE WORKSHOP"
      title="图片工坊"
      badge="WebP / AVIF"
      icon="image-tools"
      tone="mint"
      href="image-tools.html"
      label="打开图片工坊 →"
      offset={0}
    >
      多张图片批量转换格式、一键压缩预设、滑动对比画质并打包 ZIP，全程本地不上传。
    </ToolShortcut>
  );
}
function ImageShortcut() {
  return (
    <ToolShortcut
      eyebrow="IMAGE STUDIO"
      title="图片灵感室"
      badge="20 个起点"
      icon="image-prompts"
      tone="warm"
      href="image-prompts.html"
      label="打开图片灵感室 →"
      offset={0}
    >
      {"20 张原创构图示意与提示词起点，按人物、产品、海报、场景与插画浏览与本地收藏。"}
    </ToolShortcut>
  );
}

function OptimizerShortcut() {
  return (
    <ToolShortcut
      eyebrow="PROMPT OPTIMIZER"
      title="提示词优化器"
      badge="自托管"
      icon="optimizer"
      tone="violet"
      href="prompt-optimizer/"
      label="打开提示词优化器 →"
      offset={0}
    >
      {"接入自己的模型，系统优化、变量测试与对比结果；密钥仅留在当前浏览器。"}
    </ToolShortcut>
  );
}

function VideoShortcut() {
  return (
    <ToolShortcut
      eyebrow="VIDEO STUDIO"
      title="视频灵感室"
      badge="5 平台 · 15 模板"
      icon="video-prompts"
      tone="slate"
      href="video-prompts.html"
      label="打开视频灵感室 →"
      offset={0}
    >
      {"按平台方言选模板、填故事与摄影词库，整理可直接复制的分镜提示词与草稿。"}
    </ToolShortcut>
  );
}

function FrameStudioShortcut() {
  return (
    <ToolShortcut
      eyebrow="FRAME STUDIO"
      title="画框工坊"
      badge="Ctrl+V 即用"
      icon="frame-studio"
      tone="sky"
      href="frame-studio.html"
      label="打开画框工坊 →"
      offset={0}
    >
      {"粘贴截图或切换代码卡片、引文摘录，一键套上画廊底色、玻璃窗口与高清投影导出。"}
    </ToolShortcut>
  );
}

function FocusLabShortcut() {
  return (
    <ToolShortcut
      eyebrow="FOCUS LAB"
      title="专注时钟与白噪音"
      badge="Web Audio"
      icon="focus-lab"
      tone="rose"
      href="focus-lab.html"
      label="打开专注白噪音钟 →"
      offset={0}
    >
      {"零外部音频文件，实时合成细雨、壁炉、松风与溪流，搭配时间戳校准番茄钟。"}
    </ToolShortcut>
  );
}

function GuestbookShortcut() {
  return (
    <ToolShortcut
      eyebrow="LOCAL NOTES"
      title="灵感草稿箱"
      badge="本地便签"
      icon="guestbook"
      tone="sand"
      href="guestbook.html"
      label="打开灵感草稿箱 →"
      offset={0}
    >
      {"随时记下未展开的想法、待办与摘录，支持快捷分类、置顶、原位编辑与 JSON 备份。"}
    </ToolShortcut>
  );
}

function ChristmasShortcut() {
  return (
    <ToolShortcut
      eyebrow="INTERACTIVE CANVAS"
      title="圣诞夜粒子树"
      badge="冬日特辑"
      icon="christmas"
      tone="pine"
      href="christmas.html"
      label="点亮圣诞树 →"
      offset={0}
    >
      {"可惯性旋转的 3D 粒子圣诞树，附带三层飘雪、纯代码八音盒与 1600×960 贺卡导出。"}
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
        <a href="#vault">
          {"本地数据保险箱 "}
          <span aria-hidden="true">{"↓"}</span>
        </a>
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
                "使用 React 与 Vite 组织多页入口，界面采用 JavaScript、TypeScript 与 CSS。内容维护在本地数据文件中，构建产物通过 GitHub Pages 发布，本机通过 HTTP 服务开发与预览。"
              }
            </dd>
          </div>
          {"\n          "}
          <div>
            <dt>{"字体与颜色"}</dt>
            <dd>
              {
                "标题优先使用本机宋体类衬线字体，正文使用中文无衬线字体。全站采用 #FAF9F7 晨光瓷白、#222222 墨色标题和薄荷、浅杏微光，玻璃表面使用细线边框。"
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
                "配色与季节偏好保存在当前浏览器，纸色与夜色偏好下均使用暖白外观。HTTP 本机预览或 HTTPS 访问完成缓存后，可浏览已缓存的页面并使用本地搜索；图片工坊的编解码器首次加载需要联网。"
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
        <WorkbenchHero />
        {"\n    "}
        <section className="workbench-tool-grid" aria-label="站内工具快捷入口">
          <ImageToolsShortcut />
          <FrameStudioShortcut />
          <ImageShortcut />
          <VideoShortcut />
          <OptimizerShortcut />
          <FocusLabShortcut />
          <GuestbookShortcut />
          <ChristmasShortcut />
        </section>
        {"\n\n    "}
        <LocalDataVault />
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
