import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  about,
  credentials,
  navigation,
  project,
  screenshots,
  skills,
} from "./content";
import { ImageViewer, type ViewerHandle } from "./ImageViewer";

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Label({ number, children }: { number: string; children: ReactNode }) {
  return (
    <p className="section-label">
      <span aria-hidden="true">{number} / </span>
      {children}
    </p>
  );
}
function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLElement>(null);
  const wordmark = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (mq.matches) {
        if (document.activeElement === menu.current) wordmark.current?.focus();
        setOpen(false);
      }
    };
    mq.addEventListener("change", resize);
    return () => mq.removeEventListener("change", resize);
  }, []);
  const links = navigation.map((item) => (
    <a
      key={item}
      href={`#${item.toLowerCase()}`}
      onClick={(event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        setOpen(false);
        history.pushState(null, "", `#${item.toLowerCase()}`);
        document
          .querySelector<HTMLElement>(`#${item.toLowerCase()} h2`)
          ?.focus({ preventScroll: true });
        document.getElementById(item.toLowerCase())?.scrollIntoView();
      }}
    >
      {item}
    </a>
  ));
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menu.current?.focus();
        }
      }}
    >
      <div className="container header-inner">
        <a ref={wordmark} className="wordmark" href="#home">
          Daniel Rusnac.
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {links}
        </nav>
        <details
          className="mobile-navigation"
          open={open}
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary
            ref={menu}
            className="menu-toggle"
            aria-controls="navigation"
          >
            {open ? "Close" : "Menu"}{" "}
            <span aria-hidden="true">{open ? "−" : "+"}</span>
          </summary>
          <nav id="navigation" aria-label="Main navigation">
            {links}
          </nav>
        </details>
      </div>
    </header>
  );
}
function EditorialSection({
  id,
  number,
  label,
  title,
  children,
  className = "",
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`editorial section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <Label number={number}>{label}</Label>
      <div className="section-main">
        <h2 tabIndex={-1} id={`${id}-title`}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          IT portfolio / Development · Security · Design
        </p>
        <h1 id="hero-title" tabIndex={-1}>
          Daniel
          <br />
          Rusnac<span className="accent">.</span>
        </h1>
        <p className="hero-lead">
          Information Security student exploring full-stack development,
          cybersecurity, and digital design.
        </p>
        <p className="hero-intro">
          From designing interfaces in Figma to building interactive web
          applications, I'm developing my skills through hands-on projects and
          continuous learning.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            View my work <Arrow />
          </a>
          <a className="text-link" href="#contact">
            Get in touch <Arrow />
          </a>
        </div>
      </div>
      <img
        className="portrait"
        src="/assets/daniel-rusnac-portrait-820.webp"
        srcSet="/assets/daniel-rusnac-portrait-480.webp 480w, /assets/daniel-rusnac-portrait-820.webp 820w, /assets/daniel-rusnac-portrait.webp 1093w"
        sizes="(max-width: 767px) 216px, (max-width: 1023px) 256px, 410px"
        width="1093"
        height="1439"
        alt="Portrait of Daniel Rusnac"
        decoding="async"
      />
    </section>
  );
}
function About() {
  return (
    <section
      id="about"
      className="editorial section about"
      aria-labelledby="about-title"
    >
      <Label number="02">About me</Label>
      <div className="section-main">
        <h2 tabIndex={-1} id="about-title">
          Curious about how things work. Focused on how to build them.
        </h2>
        <div className="prose">
          {about.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <dl className="about-facts">
          <div>
            <dt>Current Focus</dt>
            <dd>Software Development &amp; Information Security</dd>
          </div>
          <div>
            <dt>University</dt>
            <dd>Technical University of Moldova</dd>
          </div>
        </dl>
      </div>
      <div className="interests">
        <p className="small-label">Interests</p>
        <p>Full-Stack Development / Cybersecurity / UI/UX Design</p>
      </div>
    </section>
  );
}
function Skills() {
  return (
    <EditorialSection
      id="skills"
      number="03"
      label="Skills & technologies"
      title="Languages & tools."
      className="skills"
    >
      <dl className="skill-list">
        {skills.map(([label, values]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{values}</dd>
          </div>
        ))}
      </dl>
    </EditorialSection>
  );
}
function SelectedProjects() {
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
    <section
      id="projects"
      className="section projects"
      aria-labelledby="projects-title"
    >
      <div className="editorial">
        <Label number="04">Selected projects</Label>
        <div className="section-main">
          <h2 id="projects-title" tabIndex={-1}>
            From concept to implementation.
          </h2>
          <p className="section-intro">
            A selection of personal projects exploring the connection between
            design, development, and interactive digital experiences.
          </p>
        </div>
      </div>
      <div className="project-layout">
        <div className="project-overview">
          <p className="eyebrow">{project.category}</p>
          <h3>
            ASOS-inspired <span className="nowrap">E-commerce</span> Website
          </h3>
          <p>{project.overview}</p>
          <dl>
            <div>
              <dt>My Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Technology Stack</dt>
              <dd>{project.technologies}</dd>
            </div>
          </dl>
          <a className="text-link" href={project.repositoryUrl}>
            GitHub Repository <Arrow />
          </a>
        </div>
        <div className="showcase">
          {screenshots.map((shot, index) => (
            <figure key={shot.src} className={`screenshot screenshot-${index}`}>
              <figcaption>
                <span aria-hidden="true">0{index + 1} / </span>
                {shot.caption}
              </figcaption>
              <a
                href={shot.src}
                aria-haspopup="dialog"
                aria-label={`Open image: ${shot.caption.toLowerCase()}`}
                onClick={(event) => openImage(event, index)}
              >
                <img
                  src={shot.src.replace("-original.png", ".webp")}
                  srcSet={`${shot.src.replace("-original.png", "-640.webp")} 640w, ${shot.src.replace("-original.png", "-1280.webp")} 1280w, ${shot.src.replace("-original.png", ".webp")} ${shot.width}w`}
                  sizes={
                    index === 0
                      ? "(max-width: 767px) calc(100vw - 80px), (max-width: 1279px) calc(100vw - 136px), 790px"
                      : "(max-width: 767px) calc(100vw - 80px), (max-width: 1279px) 50vw, 445px"
                  }
                  width={shot.width}
                  height={shot.height}
                  alt={shot.alt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="image-action">
                  Open image <Arrow />
                </span>
              </a>
            </figure>
          ))}
        </div>
      </div>
      <details className="project-details">
        <summary>
          View project details{" "}
          <span className="details-sign" aria-hidden="true" />
        </summary>
        <div className="case-content">
          <div className="prose">
            {project.description.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div className="case-columns">
            <div>
              <h4>My Contribution</h4>
              <p>{project.contribution}</p>
              <h4>Key Features</h4>
              <ul>
                {project.features.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
            <dl>
              <div>
                <dt>Design Tool</dt>
                <dd>{project.designTool}</dd>
              </div>
              <div>
                <dt>Development Environment</dt>
                <dd>{project.developmentEnvironment}</dd>
              </div>
              <div>
                <dt>Project Type</dt>
                <dd>{project.projectType}</dd>
              </div>
            </dl>
          </div>
          <p className="disclaimer">{project.disclaimer}</p>
        </div>
      </details>
      <ImageViewer ref={viewer} />
    </section>
  );
}
function Education() {
  return (
    <EditorialSection
      id="education"
      number="05"
      label="Education & certifications"
      title="Education & credentials."
    >
      <div className="education-columns">
        <div>
          <p className="small-label">Education</p>
          <h3>Information Security</h3>
          <p>Technical University of Moldova</p>
          <p className="muted">
            Faculty of Computers, Informatics and Microelectronics (FCIM)
          </p>
          <p className="small-label">2026 — Present</p>
        </div>
        <div>
          <p className="small-label">Certifications</p>
          {credentials.map((cert) => (
            <article className="credential" key={cert.subject}>
              <h3>{cert.subject}</h3>
              <p className="muted">Certiport · IT Specialist</p>
              <time dateTime={cert.date}>{cert.label}</time>
              <a
                className="text-link"
                href={cert.document}
                aria-label={`View certificate: ${cert.subject} (PDF)`}
              >
                View certificate <Arrow />
              </a>
            </article>
          ))}
        </div>
      </div>
    </EditorialSection>
  );
}
function Contact() {
  return (
    <div className="contact-band">
      <div className="container">
        <EditorialSection
          id="contact"
          number="06"
          label="Contact"
          title="A conversation starts here."
        >
          <p className="section-intro">
            Whether you have a project idea, want to discuss technology, or
            simply connect, feel free to reach out.
          </p>
          <div className="contact-links">
            <a href="mailto:rusnacdanieal2007@gmail.com">
              <span>
                <strong>Email</strong>
                <span>rusnacdanieal2007@gmail.com</span>
              </span>
              <Arrow />
            </a>
            <a href="https://github.com/DanTeAmo">
              <span>
                <strong>GitHub</strong>
                <span>github.com/DanTeAmo</span>
              </span>
              <Arrow />
            </a>
          </div>
        </EditorialSection>
      </div>
    </div>
  );
}
function SiteFooter() {
  return (
    <footer className="contact-band">
      <div className="container site-footer">
        <div>
          <a className="wordmark" href="#home">
            Daniel Rusnac.
          </a>
          <p>Development · Cybersecurity · Design</p>
        </div>
        <a className="text-link" href="#home">
          Back to top <Arrow />
        </a>
      </div>
    </footer>
  );
}
export function PortfolioPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <div className="container">
          <Hero />
          <About />
          <Skills />
          <SelectedProjects />
          <Education />
        </div>
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
