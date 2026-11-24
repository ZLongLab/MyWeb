import HomeHero from "./HomeHero";
import ProductGlassCard from "./ProductGlassCard";
import IdeaNetworkGraph from "./IdeaNetworkGraph";
import GitHubActivityCard from "./GitHubActivityCard";
import ReadingNotesList from "./ReadingNotesList";
import { homeData } from "./home-data";
const ONLINE_TOOLS = [
  {
    href: "image-tools.html",
    title: "图片工坊",
    badge: "WebP / AVIF",
    icon: "◧",
    tone: "mint",
    desc: "本地批量压缩与格式转换，不上传原图。",
  },
  {
    href: "frame-studio.html",
    title: "画框工坊",
    badge: "Ctrl+V 即用",
    icon: "▣",
    tone: "sage",
    desc: "粘贴作品截图，一键套上画廊底色与圆角阴影。",
  },
  {
    href: "image-prompts.html",
    title: "图片灵感室",
    badge: "20 个起点",
    icon: "◐",
    tone: "warm",
    desc: "按人物、产品、海报与构图挑选提示词。",
  },
  {
    href: "video-prompts.html",
    title: "视频灵感室",
    badge: "15 个模板",
    icon: "▷",
    tone: "mist",
    desc: "多平台分镜模板与摄影镜头词库。",
  },
  {
    href: "prompt-optimizer/",
    title: "提示词优化器",
    badge: "自托管",
    icon: "✦",
    tone: "plum",
    desc: "接入自己的模型，对比并精修提示词。",
  },
  {
    href: "focus-lab.html",
    title: "专注白噪音",
    badge: "Web Audio",
    icon: "◌",
    tone: "rose",
    desc: "实时合成细雨、壁炉与微风，配极简番茄钟。",
  },
] as const;

function ChristmasSpotlight() {
  return (
    <a className="christmas-spotlight" href="christmas.html">
      <div className="christmas-spotlight-copy">
        <p className="christmas-spotlight-kicker">
          <span>✦ 冬日限定特辑</span>
          <i aria-hidden="true">·</i>
          <span>INTERACTIVE CANVAS</span>
        </p>
        <h2>圣诞夜 · 旋转粒子圣诞树</h2>
        <p>
          拖动旋转立体粒子圣诞树，点亮盘旋的光带，换一串暖金、冰蓝或玫瑰色的冬夜灯火。
        </p>
      </div>
      <div className="christmas-spotlight-visual">
        <svg viewBox="0 0 84 90" aria-hidden="true">
          <polygon
            points="42,7 45,16 54,16 47,22 49,31 42,25 35,31 37,22 30,16 39,16"
            fill="#f5d78e"
          />
          <circle cx="42" cy="36" r="2.3" fill="#ffe7ab" />
          <circle cx="34" cy="46" r="2.1" fill="#9bd7ff" />
          <circle cx="50" cy="47" r="2.3" fill="#f7c77c" />
          <circle cx="29" cy="57" r="2.1" fill="#f4a8bc" />
          <circle cx="42" cy="56" r="2.5" fill="#ffe7ab" />
          <circle cx="55" cy="58" r="2.1" fill="#9bd7ff" />
          <circle cx="24" cy="68" r="2.3" fill="#ffe7ab" />
          <circle cx="36" cy="69" r="2.1" fill="#f7c77c" />
          <circle cx="48" cy="68" r="2.4" fill="#f4a8bc" />
          <circle cx="60" cy="69" r="2.1" fill="#ffe7ab" />
          <rect x="39" y="75" width="6" height="9" rx="1.5" fill="#a28058" />
        </svg>
        <span className="christmas-spotlight-cta">点亮圣诞树 →</span>
      </div>
    </a>
  );
}

export default function HomeGallery() {
  const featured = ["recallai", "document-assistant"].flatMap((id) =>
    homeData.projects.filter((project) => project.id === id),
  );
  return (
    <>
      <main className="morning-gallery gallery-width" id="main">
        <HomeHero />
        <section id="works" className="gallery-products">
          <div className="gallery-section-heading">
            <h2>
              <i className="section-dot dot-mint" aria-hidden="true" />
              制作的产品
            </h2>
            <a href="projects.html">全部作品 ↗</a>
          </div>
          <div className="product-glass-grid">
            {featured.map((project, index) => (
              <ProductGlassCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>
        <section id="online-tools" className="gallery-tools">
          <div className="gallery-section-heading">
            <h2>
              <i className="section-dot dot-warm" aria-hidden="true" />
              在线小工具
            </h2>
            <a href="workbench.html">前往工作台 ↗</a>
          </div>
          <div className="gallery-tools-grid">
            {ONLINE_TOOLS.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="glass-card gallery-tool-card"
                data-tool-tone={tool.tone}
              >
                <div className="gallery-tool-head">
                  <div className="gallery-tool-title">
                    <i className="gallery-tool-icon" aria-hidden="true">
                      {tool.icon}
                    </i>
                    <h3>{tool.title}</h3>
                  </div>
                  <span>{tool.badge}</span>
                </div>
                <p>{tool.desc}</p>
                <span className="gallery-tool-go" aria-hidden="true">
                  打开工具 ↗
                </span>
              </a>
            ))}
          </div>
        </section>
        <ChristmasSpotlight />
        <div className="gallery-bento">
          <IdeaNetworkGraph />
          <GitHubActivityCard />
        </div>
        <ReadingNotesList />
        <aside className="gallery-letter-card" aria-label="小站寄语">
          <p className="gallery-letter-kicker">POSTSCRIPT · 寄语信笺</p>
          <blockquote className="gallery-quote">
            <span aria-hidden="true">“</span>
            <p>
              起风了，唯有努力生存。
              <br />
              把想法做出来，也给生活留一点空隙。
            </p>
            <span aria-hidden="true">”</span>
          </blockquote>
          <div className="gallery-letter-foot">
            <span>— {homeData.site.name} · 有间小站</span>
            <a href="guestbook.html">留一张随手便签 →</a>
          </div>
        </aside>
      </main>
    </>
  );
}
