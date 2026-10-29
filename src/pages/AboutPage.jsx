function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-title">
      <div className="about-intro">
        {"\n      "}
        <div className="about-hero-meta">
          <p className="eyebrow">{"关于 / ABOUT"}</p>
          <p className="about-creator-status">
            <span aria-hidden="true">{"📍"}</span>
            {" 正在用代码记录想法"}
          </p>
        </div>
        {"\n      "}
        <h1 id="about-title">
          <span>{"很高兴，"}</span>
          <span className="about-title-rest">
            {"在这里遇见你"}
            <span className="title-period">{"。"}</span>
          </span>
        </h1>
        {"\n      "}
        <blockquote className="about-quote">
          <p className="about-name">
            <span data-site-name="">{"ZL"}</span>
            <span className="site-role" data-site-role="">
              {"计算机学生"}
            </span>
          </p>
          <p className="large-copy" data-site-bio="">
            {"做一些实用的小工具，也记录把想法做出来的过程。"}
          </p>
        </blockquote>
        {"\n    "}
      </div>
    </section>
  );
}

function AboutStory() {
  return (
    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-story-heading">
        <p className="about-section-index">{"01 / MOTIVE"}</p>
        <h2 id="about-story-title">{"为什么有这个小站"}</h2>
      </div>
      <div className="prose">
        <p>
          {"我是 ZL，一名计算机学生。这个小站收着做过的工具、开源适配，也留下"}
          <mark className="about-inline-highlight">{"动手过程中的思考"}</mark>
          {"。"}
        </p>
        <p>
          {
            "从本地资料检索到文档整理，我希望把具体的问题做成能用的小工具。这里先从"
          }
          <span className="about-inline-emphasis">{"作品和文章"}</span>
          {"开始，把实现方法、取舍和还没解决的地方慢慢写清楚。"}
        </p>
        <p>
          <a className="text-link" href="workbench.html">
            {"看看当前的项目与工作台 →"}
          </a>
        </p>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      className="contact-section about-contact"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="about-contact-copy">
        <p className="about-section-index">{"02 / CONTACT"}</p>
        <h2 id="contact-heading">{"联系我"}</h2>
        <p data-contact-description="">{"欢迎交流项目与想法。"}</p>
      </div>
      <div className="about-contact-actions">
        <span className="contact-pending" data-contact-pending="">
          {"邮箱暂未公开"}
        </span>
        <a
          className="button button-primary"
          href="#contact"
          data-email-link=""
          hidden={true}
        >
          {"发送邮件 "}
          <span aria-hidden="true">{"↗"}</span>
        </a>
        <div
          className="about-contact-socials"
          data-social-links=""
          data-social-scope="contact"
          role="group"
          aria-label="社交链接，在新标签页打开"
        ></div>
      </div>
    </section>
  );
}

function AboutTimeline() {
  return (
    <section
      className="about-timeline"
      id="about-timeline"
      aria-labelledby="about-timeline-title"
      hidden={true}
    >
      <p className="about-section-index">{"03 / GROWING HERE"}</p>
      <h2 id="about-timeline-title">{"小站生长的足迹"}</h2>
      <ol></ol>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <main className="container about-page" id="main">
        {"\n    "}
        <AboutHero />
        {"\n    "}
        <AboutStory />
        {"\n    "}
        <Contact />
        {"\n    "}
        <AboutTimeline />
        {"\n  "}
      </main>
    </>
  );
}
