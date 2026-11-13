import { site, projects, articles, house, workbench } from "../../data/site.js";
import { detailHref as navigationHref } from "../../lib/navigation.js";

export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  image?: { src: string; caption?: string };
}
export interface Article {
  id: string;
  title: string;
  date: string;
  summary: string;
  tags?: string[];
}
interface Day {
  date: string;
  count: number;
  level: number;
}
interface Snapshot {
  siteStarted: string;
  reviewedAt: string;
  statistics: { projects: number; articles: number };
  github: {
    login: string;
    total: number;
    from: string;
    to: string;
    weeks: { days: Day[] }[];
  };
}
const globals = window as unknown as {
  SITE_SNAPSHOT: Snapshot;
  SITE_LIFE: { reading: { title: string; note?: string }[] };
};
export const homeData = {
  site,
  projects: projects as Project[],
  articles: articles as Article[],
  house,
  workbench,
  snapshot: globals.SITE_SNAPSHOT,
  reading: globals.SITE_LIFE?.reading || [],
};
export function detailHref(kind: "project" | "article", id: string) {
  return navigationHref(kind === "project" ? "projects" : "articles", id);
}
