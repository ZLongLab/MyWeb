// Pure URL boundary shared by React components and the preserved navigation controller.
export function contextFor(section, context = {}) {
  const entries =
    section === "projects" ? window.SITE_PROJECTS : window.SITE_ARTICLES;
  const categories = entries.map((entry) => entry.category);
  const tags = entries.flatMap((entry) => entry.tags || []);
  return {
    category: categories.includes(context.category) ? context.category : "",
    q:
      section === "articles" && typeof context.q === "string"
        ? context.q.trim().slice(0, 100)
        : "",
    tag:
      section === "articles" && tags.includes(context.tag) ? context.tag : "",
    view:
      section === "articles" && ["time", "topics"].includes(context.view)
        ? context.view
        : "",
  };
}
export function listHref(section, context) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(contextFor(section, context)))
    if (value) params.set(key, value);
  return (
    (section === "projects" ? "projects.html" : "articles.html") +
    (params.size ? "?" + params : "")
  );
}
export function detailHref(section, id, context) {
  const tools = {
    "image-prompts": "image-prompts.html",
    "video-prompts": "video-prompts.html",
    "prompt-optimizer": "prompt-optimizer/",
  };
  if (section === "projects" && tools[id]) return tools[id];
  const params = new URLSearchParams({ id });
  for (const [key, value] of Object.entries(contextFor(section, context)))
    if (value) params.set(key, value);
  return (
    (section === "projects" ? "project.html" : "article.html") + "?" + params
  );
}
