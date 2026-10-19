import { useEffect, useRef, useState, type MouseEvent } from "react";
import { navigation } from "./content";

type ReadabilityPlate = {
  left: number;
  top: number;
  width: number;
  height: number;
  visible: boolean;
};

export function SiteHeader() {
  const [plates, setPlates] = useState<ReadabilityPlate[]>([]);
  const [open, setOpen] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const header = useRef<HTMLElement>(null);
  const disclosure = useRef<HTMLDetailsElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLElement>(null);
  const animation = useRef<Animation | null>(null);
  const desiredOpen = useRef(false);
  const desktopNav = useRef<HTMLElement>(null);
  const activeLink = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    let frame = 0;
    let previous = "";
    const images = [...document.querySelectorAll<HTMLImageElement>("main img")];
    const textBlocks = [
      ...document.querySelectorAll<HTMLElement>(
        "main h1, main h2, main h3, main p, main dt, main dd, main figcaption",
      ),
    ];
    function measure() {
      frame = 0;
      const links = [
        header.current?.querySelector<HTMLElement>(".wordmark"),
        ...(desktopNav.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
        menu.current,
      ].filter((element): element is HTMLElement => !!element);
      const media = images
        .filter((image) => image.complete && image.naturalWidth > 0)
        .map((image) => image.getBoundingClientRect());
      for (const block of textBlocks) {
        const bounds = block.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > 80 || !bounds.width) continue;
        const range = document.createRange();
        range.selectNodeContents(block);
        media.push(...range.getClientRects());
      }
      const next = links.map((link) => {
        const rect = link.getBoundingClientRect();
        // Protect labels crossing media or another line of text, without pixel sampling.
        const visible =
          rect.width > 0 &&
          media.some((image) => {
            const width = Math.max(
              0,
              Math.min(rect.right, image.right) -
                Math.max(rect.left, image.left),
            );
            const height = Math.max(
              0,
              Math.min(rect.bottom, image.bottom) -
                Math.max(rect.top, image.top),
            );
            return width * height > rect.width * rect.height * 0.15;
          });
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          visible,
        };
      });
      const signature = JSON.stringify(next);
      if (signature !== previous) {
        previous = signature;
        setPlates(next);
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    const resize = new ResizeObserver(schedule);
    if (desktopNav.current) resize.observe(desktopNav.current);
    images.forEach((image) => resize.observe(image));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("load", schedule, true);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("load", schedule, true);
    };
  }, []);

  function positionIndicator(link: HTMLAnchorElement | null) {
    const nav = desktopNav.current;
    if (!nav) return;
    activeLink.current = link;
    if (!link || !nav.getClientRects().length) {
      activeLink.current = null;
      nav.removeAttribute("data-line-visible");
      return;
    }
    const bounds = link.getBoundingClientRect();
    const navBounds = nav.getBoundingClientRect();
    nav.style.setProperty(
      "--navigation-line-x",
      `${bounds.left - navBounds.left + (bounds.width - 20) / 2}px`,
    );
    nav.setAttribute("data-line-visible", "");
  }

  function retainFocusedIndicator() {
    const focused = document.activeElement;
    positionIndicator(
      focused instanceof HTMLAnchorElement &&
        focused.parentElement === desktopNav.current
        ? focused
        : null,
    );
  }

  useEffect(() => {
    const nav = desktopNav.current;
    if (!nav) return;
    const observer = new ResizeObserver(() =>
      positionIndicator(activeLink.current),
    );
    observer.observe(nav);
    nav.querySelectorAll("a").forEach((link) => observer.observe(link));
    return () => observer.disconnect();
  }, []);

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
        "main, #ep-next > footer",
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
    document.querySelectorAll<HTMLElement>("main[inert], #ep-next > footer[inert]").forEach((el) => {
      el.inert = false;
    });
    history.pushState(null, "", `#${id}`);
    document
      .querySelector<HTMLElement>(`#${id} h2, #${id} h1`)
      ?.focus({ preventScroll: true });
    document.getElementById(id)?.scrollIntoView();
  }

  return (
    <>
      <div className="navigation-readability" aria-hidden="true">
        {["Brand", ...navigation, "Menu"].map((item, index) => {
          const plate = plates[index];
          return (
            <span
              key={item}
              data-category={item}
              data-active={plate?.visible ? "true" : undefined}
              style={
                plate
                  ? {
                      left: plate.left,
                      top: plate.top,
                      width: plate.width,
                      height: plate.height,
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
      <header ref={header} className="site-header studio-header">
        <div className="container header-inner">
          <a
            className="wordmark"
            href="#home"
            onClick={(event) => navigate(event, "home")}
          >
            Daniel Rusnac.
          </a>
          <nav
            ref={desktopNav}
            className="desktop-navigation"
            aria-label="Main navigation"
            data-animated={enhanced ? "true" : undefined}
            onPointerLeave={retainFocusedIndicator}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (
                !(next instanceof HTMLAnchorElement) ||
                next.parentElement !== desktopNav.current
              )
                positionIndicator(null);
            }}
          >
            {navigation.map((item) => (
              <a
                key={item}
                className={
                  item === "Contact" ? "navigation-contact" : undefined
                }
                href={`#${item.toLowerCase()}`}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch")
                    positionIndicator(event.currentTarget);
                }}
                onFocus={(event) => positionIndicator(event.currentTarget)}
                onClick={(event) => navigate(event, item.toLowerCase())}
              >
                {item}
              </a>
            ))}
            <span className="navigation-indicator" aria-hidden="true" />
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
    </>
  );
}
