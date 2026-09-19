"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/icons";
import { Reveal, Btn, Badge, SectionHead, PageHero, CountUp } from "@/components/ui";
import { Spark } from "@/components/charts";
import { PRODUCTS, FEATURE_GROUPS, SERVICES, PROCESS_STEPS, faNum } from "@/content/data";
import { SmartLink } from "@/components/SmartLink";

/* ── hero visual: active modules panel ── */
function ModulesStack() {
  const mods = [
    { icon: "monitor" as const, label: "پایش و تحلیل" },
    { icon: "optimize" as const, label: "بهینه‌سازی" },
    { icon: "forecast" as const, label: "پیش‌بینی" },
  ];
  return (
    <div className="relative rounded-l border border-line bg-surface p-5 shadow-lift">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-bold text-ink2">ماژول‌های فعال سامانه</span>
        <span className="h-2 w-2 rounded-full bg-accent pulse-dot" />
      </div>
      <div className="space-y-3">
        {mods.map((m) => (
          <div key={m.label} className="flex items-center justify-between rounded-s border border-line bg-bg px-4 py-3">
            <span className="flex items-center gap-3 text-[13px] font-bold text-ink">
              <span className="text-ch-blue"><Icon name={m.icon} size={19} /></span>
              {m.label}
            </span>
            <Badge tone="green">فعال</Badge>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-s border border-linesoft bg-bg p-3.5">
        <div className="flex justify-between text-[11px] text-ink3 mb-2">
          <span>صرفه‌جویی تجمعی</span>
          <span className="text-accent font-bold fa-num">۲٫۸ میلیارد ریال</span>
        </div>
        <Spark data={[12, 18, 15, 24, 22, 31, 29, 38, 44, 52]} color="#0F8F5A" />
      </div>
    </div>
  );
}

export default function Services() {
  const [group, setGroup] = useState(0);
  const g = FEATURE_GROUPS[group];

  return (
    <>
      {/* ── Hero — platform + consulting, one page ── */}
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "خدمات" }]}
        title="پلتفرم هوشمند و راهکارهای تخصصی مدیریت انرژی"
        lead="سامانه بهسا دیجیتال با هفت ماژول یکپارچه، داده مصرف شما را پایش و تحلیل می‌کند؛ تیم مشاوره ما هم با خدمات تخصصی، نتیجه را در قبض ماه بعد قابل‌اندازه‌گیری می‌کند. ابزار و تخصص، کنار هم."
      >
        <Reveal dir="l" delay={150}>
          <div className="space-y-3">
            <ModulesStack />
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: 7, s: "", l: "ماژول سامانه" },
                { v: 8, s: "", l: "خدمت مشاوره" },
                { v: 5, s: "", l: "گام فرایند" },
              ].map((k) => (
                <div key={k.l} className="rounded-m border border-line bg-surface p-3 text-center shadow-card">
                  <p className="font-display font-extrabold text-[20px] text-ink fa-num"><CountUp to={k.v} suffix={k.s} /></p>
                  <p className="mt-0.5 text-[11px] text-ink3">{k.l}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </PageHero>

      {/* ── 1 · Platform modules ── */}
      <section className="py-20 md:py-24 bg-bg relative">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            eyebrow="سامانه بهسا دیجیتال"
            title="هفت ماژول، یک پلتفرم یکپارچه"
            lead="ماژول‌ها مستقل عمل می‌کنند اما داده مشترک دارند؛ یعنی تحلیل دیماند، همان داده‌ای را می‌خواند که پایش لحظه‌ای ثبت می‌کند."
          />

          {/* featured core module */}
          <Reveal className="mt-12">
            <article className="group grid overflow-hidden rounded-l border border-line bg-surface transition-all duration-300 hover:shadow-lift hover:border-primary/40 lg:grid-cols-2">
              <div className="relative p-8 md:p-10 bg-navy text-neutral-100 on-dark overflow-hidden">
                <div className="absolute inset-0 grid-dark" />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-m bg-white/8 border border-white/12 text-orange-300">
                      <Icon name="monitor" size={28} />
                    </span>
                    <div>
                      <Badge tone="green">هسته مرکزی</Badge>
                      <h3 className="mt-2 font-display font-extrabold text-[22px]">پایش و تحلیل انرژی</h3>
                    </div>
                  </div>
                  <p className="mt-5 text-[14.5px] leading-8 text-neutral-400">{PRODUCTS[0].desc}</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[["۱۵", "دقیقه‌ای"], ["۳۶", "ماه آرشیو"], ["۹۹٫۹٪", "دسترس‌پذیری"]].map(([a, b]) => (
                      <div key={b} className="rounded-s border border-navyline bg-navy2 p-3 text-center">
                        <p className="font-display font-extrabold text-[19px] fa-num">{a}</p>
                        <p className="text-[11px] text-neutral-400">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col">
                <h4 className="font-display font-bold text-[15px] text-ink3">قابلیت‌های کلیدی</h4>
                <ul className="mt-4 space-y-3.5 flex-1">
                  {PRODUCTS[0].items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-[14.5px] font-semibold text-ink">
                      <span className="text-accent"><Icon name="check" size={18} sw={2} /></span>{it}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Btn href="https://panel.behsa-digital.ir/login" target="_blank" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
                  <Btn href="/articles" variant="secondary">مقالات مرتبط</Btn>
                </div>
              </div>
            </article>
          </Reveal>

          {/* remaining six modules */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.slice(1).map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 90}>
                <article className="group flex h-full flex-col rounded-m border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/35">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-primary-soft text-orange-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <Icon name={p.icon} size={23} />
                    </span>
                    <span className="font-display font-black text-[22px] text-line group-hover:text-primary-soft transition-colors">{faNum(`0${i + 2}`)}</span>
                  </div>
                  <h3 className="mt-5 font-display font-bold text-[17px] text-ink">{p.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-7 text-ink2">{p.desc}</p>
                  <ul className="mt-4 space-y-2 pt-4 border-t border-linesoft">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-center gap-2.5 text-[13px] font-medium text-ink2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />{it}
                      </li>
                    ))}
                  </ul>
                  <SmartLink href="https://panel.behsa-digital.ir/login" target="_blank" rel="noopener noreferrer" className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 hover:gap-3 transition-all">
                    ورود به سامانه <Icon name="login" size={14} sw={2.2} />
                  </SmartLink>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2 · Full feature catalogue — tabbed ── */}
      <section className="py-20 md:py-24 bg-surface border-y border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            eyebrow="فهرست کامل امکانات"
            title="تمام گزارش‌ها و ابزارهای سامانه"
            lead="امکانات در پنج دسته سازماندهی شده‌اند؛ روی هر دسته کلیک کنید تا فهرست کامل گزارش‌ها را ببینید."
          />

          <div className="mt-10 flex flex-wrap gap-2.5" role="tablist" aria-label="دسته‌بندی امکانات">
            {FEATURE_GROUPS.map((fg, i) => (
              <button
                key={fg.key} role="tab" aria-selected={group === i} onClick={() => setGroup(i)}
                className={cn(
                  "inline-flex items-center gap-2.5 rounded-s border px-5 h-12 text-[14px] font-bold transition-all cursor-pointer",
                  group === i
                    ? "bg-blue-600 border-blue-600 text-white shadow-[0_8px_20px_rgb(0_98_189/0.28)]"
                    : "bg-bg border-line text-ink2 hover:border-blue-600/40 hover:text-steel",
                )}
              >
                <Icon name={fg.icon} size={17} />
                {fg.key}
                <span className={cn("rounded-xs px-1.5 py-0.5 text-[11px] fa-num", group === i ? "bg-white/15" : "bg-line/60 text-ink3")}>{faNum(fg.items.length)}</span>
              </button>
            ))}
          </div>

          <div key={group} className="mt-8 rounded-l border border-line bg-bg p-7 md:p-10">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="inline-flex h-13 w-13 items-center justify-center rounded-m bg-primary text-on-primary"><Icon name={g.icon} size={26} /></span>
                <h3 className="mt-5 font-display font-extrabold text-[24px] text-ink">دسته {g.key}</h3>
                <p className="mt-3 text-[14px] leading-7 text-ink2">
                  {g.items.length} گزارش و ابزار فعال در این دسته؛ همه با داده لحظه‌ای کنتورها به‌روزرسانی می‌شوند.
                </p>
                <div className="mt-6 flex items-center gap-3 rounded-s border border-line bg-surface p-4">
                  <span className="text-accent"><Icon name="check" size={22} sw={2} /></span>
                  <p className="text-[13px] font-semibold text-ink2">خروجی هر گزارش: PDF، اکسل و دسترسی API</p>
                </div>
              </div>
              <ul className="lg:col-span-8 grid gap-3 sm:grid-cols-2 content-start">
                {g.items.map((it, i) => (
                  <li key={it} className="rv is-in flex items-center gap-3.5 rounded-s border border-line bg-surface px-5 py-4 transition-all hover:border-primary/40 hover:shadow-card" style={{ transitionDelay: `${i * 50}ms` }}>
                    <span className="font-display font-black text-[15px] text-orange-700/40 fa-num">{faNum(String(i + 1).padStart(2, "0"))}</span>
                    <span className="text-[14px] font-semibold text-ink">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 · Consulting engagements ── */}
      <section className="py-20 md:py-24 bg-bg relative">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead
              eyebrow="خدمات مشاوره تخصصی"
              title="هر خدمت، پاسخی به یک مشکل مشخص"
              lead="ساختار همه خدمات ما یکسان است: مشکل را نام می‌بریم، راهکار را شرح می‌دهیم و مزیت مالی آن را تضمین می‌کنیم."
            />
            <Reveal delay={150} className="shrink-0">
              <div className="flex items-center gap-5 rounded-m border border-line bg-surface px-6 py-4">
                <div className="text-center">
                  <p className="font-display font-extrabold text-[20px] text-orange-700"><CountUp to={40} suffix="+" /></p>
                  <p className="text-[11px] text-ink3">پروژه مشاوره</p>
                </div>
                <span className="h-9 w-px bg-line" />
                <div className="text-center">
                  <p className="font-display font-extrabold text-[20px] text-accent"><CountUp to={312} suffix="٪" /></p>
                  <p className="text-[11px] text-ink3">میانگین ROI</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Reveal key={s.num} delay={(i % 2) * 100}>
                <article className="group relative h-full rounded-m border border-line bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/35">
                  <span className="absolute inset-y-0 right-0 w-[3px] bg-primary/0 group-hover:bg-primary transition-colors duration-300" />
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-m bg-steel/8 text-steel transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                          <Icon name={s.icon} size={26} />
                        </span>
                        <div>
                          <h3 className="font-display font-bold text-[18px] text-ink">{s.title}</h3>
                          <p className="text-[12px] font-bold text-ink3 mt-0.5">خدمت مشاوره <span className="fa-num">{s.num}</span></p>
                        </div>
                      </div>
                      <span className="font-display font-black text-[30px] leading-none text-line group-hover:text-primary-soft transition-colors">{s.num}</span>
                    </div>

                    <div className="mt-6 space-y-3.5">
                      <div className="flex gap-3 rounded-s bg-errbg/60 p-3.5">
                        <span className="text-err shrink-0 mt-0.5"><Icon name="alert" size={16} sw={2} /></span>
                        <p className="text-[13.5px] leading-6.5"><span className="font-bold text-err">مشکل: </span><span className="text-ink2">{s.problem}</span></p>
                      </div>
                      <div className="flex gap-3 rounded-s bg-primary-soft/70 p-3.5">
                        <span className="text-orange-700 shrink-0 mt-0.5"><Icon name="decision" size={16} sw={2} /></span>
                        <p className="text-[13.5px] leading-6.5"><span className="font-bold text-orange-700">راهکار: </span><span className="text-ink2">{s.solution}</span></p>
                      </div>
                      <div className="flex gap-3 rounded-s bg-accent-soft/70 p-3.5">
                        <span className="text-accent shrink-0 mt-0.5"><Icon name="check" size={16} sw={2} /></span>
                        <p className="text-[13.5px] leading-6.5"><span className="font-bold text-accent">مزیت: </span><span className="text-ink2">{s.benefit}</span></p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-linesoft pt-5">
                      <SmartLink href="/contact" className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-orange-700 hover:gap-3 transition-all">
                        درخواست این خدمت <Icon name="arrowL" size={15} sw={2.2} />
                      </SmartLink>
                      <span className="text-[12px] text-ink3 fa-num">مدت پروژه: ۴ تا ۸ هفته</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · Process — RTL flow ── */}
      <section className="py-20 md:py-24 bg-surface border-t border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            eyebrow="فرایند همکاری"
            title="یک پروژه مشاوره چگونه پیش می‌رود؟"
            lead="پنج گام شفاف، از جلسه اول تا پایش مستمر نتایج."
            align="center"
          />
          <div className="mt-14 relative">
            <div className="hidden lg:block absolute top-[34px] right-[8%] left-[8%] h-px border-t-2 border-dashed border-line" />
            <div className="grid gap-8 lg:grid-cols-5">
              {PROCESS_STEPS.map((st, i) => (
                <Reveal key={st.num} delay={i * 120}>
                  <div className="relative text-center group">
                    <div className="relative z-10 mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-primary/25 bg-surface transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_0_8px_rgb(0_98_189/0.08)]">
                      <span className="font-display font-black text-[24px] text-orange-700">{st.num}</span>
                    </div>
                    <h3 className="mt-5 font-display font-bold text-[16px] text-ink">{st.title}</h3>
                    <p className="mt-2.5 text-[13px] leading-6.5 text-ink2 max-w-[230px] mx-auto">{st.desc}</p>
                    {i < PROCESS_STEPS.length - 1 && (
                      <span className="lg:hidden flex justify-center mt-6 text-orange-700/50"><Icon name="arrowL" size={20} className="rotate-90" /></span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-bg border-t border-line text-ink">
        <div className="absolute inset-0 grid-light" />
        <div className="absolute -top-28 right-[14%] h-[260px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgb(0_98_189/0.12),transparent_70%)] blur-2xl glow-a" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 text-center">
          <Reveal>
            <h2 className="font-display font-black text-[26px] md:text-[36px] leading-[1.45]">با ما مشورت کنید.</h2>
            <p className="mt-4 text-[15px] leading-8 text-ink2 max-w-xl mx-auto">
              در یک جلسه ۳۰ دقیقه‌ای رایگان، قبض‌های اخیر مجموعه‌تان را بررسی می‌کنیم و می‌گوییم کدام ماژول یا خدمت، بیشترین اثر مالی را دارد.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Btn href="/contact?subject=خدمات مشاوره تخصصی" size="lg" icon="arrowL">رزرو جلسه مشاوره</Btn>
              <Btn href="/articles" size="lg" variant="secondary">مقالات مدیریت انرژی</Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
