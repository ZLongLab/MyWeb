import { detailHref, type Project } from "./home-data";
export default function ProductGlassCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className={"product-glass-card glass-card product-" + index}>
      <a className="product-copy" href={detailHref("project", project.id)}>
        <span className="product-number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{project.title}</h3>
        <div className="product-tags">
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{project.summary}</p>
        <span className="product-detail">探索作品 ↗</span>
      </a>
      {project.image && (
        <a
          className={
            "product-preview " + (index === 0 ? "home-shot-front" : "")
          }
          href={project.image.src}
          data-image-preview=""
          data-image-caption={project.image.caption || project.title}
          aria-label={project.title + " · 查看界面大图"}
        >
          <img
            src={project.image.src}
            alt={project.image.caption || project.title}
            width="960"
            height="600"
            loading="lazy"
          />
        </a>
      )}
    </article>
  );
}
