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
            "使用 React 与 Vite 组织 17 个多页入口，界面代码采用 JavaScript 与 TypeScript，样式使用 CSS。文章、作品与近况维护在本地数据文件中，构建产物通过 GitHub Pages 提供静态访问。"
          }
        </p>
        <p>
          {
            "主站的字体、图片与脚本由本站静态资源提供。文章统计由本地脚本生成，GitHub 活动使用经过核对的公开日历快照。图片工坊通过 jSquash / Squoosh 在浏览器内处理图片，提示词工具的收藏与草稿由各工具在本机保存。"
          }
        </p>
        <p>
          {
            "本地开发运行 npm run dev，发布前运行 npm run verify，使用 npm run build:pages 生成 dist 发布目录。本机通过 HTTP 服务预览，线上通过 HTTPS 访问；首次成功缓存后可浏览已缓存的页面和脚本，图片编解码器在首次加载时需要联网。"
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
            "标题优先使用本机 Songti SC、STSong 或宋体，正文使用 Noto Sans SC 与系统中文无衬线字体，小字使用 Cascadia Code / Consolas。字体通过本机字体栈回退。"
          }
        </p>
        <p>
          {
            "主站 17 页统一使用暖白纸张、墨色标题、薄荷与香槟微光，以及半透明玻璃表面。顶栏的配色偏好与工作台的季节选择保存在当前浏览器，纸色与夜色偏好下均呈现暖白外观。"
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
        <p>
          视频灵感室的内容来源按固定快照登记：LearnPrompt 策展内容 CC BY
          4.0、代码 MIT；marsoyang1 未提供明确许可，只参考字段结构；Yuyyxz 与
          rich5000 为 MIT；VideoPrompts.tools 仅参考 CC BY 4.0
          模板库的字段维度。平台方言另参考 ZhongBiao-zheng /
          video-prompt（MIT），只借简派与繁派划分方法，档案及文字由本站原创，不保证模型效果。本站示例原创，不搬运案例提示词或媒体。
          <a href="video-prompts.html#video-sources">
            阅读逐项来源与改写说明 ↗
          </a>
          ，<a href="THIRD-PARTY-LICENSES.txt">查看第三方许可登记 ↗</a>。
        </p>
      </div>
    </section>
  );
}

function ImageToolsNote() {
  return (
    <section className="room-section" id="image-tools">
      <div className="room-section-head">
        <p className="room-kicker">IMAGE WORKSHOP</p>
        <h2>图片工坊的使用边界</h2>
      </div>
      <div className="room-section-body">
        <p>
          <a href="image-tools.html">打开图片工坊 →</a>{" "}
          批量调整图片格式与宽度，编解码来自 jSquash / Squoosh；PNG 使用浏览器
          Canvas。全程在本地处理，不上传图片。
        </p>
        <p>
          图片和结果只保留在当前页，刷新后需要重新选择。动画只处理首帧，JPEG
          透明区域填为白色，输出不保留原图附加元数据。
        </p>
        <p>
          页面壳与脚本可离线打开；较大的编解码器二进制不进入离线预缓存，首次转换或重新加载组件需要联网，不保证离线转换。AVIF
          编码较慢。
        </p>
        <p>
          <a href="THIRD-PARTY-LICENSES.txt">查看编解码器开源许可证 ↗</a>
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
        <ImageToolsNote />
        <Changelog />
        {"\n    "}
        {"\n  "}
      </main>
    </>
  );
}
