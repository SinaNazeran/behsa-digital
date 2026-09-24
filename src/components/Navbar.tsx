"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { Icon } from "./icons";
import { BehsaLogo } from "./BehsaLogo";
import { Button } from "./ui/Button";
import { MegaMenu } from "./MegaMenu";
import { DropdownMenu } from "./DropdownMenu";
import { MobileDrawer } from "./MobileDrawer";
import {
  NAV_CONTACT, NAV_CTA_LABEL, sectionKeyForRoute, type NavSectionView,
} from "@/content/navigation";
import { SmartLink } from "@/components/SmartLink";

/* ── Floating enterprise-glass navbar · RTL mega/dropdown navigation
   open: hover (desktop) · close: Escape / outside click / leave / scroll
   triggers are real links: click = navigate to the section landing page,
   ArrowDown opens the panel, ←/→ move between triggers ── */

export function Navbar({ sections, panelUrl, phoneHref, phoneDisplay }: {
  sections: NavSectionView[];
  panelUrl: string;
  phoneHref: string;
  phoneDisplay: string;
}) {
  const route = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerRefs = useRef<Record<string, HTMLElement | null>>({});

  const activeKey = sectionKeyForRoute(route, sections);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setOpen(null); /* menu must not linger over scrolled content */
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close on route change / outside click / Escape */
  useEffect(() => { setOpen(null); }, [route]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        triggerRefs.current[open]?.focus();
        setOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const openNow = (key: string) => {
    window.clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    /* never pull the panel away from someone typing in its search field */
    const typing = document.activeElement instanceof HTMLInputElement && headerRef.current?.contains(document.activeElement);
    if (typing) return;
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };

  const moveTrigger = (from: string, dir: 1 | -1) => {
    const keys = sections.map((s) => String(s.id));
    const i = keys.indexOf(from);
    const next = keys[(i + dir + keys.length) % keys.length];
    triggerRefs.current[next]?.focus();
  };

  const onTriggerKey = (e: React.KeyboardEvent, section: NavSectionView) => {
    const key = String(section.id);
    if (e.key === "ArrowDown" && section.items.length > 0) {
      e.preventDefault();
      openNow(key);
      window.setTimeout(() => {
        headerRef.current?.querySelector<HTMLElement>(`[data-panel="${key}"] a`)?.focus();
      }, 30);
    }
    if (e.key === "ArrowLeft") moveTrigger(key, 1);   /* RTL: left = next */
    if (e.key === "ArrowRight") moveTrigger(key, -1);
  };

  const openSection = sections.find((s) => String(s.id) === open);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 md:px-6">
      <div
        onMouseLeave={closeSoon}
        className={cn(
          "relative mx-auto mt-3 flex max-w-[1280px] items-center gap-4 rounded-[16px] border px-4 transition-all duration-300 ease-out md:px-5",
          /* scrolled: solid surface, tighter bar, subtle elevation that lifts it off the page */
          scrolled || open
            ? "h-[58px] border-line bg-surface/[0.97] shadow-[0_10px_30px_-14px_rgb(22_33_46/0.28)] backdrop-blur-md md:h-[62px]"
            /* at rest: frosted translucent glass that melts into the hero */
            : "h-[64px] border-white/60 bg-white/[0.72] shadow-card backdrop-blur-xl md:h-[68px]",
        )}
      >
        {/* logo — rightmost: symbol on top + BEHSA underneath exactly like brand asset */}
        <BehsaLogo variant="stacked-with-text" height={46} priority={true} />

        {/* desktop nav — hover opens the panel, click navigates to the section page */}
        <nav className="mr-2 hidden items-center lg:flex" aria-label="ناوبری اصلی">
          {sections.map((section) => {
            const key = String(section.id);
            const isActive = activeKey === key;
            const hasPanel = section.items.length > 0;
            return (
              <div key={key} className="relative">
                <SmartLink
                  href={section.href}
                  target={section.newTab ? "_blank" : undefined}
                  rel={section.newTab ? "noopener noreferrer" : undefined}
                  ref={(el) => { triggerRefs.current[key] = el; }}
                  onMouseEnter={() => (hasPanel ? openNow(key) : setOpen(null))}
                  onClick={() => hasPanel && openNow(key)}
                  onKeyDown={(e) => onTriggerKey(e, section)}
                  aria-expanded={hasPanel ? open === key : undefined}
                  aria-controls={hasPanel ? `nav-panel-${key}` : undefined}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-1.5 rounded-[10px] px-3.5 text-[13.5px] font-bold transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive ? "text-orange-700" : "text-ink2 hover:text-orange-700",
                    open === key && "bg-primary-soft text-orange-700",
                  )}
                >
                  {section.title}
                  {/* downward chevron at rest · rotates 180° when the panel opens */}
                  {hasPanel && (
                    <Icon
                      name="chevron"
                      size={13}
                      sw={2.2}
                      className={cn("text-ink3 transition-transform duration-200 ease-out", open === key && "rotate-180 text-orange-700")}
                    />
                  )}
                  {isActive && <span className="absolute -bottom-0.5 right-3.5 left-3.5 h-0.5 rounded-full bg-primary" />}
                </SmartLink>

                {/* simple dropdown — anchored to its trigger */}
                {open === key && hasPanel && section.kind === "dropdown" && (
                  <div id={`nav-panel-${key}`} data-panel={key} role="region" aria-label={section.title} className="absolute top-full right-0 z-50 pt-3" onMouseEnter={() => openNow(key)}>
                    <div className="nav-panel-enter overflow-hidden rounded-[14px] border border-line bg-white/97 shadow-lift backdrop-blur-xl">
                      <DropdownMenu section={section} activePath={route} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* mega panel — anchored to the full bar (not the nav) so it centers on the viewport */}
        {openSection && openSection.kind !== "dropdown" && openSection.items.length > 0 && (
          <div id={`nav-panel-${openSection.id}`} data-panel={openSection.id} role="region" aria-label={openSection.title} className="absolute top-full inset-x-0 z-50 flex justify-center pt-3" onMouseEnter={() => openNow(String(openSection.id))}>
            <div className="nav-panel-enter max-h-[calc(100dvh-110px)] w-[min(1140px,calc(100vw-28px))] overflow-y-auto overscroll-contain rounded-[18px] border border-line bg-white/97 shadow-lift backdrop-blur-xl">
              <MegaMenu section={openSection} activePath={route} />
            </div>
          </div>
        )}

        {/* actions — leftmost */}
        <div className="mr-auto flex items-center gap-2.5">
          {/* direct contact / demo request navigation into the contact page */}
          <SmartLink
            href={NAV_CONTACT.href}
            aria-label={NAV_CONTACT.title}
            className={cn(
              "group hidden h-10 items-center gap-2 rounded-[10px] border px-3 text-[13px] font-bold transition-all duration-200 active:translate-y-px",
              "border-line bg-bg text-ink2 hover:-translate-y-px hover:border-primary/40 hover:text-orange-700 hover:shadow-card",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex",
            )}
          >
            <Icon name="phone" size={15} className="shrink-0 transition-transform duration-200 group-hover:-rotate-6" />
            <span className="hidden md:inline">{NAV_CONTACT.title}</span>
          </SmartLink>
          {/* the site's single call to action — goes straight to the product
              panel; external → opens in a new tab so the page stays open */}
          <Button
            href={panelUrl}
            target="_blank"
            variant="primary"
            size="md"
            icon="login"
            ariaLabel={`${NAV_CTA_LABEL} (باز شدن در پنجره جدید)`}
            className="hidden h-10 px-4 text-[13px] shadow-[0_2px_10px_rgb(250_100_0/0.26)] hover:shadow-[0_4px_14px_rgb(250_100_0/0.36)] sm:inline-flex"
          >
            {NAV_CTA_LABEL}
          </Button>
          <button
            onClick={() => setDrawer(true)}
            aria-label="باز کردن منو"
            aria-expanded={drawer}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-line bg-bg text-ink transition-colors hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} route={route} sections={sections} panelUrl={panelUrl} phoneHref={phoneHref} phoneDisplay={phoneDisplay} />
    </header>
  );
}
