import TopAudioCapsule from "./TopAudioCapsule";
import HomeHero from "./HomeHero";
import ProductGlassCard from "./ProductGlassCard";
import IdeaNetworkGraph from "./IdeaNetworkGraph";
import GitHubActivityCard from "./GitHubActivityCard";
import ReadingNotesList from "./ReadingNotesList";
import HomeGalleryFooter from "./HomeGalleryFooter";
import { homeData } from "./home-data";
import "../../styles/home-gallery.css";
export default function HomeGallery() {
  const featured = ["recallai", "document-assistant"].flatMap((id) =>
    homeData.projects.filter((project) => project.id === id),
  );
  return (
    <>
      <TopAudioCapsule />
      <main className="morning-gallery gallery-width" id="main">
        <HomeHero />
        <section id="works" className="gallery-products">
          <div className="gallery-section-heading">
            <h2>制作的产品</h2>
            <a href="projects.html">全部作品 ↗</a>
          </div>
          <div className="product-glass-grid">
            {featured.map((project, index) => (
              <ProductGlassCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>
        <div className="gallery-bento">
          <IdeaNetworkGraph />
          <GitHubActivityCard />
        </div>
        <ReadingNotesList />
        <blockquote className="gallery-quote">
          <span aria-hidden="true">“</span>
          <p>
            起风了，唯有努力生存。
            <br />
            把想法做出来，也给生活留一点空隙。
          </p>
          <span aria-hidden="true">”</span>
        </blockquote>
      </main>
      <HomeGalleryFooter />
    </>
  );
}
