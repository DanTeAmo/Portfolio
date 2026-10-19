import { useRef, useState, type MouseEvent } from "react";
import {
  credentials,
  project,
  screenshots,
  skills,
  collection,
} from "./content";
import { ImageViewer, type ViewerHandle } from "./ImageViewer";
import { SiteHeader } from "./SiteHeader";

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Screenshot({
  index,
  className = "",
  eager = false,
}: {
  index: number;
  className?: string;
  eager?: boolean;
}) {
  const shot = screenshots[index];
  return (
    <img
      className={className}
      src={shot.src.replace("-original.png", "-1280.webp")}
      srcSet={`${shot.src.replace("-original.png", "-640.webp")} 640w, ${shot.src.replace("-original.png", "-1280.webp")} 1280w, ${shot.src.replace("-original.png", ".webp")} ${shot.width}w`}
      sizes="(max-width: 650px) calc(100vw - 40px), (max-width: 1500px) 58vw, 840px"
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function FeaturedProject({
  onOpen,
}: {
  onOpen: (event: MouseEvent<HTMLAnchorElement>, index: number) => void;
}) {
  const [slide, setSlide] = useState(0);
  const shot = screenshots[slide];
  return (
    <article className="ep-feature">
      <div className="ep-project-head">
        <h2 id="projects-title" tabIndex={-1}>
          Selected work
        </h2>
        <span>01 / INDEPENDENT PROJECT</span>
      </div>
      <div className="ep-project-visual" data-slide={slide}>
        <a
          className="ep-image-link"
          href={shot.src}
          aria-haspopup="dialog"
          aria-label={`Open image: ${shot.caption.toLowerCase()}`}
          onClick={(event) => onOpen(event, slide)}
        >
          <Screenshot index={slide} className="ep-main-screen" eager />
          <span className="ep-enlarge">
            View image <Arrow />
          </span>
        </a>
        <div className="ep-slide-control">
          <span className="ep-slide-count" aria-live="polite">
            {String(slide + 1).padStart(2, "0")} / 03
            <span className="sr-only"> · {shot.caption}</span>
          </span>
          <button
            type="button"
            className="ep-slide-next"
            aria-label="Next ASOS project screenshot"
            onClick={() =>
              setSlide((value) => (value + 1) % screenshots.length)
            }
          >
            Next <Arrow />
          </button>
        </div>
      </div>
      <div className="ep-caption">
        <h3>ASOS-inspired e-commerce</h3>
        <div>
          <span>UI design / Frontend development</span>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Live demo <Arrow />
          </a>
        </div>
      </div>
      <details className="ep-notes">
        <summary>
          Project notes <span aria-hidden="true">+</span>
        </summary>
        <div className="ep-notes-body">
          <p>{project.overview}</p>
          <dl>
            <div>
              <dt>My contribution</dt>
              <dd>{project.contribution}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>
                {project.designTool} · {project.technologies}
              </dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{project.projectType}</dd>
            </div>
          </dl>
          <p className="ep-disclaimer">{project.disclaimer}</p>
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the repository <Arrow />
          </a>
        </div>
      </details>
    </article>
  );
}

function Collection() {
  return (
    <section className="ep-collection" aria-labelledby="collection-title">
      <div className="ep-collection-head">
        <h2 id="collection-title">More from the collection.</h2>
        <span>PROJECTS / STUDIES / EXPERIMENTS</span>
      </div>
      <div className="ep-pair">
        {collection.map((item) => (
          <article className="ep-slot ep-slot-narrow" key={item.id}>
            <a
              className="ep-portfolio-cover"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title} — view source on GitHub`}
            >
              <div className="ep-cover-label">
                <span>{item.number} / PERSONAL PROJECT</span>
                <Arrow />
              </div>
              <div className="ep-cover-name">
                Daniel
                <br />
                Rusnac.
              </div>
              <div className="ep-cover-bottom">
                <img
                  src="/assets/daniel-rusnac-portrait-480.webp"
                  alt=""
                  width="1093"
                  height="1439"
                  loading="lazy"
                />
                <span>
                  DESIGN /<br />
                  DEVELOPMENT /<br />
                  SECURITY
                </span>
              </div>
            </a>
            <div className="ep-caption">
              <h3>{item.title}</h3>
              <div>
                <span>{item.role}</span>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Source <Arrow />
                </a>
              </div>
            </div>
          </article>
        ))}
        <div className="ep-collection-invitation">
          <p className="ep-label">AN OPEN-ENDED COLLECTION</p>
          <h3>
            There’s always
            <br />a next chapter.
          </h3>
          <p>
            Explore the repositories behind my work, and follow the collection
            as it grows.
          </p>
          <a
            className="ep-text-link"
            href="https://github.com/DanTeAmo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore my GitHub <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function BehindTheWork({
  onOpen,
}: {
  onOpen: (event: MouseEvent<HTMLAnchorElement>, index: number) => void;
}) {
  return (
    <section id="process" className="ep-dark" aria-labelledby="process-title">
      <div className="ep-dark-heading">
        <span className="ep-label">BEHIND THE WORK</span>
        <h2 id="process-title" tabIndex={-1}>
          From the interface
          <br />
          to the interaction.
        </h2>
        <p>
          I’m learning through making: designing interfaces, building them and
          understanding the systems that power them.
        </p>
      </div>
      <div className="ep-process-grid">
        <figure className="ep-process-primary">
          <a
            href={screenshots[1].src}
            aria-haspopup="dialog"
            aria-label="Open image: product cards"
            onClick={(event) => onOpen(event, 1)}
          >
            <Screenshot index={1} />
          </a>
          <figcaption>
            <span>01 / INTERFACE</span>
            <span>ASOS-inspired personal project</span>
          </figcaption>
        </figure>
        <div className="ep-process-copy">
          <h3>The details matter.</h3>
          <p>
            Product collections, search, product dialogs, saved items and a
            shopping bag — brought together in one responsive frontend.
          </p>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Try the live project <Arrow />
          </a>
          <details className="ep-feature-list">
            <summary>
              Explore the features <span aria-hidden="true">+</span>
            </summary>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </details>
        </div>
        <figure className="ep-process-secondary">
          <a
            href={screenshots[2].src}
            aria-haspopup="dialog"
            aria-label="Open image: brands and footer"
            onClick={(event) => onOpen(event, 2)}
          >
            <Screenshot index={2} />
          </a>
          <figcaption>02 / CONSISTENCY ACROSS THE EXPERIENCE</figcaption>
        </figure>
      </div>
      <section id="about" className="ep-profile" aria-labelledby="about-title">
        <div>
          <span className="ep-label">PROFILE / CURRENT CHAPTER</span>
          <h2 id="about-title" tabIndex={-1}>
            Curiosity.
            <br />
            Practice.
            <br />
            Progress.
          </h2>
          <a
            href="/daniel-rusnac-resume.pdf"
            download="Daniel-Rusnac-Resume.pdf"
          >
            Download résumé <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="ep-profile-info">
          <p>
            I’m Daniel Rusnac, an Information Security student at the Technical
            University of Moldova. My interests span full-stack development,
            cybersecurity and digital design.
          </p>
          <dl id="education">
            <div>
              <dt>EDUCATION</dt>
              <dd>
                <strong>Information Security</strong>
                <span>
                  Technical University of Moldova
                  <br />
                  Faculty of Computers, Informatics and Microelectronics (FCIM)
                  <br />
                  2026 — Present
                </span>
              </dd>
            </div>
            <div>
              <dt>CREDENTIALS</dt>
              <dd>
                {credentials.map((cert) => (
                  <div className="ep-credential" key={cert.subject}>
                    <a
                      href={cert.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View certificate: ${cert.subject} (PDF)`}
                    >
                      IT Specialist · {cert.subject} <Arrow />
                    </a>
                    <span>
                      Certiport · <time dateTime={cert.date}>{cert.label}</time>
                    </span>
                  </div>
                ))}
              </dd>
            </div>
          </dl>
          <details id="skills" className="ep-skills">
            <summary>
              Languages &amp; tools <span aria-hidden="true">+</span>
            </summary>
            <dl>
              {skills.map(([label, values]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{values}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </section>
    </section>
  );
}

export function PortfolioPage() {
  const viewer = useRef<ViewerHandle>(null);
  function openImage(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    viewer.current?.open(index, event.currentTarget);
  }
  return (
    <div id="ep-next">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <div className="ep-page">
          <section id="home" className="ep-intro" aria-labelledby="hero-title">
            <div className="ep-kicker">
              <span>PERSONAL PORTFOLIO</span>
              <span>DEVELOPMENT / SECURITY / DESIGN</span>
            </div>
            <h1 id="hero-title" tabIndex={-1}>
              Daniel Rusnac.
            </h1>
            <div className="ep-deck">
              <p>
                Curious about how things work.
                <br />
                Focused on how to build them.
              </p>
              <div>
                Information Security student
                <br />
                Technical University of Moldova
              </div>
            </div>
          </section>
          <section
            id="projects"
            className="ep-opening"
            aria-labelledby="projects-title"
          >
            <div className="ep-author">
              <figure>
                <img
                  src="/assets/daniel-rusnac-portrait-820.webp"
                  srcSet="/assets/daniel-rusnac-portrait-480.webp 480w, /assets/daniel-rusnac-portrait-820.webp 820w, /assets/daniel-rusnac-portrait.webp 1093w"
                  sizes="(max-width: 650px) 38vw, (max-width: 1500px) 30vw, 430px"
                  alt="Portrait of Daniel Rusnac"
                  width="1093"
                  height="1439"
                  fetchPriority="high"
                  decoding="async"
                />
                <figcaption>
                  <span>THE PERSON BEHIND THE WORK</span>
                  <span>MD</span>
                </figcaption>
              </figure>
              <p>
                I explore the connections between digital design, software
                development and information security.
              </p>
              <a href="#about" className="ep-text-link">
                A little about me <Arrow />
              </a>
            </div>
            <FeaturedProject onOpen={openImage} />
          </section>
          <Collection />
          <section className="ep-statement" aria-label="Personal statement">
            <span className="ep-label">A WORK IN PROGRESS, BY DESIGN.</span>
            <p>
              <span>I’m exploring how digital</span> experiences look, work and
              stay secure.
            </p>
            <a href="#process" className="ep-text-link">
              Behind the work <Arrow />
            </a>
          </section>
        </div>
        <BehindTheWork onOpen={openImage} />
        <ImageViewer ref={viewer} />
      </main>
      <footer id="contact" className="ep-footer">
        <div className="ep-footer-inner">
          <div className="ep-footer-top">
            <span className="ep-label">A CONVERSATION STARTS HERE.</span>
            <span>DESIGN / DEVELOPMENT / NEW IDEAS</span>
          </div>
          <h2 id="contact-title" tabIndex={-1} className="sr-only">
            Contact Daniel Rusnac
          </h2>
          <a href="mailto:rusnacdanieal2007@gmail.com" className="ep-hello">
            Let’s talk
            <Arrow />
          </a>
          <a className="ep-email" href="mailto:rusnacdanieal2007@gmail.com">
            rusnacdanieal2007@gmail.com
          </a>
          <div className="ep-footer-bottom">
            <span>Daniel Rusnac.</span>
            <div>
              <a
                href="https://github.com/DanTeAmo"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <Arrow />
              </a>
              <a href="#home">Back to top ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
