import { useEffect, useRef, useState, type MouseEvent } from "react";
import { navigation } from "./content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const header = useRef<HTMLElement>(null);
  const disclosure = useRef<HTMLDetailsElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLElement>(null);
  const animation = useRef<Animation | null>(null);
  const desiredOpen = useRef(false);

  function setMenu(next: boolean, immediate = false) {
    const details = disclosure.current;
    const surface = panel.current;
    if (!details || !surface) return;
    desiredOpen.current = next;
    setOpen(next);
    const current = animation.current ? getComputedStyle(surface) : null;
    const from = current
      ? { opacity: current.opacity, transform: current.transform }
      : {
          opacity: next ? "0" : "1",
          transform: next ? "translateY(-12px)" : "translateY(0)",
        };
    animation.current?.cancel();
    animation.current = null;
    surface.inert = !next;
    if (next) surface.removeAttribute("aria-hidden");
    else surface.setAttribute("aria-hidden", "true");
    if (
      immediate ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !surface.animate
    ) {
      details.open = next;
      return;
    }
    if (next) details.open = true;
    if (!details.open) return;
    const motion = surface.animate(
      [
        from,
        {
          opacity: next ? "1" : "0",
          transform: next ? "translateY(0)" : "translateY(-12px)",
        },
      ],
      { duration: next ? 360 : 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    animation.current = motion;
    motion.onfinish = () => {
      if (animation.current !== motion) return;
      animation.current = null;
      if (!desiredOpen.current) details.open = false;
    };
  }

  useEffect(() => {
    setEnhanced(true);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      if (reduced.matches) setMenu(desiredOpen.current, true);
    };
    reduced.addEventListener("change", settle);
    const desktop = matchMedia("(min-width: 768px)");
    const resize = () => {
      if (!desktop.matches) return;
      if (disclosure.current?.contains(document.activeElement))
        header.current?.querySelector<HTMLElement>(".wordmark")?.focus();
      setMenu(false, true);
    };
    desktop.addEventListener("change", resize);
    return () => {
      reduced.removeEventListener("change", settle);
      desktop.removeEventListener("change", resize);
      animation.current?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const background = [
      ...document.querySelectorAll<HTMLElement>(
        "main, body > #root > footer, #root > .contact-band",
      ),
    ];
    const previous = background.map((el) => el.inert);
    background.forEach((el) => {
      el.inert = true;
    });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenu(false);
        menu.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = [
          ...header.current!.querySelectorAll<HTMLElement>("a[href], summary"),
        ].filter((el) => el.getClientRects().length && !el.closest("[inert]"));
        const first = controls[0],
          last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = overflow;
      background.forEach((el, index) => {
        el.inert = previous[index];
      });
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    setMenu(false, true);
    // Release background before moving focus to the selected section.
    document.querySelectorAll<HTMLElement>("main[inert]").forEach((el) => {
      el.inert = false;
    });
    history.pushState(null, "", `#${id}`);
    document
      .querySelector<HTMLElement>(`#${id} h2, #${id} h1`)
      ?.focus({ preventScroll: true });
    document.getElementById(id)?.scrollIntoView();
  }

  return (
    <header ref={header} className="site-header studio-header">
      <div className="container header-inner">
        <a
          className="wordmark"
          href="#home"
          onClick={(event) => navigate(event, "home")}
        >
          Daniel Rusnac.
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(event) => navigate(event, item.toLowerCase())}
            >
              {item}
            </a>
          ))}
        </nav>
        <details
          ref={disclosure}
          className="mobile-navigation studio-navigation"
        >
          <summary
            ref={menu}
            className="menu-toggle"
            aria-controls="navigation-panel"
            aria-expanded={enhanced ? open : undefined}
            onClick={(event) => {
              event.preventDefault();
              setMenu(!desiredOpen.current);
            }}
          >
            <span className="menu-label-open">Menu</span>
            <span className="menu-label-close">Close</span>
            <span className="menu-symbol" aria-hidden="true">
              <i />
              <i />
            </span>
          </summary>
          <div ref={panel} id="navigation-panel" className="navigation-panel">
            <div className="container navigation-content">
              <p className="navigation-eyebrow">Explore the portfolio</p>
              <nav id="navigation" aria-label="Main navigation">
                {navigation.map((item, index) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(event) => navigate(event, item.toLowerCase())}
                  >
                    <span className="navigation-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span>{item}</span>
                    <span className="navigation-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </nav>
              <div className="navigation-footer">
                <div>
                  <p className="small-label">Let's connect</p>
                  <a href="mailto:rusnacdanieal2007@gmail.com">
                    rusnacdanieal2007@gmail.com ↗
                  </a>
                </div>
                <div className="navigation-utilities">
                  <a
                    href="https://github.com/DanTeAmo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href="/daniel-rusnac-resume.pdf"
                    download="Daniel-Rusnac-Resume.pdf"
                  >
                    Download résumé ↓
                  </a>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
