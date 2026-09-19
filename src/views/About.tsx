import { Icon } from "@/components/icons";
import { Reveal, Btn, SectionHead, PageHero, Marquee, CountUp } from "@/components/ui";
import { DIFFERENTIATORS, FLOW_STEPS } from "@/content/data";

export default function About({ clients }: { clients: string[] }) {
  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "درباره ما" }]}
        title="درباره بهسا دیجیتال"
        lead="بهسا دیجیتال از یک سؤال ساده شروع شد: چرا صنایع بابت انرژی‌ای که می‌توانستند مدیریتش کنند، جریمه می‌شوند؟ پاسخ ما، پلتفرمی است که داده مصرف را به تصمیم مالی تبدیل می‌کند."
      >
        <Reveal dir="l" delay={150}>
          <div className="rounded-m border border-line bg-surface p-5 shadow-lift space-y-3">
            {[
              { icon: "data" as const, l: "نقطه داده پردازش‌شده در روز", v: "۲٫۴ میلیون" },
              { icon: "realtime" as const, l: "کنتور هوشمند متصل", v: "+۱٬۸۰۰" },
              { icon: "save" as const, l: "صرفه‌جویی ایجادشده برای مشتریان", v: "۱۸۰ میلیارد ریال" },
            ].map((r) => (
              <div key={r.l} className="flex items-center justify-between rounded-s border border-line bg-bg px-4 py-3">
                <span className="flex items-center gap-3 text-[13px] font-semibold text-ink2">
                  <span className="text-accent"><Icon name={r.icon} size={19} /></span>{r.l}
                </span>
                <span className="font-display font-extrabold text-[15.5px] text-ink fa-num">{r.v}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </PageHero>

      {/* ── Mission & Vision ── */}
      <section className="py-20 md:py-24 bg-bg relative">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <SectionHead
                eyebrow="هویت ما"
                title="داده، پایه هر تصمیم انرژی"
                lead="ما شرکت نرم‌افزاری نیستیم که وارد انرژی شده باشد؛ تیمی از مهندسان برق قدرت هستیم که نرم‌افزار می‌سازیم تا مسئله جریمه‌ها و اتلاف انرژی را برای همیشه حل کنیم."
              />
            </div>
            <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
              <Reveal dir="l">
                <div className="h-full rounded-m border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-primary text-on-primary"><Icon name="decision" size={23} /></span>
                  <h3 className="mt-5 font-display font-extrabold text-[19px] text-ink">مأموریت</h3>
                  <p className="mt-3 text-[14px] leading-8 text-ink2">
                    کمک به سازمان‌ها و صنایع برای تصمیم‌گیری بهتر در حوزه انرژی با استفاده از داده و فناوری.
                  </p>
                </div>
              </Reveal>
              <Reveal dir="l" delay={130}>
                <div className="h-full rounded-m border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-accent/50">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-accent text-white"><Icon name="eye" size={23} /></span>
                  <h3 className="mt-5 font-display font-extrabold text-[19px] text-ink">چشم‌انداز</h3>
                  <p className="mt-3 text-[14px] leading-8 text-ink2">
                    تبدیل‌شدن به یک پلتفرم هوشمند و قابل اعتماد در مدیریت و بهینه‌سازی انرژی.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Behsa — 5 differentiators ── */}
      <section className="py-20 md:py-24 bg-surface border-y border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHead
                  eyebrow="مزیت رقابتی"
                  title="چرا بهسا دیجیتال؟"
                  lead="پنج چیزی که ما را از یک نرم‌افزار گزارش‌گیریِ صرف جدا می‌کند."
                />
                <Reveal delay={200}>
                  <div className="mt-8 flex items-center gap-4 rounded-m border border-line bg-bg p-5">
                    <span className="font-display font-black text-[40px] leading-none text-orange-700"><CountUp to={9} /></span>
                    <p className="text-[13.5px] font-semibold text-ink2">سال تجربه متمرکز در مدیریت انرژی صنعتی</p>
                  </div>
                </Reveal>
              </div>
            </div>
            <div className="lg:col-span-8">
              {DIFFERENTIATORS.map((d, i) => (
                <Reveal key={d.title} delay={i * 80}>
                  <div className="group flex gap-6 border-b border-line py-7 first:pt-0 last:border-0 transition-colors hover:bg-bg/60 rounded-s px-2">
                    <span className="font-display font-black text-[34px] leading-none text-line group-hover:text-orange-700 transition-colors shrink-0 w-14 fa-num">
                      {`۰${i + 1}`}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-orange-700"><Icon name={d.icon} size={21} /></span>
                        <h3 className="font-display font-bold text-[18px] text-ink">{d.title}</h3>
                      </div>
                      <p className="mt-2.5 text-[14px] leading-8 text-ink2 max-w-2xl">{d.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Approach — RTL flow: داده ← تحلیل ← بینش ← تصمیم ← بهینه‌سازی ── */}
      <section className="relative py-20 md:py-24 bg-gradient-to-b from-blue-50 to-bg text-ink overflow-hidden border-y border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_90%_0%,rgb(0_98_189/0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            eyebrow="رویکرد ما"
            title="مسیری که هر داده در بهسا طی می‌کند"
            lead="در خوانش راست‌به‌چپ؛ هر مرحله، خوراک مرحله بعد را تولید می‌کند و مسیر از داده به صرفه‌جویی می‌رسد."
            align="center"
          />
          <div className="mt-14 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">
            {FLOW_STEPS.map((s, i) => (
              <Reveal key={s} delay={i * 120}>
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <div className="group relative flex flex-col items-center gap-3 rounded-m border border-line bg-surface shadow-card px-8 py-6 min-w-[150px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/35">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft border border-primary/20 font-display font-extrabold text-[15px] text-orange-700 fa-num">{(i + 1).toLocaleString("fa-IR")}</span>
                    <span className="font-display font-extrabold text-[17px] text-ink">{s}</span>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <>
                      <span className="hidden lg:block text-orange-700/60 mx-2"><Icon name="arrowL" size={22} sw={2.2} /></span>
                      <span className="lg:hidden text-orange-700/60"><Icon name="arrowL" size={22} sw={2.2} className="rotate-90" /></span>
                    </>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <p className="mt-12 text-center text-[13.5px] text-ink2 max-w-2xl mx-auto leading-7">
              خروجی نهایی این زنجیره، یک عدد است: <span className="text-accent font-bold">ریالِ صرفه‌جویی‌شده در هر ماه.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="py-16 md:py-20 bg-bg">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <Reveal>
            <p className="text-center text-[12.5px] font-bold text-ink3 mb-8">مورد اعتماد مجموعه‌های پیشرو در صنعت و انرژی</p>
          </Reveal>
          <Marquee items={clients} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-line bg-surface text-ink">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-16 md:py-20 text-center">
          <Reveal>
            <h2 className="font-display font-black text-[24px] md:text-[34px] leading-[1.5] max-w-3xl mx-auto">
              با ما درباره مدیریت انرژی <span className="text-orange-700">مجموعه خود</span> صحبت کنید.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Btn href="/contact?subject=خدمات مشاوره تخصصی" size="lg" icon="arrowL">شروع گفتگو و مشاوره</Btn>
              <Btn href="/services" size="lg" variant="secondary">خدمات مشاوره</Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
