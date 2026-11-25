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

const INTERACTIVE_EDITIONS = [
  {
    href: "starlight-box.html",
    kicker: "WEB AUDIO + 3D ORBIT",
    title: "星轨八音盒",
    desc: "点亮 16 拍五声音阶星格即兴作曲，键盘 A–K 实时弹奏，3D 星环绽放声景粒子。",
    cta: "进入编曲台 →",
    tone: "nebula",
    mark: "✦",
  },
  {
    href: "fireworks.html",
    kicker: "PHYSICS + MIRROR LAKE",
    title: "夜空烟花湖",
    desc: "点击夜空升空 5 种真实物理形态烟花，湖面实时映出微光倒影，支持高清壁纸导出。",
    cta: "放一场烟花 →",
    tone: "lake",
    mark: "✧",
  },
  {
    href: "christmas.html",
    kicker: "WINTER CANVAS 3D",
    title: "圣诞夜 · 粒子树",
    desc: "拖动旋转 3D 粒子圣诞树，切换三层景深飘雪、钢片琴八音盒与定制贺卡导出。",
    cta: "点亮圣诞树 →",
    tone: "pine",
    mark: "❄",
  },
] as const;

function ChristmasSpotlight() {
  return (
    <section
      className="christmas-spotlight interactive-showcase"
      aria-labelledby="interactive-showcase-title"
    >
      <div className="interactive-showcase-head">
        <p className="christmas-spotlight-kicker">
          <span>✦ 声光互动特辑</span>
          <i aria-hidden="true">·</i>
          <span>INTERACTIVE CANVAS &amp; WEB AUDIO</span>
        </p>
        <h2 id="interactive-showcase-title">把声音与粒子，放进夜空里玩一会儿。</h2>
      </div>
      <div className="interactive-showcase-grid">
        {INTERACTIVE_EDITIONS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="interactive-edition-card"
            data-edition-tone={item.tone}
          >
            <div className="interactive-edition-top">
              <span className="interactive-edition-mark" aria-hidden="true">
                {item.mark}
              </span>
              <span className="interactive-edition-kicker">{item.kicker}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <span className="christmas-spotlight-cta">{item.cta}</span>
          </a>
        ))}
      </div>
    </section>
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
