/* Deliberately NOT a client component.
 *
 * Everything below is markup with no state, no effects and no event handlers
 * of its own, so a server component that renders <Btn> or <PageHero> should
 * get plain HTML — not a client reference it has to ship and hydrate. While
 * this file carried "use client", /product alone registered 83 of those.
 *
 * Reveal is the one piece that genuinely needs the browser; it lives in
 * ./Reveal and is re-exported here so the existing import sites keep working.
 * Re-exporting a client component from a server module is fine: the boundary
 * travels with Reveal itself, not with this file.
 *
 * A client component importing from here is also fine — it simply compiles
 * into that component's graph, which is how <Btn onClick> keeps working in
 * views/Articles.tsx.
 */
import type { CSSProperties, ReactNode } from "react";
import type { NavLens } from "@/content/navigation";
import { cn } from "../utils/cn";
import { Icon, type IconName } from "./icons";
import { AccentText } from "./AccentText";
import { SmartLink } from "@/components/SmartLink";
import { RevealOnLoad } from "./RevealOnLoad";
import { Reveal } from "./Reveal";

export { Reveal } from "./Reveal";
export { RevealOnLoad } from "./RevealOnLoad";

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
    "inline-flex items-center justify-center gap-2 font-body font-semibold rounded-sm transition-all duration-200 cursor-pointer select-none",
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

/* ── Breadcrumb (RTL — separator points LEFT) ──
   The last item is always the current page: plain text with
   aria-current, even when it carries a path (callers can hand over the
   same list they feed the BreadcrumbList JSON-LD). */
export function Breadcrumb({ items, dark = false }: { items: { label: string; path?: string }[]; dark?: boolean }) {
  return (
    <nav aria-label="مسیر صفحه" className={cn("flex items-center gap-2 text-[12.5px] font-medium flex-wrap", dark ? "text-white/85" : "text-ink3")}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <Icon name="arrowL" size={12} sw={2.2} className="opacity-50" />}
          {it.path && i < items.length - 1 ? (
            <SmartLink href={it.path} className={cn("transition-colors", dark ? "hover:text-white" : "hover:text-orange-700")}>{it.label}</SmartLink>
          ) : (
            <span aria-current={i === items.length - 1 ? "page" : undefined} className={dark ? "font-bold text-white" : "text-ink"}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ── Inner-page hero band ──
   One skeleton everywhere (crumb → eyebrow → H1 → lead → side panel), so
   every inner page reads as the same system. Every hero stands on a
   saturated brand ground — none is left pale — and the hue plus one data
   motif say which part of the site the visitor is in. The tone is the
   menu section's lens:
     feature  · product    navy control room, a live load profile
     report   · reports    bright brand blue, a combo chart with one marked
                           point (the decision the report serves)
     outcome  · solutions  deep green, the curve dropping under the
                           contracted-demand line (the penalty removed)
     vertical · industries burnt orange, several sites' load shapes
     content / company     the brand pair, blue fading through navy to orange
   Every ground is dark enough for white text (blue-600, the lightest,
   is 6.03:1), so side panels share one glass surface: HERO_PANEL. */
export type HeroTone = NavLens | "report";

type ToneStyle = { section: string; layers: ReactNode; accent: string; eyebrow: string; lead: string; /** extra room when the motif is tall */ pad?: string };

const EDITORIAL: ToneStyle = {
  /* the brand pair itself: blue behind the headline, orange behind the
     panel, navy between them so the two never mix into brown */
  section: "bg-gradient-to-bl from-blue-700 via-blue-950 to-orange-900 border-blue-900",
  layers: (
    <>
      <div className="absolute inset-0 grid-dark opacity-50" />
      <div className="absolute -top-40 right-[2%] h-[440px] w-[640px] rounded-full bg-blue-500/40 blur-3xl glow-a" />
      <div className="absolute -bottom-44 left-[4%] h-[380px] w-[540px] rounded-full bg-orange-500/35 blur-3xl glow-b" />
    </>
  ),
  accent: "text-orange-300",
  eyebrow: "border-white/20 bg-white/10 text-white",
  lead: "text-blue-50",
};

const HERO_TONES: Record<HeroTone, ToneStyle> = {
  feature: {
    section: "bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 border-blue-800",
    layers: (
      <>
        <div className="absolute inset-0 grid-dark opacity-60" />
        <div className="absolute -top-40 right-[4%] h-[440px] w-[640px] rounded-full bg-blue-500/45 blur-3xl glow-a" />
        <div className="absolute -bottom-40 left-[6%] h-[360px] w-[500px] rounded-full bg-orange-500/22 blur-3xl glow-b" />
      </>
    ),
    accent: "text-orange-300",
    eyebrow: "border-blue-300/30 bg-blue-300/12 text-blue-100",
    lead: "text-blue-100",
  },
  report: {
    section: "bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 border-blue-900",
    layers: (
      <>
        {/* one grid, strongest behind the headline and fading out toward the
            panel and the chart, so it frames the text instead of crossing it */}
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_left,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_80%_at_80%_25%,#000_15%,transparent_75%)]" />
        <div className="absolute -top-48 right-[2%] h-[480px] w-[700px] rounded-full bg-blue-400/45 blur-3xl glow-a" />
        <div className="absolute -bottom-32 left-[18%] h-[260px] w-[520px] rounded-full bg-orange-500/25 blur-3xl glow-b" />
        {/* hairline across the top edge — reads as the rule on a printed report */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/40 to-transparent" />
      </>
    ),
    accent: "text-orange-200",
    eyebrow: "border-white/25 bg-white/12 text-white",
    lead: "text-blue-50",
    pad: "pb-24 md:pb-40",
  },
  outcome: {
    section: "bg-gradient-to-b from-green-950 via-green-900 to-green-800 border-green-900",
    layers: (
      <>
        <div className="absolute inset-0 dots-dark opacity-80" />
        <div className="absolute -top-40 right-[6%] h-[420px] w-[600px] rounded-full bg-green-500/35 blur-3xl glow-a" />
        <div className="absolute -bottom-40 left-[8%] h-[340px] w-[480px] rounded-full bg-orange-500/20 blur-3xl glow-b" />
      </>
    ),
    accent: "text-orange-300",
    eyebrow: "border-green-300/30 bg-green-300/12 text-green-100",
    lead: "text-green-100",
  },
  vertical: {
    section: "bg-gradient-to-b from-orange-950 via-orange-900 to-orange-800 border-orange-900",
    layers: (
      <>
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(rgb(254_184_155/0.22)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -top-40 right-[6%] h-[420px] w-[600px] rounded-full bg-orange-500/40 blur-3xl glow-a" />
        <div className="absolute -bottom-40 left-[6%] h-[340px] w-[480px] rounded-full bg-blue-500/22 blur-3xl glow-b" />
      </>
    ),
    accent: "text-blue-300",
    eyebrow: "border-orange-300/35 bg-orange-300/12 text-orange-100",
    lead: "text-orange-100",
  },
  content: EDITORIAL,
  company: EDITORIAL,
};

/** the glass surface for anything placed in a hero's side column */
export const HERO_PANEL = "glass-panel rounded-md p-5 text-white";

/* Motifs are drawn right → left so the "latest" end of every line sits
   where an RTL reader finishes. `slice` keeps strokes uniform: desktop
   shows the whole strip, a phone shows its middle. */
/* Reports motif: a combo chart — bars, the trend over them, and one
   marked point where the decision is taken. The series rises into that
   point and falls after it: cost, before and after acting on a report. */
const REPORT_BARS = [18, 22, 20, 26, 24, 30, 28, 34, 31, 38, 35, 33, 40, 45, 42, 49, 46, 54, 50, 47, 56, 61, 58, 66, 63, 78, 64, 55, 57, 48, 50, 42, 44, 36, 38, 31];
const DECISION = 25;
const barX = (i: number) => 1200 - (i + 1) * 32 + 9;
const trendY = (i: number) => {
  const w = REPORT_BARS.slice(Math.max(0, i - 1), i + 2);
  return 120 - w.reduce((sum, h) => sum + h, 0) / w.length - 12;
};
const TREND = REPORT_BARS.map((_, i) => `${i ? "L" : "M"}${barX(i) + 7} ${trendY(i).toFixed(1)}`).join(" ");

function ReportChart() {
  const dx = barX(DECISION) + 7, dy = trendY(DECISION);
  return (
    <>
      <defs>
        <linearGradient id="report-bar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="report-bar-hot" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-orange-400)" />
          <stop offset="1" stopColor="var(--color-orange-500)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {[36, 66, 96].map((y) => (
        <line key={y} x1="0" x2="1200" y1={y} y2={y} stroke="#fff" strokeOpacity="0.12" strokeDasharray="2 6" />
      ))}
      {REPORT_BARS.map((h, i) => (
        <rect
          key={i}
          x={barX(i)}
          y={120 - h}
          width="14"
          height={h}
          rx="3"
          fill={i === DECISION ? "url(#report-bar-hot)" : "url(#report-bar)"}
          className="bar-grow [transform-box:fill-box]"
          style={{ animationDelay: `${i * 22}ms` }}
        />
      ))}
      <path d={TREND} pathLength={1} fill="none" stroke="var(--color-orange-200)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="chart-line" style={{ "--dash": 1 } as CSSProperties} />
      <line x1={dx} x2={dx} y1={dy - 26} y2={dy} stroke="#fff" strokeOpacity="0.45" strokeDasharray="3 4" />
      <circle cx={dx} cy={dy} r="9" fill="var(--color-orange-400)" fillOpacity="0.35" className="motion-safe:animate-ping [transform-box:fill-box] origin-center" />
      <circle cx={dx} cy={dy} r="4.5" fill="#fff" stroke="var(--color-orange-400)" strokeWidth="3" />
    </>
  );
}

function HeroMotif({ tone }: { tone: HeroTone }) {
  if (tone === "content" || tone === "company") return null;
  return (
    <svg aria-hidden viewBox="0 0 1200 120" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-x-0 bottom-0 w-full aspect-[10/1] min-h-16">
      {tone === "feature" && (
        <>
          <defs>
            <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--color-blue-400)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--color-blue-400)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M1200 96 L1140 90 L1090 94 L1040 74 L990 78 L940 56 L890 62 L840 44 L790 50 L740 34 L680 42 L620 30 L560 48 L500 40 L440 62 L380 54 L320 70 L260 64 L200 82 L140 76 L80 88 L0 84 V120 H1200 Z" fill="url(#hero-area)" />
          <path d="M1200 96 L1140 90 L1090 94 L1040 74 L990 78 L940 56 L890 62 L840 44 L790 50 L740 34 L680 42 L620 30 L560 48 L500 40 L440 62 L380 54 L320 70 L260 64 L200 82 L140 76 L80 88 L0 84" pathLength={1} fill="none" stroke="var(--color-orange-400)" strokeWidth="2.5" strokeLinejoin="round" className="chart-line" style={{ "--dash": 1 } as CSSProperties} />
        </>
      )}
      {tone === "outcome" && (
        <>
          <line x1="0" x2="1200" y1="52" y2="52" stroke="var(--color-orange-300)" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="8 8" />
          <path d="M1200 90 L1150 70 L1110 36 L1080 60 L1040 24 L1000 58 L960 30 L920 66 L880 40 L840 72 L800 60" fill="none" stroke="var(--color-green-200)" strokeOpacity="0.45" strokeWidth="2" strokeLinejoin="round" />
          <path d="M800 60 L740 78 L690 66 L630 84 L570 72 L510 88 L450 76 L390 90 L330 80 L270 94 L200 84 L130 96 L60 88 L0 98" pathLength={1} fill="none" stroke="var(--color-green-300)" strokeWidth="2.5" strokeLinejoin="round" className="chart-line" style={{ "--dash": 1 } as CSSProperties} />
        </>
      )}
      {tone === "vertical" && (
        <g fill="none" strokeWidth="2" strokeLinejoin="round" className="chart-line" style={{ "--dash": 1 } as CSSProperties}>
          <path pathLength={1} d="M1200 44 C1050 40 900 48 750 42 S450 46 300 40 S100 44 0 42" stroke="var(--color-orange-200)" strokeOpacity="0.55" />
          <path pathLength={1} d="M1200 100 C1080 100 1020 60 900 56 S720 90 600 70 S420 40 300 66 S120 100 0 96" stroke="var(--color-orange-400)" strokeOpacity="0.9" />
          <path pathLength={1} d="M1200 84 C1100 84 1060 72 980 74 S820 96 700 90 S520 60 400 62 S160 92 0 80" stroke="var(--color-blue-300)" strokeOpacity="0.85" />
        </g>
      )}
      {tone === "report" && <ReportChart />}
    </svg>
  );
}

export function PageHero({ crumb, title, lead, eyebrow, tone = "content", children }: {
  crumb: { label: string; path?: string }[];
  title: string;
  lead?: string;
  /** section label above the H1 — says where the visitor is before they read */
  eyebrow?: { label: string; icon?: IconName };
  tone?: HeroTone;
  children?: ReactNode;
}) {
  const t = HERO_TONES[tone];
  return (
    <section className={cn("on-dark relative overflow-hidden border-b text-white", t.section)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">{t.layers}</div>
      <HeroMotif tone={tone} />
      <div className={cn("relative mx-auto max-w-[1200px] px-5 md:px-8 pt-32 pb-20 md:pt-40 md:pb-28", t.pad)}>
        <RevealOnLoad dir="r"><Breadcrumb items={crumb} dark /></RevealOnLoad>
        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className={children ? "lg:col-span-7" : "lg:col-span-10"}>
            <RevealOnLoad delay={80}>
              {eyebrow && (
                <p className={cn("mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold backdrop-blur-sm", t.eyebrow)}>
                  {eyebrow.icon && <Icon name={eyebrow.icon} size={15} sw={2} />}
                  {eyebrow.label}
                </p>
              )}
              <h1 className="font-display font-black text-[30px] md:text-[44px] leading-[1.4] tracking-tight text-white">
                <AccentText text={title} accentClass={t.accent} />
              </h1>
              {lead && <p className={cn("mt-5 text-[15.5px] md:text-[17px] leading-8 md:leading-9 max-w-2xl", t.lead)}>{lead}</p>}
            </RevealOnLoad>
          </div>
          {children && <div className="lg:col-span-5">{children}</div>}
        </div>
      </div>
    </section>
  );
}

/* ── Closing call-to-action banner ──
   An inset dark card, not another full-bleed band: it has to stand apart
   from the light content above and the light footer below. Same shape on
   every page, so the one action the site asks for is learnt once. */
export function CtaBanner({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="relative bg-bg py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal>
          <div className="on-dark relative overflow-hidden rounded-lg border border-blue-700/60 bg-gradient-to-l from-blue-900 via-blue-800 to-blue-950 px-6 py-10 text-white shadow-lift md:px-12 md:py-14">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 grid-dark opacity-50" />
              <div className="absolute -top-28 right-[6%] h-64 w-[420px] rounded-full bg-blue-500/25 blur-3xl glow-a" />
              <div className="absolute -bottom-28 left-[4%] h-64 w-[420px] rounded-full bg-blue-400/20 blur-3xl glow-b" />
            </div>
            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="inline-flex items-center gap-2.5 text-[12.5px] font-bold text-orange-300">
                  <span className="h-2 w-2 rounded-full bg-green-400 pulse-dot" />
                  سامانه هوشمند مدیریت انرژی بهسا
                </p>
                <h2 className="mt-4 font-display font-black text-[22px] md:text-[30px] leading-[1.55]">
                  <AccentText text={title} accentClass="text-orange-300" />
                </h2>
                {lead && <p className="mt-3 max-w-xl text-[14.5px] leading-8 text-blue-100">{lead}</p>}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">{children}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
