import { house, site, workbench } from "../data/site.js";

export default function Footer({ page }) {
  if (page === "notfound")
    return (
      <footer className="container lost-footer">
        <div className="footer-inner">有间小站 · 给下次来，留一扇门。</div>
      </footer>
    );
  const room =
    page === "project" ? "projects" : page === "article" ? "articles" : page;
  const wide = ["home", "projects", "project"].includes(page);
  return (
    <footer className="site-footer house-footer">
      <div
        className={
          "footer-inner house-footer-inner container" +
          (wide ? " container-wide" : "")
        }
      >
        <div className="house-footer-top">
          <a className="footer-brand" href="index.html">
            {site.siteTitle}
          </a>
          <p className="house-footer-caption">
            一所放作品、手记，也给生活留位置的小房子。
          </p>
        </div>
        <nav className="house-floorplan" aria-label="房间平面图">
          {house.rooms.map((entry, index) => (
            <a
              key={entry.id}
              className="room-door"
              href={entry.href}
              data-room={entry.id}
              aria-current={entry.id === room ? "page" : undefined}
            >
              <span className="room-door-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="room-door-name">
                {entry.name + " / " + entry.title}
              </span>
              <span className="room-door-description">{entry.description}</span>
            </a>
          ))}
        </nav>
        <div className="house-footer-bottom">
          <p className="house-footer-meta">
            {"本站共 " +
              house.rooms.length +
              " 间房 · 上次修缮 " +
              (workbench.updated || house.updated)}
          </p>
          <div className="house-footer-links">
            <a href="about.html">关于 ZL</a>
            <a
              href="https://github.com/ZLongLab"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a href="feed.xml">订阅</a>
            <a href="#main">回到顶部 ↑</a>
          </div>
        </div>
        <div className="house-footer-wordmark" aria-hidden="true">
          有间小站。
        </div>
      </div>
    </footer>
  );
}
