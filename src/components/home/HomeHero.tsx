import PrismSphereCanvas from "./PrismSphereCanvas";
import { homeData } from "./home-data";
export default function HomeHero() {
  return (
    <section className="gallery-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 id="home-title">
          有间小站<span>。</span>
        </h1>
        <p className="hero-subtitle">一个关于创造、记录与生活留白的角落。</p>
        <div className="hero-chips">
          <span>LOCAL FIRST</span>
          <span>慢慢创造</span>
        </div>
        <p className="hero-intro">
          {homeData.site.bio}
          <br />
          这里放着正在打磨的作品，也留着一些日常的想法。
          <br />
          欢迎停一会儿，看看最近做了什么。
        </p>
        <a className="gallery-button" href="about.html">
          立即详情 <span>→</span>
        </a>
      </div>
      <PrismSphereCanvas />
    </section>
  );
}
