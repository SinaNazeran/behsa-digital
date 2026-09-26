"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/icons";
import { Reveal, Btn, SectionHead } from "@/components/ui";
import { Hero } from "@/components/hero/Hero";
import { ArticleCard, type ArticleCardProps } from "@/components/ArticleCard";
import { faNum } from "@/content/data";
import { SmartLink } from "@/components/SmartLink";
import { AccentText } from "@/components/AccentText";
import type { ContentMap, SectionView } from "@/lib/cms";

/* ════════════════════════════════════════════════════════════════
   Homepage — the narrative of docs/content-strategy.md:

     1 hero            what this is, and that it needs no hardware
     2 asset types     who it is for, without naming anyone's brand
     3 pains           the problem, with its consequence
     4 regulations     why now
     5 status quo      why the current approach cannot answer it
     6 platform        how it works, four steps
     7 reports         what you actually receive
     8 dashboard       proof of mechanism (real screenshots only)
     9 capacitor       the differentiator, shown not claimed
    10 industries      relevance
    11 benefits        outcome — capability language, no percentages
    12 proof           RESERVED: renders only with real testimonials
    13 articles        depth
    14 faq             objection handling, before the ask
    15 cta             conversion

   Every band renders whatever the CMS holds, and a band the editor
   switched off — or emptied — disappears instead of leaving a headline
   with nothing under it.
   ════════════════════════════════════════════════════════════════ */

export type HomeProps = {
  articles: ArticleCardProps[];
  testimonials: { quote: string; name: string; org: string }[];
  faqs: { q: string; a: string }[];
  /** editable page sections, keyed by the section registry */
  content: ContentMap;
  panelUrl: string;
};

const EMPTY_SECTION: SectionView = {
  key: "", eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "",
  imageUrl: null, mobileImageUrl: null, videoUrl: "", videoEnabled: false, isActive: false, items: [],
};

/* no leading zero: at display size the Persian ۰ is a dot, so «۰۱»
   read as «• ۱» — a bullet, not a number */
const ordinal = (i: number) => faNum(i + 1);

/* card colour identities (tone-* in index.css), cycled where a grid's
   cards are peers rather than one idea */
const TONES = ["tone-orange", "tone-blue", "tone-green"] as const;

/* a report card's colour follows what the report is about, not its
   position in the grid: money and supply orange, renewables green, the
   measurement and quality reports blue. Tags are editor text, so this
   matches on words; anything unmatched keeps the positional cycle.
   ponytail: keyword match on the CMS tag — move to a tone field on the
   report category if editors start inventing new tag wording. */
function reportTone(tag: string | undefined, i: number) {
  const t = tag ?? "";
  if (/تجدید|خورشید/.test(t)) return "tone-green";
  if (/هزینه|تأمین|خرید/.test(t)) return "tone-orange";
  if (/کیفیت|پایش|داده|کنتور/.test(t)) return "tone-blue";
  return TONES[i % TONES.length];
}

/* phones: a card grid becomes one swipeable row (the next card peeks in
   from the left), which takes ~2,000px off the page; sm+ is the grid */
const SNAP_ROW = "-mx-5 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0";
const SNAP_ITEM = "h-full w-[82%] shrink-0 snap-start sm:w-auto";

/* top rail of a kpi-card: a tick of its tone at rest, the full edge on hover */
const RAIL = "absolute top-0 right-0 left-0 h-[3px] origin-right scale-x-[0.35] bg-gradient-to-l from-(--tone-500) via-(--tone-300) to-transparent transition-transform duration-500 ease-fluid group-hover:scale-x-100";

/* feeds the pointer into the hovered card's light (.card-live, see
   index.css) — one listener per grid rather than one per card */
function trackSpot(e: PointerEvent<HTMLElement>) {
  const card = (e.target as Element).closest<HTMLElement>(".card-live");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Home({ articles, testimonials, faqs, content, panelUrl }: HomeProps) {
  const [tab, setTab] = useState(0);
  const [faq, setFaq] = useState(0);
  const s = (key: string): SectionView => content[key] ?? EMPTY_SECTION;
  const pains = s("pains"), regulations = s("regulations"), statusQuo = s("status-quo");
  const platform = s("platform"), reports = s("reports"), dashboard = s("dashboard");
  const capacitor = s("capacitor"), industries = s("industries"), benefits = s("benefits");
  const proof = s("proof"), posts = s("articles"), faqHead = s("faq"), closing = s("cta");

  /* roving focus across the step tabs: arrows move and select (RTL, so
     ArrowLeft is "next"), Home/End jump to the ends */
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = platform.items.length;
    const to =
      e.key === "ArrowLeft" || e.key === "ArrowDown" ? (i + 1) % n
      : e.key === "ArrowRight" || e.key === "ArrowUp" ? (i - 1 + n) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    setTab(to);
    document.getElementById(`platform-tab-${to}`)?.focus();
  };

  const t = platform.items[Math.min(tab, Math.max(platform.items.length - 1, 0))];
  /* screenshots without an uploaded image would make the band's own
     claim untrue, so the band is gated on real media being present */
  const shots = dashboard.items.filter((i) => i.imageUrl);

  return (
    <>
      {/* ───────── 1 · HERO + 2 · asset types ───────── */}
      <Hero hero={s("hero")} companies={s("companies")} />

      {/* ───────── 3 · Pain points ─────────
          Every card below band 2 is the same recipe (index.css): a tone
          for its colour identity, kpi-card for the surface, kpi-icon for
          the lit tile, card-live for the response. Pains are all orange:
          they are one thing — cost leaking out. */}
      {pains.isActive && pains.items.length > 0 && (
      <section className="relative py-16 md:py-28 bg-gradient-to-b from-orange-50 via-bg to-bg border-t border-orange-100 overflow-hidden">
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="absolute -top-40 right-[10%] h-[440px] w-[640px] rounded-full bg-orange-200/50 blur-3xl glow-a pointer-events-none" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[540px] rounded-full bg-blue-200/40 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={pains.eyebrow} title={pains.title} lead={pains.description} size="display" />
            {pains.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={pains.ctaHref || "/solutions"} variant="secondary" icon="arrowL">{pains.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>

          <div onPointerMove={trackSpot} className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {pains.items.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90} className="h-full">
                <article className="tone-orange kpi-card card-live group h-full flex flex-col justify-between overflow-hidden p-6">
                  <span className={RAIL} />
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="kpi-icon h-13 w-13 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon name={p.icon ?? "alert"} size={24} />
                      </span>
                      <span className="kpi-num font-display font-black text-[44px] leading-none tracking-tighter fa-num">{ordinal(i)}</span>
                    </div>
                    <h3 className="mt-6 font-display font-extrabold text-[18px] text-ink leading-snug tracking-tight">{p.title}</h3>
                    {p.description && <p className="mt-3 text-[13.5px] leading-7 text-ink2">{p.description}</p>}
                  </div>
                  {p.tag && p.href && (
                    <div className="mt-6 pt-4 border-t border-(--tone-100)">
                      <SmartLink
                        href={p.href}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-(--tone-700) hover:gap-2.5 transition-all"
                      >
                        {p.tag} <Icon name="arrowL" size={14} sw={2.2} />
                      </SmartLink>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 4 · Regulatory urgency ─────────
          Statute text and Behsa's output are visually separated so the
          band never reads as legal advice: the statute sits on the card,
          Behsa's role in its own orange-tinted well. No percentage is
          published here — see docs/content-spec.md, placeholder P1.
          The band is brand green — the renewable-law colour — deepest
          (green-700, white 5.6:1) where the heading and lead sit.
          Cards are the same glass as the blue bands' (L2), so the three
          saturated bands read as one family. They share rows through
          subgrid, so both «نقش بهسا دیجیتال» wells start on one line
          however long each statute runs. */}
      {regulations.isActive && regulations.items.length > 0 && (
      <section className="on-brand relative py-16 md:py-24 bg-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 grid-dark grid-fade opacity-80" />
        <div className="absolute -bottom-48 -left-32 h-[440px] w-[600px] rounded-full bg-green-400/35 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -top-24 -right-32 h-[400px] w-[560px] rounded-full bg-blue-500/30 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={regulations.eyebrow} title={regulations.title} lead={regulations.description} dark={true} />
          <div onPointerMove={trackSpot} className="mt-12 grid gap-6 lg:grid-cols-2">
            {regulations.items.map((r, i) => (
              <Reveal key={r.id} delay={i * 110} className="grid grid-rows-subgrid row-span-4">
                <article className="card-live glass-panel glass-on-brand group grid grid-rows-subgrid row-span-4 gap-0 p-7 md:p-8 [--spot:rgb(255_255_255/0.12)] hover:border-white/40">
                  <div className="flex items-start gap-4">
                    <span className="tone-orange kpi-icon h-12 w-12 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon name={r.icon ?? "leaf"} size={23} />
                    </span>
                    <h3 className="font-display font-bold text-[17px] md:text-[18px] leading-8 text-white">{r.title}</h3>
                  </div>
                  {/* the empty cell keeps the row even when a field is missing */}
                  {r.description ? (
                    <p className="mt-5 text-[14px] leading-8 text-white">{r.description}</p>
                  ) : <span />}
                  {r.bullets.length > 0 ? (
                    <div className="mt-6 rounded-md bg-green-900/25 ring-1 ring-inset ring-white/15 p-5">
                      <p className="text-[12px] font-bold text-orange-100">نقش بهسا دیجیتال</p>
                      <ul className="mt-3 space-y-2.5">
                        {r.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-7 text-white">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-300" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : <span />}
                  {r.tag && r.href && (
                    <div className="pt-6">
                      <SmartLink href={r.href} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white underline-offset-4 hover:underline hover:gap-3 transition-all">
                        {r.tag} <Icon name="arrowL" size={14} sw={2.2} />
                      </SmartLink>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 5 · Why the status quo fails ─────────
          Deliberately quiet: it breaks the card-grid rhythm between the
          regulation cards and the blue platform band. */}
      {statusQuo.isActive && statusQuo.items.length > 0 && (
      <section className="py-16 md:py-20 bg-surface border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={statusQuo.eyebrow} title={statusQuo.title} />
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {statusQuo.items.map((q, i) => (
              <Reveal key={q.id} delay={(i % 3) * 90} className="h-full">
                <div className="group relative h-full border-t border-line pt-6">
                  <span className="absolute -top-px right-0 h-[3px] w-14 rounded-full bg-gradient-to-l from-primary to-orange-300 transition-[width] duration-500 ease-fluid group-hover:w-28" />
                  <h3 className="font-display font-bold text-[15.5px] text-ink">{q.title}</h3>
                  {q.description && <p className="mt-3 text-[13.5px] leading-7 text-ink2">{q.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 6 · How it works — four steps ─────────
          Brand blue, not navy: every text run here sits on blue-600 or
          deeper (white 6.03:1), the lighter glows stay off the copy. */}
      {platform.isActive && t && (
      <section className="on-brand relative py-16 md:py-24 bg-gradient-to-b from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 grid-dark grid-fade opacity-70" />
        <div className="absolute -bottom-32 left-[2%] h-[380px] w-[520px] rounded-full bg-blue-400/35 blur-3xl glow-b pointer-events-none" />
        <div className="absolute -top-40 left-[30%] h-[340px] w-[520px] rounded-full bg-blue-400/15 blur-3xl glow-a pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={platform.eyebrow} title={platform.title} lead={platform.description} dark={true} />

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3" role="tablist" aria-label="گام‌های کار با سامانه">
              {platform.items.map((p, i) => (
                <button
                  key={p.id} id={`platform-tab-${i}`} role="tab" aria-selected={tab === i} aria-controls="platform-panel"
                  tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "relative overflow-hidden flex items-center gap-3.5 rounded-lg border p-4 text-right transition-all duration-300 ease-fluid cursor-pointer active:scale-[0.98]",
                    tab === i
                      ? "border-white bg-white text-neutral-950 shadow-[0_16px_36px_-10px_rgb(0_32_70/0.55)]"
                      : "border-white/15 bg-white/[0.08] text-white hover:bg-white/[0.14] hover:border-white/30 backdrop-blur-sm",
                  )}
                >
                  {/* start-edge rail: marks the live step without another colour block */}
                  <span className={cn(
                    "absolute right-0 inset-y-3 w-[3px] rounded-l-full bg-primary origin-center transition-transform duration-300 ease-fluid",
                    tab === i ? "scale-y-100" : "scale-y-0",
                  )} />
                  <span className={cn(
                    "h-11 w-11 transition-all duration-300 ease-fluid",
                    tab === i ? "tone-orange kpi-icon" : "inline-flex shrink-0 items-center justify-center rounded-md bg-white/12 ring-1 ring-inset ring-white/20 text-white",
                  )}>
                    <Icon name={p.icon ?? "monitor"} size={22} />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-[15.5px]">{p.title}</span>
                    <span className={cn("block text-[11.5px] mt-0.5", tab === i ? "text-ink3" : "text-blue-100")}>
                      گام {faNum(i + 1)} از {faNum(platform.items.length)}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8">
              <div key={tab} id="platform-panel" role="tabpanel" aria-labelledby={`platform-tab-${tab}`} tabIndex={0} className="rv-now glass-panel glass-on-brand h-full rounded-lg p-7 md:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-[12.5px] font-bold text-orange-700 shadow-[0_6px_16px_-6px_rgb(0_32_70/0.5)]">
                      <Icon name={t.icon ?? "monitor"} size={14} />
                      {t.title}
                    </span>
                  </div>
                  {t.description && <p className="mt-4 text-[15.5px] leading-8 text-white max-w-2xl">{t.description}</p>}
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {t.bullets.map((it, i) => (
                      <li key={it} className="rv-now flex items-center gap-3 rounded-md border border-white/15 bg-white/[0.08] hover:bg-white/[0.14] px-4 py-3.5 text-[14px] font-semibold text-white transition-colors" style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="tone-green kpi-icon h-6 w-6 rounded-full!">
                          <Icon name="check" size={14} sw={2.4} />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-3">
                  <Btn href={panelUrl} target="_blank" size="md" variant="primary" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
                  {platform.ctaLabel && (
                    <Btn href={platform.ctaHref || "/product/platform"} variant="dark" size="md">
                      {platform.ctaLabel}
                    </Btn>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 7 · Report catalogue (representative subset) ─────────
          Tones cycle here: six questions, six different colours of card,
          so the grid reads as a range rather than a list. */}
      {reports.isActive && reports.items.length > 0 && (
      <section id="reports" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 via-surface to-surface relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="absolute -top-40 right-[20%] h-[400px] w-[600px] rounded-full bg-blue-200/50 blur-3xl glow-a pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={reports.eyebrow} title={reports.title} lead={reports.description} />
            {reports.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={reports.ctaHref || "/reports"} variant="secondary" icon="arrowL">{reports.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>
          <div onPointerMove={trackSpot} className={cn("mt-10 sm:mt-12", SNAP_ROW, "sm:grid-cols-2 lg:grid-cols-3")}>
            {reports.items.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 100} className={SNAP_ITEM}>
                <SmartLink
                  href={r.href || "/reports"}
                  className={cn(reportTone(r.tag, i), "kpi-card card-live group h-full overflow-hidden p-6 flex flex-col justify-between")}
                >
                  <span className={RAIL} />
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="kpi-icon h-12 w-12 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon name={r.icon ?? "board"} size={23} />
                      </span>
                      {r.tag && (
                        <span className="inline-flex items-center rounded-full bg-(--tone-50) px-3 py-1 text-[12px] font-bold leading-none text-(--tone-700) ring-1 ring-inset ring-(--tone-200)">
                          {r.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 font-display font-extrabold text-[16.5px] text-ink leading-7 tracking-tight group-hover:text-(--tone-700) transition-colors">{r.title}</h3>
                    {r.description && <p className="mt-2.5 text-[13.5px] leading-7 text-ink2">{r.description}</p>}
                  </div>
                  <span className="mt-5 pt-4 border-t border-(--tone-100) inline-flex items-center gap-1.5 text-[13px] font-bold text-(--tone-700) group-hover:gap-2.5 transition-all">
                    مشاهدهٔ گزارش <Icon name="arrowL" size={14} sw={2.2} />
                  </span>
                </SmartLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 8 · Inside the system — real screenshots only ─────────
          Gated on `shots`: the band claims the images come from the real
          product, so it must not render placeholder art. */}
      {dashboard.isActive && shots.length > 0 && (
      <section className="on-brand relative py-16 md:py-24 bg-gradient-to-b from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 grid-dark grid-fade opacity-70" />
        <div className="absolute -bottom-32 left-[8%] h-[400px] w-[560px] rounded-full bg-blue-400/35 blur-3xl glow-a pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={dashboard.eyebrow} title={dashboard.title} lead={dashboard.description} dark={true} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {shots.map((shot, i) => (
              <Reveal key={shot.id} delay={(i % 2) * 110}>
                <figure className="glass-panel glass-on-brand h-full rounded-lg p-3">
                  <img
                    src={shot.imageUrl!}
                    alt={shot.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-md border border-white/15 bg-blue-800 object-cover"
                  />
                  <figcaption className="px-3 py-4">
                    <p className="font-display font-bold text-[15px] text-white">{shot.title}</p>
                    {shot.description && <p className="mt-2 text-[13px] leading-7 text-blue-50">{shot.description}</p>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 9 · Capacitor bank design — the differentiator ─────────
          The page's second big moment after the hero, so it is built
          unlike every other band: brand blue between two light bands
          (restoring the light/colour alternation the middle of the page
          had lost), a display-size headline, and the four outputs set as
          one white sheet — the report you receive — instead of a grid of
          separate cards. White is the one ground that holds the logo
          colours and ink at full strength, as in the footer's logo plate. */}
      {capacitor.isActive && (
      <section className="on-brand relative py-20 md:py-32 bg-gradient-to-bl from-blue-600 via-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 grid-dark grid-fade opacity-70" />
        <div className="absolute -bottom-40 left-[2%] h-[480px] w-[680px] rounded-full bg-blue-400/35 blur-3xl glow-a pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={capacitor.eyebrow} title={capacitor.title} lead={capacitor.description} dark={true} size="display" />
            {capacitor.ctaLabel && (
              <Reveal delay={200}>
                <Btn href={capacitor.ctaHref || "/reports/capacitor-bank-design"} size="lg" className="mt-9" icon="arrowL">
                  {capacitor.ctaLabel}
                </Btn>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-7">
            <Reveal dir="l">
              <div className="rounded-surface bg-surface p-2 text-ink shadow-[0_48px_96px_-36px_rgb(0_20_45/0.7)] ring-1 ring-white/60">
                {capacitor.imageUrl ? (
                  <img
                    src={capacitor.imageUrl}
                    alt={capacitor.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-sheet"
                  />
                ) : (
                  /* one sheet, four cells: hairlines between them, not four boxes */
                  <div className="grid sm:grid-cols-2">
                    {capacitor.items.map((c, i) => (
                      <div
                        key={c.id}
                        className={cn(
                          "tone-blue group rounded-sheet p-6 md:p-7 transition-colors duration-300 hover:bg-blue-50",
                          i < capacitor.items.length - (capacitor.items.length % 2 === 0 ? 2 : 1) && "sm:border-b sm:border-linesoft sm:rounded-b-none",
                          i % 2 === 0 && "sm:border-l sm:border-linesoft sm:rounded-l-none",
                          i < capacitor.items.length - 1 && "max-sm:border-b max-sm:border-linesoft max-sm:rounded-b-none",
                        )}
                      >
                        <span className="kpi-icon h-11 w-11 font-display font-black text-[16px] fa-num group-hover:scale-110 group-hover:-rotate-6">
                          {faNum(i + 1)}
                        </span>
                        <h3 className="mt-5 font-display font-extrabold text-[16px] text-ink leading-7 tracking-tight">{c.title}</h3>
                        {c.description && <p className="mt-2.5 text-[13.5px] leading-7 text-ink2">{c.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 10 · Industries ───────── */}
      {industries.isActive && industries.items.length > 0 && (
      <section className="py-16 md:py-24 bg-gradient-to-b from-surface to-blue-50/70 relative overflow-hidden border-b border-line">
        <div className="absolute -bottom-40 right-[10%] h-[400px] w-[600px] rounded-full bg-orange-100/70 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={industries.eyebrow} title={industries.title} lead={industries.description} align="center" />
          <div onPointerMove={trackSpot} className={cn("mt-10 sm:mt-12", SNAP_ROW, "sm:grid-cols-2")}>
            {industries.items.map((ind, i) => {
              const Wrapper = ind.href ? SmartLink : "article";
              return (
                <Reveal key={ind.id} delay={(i % 2) * 90} className={SNAP_ITEM}>
                  <Wrapper
                    {...(ind.href ? { href: ind.href } : {})}
                    className={cn(TONES[(i + 1) % TONES.length], "kpi-card card-live group h-full flex flex-col overflow-hidden p-6")}
                  >
                    <span className={RAIL} />
                    <div className="flex items-center gap-4">
                      <span className="kpi-icon h-13 w-13 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon name={ind.icon ?? "org"} size={25} />
                      </span>
                      <h3 className="font-display font-extrabold text-[17px] text-ink tracking-tight group-hover:text-(--tone-700) transition-colors">{ind.title}</h3>
                    </div>
                    {ind.description && <p className="mt-4 text-[13.5px] leading-7 text-ink2">{ind.description}</p>}
                    {ind.href && (
                      <span className="mt-auto pt-4 border-t border-(--tone-100) inline-flex items-center gap-1.5 text-[13px] font-bold text-(--tone-700) group-hover:gap-2.5 transition-all">
                        گزارش‌های این بخش <Icon name="arrowL" size={14} sw={2.2} />
                      </span>
                    )}
                  </Wrapper>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 11 · Outcomes ─────────
          The ROI panel that used to sit in the left column («۳۱۲٪ …
          بر اساس نتایج مستقرسازی‌های ۱۴۰۳») was a fabricated statistic
          with a fabricated provenance line and has been removed. Its
          replacement states the measurement method instead of a result. */}
      {benefits.isActive && benefits.items.length > 0 && (
      <section className="on-brand relative py-16 md:py-24 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 grid-dark grid-fade opacity-70" />
        <div className="absolute -bottom-36 left-[6%] h-[420px] w-[560px] rounded-full bg-blue-400/35 blur-3xl glow-b pointer-events-none" />
        <div className="absolute -top-40 left-[40%] h-[360px] w-[520px] rounded-full bg-blue-400/15 blur-3xl glow-a pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHead eyebrow={benefits.eyebrow} title={benefits.title} lead={benefits.description} dark={true} />
                {/* the band's anchor: the one solid white surface on the blue */}
                <Reveal delay={200}>
                  <div className="mt-8 rounded-lg bg-surface p-7 text-ink shadow-[0_30px_60px_-24px_rgb(0_32_70/0.6)]">
                    <p className="flex items-center gap-2.5 font-display font-bold text-[15px] text-ink">
                      <Icon name="precision" size={18} className="text-orange-700" />
                      اثر مالی را چطور اندازه می‌گیریم؟
                    </p>
                    <p className="mt-4 text-[13.5px] leading-8 text-ink2">
                      مبنای سنجش، قبض دورهٔ پیش از استقرار است. اقلام جریمه‌پذیر پیش و پس از اقدام مقایسه می‌شوند و اثر تغییرات تعرفه از محاسبه کنار گذاشته می‌شود.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
            <div onPointerMove={trackSpot} className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              {benefits.items.map((b, i) => (
                <Reveal key={b.id} delay={(i % 2) * 100} className="h-full">
                  <div className="card-live glass-panel glass-on-brand group h-full p-6 [--spot:rgb(255_255_255/0.12)] hover:border-white/40">
                    <span className="tone-orange kpi-icon h-12 w-12 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon name={b.icon ?? "check"} size={22} />
                    </span>
                    <h3 className="mt-5 font-display font-extrabold text-[16.5px] text-white leading-7 tracking-tight">{b.title}</h3>
                    {b.description && <p className="mt-2.5 text-[13px] leading-7 text-white">{b.description}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 12 · Proof — reserved ─────────
          Renders only when real, permission-cleared testimonials exist.
          The band ships inactive and the testimonials table ships empty:
          empty beats fabricated (docs/content-strategy.md). */}
      {proof.isActive && testimonials.length > 0 && (
      <section className="relative py-16 md:py-24 bg-surface text-ink overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={proof.eyebrow} title={proof.title} lead={proof.description} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {testimonials.map((q, i) => (
              <Reveal key={`${q.name}-${i}`} delay={i * 120} dir={i % 2 ? "l" : "r"}>
                <figure className="card-live h-full flex flex-col justify-between border border-line bg-bg p-8 shadow-card hover:shadow-lift hover:border-orange-200">
                  <blockquote className="text-[16px] leading-8 text-ink font-medium">«{q.quote}»</blockquote>
                  <figcaption className="mt-6 flex flex-wrap items-center gap-4 pt-5 border-t border-linesoft">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-display font-extrabold text-[17px]">
                      {q.name.charAt(0)}
                    </span>
                    <span className="flex-1 min-w-[140px]">
                      <span className="block text-[14.5px] font-bold text-ink">{q.name}</span>
                      <span className="block text-[12.5px] text-ink3 mt-0.5">{q.org}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 13 · Articles preview ───────── */}
      {posts.isActive && articles.length > 0 && (
      <section className="relative py-16 md:py-24 bg-bg border-b border-line">
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={posts.eyebrow} title={posts.title} lead={posts.description} />
            {posts.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={posts.ctaHref || "/articles"} variant="secondary" icon="arrowL">{posts.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>
          <div onPointerMove={trackSpot} className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 100} className="h-full">
                <ArticleCard {...a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 14 · FAQ — objections, before the ask ───────── */}
      {faqHead.isActive && faqs.length > 0 && (
      <section className="py-16 md:py-24 bg-surface border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHead eyebrow={faqHead.eyebrow} title={faqHead.title} lead={faqHead.description} />
                <Reveal delay={200}>
                  <div className="mt-8 rounded-lg border border-line bg-bg p-6 shadow-card transition-colors hover:border-primary/40">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-primary-soft text-orange-700 border border-orange-200/50">
                      <Icon name="consultant" size={23} />
                    </span>
                    <p className="mt-4 font-display font-bold text-[16.5px] text-ink">پاسخ خود را پیدا نکردید؟</p>
                    <p className="mt-2.5 text-[13.5px] leading-7 text-ink2">سؤال فنی یا شرایط خاص مجموعه‌تان را بپرسید؛ در ساعات کاری پاسخ می‌دهیم.</p>
                    <Btn href="/contact" variant="secondary" size="sm" className="mt-5" icon="arrowL">تماس با ما</Btn>
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 70}>
                  <div className={cn(
                    "relative rounded-lg border overflow-hidden transition-all duration-300 ease-fluid",
                    faq === i ? "border-orange-200 bg-gradient-to-b from-orange-50 to-surface shadow-[0_24px_48px_-22px_rgb(250_100_0/0.35)]" : "border-line bg-surface hover:border-primary/30",
                  )}>
                    <button
                      id={`faq-q-${i}`}
                      onClick={() => setFaq(faq === i ? -1 : i)}
                      aria-expanded={faq === i}
                      aria-controls={`faq-panel-${i}`}
                      className="group flex w-full items-center gap-4 px-6 py-5 text-right cursor-pointer"
                    >
                      <span className={cn(
                        "font-display font-black text-[16px] shrink-0 fa-num transition-colors",
                        faq === i ? "text-orange-700" : "text-neutral-400 group-hover:text-orange-700/60",
                      )}>
                        {ordinal(i)}
                      </span>
                      <span className={cn(
                        "flex-1 font-display font-bold text-[15.5px] md:text-[16.5px] leading-7 transition-colors",
                        faq === i ? "text-orange-700" : "text-ink group-hover:text-orange-700",
                      )}>
                        {f.q}
                      </span>
                      <span className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-all duration-300",
                        faq === i
                          ? "bg-primary border-primary text-on-primary"
                          : "border-line bg-surface text-ink2 group-hover:border-primary/40 group-hover:text-orange-700",
                      )}>
                        {/* only the glyph turns (× open, + closed) — rotating the box made it a diamond */}
                        <Icon name="x" size={15} sw={2.4} className={cn("transition-transform duration-300 ease-fluid", faq !== i && "rotate-45")} />
                      </span>
                    </button>
                    <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-q-${i}`} inert={faq !== i} className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      faq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}>
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 pr-[62px] text-[14px] leading-8 text-ink2">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 15 · Final CTA ─────────
          One call to action site-wide: the product panel. A contained
          banner on a light ground rather than a full-bleed band: the
          page ends on one lit object, not on another stripe. Its only
          ornament is the product's own idea — a load curve that draws
          itself and ends on a marked point, the bill seen before it is
          issued (RTL: time runs right to left, so the point is on the left). */}
      {closing.isActive && (
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-blue-50 py-16 md:py-24">
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <Reveal>
            <div className="on-brand relative isolate overflow-hidden rounded-surface bg-gradient-to-bl from-blue-600 via-blue-600 to-blue-700 px-6 py-14 text-center text-white shadow-[0_40px_80px_-32px_rgb(0_98_189/0.65)] md:px-16 md:py-20">
              <div className="absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(to_left,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_65%_70%_at_50%_35%,#000_10%,transparent_75%)]" />
              <div className="absolute -top-44 -right-32 -z-10 h-[420px] w-[420px] rounded-full bg-blue-400/40 blur-3xl" />
              <div className="absolute -bottom-48 -left-24 -z-10 h-[460px] w-[460px] rounded-full bg-blue-400/45 blur-3xl" />
              {/* inner edge light, so the banner reads as a lit surface */}
              <div className="absolute inset-0 -z-10 rounded-[inherit] ring-1 ring-inset ring-white/20" />

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
              <span aria-hidden="true" className="cta-dot absolute left-[5%] top-[64%] -z-10 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-orange-300 shadow-[0_0_0_6px_rgb(250_100_0/0.3),0_0_28px_rgb(250_100_0/0.9)]" />

              <span className="tone-orange kpi-icon mx-auto mb-7 h-16 w-16 rounded-lg!">
                <Icon name="bolt" size={30} />
              </span>
              {closing.title && (
                <h2 className="font-display font-black text-[28px] md:text-[42px] leading-[1.45] tracking-tight max-w-3xl mx-auto">
                  <AccentText text={closing.title} accentClass="text-orange-200" />
                </h2>
              )}
              {closing.description && (
                <p className="mt-5 text-[15.5px] leading-8 text-blue-50 max-w-xl mx-auto">
                  {closing.description}
                </p>
              )}
              {closing.items.length > 0 && (
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                  {closing.items.map((b, i) => {
                    const external = !b.href.startsWith("/");
                    return (
                      <Btn
                        key={b.id}
                        href={b.href || "#"}
                        target={external ? "_blank" : undefined}
                        size="lg"
                        variant={i === 0 ? "primary" : "secondary"}
                        icon={i === 0 ? "arrowL" : undefined}
                        ariaLabel={external ? `${b.title} (باز شدن در پنجره جدید)` : undefined}
                      >
                        {b.title}
                      </Btn>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
      )}
    </>
  );
}
