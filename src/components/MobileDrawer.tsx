"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Icon } from "./icons";
import { BehsaLogo } from "./BehsaLogo";
import { Button } from "./ui/Button";
import { NAV_CONTACT, NAV_CTA_LABEL, sectionKeyForRoute, type NavSectionView } from "@/content/navigation";
import { SmartLink } from "@/components/SmartLink";
import { ReportSearchForm } from "./MegaMenu";

/* Full-height RTL drawer · multi-level accordion · focus trap ·
   scroll lock · Escape / backdrop close · sticky demo CTA at the base. */

export function MobileDrawer({ open, onClose, route, sections, panelUrl, phoneHref, phoneDisplay }: {
  open: boolean;
  onClose: () => void;
  route: string;
  sections: NavSectionView[];
  panelUrl: string;
  phoneHref: string;
  phoneDisplay: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const activeKey = sectionKeyForRoute(route, sections);

  /* The drawer used to render its whole contents on every page: 208 elements
     — 43 links, 9 icons, every menu section — built, laid out and hydrated
     even on desktop, where it is `lg:hidden` and can never be opened. That
     was 15% of the homepage's DOM for markup almost nobody sees.
     It cannot simply be unmounted, though: the slide-in and slide-out are
     CSS transitions on the shell below, and an element that mounts already
     open has nothing to transition from. So the shell stays (three divs) and
     only its contents wait. `open || filled` fills it in the same commit that
     starts the opening transition, and `filled` keeps it populated afterwards
     so the closing transition has something to slide out. */
  const [filled, setFilled] = useState(false);
  useEffect(() => { if (open) setFilled(true); }, [open]);
  const populated = open || filled;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const el = ref.current;
    const focusables = () =>
      el ? Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")) : [];
    window.setTimeout(() => focusables()[0]?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);

  useEffect(() => { if (open) setOpenKey(activeKey); }, [open, activeKey]);

  const SectionBlock = ({ section }: { section: NavSectionView }) => {
    const key = String(section.id);
    const isOpen = openKey === key;
    const hasItems = section.items.length > 0;
    /* the report catalogue lists its categories here, not every report:
       one level, short enough to scan in a drawer */
    const links = section.groups
      ? section.groups.map((g) => ({ id: g.id, title: g.title, href: g.href, icon: g.icon, newTab: false }))
      : section.items;
    return (
      <div className={cn("border-b border-linesoft transition-colors duration-300", isOpen && "bg-primary-soft/50")}>
        <div className="relative flex items-stretch">
          {/* start-edge rail for the current section, as on the desktop tabs */}
          {activeKey === key && <span className="absolute right-0 inset-y-3 w-[3px] rounded-l-full bg-primary" />}
          <SmartLink
            href={section.href}
            target={section.newTab ? "_blank" : undefined}
            rel={section.newTab ? "noopener noreferrer" : undefined}
            onClick={onClose}
            aria-current={activeKey === key ? "true" : undefined}
            className={cn("flex-1 px-5 py-4 text-[15px] font-bold transition-colors", activeKey === key ? "text-orange-700" : "text-ink")}
          >
            {section.title}
          </SmartLink>
          {hasItems && (
            <button
              onClick={() => setOpenKey(isOpen ? null : key)}
              aria-expanded={isOpen}
              aria-label={isOpen ? `بستن ${section.title}` : `باز کردن ${section.title}`}
              className="inline-flex w-14 items-center justify-center text-ink3 transition-colors hover:text-orange-700"
            >
              {/* the desktop chevron, turning the same way */}
              <Icon name="chevron" size={15} sw={2.2} className={cn("transition-transform duration-300 ease-fluid", isOpen && "rotate-180 text-orange-700")} />
            </button>
          )}
        </div>
        <div inert={!isOpen} className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            {section.groups && <ReportSearchForm id="drawer-report-search" className="mx-5 mb-2 mt-1" />}
            <ul className="pb-3">
              {links.map((item) => (
                <li key={item.id}>
                  <SmartLink
                    href={item.href}
                    target={item.newTab ? "_blank" : undefined}
                    rel={item.newTab ? "noopener noreferrer" : undefined}
                    onClick={onClose}
                    className="flex items-center gap-3 py-2.5 pr-8 pl-5 text-[13.5px] font-semibold text-ink2 transition-colors hover:text-orange-700"
                  >
                    {/* boxed icons, as in the mega menu */}
                    {item.icon
                      ? <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-line bg-surface text-orange-700"><Icon name={item.icon} size={14} /></span>
                      : <span className="h-1 w-1 rounded-full bg-primary/50" />}
                    {item.title}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  /* Enter decelerates in (400ms), exit accelerates away and is a little
     shorter (300ms) — the Material 3 emphasized pair for elements that come
     from / leave to off-screen. Scrim and panel share the timing so they
     move as one. */
  const motion = open
    ? "duration-[400ms] ease-[cubic-bezier(0.05,0.7,0.1,1)]"
    : "duration-300 ease-[cubic-bezier(0.3,0,0.8,0.15)]";

  return (
    /* visibility is transitioned, not toggled: a visible→hidden transition
       keeps it visible for its whole duration, so the drawer stays on screen
       until the slide-out ends (it used to vanish on the first frame of the
       close, hiding the exit animation entirely); hidden→visible flips at
       once, so opening is unaffected. Keep its duration equal to the exit. */
    <div className={cn("fixed inset-0 z-[60] transition-[visibility] duration-300 lg:hidden", open ? "visible" : "invisible pointer-events-none")}>
      <div
        className={cn("absolute inset-0 bg-neutral-950/75 backdrop-blur-sm transition-opacity", motion, open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        /* only a drawer that is actually on screen should claim to be a modal
           dialog; announcing aria-modal from a permanently present, hidden
           node tells assistive tech the rest of the page is inert */
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? "منوی ناوبری" : undefined}
        className={cn(
          "absolute inset-y-0 right-0 flex w-[310px] max-w-[88vw] flex-col border-l border-line bg-surface shadow-dark transition-transform",
          motion,
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {populated && (
          <>
          <div className="flex items-center justify-between border-b border-linesoft p-5">
            <div onClick={onClose}>
              <BehsaLogo variant="stacked-with-text" height={42} autoplay={false} />
            </div>
            <button
              onClick={onClose}
              aria-label="بستن منو"
              className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-line text-ink2 transition-colors hover:border-err/40 hover:text-err focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon name="x" size={17} />
            </button>
          </div>

          <nav className="scroll-slim flex-1 overflow-y-auto overscroll-contain" aria-label="ناوبری موبایل">
            {sections.map((s) => <SectionBlock key={s.id} section={s} />)}
            <SmartLink
              href={NAV_CONTACT.href}
              onClick={onClose}
              aria-current={activeKey === "contact" ? "true" : undefined}
              className={cn("block px-5 py-4 text-[15px] font-bold transition-colors", activeKey === "contact" ? "text-orange-700" : "text-ink")}
            >
              {NAV_CONTACT.title}
            </SmartLink>
          </nav>

          {/* sticky platform CTA at the drawer's base */}
          <div className="space-y-2.5 border-t border-linesoft bg-bg p-5">
            {/* same single CTA as the desktop header — panel, in a new tab */}
            <Button
              href={panelUrl}
              target="_blank"
              variant="primary"
              className="w-full"
              icon="login"
              ariaLabel={`${NAV_CTA_LABEL} (باز شدن در پنجره جدید)`}
              onClick={onClose}
            >
              {NAV_CTA_LABEL}
            </Button>
            {phoneHref && (
              <SmartLink href={phoneHref} className="flex items-center justify-center gap-2 text-[12.5px] font-bold text-ink3 fa-num hover:text-orange-700 transition-colors" dir="ltr">
                <Icon name="phone" size={13} /> {phoneDisplay}
              </SmartLink>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
