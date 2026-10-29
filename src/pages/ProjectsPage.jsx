import ProjectCollection from "../components/ProjectCollection.jsx";
function PortfolioIntro() {
  return (
    <section className="portfolio-intro" aria-labelledby="portfolio-heading">
      {"\n      "}
      <div>
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true"></span>
          {" 作品 / WORK"}
        </p>
        <h1 id="portfolio-heading">
          {"做过的东西"}
          <span className="title-period">{"。"}</span>
        </h1>
        <p>{"本地工具、开源适配，以及这个小站。"}</p>
      </div>
      {"\n\n    "}
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <main className="container container-wide" id="main">
        {"\n    "}
        <PortfolioIntro />
        {"\n    "}
        <ProjectCollection />
        {"\n  "}
      </main>
    </>
  );
}
