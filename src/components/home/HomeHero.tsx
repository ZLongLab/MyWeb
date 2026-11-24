import PrismSphereCanvas from "./PrismSphereCanvas";
import { homeData } from "./home-data";

function shanghaiMoment(): string {
  try {
    const hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: homeData.house.timeZone || "Asia/Shanghai",
        hour: "2-digit",
        hourCycle: "h23",
      }).format(new Date()),
    );
    if (hour >= 6 && hour < 12) return "早安 · 上海 · 清晨整理想法的时段";
    if (hour >= 12 && hour < 18) return "午安 · 上海 · 写代码与做小工具的时段";
    if (hour >= 18 && hour < 23) return "傍晚好 · 上海 · 放慢节奏、记录灵感的时段";
    return "夜深了 · 上海 · 这间小站留着一盏暖灯";
  } catch {
    return "欢迎来坐 · 慢慢创造与记录的小站";
  }
}

export default function HomeHero() {
  const projectCount = homeData.projects.length;
  const articleCount = homeData.articles.length;
  return (
    <section className="gallery-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="hero-status-pill">
          <i aria-hidden="true" />
          <span>{shanghaiMoment()}</span>
        </p>
        <h1 id="home-title">
          有间小站<span>。</span>
        </h1>
        <p className="hero-subtitle">一个关于创造、记录与生活留白的角落。</p>
        <div className="hero-chips">
          <span className="chip-mint">LOCAL FIRST</span>
          <span className="chip-warm">慢慢创造</span>
          <span className="chip-mist">
            {projectCount} 件作品 · {articleCount} 篇手记
          </span>
        </div>
        <p className="hero-intro">
          {homeData.site.bio}
          <br />
          这里放着正在打磨的作品，也留着一些日常的想法。
          <br />
          欢迎停一会儿，看看最近做了什么。
        </p>
        <div className="hero-actions">
          <a className="gallery-button gallery-button-primary" href="#works">
            浏览作品 <span aria-hidden="true">↓</span>
          </a>
          <a
            className="gallery-button gallery-button-ghost"
            href="#online-tools"
          >
            在线工具箱 <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <PrismSphereCanvas />
    </section>
  );
}
