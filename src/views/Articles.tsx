"use client";

import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/icons";
import { Reveal, Btn, Badge, PageHero } from "@/components/ui";
import { Thumb } from "@/components/charts";
import { faNum } from "@/lib/format";
import type { ArticleCardView } from "@/lib/cms";

type ListArticle = ArticleCardView;
import { ArticleCard } from "@/components/ArticleCard";
import { SmartLink } from "@/components/SmartLink";

const PAGE_SIZE = 6;

export default function Articles({ articles, categories }: { articles: ListArticle[]; categories: string[] }) {
  const ARTICLES = articles;
  const ARTICLE_CATS = ["همه", ...categories];
  const [cat, setCat] = useState("همه");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) =>
      (cat === "همه" || a.cat === cat) &&
      (q.trim() === "" || a.title.includes(q.trim()) || a.excerpt.includes(q.trim())),
    );
  }, [cat, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pages);
  const visible = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];

  const pick = (c: string) => { setCat(c); setPage(1); };
  const search = (v: string) => { setQ(v); setPage(1); };

  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "مقالات" }]}
        title="دانش و تحلیل مدیریت انرژی"
        lead="تحلیل‌های کاربردی تیم بهسا درباره دیماند، توان راکتیو، خرید برق و انرژی خورشیدی — به زبان مدیران انرژی، نه فقط مهندسان."
      >
        <Reveal dir="l" delay={150}>
          <div className="rounded-m border border-line bg-surface p-5 shadow-lift flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-orange-700"><Icon name="doc" size={26} /></span>
              <div>
                <p className="font-display font-extrabold text-[18px] text-ink fa-num">{faNum(ARTICLES.length)} مقاله تخصصی</p>
                <p className="text-[12px] text-ink3">به‌روزرسانی هفتگی با قوانین جدید تعرفه</p>
              </div>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-accent pulse-dot" />
          </div>
        </Reveal>
      </PageHero>

      {/* ── Featured article ── */}
      {featured && (
      <section className="py-16 md:py-20 bg-bg relative">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <Reveal>
            <article className="group grid overflow-hidden rounded-l border border-line bg-surface transition-all duration-300 hover:shadow-lift hover:border-primary/40 lg:grid-cols-2">
              <SmartLink href={`/articles/${featured.slug}`} className="block overflow-hidden">
                <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                  {featured.coverUrl ? <img src={featured.coverUrl} alt="" className="aspect-[40/22] w-full h-full object-cover" /> : <Thumb chart={featured.chart} cat={featured.cat} />}
                </div>
              </SmartLink>
              <div className="p-8 md:p-10 flex flex-col">
                <div className="flex items-center gap-3">
                  <Badge tone="blue" icon="doc">مقاله ویژه</Badge>
                  <Badge tone="steel">{featured.cat}</Badge>
                </div>
                <h2 className="mt-5 font-display font-extrabold text-[22px] md:text-[27px] leading-[1.55] text-ink group-hover:text-orange-700 transition-colors">
                  <SmartLink href={`/articles/${featured.slug}`}>{featured.title}</SmartLink>
                </h2>
                <p className="mt-4 text-[14.5px] leading-8 text-ink2 flex-1">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-linesoft">
                  <div className="flex items-center gap-4 text-[12.5px] text-ink3 fa-num">
                    <span className="flex items-center gap-1.5"><Icon name="calendar" size={14} />{featured.date}</span>
                    <span className="flex items-center gap-1.5"><Icon name="clock" size={14} />{featured.read} مطالعه</span>
                    <span className="flex items-center gap-1.5"><Icon name="consultant" size={14} />{featured.author}</span>
                  </div>
                  <Btn href={`/articles/${featured.slug}`} size="sm" icon="arrowL">ادامه مطلب</Btn>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
      )}

      {/* ── Filters + grid ── */}
      <section className="pb-20 md:pb-24 bg-bg">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          {/* filter bar */}
          <Reveal>
            <div className="rounded-l border border-line bg-surface p-5 md:p-6 flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">
              <div className="scroll-slim flex gap-2.5 overflow-x-auto pb-1 xl:pb-0" role="tablist" aria-label="دسته‌بندی مقالات">
                {ARTICLE_CATS.map((c) => (
                  <button key={c} onClick={() => pick(c)}
                    className={cn(
                      "whitespace-nowrap rounded-s border px-4 h-10 text-[13px] font-bold transition-all cursor-pointer",
                      cat === c ? "bg-blue-600 border-blue-600 text-white shadow-[0_6px_14px_rgb(0_98_189/0.25)]" : "bg-bg border-line text-ink2 hover:border-blue-600/40 hover:text-steel",
                    )}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative xl:w-72 shrink-0">
                <input
                  value={q}
                  onChange={(e) => search(e.target.value)}
                  placeholder="جستجو در مقالات…"
                  aria-label="جستجوی مقالات"
                  className="w-full h-11 rounded-s border border-line bg-bg pr-11 pl-4 text-[13.5px] font-medium text-ink placeholder:text-ink3 transition-colors focus:border-primary focus:bg-surface outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none"><Icon name="search" size={17} /></span>
              </div>
            </div>
          </Reveal>

          <p className="mt-6 text-[13px] font-semibold text-ink3 fa-num">
            {faNum(filtered.length)} مقاله یافت شد
            {cat !== "همه" && <> در دسته «{cat}»</>}
            {q.trim() !== "" && <> برای «{q}»</>}
          </p>

          {visible.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((a, i) => (
                <Reveal key={a.slug} delay={(i % 3) * 90}>
                  <ArticleCard {...a} />
                </Reveal>
              ))}
            </div>
          ) : (
            /* ── Empty state ── */
            <Reveal>
              <div className="mt-6 rounded-l border-2 border-dashed border-line bg-surface px-6 py-16 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-orange-700">
                  <Icon name="search" size={28} />
                </span>
                <h3 className="mt-5 font-display font-bold text-[19px] text-ink">مقاله‌ای با این مشخصات پیدا نشد</h3>
                <p className="mt-2 text-[13.5px] text-ink2 max-w-sm mx-auto">عبارت جستجو را تغییر دهید یا دسته دیگری را انتخاب کنید.</p>
                <Btn className="mt-6" variant="secondary" onClick={() => { setCat("همه"); setQ(""); }}>پاک‌کردن فیلترها</Btn>
              </div>
            </Reveal>
          )}

          {/* ── Pagination (RTL: بعدی points LEFT) ── */}
          {pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="صفحه‌بندی مقالات">
              <button
                onClick={() => setPage(Math.max(1, pageSafe - 1))}
                disabled={pageSafe === 1}
                className="inline-flex h-11 items-center gap-2 rounded-s border border-line bg-surface px-4 text-[13px] font-bold text-ink2 transition-all hover:border-primary/40 hover:text-orange-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Icon name="arrowR" size={15} /> قبلی
              </button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  aria-current={pageSafe === i + 1 ? "page" : undefined}
                  className={cn(
                    "h-11 w-11 rounded-s border text-[14px] font-bold fa-num transition-all cursor-pointer",
                    pageSafe === i + 1 ? "bg-primary border-primary text-on-primary shadow-[0_6px_14px_rgb(0_98_189/0.25)]" : "border-line bg-surface text-ink2 hover:border-primary/40 hover:text-orange-700",
                  )}>
                  {faNum(i + 1)}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(pages, pageSafe + 1))}
                disabled={pageSafe === pages}
                className="inline-flex h-11 items-center gap-2 rounded-s border border-line bg-surface px-4 text-[13px] font-bold text-ink2 transition-all hover:border-primary/40 hover:text-orange-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                بعدی <Icon name="arrowL" size={15} />
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-line bg-surface text-ink">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-16 text-center">
          <Reveal>
            <h2 className="font-display font-black text-[24px] md:text-[32px] leading-[1.45]">خواندن کافی نیست؛ <span className="text-orange-700">عمل کنید.</span></h2>
            <p className="mt-4 text-[14.5px] leading-8 text-ink2 max-w-lg mx-auto">همین مفاهیم را در سامانه بهسا تجربه کنید.</p>
            <Btn
              href="https://panel.behsa-digital.ir/login"
              target="_blank"
              size="lg"
              icon="login"
              className="mt-7"
              ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)"
            >
              ورود به سامانه
            </Btn>
          </Reveal>
        </div>
      </section>
    </>
  );
}
