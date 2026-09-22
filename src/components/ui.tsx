"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Icon, type IconName } from "./icons";
import { AccentText } from "./AccentText";
import { SmartLink } from "@/components/SmartLink";
import { RevealOnLoad } from "./RevealOnLoad";

/* ── Scroll reveal ──
   One observer for the whole page rather than one per element. Every Reveal
   asks for the same threshold and the same root margin, so they can all share
   a single registration; the homepage alone mounts 68 of them, and each extra
   IntersectionObserver is another set of intersection computations the browser
   runs against the same scroll. Built lazily on first use, so it never exists
   during server rendering.

   Only elements that opted into `repeat` are tracked, because the observer
   callback is shared and has to know which target wants to re-arm. A WeakSet
   keeps that off the element and out of the way of the garbage collector. */
const repeaters = new WeakSet<Element>();
let revealObserver: IntersectionObserver | null = null;

function getRevealObserver(): IntersectionObserver {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            /* a one-shot reveal has done its job — stop paying for it */
            if (!repeaters.has(e.target)) revealObserver?.unobserve(e.target);
          } else if (repeaters.has(e.target)) {
            /* re-arm the transition so it replays on every re-entry */
            e.target.classList.remove("is-in");
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -36px 0px" },
    );
  }
  return revealObserver;
}

/** Below-the-fold reveal. For content in the first viewport use
 *  <RevealOnLoad>, which needs no JavaScript to become visible. */
export function Reveal({
  children, className, delay = 0, dir, repeat = false,
}: { children: ReactNode; className?: string; delay?: number; dir?: "l" | "r"; repeat?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    if (repeat) repeaters.add(el);
    const io = getRevealObserver();
    io.observe(el);
    return () => {
      io.unobserve(el);
      repeaters.delete(el);
    };
  }, [repeat]);
  return (
    <div ref={ref} className={cn(dir === "l" ? "rv-l" : dir === "r" ? "rv-r" : "rv", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Count-up number (honours reduced motion) ── */
export function CountUp({ to, suffix = "", duration = 1500, className }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / duration, 1);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref} className={className}>{val.toLocaleString("fa-IR")}{suffix}</span>;
}

/* ── Buttons ── */
type BtnProps = {
  variant?: "primary" | "secondary" | "dark" | "green" | "ghost";
  size?: "md" | "lg" | "sm";
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onClick?: () => void;
  children: ReactNode;
  icon?: IconName;
  className?: string;
  type?: "button" | "submit";
};

export function Btn({ variant = "primary", size = "md", href, target, rel, ariaLabel, onClick, children, icon, className, type = "button" }: BtnProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 font-body font-semibold rounded-s transition-all duration-200 cursor-pointer select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    size === "lg" && "h-[52px] px-7 text-[15.5px]",
    size === "md" && "h-11 px-5.5 text-[14.5px]",
    size === "sm" && "h-9 px-4 text-[13px]",
    variant === "primary" && "bg-primary text-on-primary hover:bg-primary-deep active:translate-y-px shadow-[0_6px_16px_rgb(250_100_0/0.26)] hover:shadow-[0_8px_22px_rgb(250_100_0/0.34)]",
    variant === "secondary" && "bg-surface text-steel border border-line hover:border-primary/50 hover:text-orange-700 active:translate-y-px",
    variant === "dark" && "bg-white/8 text-neutral-100 border border-white/16 backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-white/14 hover:border-white/32 active:translate-y-px",
    variant === "green" && "bg-accent text-white hover:bg-green-800 active:translate-y-px shadow-[0_6px_16px_rgb(10_118_73/0.3)]",
    variant === "ghost" && "text-orange-700 hover:bg-primary-soft",
    className,
  );
  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
    </>
  );
  if (href) {
    const computedRel = rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
    return (
      <SmartLink href={href} target={target} rel={computedRel} aria-label={ariaLabel} onClick={onClick} className={base}>
        {inner}
      </SmartLink>
    );
  }
  return <button type={type} onClick={onClick} aria-label={ariaLabel} className={base}>{inner}</button>;
}

/* ── Badge / Tag ── */
export function Badge({ children, tone = "blue", icon }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "red" | "teal" | "steel"; icon?: IconName }) {
  /* Measured on their own ground: blue 7.58, green 5.30, amber 6.62,
     red 6.30, brand 7.31, neutral 6.23 — all clear of the 4.5 floor.
     The old set sat between 3.2 and 3.8 and failed at this size. */
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-accent-soft text-accent border-green-200",
    amber: "bg-warnbg text-warn border-amber-200",
    red: "bg-errbg text-err border-red-200",
    teal: "bg-primary-soft text-orange-800 border-orange-200",
    steel: "bg-neutral-100 text-ink2 border-neutral-300",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-xs border px-2.5 py-1 text-[12px] font-semibold leading-none", tones[tone])}>
      {icon && <Icon name={icon} size={13} sw={2} />}
      {children}
    </span>
  );
}

/* ── Section heading (eyebrow + H2 + lead) ── */
export function SectionHead({
  eyebrow, title, lead, align = "start", dark = false, id,
}: { eyebrow: string; title: string; lead?: string; align?: "start" | "center"; dark?: boolean; id?: string }) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div className={cn("flex items-center gap-3 mb-4", align === "center" && "justify-center")}>
        <span className={cn("h-px w-8", dark ? "bg-orange-400" : "bg-accent")} />
        <span className={cn("text-[13px] font-bold tracking-tight", dark ? "text-orange-300" : "text-accent")}>{eyebrow}</span>
      </div>
      {/* the CMS accent marker (*word*) is valid in any editable title,
          so every heading that renders one must interpret it — otherwise
          the stars leak into the page as literal text */}
      <h2 id={id} className={cn("font-display font-extrabold text-[26px] md:text-[32px] leading-[1.45] tracking-tight", dark ? "text-white" : "text-ink")}>
        <AccentText text={title} accentClass={dark ? "text-orange-300" : "text-orange-700"} />
      </h2>
      {lead && <p className={cn("mt-4 text-[15.5px] leading-8", dark ? "text-neutral-400" : "text-ink2")}>{lead}</p>}
    </Reveal>
  );
}

/* ── Breadcrumb (RTL — separator points LEFT) ── */
export function Breadcrumb({ items, dark = false }: { items: { label: string; path?: string }[]; dark?: boolean }) {
  return (
    <nav aria-label="مسیر صفحه" className={cn("flex items-center gap-2 text-[12.5px] font-medium flex-wrap", dark ? "text-neutral-400" : "text-ink3")}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <Icon name="arrowL" size={12} sw={2.2} className="opacity-50" />}
          {it.path ? (
            <SmartLink href={it.path} className={cn("transition-colors", dark ? "hover:text-white" : "hover:text-orange-700")}>{it.label}</SmartLink>
          ) : (
            <span className={dark ? "text-neutral-200" : "text-ink"}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ── Alert card (semantic) ── */
export function AlertCard({ type, title, desc, time, dark = false }: { type: "ok" | "warn" | "err" | "info"; title: string; desc: string; time?: string; dark?: boolean }) {
  const map = {
    ok: { icon: "check" as IconName, c: "text-ok", bg: dark ? "bg-ok/20" : "bg-ok/10", bar: "bg-ok" },
    warn: { icon: "alert" as IconName, c: dark ? "text-amber-400" : "text-warn", bg: dark ? "bg-warn/25" : "bg-warn/12", bar: "bg-warn" },
    err: { icon: "alert" as IconName, c: dark ? "text-red-400" : "text-err", bg: dark ? "bg-err/20" : "bg-err/10", bar: "bg-err" },
    info: { icon: "info" as IconName, c: dark ? "text-blue-300" : "text-info", bg: dark ? "bg-info/20" : "bg-info/10", bar: "bg-info" },
  };
  const m = map[type];
  return (
    <div className={cn(
      "relative flex items-start gap-3 rounded-s border p-3.5 pr-4 overflow-hidden transition-all",
      dark
        ? "border-white/10 bg-white/[0.04] backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.08] text-white"
        : "border-line bg-surface hover:border-steel/30 hover:shadow-card text-ink"
    )}>
      <span className={cn("absolute inset-y-0 right-0 w-[3px]", m.bar)} />
      <span className={cn("mt-0.5 rounded-xs p-1.5 shrink-0", m.bg, m.c)}><Icon name={m.icon} size={16} sw={2} /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className={cn("text-[13.5px] font-bold truncate", dark ? "text-white" : "text-ink")}>{title}</p>
          {time && <span className={cn("text-[11px] whitespace-nowrap fa-num", dark ? "text-neutral-400" : "text-ink3")}>{time}</span>}
        </div>
        <p className={cn("text-[12.5px] leading-6 mt-0.5", dark ? "text-neutral-300" : "text-ink2")}>{desc}</p>
      </div>
    </div>
  );
}

/* ── Client / logo marquee ── */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden" dir="ltr">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg to-transparent z-10" />
      <div className="ticker-track flex w-max items-center gap-10 py-2">
        {row.map((n, i) => (
          <span key={i} dir="rtl" className="flex items-center gap-2.5 whitespace-nowrap text-steel/75 font-display font-bold text-[15px] transition-colors hover:text-orange-700">
            <span className="inline-block h-2 w-2 rounded-[3px] bg-steel/35 rotate-45" />
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Inner-page hero band ── */
export function PageHero({ crumb, title, lead, children }: { crumb: { label: string; path?: string }[]; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-bg text-ink overflow-hidden border-b border-line">
      <div className="absolute inset-0 grid-light" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_90%_at_85%_-10%,rgb(0_98_189/0.12),transparent_65%)]" />
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/7 blur-3xl" />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pt-32 pb-14 md:pt-40 md:pb-[72px]">
        <RevealOnLoad dir="r"><Breadcrumb items={crumb} /></RevealOnLoad>
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className={children ? "lg:col-span-7" : "lg:col-span-10"}>
            <RevealOnLoad delay={80}>
              <h1 className="font-display font-black text-[30px] md:text-[42px] leading-[1.4] tracking-tight text-ink">
                <AccentText text={title} />
              </h1>
              {lead && <p className="mt-5 text-[15.5px] md:text-[16.5px] leading-8 text-ink2 max-w-2xl">{lead}</p>}
            </RevealOnLoad>
          </div>
          {children && <div className="lg:col-span-5">{children}</div>}
        </div>
      </div>
    </section>
  );
}
