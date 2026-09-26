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

/* ── Buttons ──
   One button for the whole site: `Btn` is the historical name, kept so
   no call site had to change. See components/ui/Button. */
export { Button as Btn } from "./ui/Button";

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
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-bold leading-none", tones[tone])}>
      {icon && <Icon name={icon} size={13} sw={2} />}
      {children}
    </span>
  );
}

/* ── Section heading (eyebrow + H2 + lead) ── */
export function SectionHead({
  eyebrow, title, lead, align = "start", dark = false, id, size = "section",
}: {
  eyebrow: string; title: string; lead?: string; align?: "start" | "center"; dark?: boolean; id?: string;
  /** display: the page's few big moments — larger, tighter, negative tracking */
  size?: "section" | "display";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div className={cn("flex items-center gap-3 mb-4", align === "center" && "justify-center")}>
        <span className={cn("h-px w-8", dark ? "bg-orange-400" : "bg-blue-600")} />
        <span className={cn("text-[13px] font-bold tracking-tight", dark ? "text-orange-100" : "text-blue-700")}>{eyebrow}</span>
      </div>
      {/* the CMS accent marker (*word*) is valid in any editable title,
          so every heading that renders one must interpret it — otherwise
          the stars leak into the page as literal text */}
      <h2 id={id} className={cn(
        "font-display",
        size === "display"
          ? "font-black text-[30px] md:text-[44px] leading-[1.3] tracking-[-0.02em]"
          : "font-extrabold text-[26px] md:text-[32px] leading-[1.45] tracking-tight",
        dark ? "text-white" : "text-ink",
      )}>
        <AccentText text={title} accentClass={dark ? "text-orange-300" : "text-orange-700"} />
      </h2>
      {lead && <p className={cn("mt-4 leading-8", size === "display" ? "text-[16.5px] md:text-[17.5px]" : "text-[15.5px]", dark ? "text-blue-100" : "text-ink2")}>{lead}</p>}
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
   saturated brand ground — none is left pale, none is navy — and the hue
   plus one data motif say which part of the site the visitor is in. The
   grounds are the homepage's own bands, so an inner page reads as the
   same product:
     feature  · product    brand blue (the platform band), a live load profile
     report   · reports    brand blue, deeper at the foot, a combo chart with
                           one marked point (the decision the report serves)
     outcome  · solutions  brand green (the regulation band), the curve
                           dropping under the contracted-demand line
     vertical · industries brand orange-700, several sites' load shapes
     content / company     brand blue closed by a blue–orange brand strip —
                           the pair side by side, never blended into brown
   Glows stay in the ground's own hue: orange light over blue (or blue
   over orange) mixes to a muddy grey. White text holds 5.6:1 or better
   on every ground, so side panels share one glass surface: HERO_PANEL. */
export type HeroTone = NavLens | "report";

type ToneStyle = { section: string; layers: ReactNode; accent: string; eyebrow: string; lead: string; /** extra room when the motif is tall */ pad?: string };

const BLUE_GROUND = (
  <>
    <div className="absolute inset-0 grid-dark grid-fade opacity-80" />
    <div className="absolute -top-40 right-[4%] h-[440px] w-[640px] rounded-full bg-blue-400/35 blur-3xl glow-a" />
    <div className="absolute -bottom-40 left-[6%] h-[360px] w-[520px] rounded-full bg-blue-400/25 blur-3xl glow-b" />
  </>
);

const ON_BRAND = { accent: "text-orange-200", eyebrow: "border-white/25 bg-white/12 text-white", lead: "text-blue-50" };

const EDITORIAL: ToneStyle = {
  section: "bg-gradient-to-bl from-blue-700 via-blue-600 to-blue-600 border-blue-700",
  layers: (
    <>
      {BLUE_GROUND}
      {/* the brand pair, side by side: a strip at the foot of the hero */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-l from-blue-400 via-primary to-blue-400" />
    </>
  ),
  ...ON_BRAND,
};

const HERO_TONES: Record<HeroTone, ToneStyle> = {
  feature: {
    section: "bg-gradient-to-b from-blue-600 via-blue-600 to-blue-700 border-blue-700",
    layers: BLUE_GROUND,
    ...ON_BRAND,
  },
  report: {
    section: "bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 border-blue-800",
    layers: (
      <>
        {/* one grid, strongest behind the headline and fading out toward the
            panel and the chart, so it frames the text instead of crossing it */}
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_left,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_80%_at_80%_25%,#000_15%,transparent_75%)]" />
        <div className="absolute -top-48 right-[2%] h-[480px] w-[700px] rounded-full bg-blue-400/45 blur-3xl glow-a" />
        <div className="absolute -bottom-32 left-[18%] h-[260px] w-[520px] rounded-full bg-blue-400/25 blur-3xl glow-b" />
        {/* hairline across the top edge — reads as the rule on a printed report */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/40 to-transparent" />
      </>
    ),
    ...ON_BRAND,
    pad: "pb-24 md:pb-40",
  },
  outcome: {
    section: "bg-green-700 border-green-800",
    layers: (
      <>
        <div className="absolute inset-0 dots-dark opacity-80" />
        <div className="absolute -top-40 right-[6%] h-[420px] w-[600px] rounded-full bg-green-400/35 blur-3xl glow-a" />
        <div className="absolute -bottom-40 left-[8%] h-[340px] w-[480px] rounded-full bg-blue-500/25 blur-3xl glow-b" />
      </>
    ),
    accent: "text-orange-200",
    eyebrow: "border-white/25 bg-white/12 text-white",
    lead: "text-green-50",
  },
  vertical: {
    section: "bg-gradient-to-b from-orange-700 via-orange-700 to-orange-800 border-orange-800",
    layers: (
      <>
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(rgb(254_211_194/0.22)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -top-40 right-[6%] h-[420px] w-[600px] rounded-full bg-orange-400/40 blur-3xl glow-a" />
        <div className="absolute -bottom-40 left-[6%] h-[340px] w-[480px] rounded-full bg-orange-500/35 blur-3xl glow-b" />
      </>
    ),
    accent: "text-orange-200",
    eyebrow: "border-white/25 bg-white/12 text-white",
    lead: "text-orange-50",
  },
  content: EDITORIAL,
  company: EDITORIAL,
};

/** the glass surface for anything placed in a hero's side column */
export const HERO_PANEL = "glass-panel glass-on-brand rounded-sheet p-5 text-white";

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
          <path pathLength={1} d="M1200 100 C1080 100 1020 60 900 56 S720 90 600 70 S420 40 300 66 S120 100 0 96" stroke="#fff" strokeOpacity="0.75" />
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
    <section className={cn("on-brand relative overflow-hidden border-b text-white", t.section)}>
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
              <h1 className="font-display font-black text-[30px] md:text-[44px] leading-[1.35] tracking-[-0.02em] text-white">
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

/* ── Side navigation card ──
   The "more in this section" rail that landing and report pages both
   carry: the page's tone for the card, boxed icons as in the mega menu,
   the tone for hover and the closing link. */
export function SideNav({ title, items, more, tone = "tone-blue" }: {
  title: string;
  items: { key: string | number; href: string; label: string; icon?: IconName }[];
  more: { href: string; label: string };
  tone?: string;
}) {
  return (
    <div className={cn(tone, "kpi-card p-6 lg:sticky lg:top-32")}>
      <p className="flex items-center gap-2.5 font-display font-bold text-[15px] text-ink">
        <span className="h-4 w-1 rounded-full bg-(--tone-500)" />
        {title}
      </p>
      {items.length > 0 && (
        <ul className="mt-4 space-y-1">
          {items.map((it) => (
            <li key={it.key}>
              <SmartLink href={it.href} className="group flex items-center gap-3 rounded-control px-2.5 py-2 text-[13.5px] font-semibold text-ink2 transition-colors hover:bg-(--tone-50) hover:text-(--tone-700)">
                {it.icon && (
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-(--tone-200) bg-surface text-(--tone-700)">
                    <Icon name={it.icon} size={15} />
                  </span>
                )}
                {it.label}
                <Icon name="arrowL" size={12} className="mr-auto shrink-0 opacity-0 transition-all group-hover:-translate-x-0.5 group-hover:opacity-70" />
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
      <SmartLink href={more.href} className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-(--tone-700) transition-all hover:gap-3">
        {more.label} <Icon name="arrowL" size={13} sw={2.2} />
      </SmartLink>
    </div>
  );
}

/* ── The CTA load curve ──
   The homepage CTA's one ornament: a load profile that draws itself as
   its Reveal arrives (.cta-line in index.css) and, optionally, ends on a
   lit point — the bill, seen before it is issued. RTL: time runs right
   to left, so the point sits on the left. */
export function CtaCurve({ dot = true }: { dot?: boolean }) {
  return (
    <>
      <svg aria-hidden="true" viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 -z-10 h-[45%] w-full">
        <defs>
          <linearGradient id="cta-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M1200 160 C 1110 150, 1060 100, 980 120 S 840 175, 750 130 S 600 50, 500 95 S 340 160, 240 90 S 110 60, 60 40 L 0 40 L 0 200 L 1200 200 Z" fill="url(#cta-fill)" />
        <path d="M1200 160 C 1110 150, 1060 100, 980 120 S 840 175, 750 130 S 600 50, 500 95 S 340 160, 240 90 S 110 60, 60 40" fill="none" stroke="rgb(255 255 255 / 0.45)" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={1} className="cta-line" />
      </svg>
      {dot && <span aria-hidden="true" className="cta-dot absolute left-[5%] top-[64%] -z-10 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_0_6px_rgb(250_100_0/0.3),0_0_28px_rgb(250_100_0/0.9)]" />}
    </>
  );
}

/* ── Closing call-to-action banner ──
   The homepage CTA in the inner pages' horizontal shape: a contained
   brand-blue surface (not navy) on a light ground, lit edge, the same
   drawing load curve. Same shape on every page, so the one action the
   site asks for is learnt once. */
export function CtaBanner({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="relative bg-gradient-to-b from-bg to-blue-50 py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Reveal>
          <div className="on-brand relative isolate overflow-hidden rounded-surface bg-gradient-to-bl from-blue-600 via-blue-600 to-blue-700 px-6 py-10 text-white shadow-[0_40px_80px_-32px_rgb(0_98_189/0.65)] md:px-12 md:py-14">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_left,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_80%_at_70%_30%,#000_10%,transparent_75%)]" />
              <div className="absolute -top-40 -right-24 h-80 w-[460px] rounded-full bg-blue-400/40 blur-3xl" />
              <div className="absolute -bottom-40 -left-24 h-80 w-[460px] rounded-full bg-blue-400/35 blur-3xl" />
              <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/20" />
            </div>
            <CtaCurve dot={false} />
            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="inline-flex items-center gap-2.5 text-[12.5px] font-bold text-orange-100">
                  <span className="h-2 w-2 rounded-full bg-green-400 pulse-dot" />
                  سامانه هوشمند مدیریت انرژی بهسا
                </p>
                <h2 className="mt-4 font-display font-black text-[22px] md:text-[30px] leading-[1.5] tracking-[-0.01em]">
                  <AccentText text={title} accentClass="text-orange-200" />
                </h2>
                {lead && <p className="mt-3 max-w-xl text-[14.5px] leading-8 text-blue-50">{lead}</p>}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">{children}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
