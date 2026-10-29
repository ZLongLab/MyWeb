export const pages = {
  "image-tools.html": {
    load: () => import("./ImageToolsPage.jsx"),
    page: "image-tools",
    room: "workbench",
  },
  "404.html": {
    load: () => import("./NotFoundPage.jsx"),
    page: "notfound",
    room: "notfound",
  },
  "about.html": {
    load: () => import("./AboutPage.jsx"),
    page: "about",
    room: "about",
  },
  "article.html": {
    load: () => import("./ArticlePage.jsx"),
    page: "article",
    room: "articles",
  },
  "articles.html": {
    load: () => import("./ArticlesPage.jsx"),
    page: "articles",
    room: "articles",
  },
  "colophon.html": {
    load: () => import("./ColophonPage.jsx"),
    page: "colophon",
    room: "colophon",
  },
  "guestbook.html": {
    load: () => import("./GuestbookPage.jsx"),
    page: "guestbook",
    room: "guestbook",
  },
  "image-prompts.html": {
    load: () => import("./ImageInspirationPage.jsx"),
    page: "image-prompts",
    room: "workbench",
  },
  "index.html": {
    load: () => import("./HomePage.jsx"),
    page: "home",
    room: "home",
  },
  "life.html": {
    load: () => import("./LifePage.jsx"),
    page: "life",
    room: "life",
  },
  "links.html": {
    load: () => import("./LinksPage.jsx"),
    page: "links",
    room: "links",
  },
  "now.html": { load: () => import("./NowPage.jsx"), page: "now", room: "now" },
  "project.html": {
    load: () => import("./ProjectPage.jsx"),
    page: "project",
    room: "projects",
  },
  "projects.html": {
    load: () => import("./ProjectsPage.jsx"),
    page: "projects",
    room: "projects",
  },
  "uses.html": {
    load: () => import("./UsesPage.jsx"),
    page: "uses",
    room: "uses",
  },
  "video-prompts.html": {
    load: () => import("./VideoStudioPage.jsx"),
    page: "video-prompts",
    room: "workbench",
  },
  "workbench.html": {
    load: () => import("./WorkbenchPage.jsx"),
    page: "workbench",
    room: "workbench",
  },
};
