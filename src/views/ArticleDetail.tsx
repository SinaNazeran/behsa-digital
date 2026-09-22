"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/icons";
import { Reveal, Btn, Badge, Breadcrumb } from "@/components/ui";
import { Thumb, SERIES } from "@/components/charts";
import type { ArticleView, ArticleCardView } from "@/lib/cms";
import { ArticleCard } from "@/components/ArticleCard";
import { SmartLink } from "@/components/SmartLink";

export default function ArticleDetail({ article, related, panelUrl }: { article: ArticleView; related: ArticleCardView[]; panelUrl: string }) {
  const slug = article.slug;
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  /* reading progress + TOC scroll-spy */
  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.25, 0), Math.max(total, 1));
      setProgress(done / Math.max(total, 1));

      const heads = Array.from(el.querySelectorAll<HTMLElement>("h2[data-sec]"));
      let idx = 0;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top < window.innerHeight * 0.35) idx = i; });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  useEffect(() => { setActive(0); setProgress(0); }, [slug]);


    const toc = article.body.filter((b) => b.h).map((b) => b.h as string);

  return (
    <>
      {/* reading progress */}
      <div className="fixed top-0 right-0 left-0 z-[70] h-[3px] bg-transparent pointer-events-none" aria-hidden="true">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      <article className="bg-bg relative">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pt-10 md:pt-14">
          <Reveal dir="r"><Breadcrumb items={[{ label: "خانه", path: "/" }, { label: "مقالات", path: "/articles" }, { label: article.cat }, { label: article.title }]} /></Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            {/* ── Main content (rightmost in RTL) ── */}
            <div className="lg:col-span-8 min-w-0">
              <Reveal>
                <header>
                  <Badge tone="blue" icon="doc">{article.cat}</Badge>
                  <h1 className="mt-5 font-display font-black text-[26px] md:text-[36px] leading-[1.5] tracking-tight text-ink">{article.title}</h1>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-ink2">
                    <span className="flex items-center gap-2"><Icon name="consultant" size={16} className="text-orange-700" />{article.author}</span>
                    <span className="flex items-center gap-2 fa-num"><Icon name="calendar" size={16} className="text-orange-700" /><time dateTime={article.publishedAt ?? undefined}>{article.date}</time></span>
                    <span className="flex items-center gap-2 fa-num"><Icon name="clock" size={16} className="text-orange-700" />{article.read} مطالعه</span>
                  </div>
                </header>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-8 rounded-l overflow-hidden border border-line shadow-card">
                  {article.coverUrl ? <img src={article.coverUrl} alt={article.title} className="aspect-[40/22] w-full object-cover" fetchPriority="high" /> : <Thumb chart={article.chart} cat={article.cat} accent={article.cat.includes("خورشیدی") ? SERIES.solar : SERIES.grid} />}
                </div>
              </Reveal>

              {/* body */}
              <div ref={bodyRef} className="mt-10 space-y-9">
                {article.body.map((sec, i) => (
                  <section key={i}>
                    {sec.h && (
                      <h2
                        data-sec
                        id={`sec-${i}`}
                        className="font-display font-extrabold text-[20px] md:text-[22px] leading-[1.55] text-ink scroll-mt-32 flex items-center gap-3"
                      >
                        <span className="inline-block h-6 w-1.5 rounded-full bg-accent shrink-0" />
                        {sec.h}
                      </h2>
                    )}
                    {sec.p.map((p, j) => (
                      <p key={j} className={cn("text-[15.5px] leading-[2.05] text-ink2", sec.h ? "mt-4" : "", j > 0 && "mt-4")}>{p}</p>
                    ))}
                  </section>
                ))}

                {/* inline callout */}
                <aside className="rounded-m border border-primary/25 bg-primary-soft/60 p-6 flex gap-4">
                  <span className="text-orange-700 shrink-0 mt-1"><Icon name="info" size={22} /></span>
                  <div>
                    <p className="font-display font-bold text-[15.5px] text-ink">جمع‌بندی کاربردی</p>
                    <p className="mt-2 text-[14px] leading-8 text-ink2">
                      همه راهکارهای این مقاله در سامانه بهسا دیجیتال به‌صورت خودکار محاسبه و گزارش می‌شوند. برای مشاهده نتایج واقعی، وارد سامانه شوید.
                    </p>
                    <Btn href={panelUrl} target="_blank" size="sm" className="mt-4" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
                  </div>
                </aside>
              </div>

              {/* author box */}
              <Reveal>
                <footer className="mt-12 rounded-m border border-line bg-surface p-6 flex flex-wrap items-center gap-5">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary font-display font-extrabold text-[20px]">ب</span>
                  <div className="flex-1 min-w-[220px]">
                    <p className="font-display font-bold text-[15.5px] text-ink">{article.author}</p>
                    <p className="mt-1 text-[13px] leading-6 text-ink2">تیم تحلیل بهسا دیجیتال — ترکیبی از مهندسان برق قدرت و متخصصان داده صنعتی.</p>
                  </div>
                  <Btn href="/articles" variant="secondary" size="sm" icon="arrowR">همه مقالات</Btn>
                </footer>
              </Reveal>
            </div>

            {/* ── Sticky TOC sidebar (leftmost in RTL) ── */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                <nav className="rounded-m border border-line bg-surface p-6" aria-label="فهرست مطالب">
                  <p className="flex items-center gap-2.5 font-display font-bold text-[14.5px] text-ink">
                    <Icon name="board" size={17} className="text-orange-700" /> فهرست مطالب
                  </p>
                  <ul className="mt-4 space-y-1">
                    {toc.map((h, i) => (
                      <li key={h}>
                        <SmartLink
                          href={`#sec-${article.body.findIndex((b) => b.h === h)}`}
                          onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${article.body.findIndex((b) => b.h === h)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                          className={cn(
                            "block rounded-s border-r-2 py-2 pl-3 text-[13px] font-semibold transition-all",
                            active === i ? "border-accent bg-accent-soft/60 text-ink pr-3.5" : "border-transparent text-ink2 hover:text-orange-700 hover:border-primary/30 pr-3",
                          )}
                        >
                          {h}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-linesoft">
                    <div className="flex justify-between text-[11.5px] font-bold text-ink3 mb-2">
                      <span>پیشرفت مطالعه</span><span className="fa-num">{`${Math.round(progress * 100).toLocaleString("fa-IR")}٪`}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-linesoft overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
                    </div>
                  </div>
                </nav>

                <div className="rounded-m border border-line bg-navy text-neutral-100 p-6 on-dark relative overflow-hidden">
                  <div className="absolute inset-0 grid-dark" />
                  <div className="relative">
                    <p className="font-display font-bold text-[16px]">این محاسبات را خودکار دریافت کنید</p>
                    <p className="mt-2 text-[13px] leading-6.5 text-neutral-400">گزارش دیماند و توان راکتیو مجموعه‌تان، هر ماه روی داشبورد شما.</p>
                    <Btn href={panelUrl} target="_blank" variant="green" size="sm" className="mt-4 w-full" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Related ── */}
        <div className="relative mt-20 border-t border-line bg-surface py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-px w-8 bg-accent" />
                    <span className="text-[13px] font-bold text-accent">ادامه مطالعه</span>
                  </div>
                  <h2 className="font-display font-extrabold text-[24px] md:text-[28px] text-ink">مقالات مرتبط</h2>
                </div>
                <Btn href="/articles" variant="secondary" icon="arrowL">همه مقالات</Btn>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((a, i) => (
                <Reveal key={a.slug} delay={i * 100}><ArticleCard {...a} /></Reveal>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
