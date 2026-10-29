import { useEffect, useRef, useState } from "react";
import SiteMark from "./SiteMark.jsx";
import { site } from "../data/site.js";

export default function Navbar({ page }) {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const nav = useRef(null);
  const wide = ["home", "projects", "project"].includes(page);
  const active =
    page === "home"
      ? "index"
      : page === "project"
        ? "projects"
        : page === "article"
          ? "articles"
          : page;
  useEffect(() => {
    const close = () => setOpen(false);
    const escape = (event) => {
      if (event.key === "Escape" && open) {
        close();
        button.current?.focus();
      }
    };
    const outside = (event) => {
      if (
        !nav.current?.contains(event.target) &&
        !button.current?.contains(event.target)
      )
        close();
    };
    const media = matchMedia("(min-width: 640px)");
    const desktop = () => {
      if (media.matches) close();
    };
    document.addEventListener("myweb:close-menu", close);
    document.addEventListener("keydown", escape);
    document.addEventListener("click", outside);
    media.addEventListener("change", desktop);
    return () => {
      document.removeEventListener("myweb:close-menu", close);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("click", outside);
      media.removeEventListener("change", desktop);
    };
  }, [open]);
  return (
    <header
      className={"site-header container" + (wide ? " container-wide" : "")}
    >
      <a className="brand" href="index.html" aria-label="返回首页">
        <SiteMark />
        <span data-site-title>{site.siteTitle}</span>
      </a>
      {page !== "notfound" && (
        <>
          <button
            ref={button}
            className="menu-toggle"
            type="button"
            data-menu-toggle
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? "关闭导航菜单" : "打开导航菜单"}
            onClick={() => setOpen(!open)}
          >
            <span>菜单</span>
            <span className="menu-lines" aria-hidden="true" />
          </button>
          <nav
            ref={nav}
            className={"site-nav" + (open ? " is-open" : "")}
            id="site-nav"
            aria-label="主要导航"
            onClick={(event) => {
              if (event.target.closest("a")) setOpen(false);
            }}
          >
            {[
              ["index", "首页"],
              ["projects", "作品"],
              ["articles", "文章"],
              ["about", "关于"],
            ].map(([slug, label]) => (
              <a
                key={slug}
                href={slug + ".html"}
                aria-current={active === slug ? "page" : undefined}
              >
                {label}
              </a>
            ))}
            <a
              className="nav-contact"
              href="about.html#contact"
              data-contact-link
            >
              联系我 <span aria-hidden="true">→</span>
            </a>
          </nav>
        </>
      )}
    </header>
  );
}
