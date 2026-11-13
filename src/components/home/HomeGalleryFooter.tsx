import { homeData } from "./home-data";
export default function HomeGalleryFooter({ page }: { page?: string }) {
  const currentRoom =
    page === "project" ? "projects" : page === "article" ? "articles" : page;
  return (
    <footer className="gallery-footer">
      <div className="gallery-width gallery-footer-inner">
        <nav className="gallery-footer-nav" aria-label="房间平面图">
          {[0, 1, 2].map((column) => (
            <div key={column}>
              {homeData.house.rooms
                .filter((_: unknown, index: number) => index % 3 === column)
                .map((room: { id: string; title: string; href: string }) => (
                  <a
                    key={room.id}
                    href={room.href}
                    data-room={room.id}
                    aria-current={currentRoom === room.id ? "page" : undefined}
                  >
                    {room.title}
                  </a>
                ))}
            </div>
          ))}
        </nav>
        <div className="footer-thanks">
          <p>Thanks for visiting!</p>
          <a href="feed.xml">订阅 RSS ↗</a>
          <a
            href="https://github.com/ZLongLab"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
        <span className="gallery-watermark" aria-hidden="true">
          有间小站。
        </span>
      </div>
    </footer>
  );
}
