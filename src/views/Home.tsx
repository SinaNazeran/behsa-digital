"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/icons";
import { Reveal, Btn, Badge, SectionHead } from "@/components/ui";
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

const ordinal = (i: number) => faNum(String(i + 1).padStart(2, "0"));

export default function Home({ articles, testimonials, faqs, content, panelUrl }: HomeProps) {
  const [tab, setTab] = useState(0);
  const [faq, setFaq] = useState(0);
  const s = (key: string): SectionView => content[key] ?? EMPTY_SECTION;
  const pains = s("pains"), regulations = s("regulations"), statusQuo = s("status-quo");
  const platform = s("platform"), reports = s("reports"), dashboard = s("dashboard");
  const capacitor = s("capacitor"), industries = s("industries"), benefits = s("benefits");
  const proof = s("proof"), posts = s("articles"), faqHead = s("faq"), closing = s("cta");

  const t = platform.items[Math.min(tab, Math.max(platform.items.length - 1, 0))];
  /* screenshots without an uploaded image would make the band's own
     claim untrue, so the band is gated on real media being present */
  const shots = dashboard.items.filter((i) => i.imageUrl);

  return (
    <>
      {/* ───────── 1 · HERO + 2 · asset types ───────── */}
      <Hero hero={s("hero")} companies={s("companies")} />

      {/* ───────── 3 · Pain points ───────── */}
      {pains.isActive && pains.items.length > 0 && (
      <section className="relative py-20 md:py-24 bg-bg border-t border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={pains.eyebrow} title={pains.title} lead={pains.description} />
            {pains.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={pains.ctaHref || "/solutions"} variant="secondary" icon="arrowL">{pains.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {pains.items.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90}>
                <article className="group relative h-full flex flex-col justify-between rounded-m border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40">
                  <span className="absolute top-0 inset-x-0 h-[3px] rounded-t-m bg-gradient-to-r from-transparent via-transparent to-transparent transition-colors duration-300 group-hover:via-primary" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-orange-50 text-orange-700 border border-orange-200/60 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                        <Icon name={p.icon ?? "alert"} size={22} />
                      </span>
                      <span className="font-display font-black text-[22px] text-neutral-300 group-hover:text-primary transition-colors fa-num">{ordinal(i)}</span>
                    </div>
                    <h3 className="mt-5 font-display font-bold text-[17px] text-ink leading-snug">{p.title}</h3>
                    {p.description && <p className="mt-3 text-[13.5px] leading-7 text-ink2">{p.description}</p>}
                  </div>
                  {p.tag && p.href && (
                    <div className="mt-6 pt-4 border-t border-linesoft">
                      <SmartLink
                        href={p.href}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 hover:gap-2.5 transition-all"
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
          band never reads as legal advice. No percentage is published
          here — see docs/content-spec.md, placeholder P1. */}
      {regulations.isActive && regulations.items.length > 0 && (
      <section className="relative py-20 md:py-24 bg-neutral-950 text-white overflow-hidden border-y border-neutral-800">
        <div className="absolute inset-0 grid-dark opacity-30" />
        <div className="absolute -top-28 left-[8%] h-[340px] w-[460px] rounded-full bg-green-500/10 blur-3xl glow-a pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={regulations.eyebrow} title={regulations.title} lead={regulations.description} dark={true} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {regulations.items.map((r, i) => (
              <Reveal key={r.id} delay={i * 110}>
                <article className="h-full flex flex-col rounded-m border border-white/15 bg-white/[0.04] backdrop-blur-sm p-7 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-s bg-green-500/15 border border-green-500/25 text-green-300">
                      <Icon name={r.icon ?? "leaf"} size={23} />
                    </span>
                    <h3 className="font-display font-bold text-[17px] md:text-[18px] leading-8 text-white">{r.title}</h3>
                  </div>
                  {r.description && (
                    <p className="mt-5 text-[14px] leading-8 text-neutral-300">{r.description}</p>
                  )}
                  {r.bullets.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-white/10">
                      <p className="text-[12px] font-bold text-orange-300">نقش بهسا دیجیتال</p>
                      <ul className="mt-3 space-y-2.5">
                        {r.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-[13.5px] leading-7 text-neutral-200">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {r.tag && r.href && (
                    <div className="mt-auto pt-6">
                      <SmartLink href={r.href} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-300 hover:gap-3 transition-all">
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
          dark regulation band and the dark platform band. */}
      {statusQuo.isActive && statusQuo.items.length > 0 && (
      <section className="py-16 md:py-20 bg-surface border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={statusQuo.eyebrow} title={statusQuo.title} />
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {statusQuo.items.map((q, i) => (
              <Reveal key={q.id} delay={(i % 3) * 90}>
                <div className="border-t-2 border-line pt-5">
                  <h3 className="font-display font-bold text-[15.5px] text-ink">{q.title}</h3>
                  {q.description && <p className="mt-3 text-[13.5px] leading-7 text-ink2">{q.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 6 · How it works — four steps ───────── */}
      {platform.isActive && t && (
      <section className="relative py-20 md:py-24 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden border-y border-blue-700/60">
        <div className="absolute inset-0 grid-dark opacity-35" />
        <div className="absolute -top-24 right-[5%] h-[320px] w-[460px] rounded-full bg-blue-500/15 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -bottom-24 left-[5%] h-[320px] w-[460px] rounded-full bg-orange-500/10 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={platform.eyebrow} title={platform.title} lead={platform.description} dark={true} />

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3" role="tablist" aria-label="گام‌های کار با سامانه">
              {platform.items.map((p, i) => (
                <button
                  key={p.id} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}
                  className={cn(
                    "flex items-center gap-3.5 rounded-m border p-4 text-right transition-all duration-200 cursor-pointer",
                    tab === i
                      ? "border-white/40 bg-white text-neutral-950 shadow-[0_12px_28px_rgb(0_32_70/0.45)]"
                      : "border-white/10 bg-white/[0.05] text-blue-100 hover:bg-white/[0.1] hover:border-white/20 hover:text-white backdrop-blur-sm",
                  )}
                >
                  <span className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-s transition-colors",
                    tab === i ? "bg-blue-600 text-white shadow-sm" : "bg-white/10 border border-white/15 text-blue-200",
                  )}>
                    <Icon name={p.icon ?? "monitor"} size={22} />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-[15.5px]">{p.title}</span>
                    <span className={cn("block text-[11.5px] mt-0.5", tab === i ? "text-neutral-500" : "text-blue-200/80")}>
                      گام {faNum(i + 1)} از {faNum(platform.items.length)}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8">
              <div key={tab} className="rv is-in h-full rounded-m border border-white/15 bg-blue-950/70 backdrop-blur-md p-7 md:p-9 shadow-dark flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/15 px-3.5 py-1 text-[12.5px] font-bold text-orange-300">
                      <Icon name={t.icon ?? "monitor"} size={14} />
                      {t.title}
                    </span>
                  </div>
                  {t.description && <p className="mt-4 text-[15.5px] leading-8 text-blue-100 max-w-2xl">{t.description}</p>}
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {t.bullets.map((it, i) => (
                      <li key={it} className="rv is-in flex items-center gap-3 rounded-s border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] px-4 py-3.5 text-[14px] font-semibold text-white transition-colors" style={{ transitionDelay: `${i * 60}ms` }}>
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          <Icon name="check" size={14} sw={2.4} />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
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

      {/* ───────── 7 · Report catalogue (representative subset) ───────── */}
      {reports.isActive && reports.items.length > 0 && (
      <section id="reports" className="py-20 md:py-24 bg-surface relative border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={reports.eyebrow} title={reports.title} lead={reports.description} />
            {reports.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={reports.ctaHref || "/reports"} variant="secondary" icon="arrowL">{reports.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reports.items.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 100}>
                <SmartLink
                  href={r.href || "/reports"}
                  className="group h-full rounded-m border border-line bg-bg p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:bg-surface hover:border-primary/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-primary-soft text-orange-700 border border-orange-200/50 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                        <Icon name={r.icon ?? "board"} size={23} />
                      </span>
                      {r.tag && <Badge tone="steel">{r.tag}</Badge>}
                    </div>
                    <h3 className="mt-5 font-display font-bold text-[16px] text-ink leading-7 group-hover:text-orange-700 transition-colors">{r.title}</h3>
                    {r.description && <p className="mt-2.5 text-[13.5px] leading-7 text-ink2">{r.description}</p>}
                  </div>
                  <span className="mt-5 pt-4 border-t border-linesoft inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 group-hover:gap-2.5 transition-all">
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
      <section className="relative py-20 md:py-24 bg-neutral-950 text-white overflow-hidden border-y border-neutral-800">
        <div className="absolute inset-0 grid-dark opacity-30" />
        <div className="absolute -top-32 right-[10%] h-[420px] w-[560px] rounded-full bg-blue-600/15 blur-3xl glow-a pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={dashboard.eyebrow} title={dashboard.title} lead={dashboard.description} dark={true} />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {shots.map((shot, i) => (
              <Reveal key={shot.id} delay={(i % 2) * 110}>
                <figure className="h-full rounded-m border border-white/15 bg-white/[0.04] p-3 backdrop-blur-sm">
                  <img
                    src={shot.imageUrl!}
                    alt={shot.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-s border border-white/10 bg-neutral-900 object-cover"
                  />
                  <figcaption className="px-3 py-4">
                    <p className="font-display font-bold text-[15px] text-white">{shot.title}</p>
                    {shot.description && <p className="mt-2 text-[13px] leading-7 text-neutral-300">{shot.description}</p>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 9 · Capacitor bank design — the differentiator ───────── */}
      {capacitor.isActive && (
      <section className="py-20 md:py-24 bg-bg relative border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={capacitor.eyebrow} title={capacitor.title} lead={capacitor.description} />
            {capacitor.ctaLabel && (
              <Reveal delay={200}>
                <Btn href={capacitor.ctaHref || "/reports/capacitor-bank-design"} className="mt-8" icon="arrowL">
                  {capacitor.ctaLabel}
                </Btn>
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-7">
            {capacitor.imageUrl ? (
              <Reveal dir="l">
                <img
                  src={capacitor.imageUrl}
                  alt={capacitor.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-m border border-line bg-surface shadow-lift"
                />
              </Reveal>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {capacitor.items.map((c, i) => (
                  <Reveal key={c.id} delay={(i % 2) * 100}>
                    <div className="h-full rounded-m border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/40">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-display font-black text-[14px] text-orange-700 fa-num">
                        {faNum(i + 1)}
                      </span>
                      <h3 className="mt-4 font-display font-bold text-[15px] text-ink leading-7">{c.title}</h3>
                      {c.description && <p className="mt-2.5 text-[13px] leading-7 text-ink2">{c.description}</p>}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 10 · Industries ───────── */}
      {industries.isActive && industries.items.length > 0 && (
      <section className="py-20 md:py-24 bg-surface relative border-b border-line">
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={industries.eyebrow} title={industries.title} lead={industries.description} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {industries.items.map((ind, i) => {
              const Wrapper = ind.href ? SmartLink : "article";
              return (
                <Reveal key={ind.id} delay={(i % 2) * 90}>
                  <Wrapper
                    {...(ind.href ? { href: ind.href } : {})}
                    className="group h-full flex flex-col rounded-m border border-line bg-bg p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40"
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-s bg-blue-50 border border-blue-200/60 text-blue-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                        <Icon name={ind.icon ?? "org"} size={25} />
                      </span>
                      <h3 className="font-display font-bold text-[17px] text-ink group-hover:text-orange-700 transition-colors">{ind.title}</h3>
                    </div>
                    {ind.description && <p className="mt-4 text-[13.5px] leading-7 text-ink2">{ind.description}</p>}
                    {ind.href && (
                      <span className="mt-5 pt-4 border-t border-linesoft inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 group-hover:gap-2.5 transition-all">
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
      <section className="relative py-20 md:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden border-y border-blue-700/60">
        <div className="absolute inset-0 grid-dark opacity-35" />
        <div className="absolute -top-24 left-[10%] h-[340px] w-[480px] rounded-full bg-blue-500/15 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -bottom-28 right-[10%] h-[340px] w-[480px] rounded-full bg-orange-500/10 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHead eyebrow={benefits.eyebrow} title={benefits.title} lead={benefits.description} dark={true} />
                <Reveal delay={200}>
                  <div className="mt-8 rounded-m border border-white/20 bg-blue-950/70 backdrop-blur-md p-7 shadow-dark">
                    <p className="flex items-center gap-2.5 font-display font-bold text-[15px] text-white">
                      <Icon name="precision" size={18} className="text-orange-400" />
                      اثر مالی را چطور اندازه می‌گیریم؟
                    </p>
                    <p className="mt-4 text-[13.5px] leading-8 text-blue-100">
                      مبنای سنجش، قبض دورهٔ پیش از استقرار است. اقلام جریمه‌پذیر پیش و پس از اقدام مقایسه می‌شوند و اثر تغییرات تعرفه از محاسبه کنار گذاشته می‌شود.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              {benefits.items.map((b, i) => (
                <Reveal key={b.id} delay={(i % 2) * 100}>
                  <div className="h-full rounded-m border border-white/12 bg-white/[0.05] backdrop-blur-sm p-6 transition-colors hover:bg-white/[0.09] hover:border-white/25">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-s bg-white/10 border border-white/15 text-orange-300">
                      <Icon name={b.icon ?? "check"} size={21} />
                    </span>
                    <h3 className="mt-4 font-display font-bold text-[15.5px] text-white leading-7">{b.title}</h3>
                    {b.description && <p className="mt-2.5 text-[13px] leading-7 text-blue-100/90">{b.description}</p>}
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
      <section className="relative py-20 md:py-24 bg-surface text-ink overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={proof.eyebrow} title={proof.title} lead={proof.description} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {testimonials.map((q, i) => (
              <Reveal key={`${q.name}-${i}`} delay={i * 120} dir={i % 2 ? "l" : "r"}>
                <figure className="relative h-full flex flex-col justify-between rounded-m border border-line bg-bg p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40">
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
      <section className="relative py-20 md:py-24 bg-bg border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={posts.eyebrow} title={posts.title} lead={posts.description} />
            {posts.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={posts.ctaHref || "/articles"} variant="secondary" icon="arrowL">{posts.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 100}>
                <ArticleCard {...a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 14 · FAQ — objections, before the ask ───────── */}
      {faqHead.isActive && faqs.length > 0 && (
      <section className="py-20 md:py-24 bg-surface border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHead eyebrow={faqHead.eyebrow} title={faqHead.title} lead={faqHead.description} />
                <Reveal delay={200}>
                  <div className="mt-8 rounded-m border border-line bg-bg p-6 shadow-card transition-colors hover:border-primary/40">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-primary-soft text-orange-700 border border-orange-200/50">
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
                    "rounded-m border overflow-hidden transition-all duration-300",
                    faq === i ? "border-primary/50 bg-surface shadow-card" : "border-line bg-bg hover:border-primary/30",
                  )}>
                    <button
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
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-s border transition-all duration-300",
                        faq === i
                          ? "rotate-45 bg-primary border-primary text-on-primary"
                          : "border-line bg-surface text-ink2 group-hover:border-primary/40 group-hover:text-orange-700",
                      )}>
                        <Icon name="x" size={15} sw={2.4} />
                      </span>
                    </button>
                    <div id={`faq-panel-${i}`} className={cn(
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
          One call to action site-wide: the product panel. */}
      {closing.isActive && (
      <section className="relative overflow-hidden bg-gradient-to-l from-blue-900 via-blue-800 to-blue-900 text-white border-t border-blue-700/50">
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "linear-gradient(to left, rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="absolute -top-32 right-[18%] h-[340px] w-[480px] rounded-full bg-white/10 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -bottom-32 left-[18%] h-[340px] w-[480px] rounded-full bg-orange-500/10 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28 text-center">
          <Reveal>
            <span className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-l bg-white/15 border border-white/25 text-white shadow-lift">
              <Icon name="bolt" size={28} />
            </span>
            {closing.title && (
              <h2 className="font-display font-black text-[28px] md:text-[40px] leading-[1.45] tracking-tight max-w-3xl mx-auto">
                <AccentText text={closing.title} accentClass="text-orange-300" />
              </h2>
            )}
            {closing.description && (
              <p className="mt-5 text-[15.5px] leading-8 text-neutral-200 max-w-xl mx-auto">
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
                      variant={i === 0 ? "primary" : "dark"}
                      icon={i === 0 ? "arrowL" : undefined}
                      ariaLabel={external ? `${b.title} (باز شدن در پنجره جدید)` : undefined}
                    >
                      {b.title}
                    </Btn>
                  );
                })}
              </div>
            )}
          </Reveal>
        </div>
      </section>
      )}
    </>
  );
}
