import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard.jsx";
import { detailHref, listHref } from "../lib/navigation.js";
import { projects } from "../data/site.js";
const categories = [
  "全部",
  ...new Set(projects.map((project) => project.category)),
];
function readCategory() {
  const value = new URLSearchParams(location.search).get("category");
  return categories.includes(value) ? value : "全部";
}
export default function ProjectCollection() {
  "use memo";
  const [category, setCategory] = useState(readCategory);
  const selected = projects.filter(
    (project) => category === "全部" || project.category === category,
  );
  useEffect(() => {
    function followLegacyLink() {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      if (projects.some((project) => project.id === id))
        location.replace(
          detailHref("projects", id, { category: readCategory() }),
        );
    }
    const pop = () => {
      setCategory(readCategory());
      followLegacyLink();
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("hashchange", followLegacyLink);
    followLegacyLink();
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("hashchange", followLegacyLink);
    };
  }, []);
  useEffect(() => {
    window.SITE_MOTION?.reveal(document.querySelector("[data-project-list]"));
  }, [category]);
  function choose(value) {
    setCategory(value);
    try {
      history.replaceState(
        history.state || {},
        "",
        new URL(listHref("projects", { category: value }), location.href),
      );
    } catch {
      /* Filtering remains available in restricted browsers. */
    }
  }
  return (
    <section className="portfolio-collection" aria-label="作品列表">
      <div className="portfolio-toolbar">
        <div
          className="portfolio-filters"
          role="group"
          aria-label="按作品分类筛选"
          data-project-filters
        >
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              data-category={value}
              aria-pressed={value === category}
              onClick={() => choose(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <p
          className="portfolio-count visually-hidden"
          data-project-count
          aria-live="polite"
          aria-atomic="true"
        >
          共 {selected.length} 件作品
          {category === "全部" ? "" : " · " + category}
        </p>
      </div>
      <div data-project-list>
        {selected.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={projects.indexOf(project)}
            category={category}
          />
        ))}
      </div>
    </section>
  );
}
