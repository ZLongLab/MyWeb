import { detailHref } from "../lib/navigation.js";

export default function ProjectCard({ project, index, category }) {
  "use memo";
  return (
    <article
      className="portfolio-project"
      id={project.id}
      data-tone={["cool", "warm", "sand", "mist"][index % 4]}
      aria-labelledby={project.id + "-title"}
    >
      <div className="portfolio-content">
        <div className="portfolio-meta">
          <span className="portfolio-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="portfolio-category">{project.category}</span>
          <span className="portfolio-status">{project.status}</span>
        </div>
        <h2 className="portfolio-title" id={project.id + "-title"}>
          <a href={detailHref("projects", project.id, { category })}>
            {project.title}
            <span aria-hidden="true">→</span>
          </a>
        </h2>
        <p className="portfolio-summary">{project.summary}</p>
        <ul className="portfolio-tags" aria-label="项目技术与特点">
          {(project.tags || []).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
