import { Icon } from "@/components/icons";
import { Reveal, Btn, SectionHead, PageHero, CtaBanner } from "@/components/ui";
import { DIFFERENTIATORS, FLOW_STEPS } from "@/content/data";
import { faNum } from "@/lib/format";

export default function About() {
  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "درباره ما" }]}
        title="درباره بهسا دیجیتال"
        eyebrow={{ label: "درباره بهسا", icon: "org" }}
        lead="بهسا دیجیتال از یک مشاهدهٔ ساده شروع شد: بخش بزرگی از هزینهٔ برق صنایع، جریمه‌ای است که اگر به‌موقع دیده شود قابل پیشگیری است — و دادهٔ لازم برای دیدنش، از قبل در کنتور هوشمند وجود دارد."
      />

      {/* ── Mission & Vision ── */}
      <section className="py-20 md:py-24 bg-bg relative">
        <div className="absolute inset-0 grid-light grid-fade" />
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
              <Reveal dir="l" className="h-full">
                <div className="tone-orange kpi-card card-live group h-full p-7">
                  <span className="kpi-icon h-12 w-12 group-hover:scale-110 group-hover:-rotate-6"><Icon name="decision" size={23} /></span>
                  <h3 className="mt-5 font-display font-extrabold text-[19px] text-ink">مأموریت</h3>
                  <p className="mt-3 text-[14px] leading-8 text-ink2">
                    کمک به سازمان‌ها و صنایع برای تصمیم‌گیری بهتر در حوزه انرژی با استفاده از داده و فناوری.
                  </p>
                </div>
              </Reveal>
              <Reveal dir="l" delay={130} className="h-full">
                <div className="tone-green kpi-card card-live group h-full p-7">
                  <span className="kpi-icon h-12 w-12 group-hover:scale-110 group-hover:-rotate-6"><Icon name="eye" size={23} /></span>
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
              </div>
            </div>
            <div className="lg:col-span-8">
              {DIFFERENTIATORS.map((d, i) => (
                <Reveal key={d.title} delay={i * 80}>
                  <div className="tone-orange group flex gap-6 border-b border-line py-7 first:pt-0 last:border-0 transition-colors hover:bg-(--tone-50)/60 rounded-control px-3">
                    <span className="kpi-num font-display font-black text-[38px] leading-none tracking-tighter shrink-0 w-12 fa-num">
                      {faNum(i + 1)}
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
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_90%_0%,rgb(0_98_189/0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead
            eyebrow="رویکرد ما"
            title="مسیری که هر داده در بهسا طی می‌کند"
            lead="در خوانش راست‌به‌چپ؛ هر مرحله خوراک مرحلهٔ بعد را تولید می‌کند."
            align="center"
          />
          <div className="mt-14 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">
            {FLOW_STEPS.map((s, i) => (
              <Reveal key={s} delay={i * 120}>
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <div className="tone-blue kpi-card card-live group flex flex-col items-center gap-3 px-8 py-6 min-w-[150px]">
                    <span className="kpi-icon h-10 w-10 rounded-full! font-display font-extrabold text-[15px] fa-num group-hover:scale-110">{(i + 1).toLocaleString("fa-IR")}</span>
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
              خروجی نهایی این زنجیره یک توصیهٔ کلی نیست؛ یک عدد مشخص است: <span className="text-accent font-bold">قدرت قراردادی، ظرفیت خازن، یا مقدار خرید برق.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBanner title="با ما درباره مدیریت انرژی *مجموعه خود* صحبت کنید.">
        <Btn href="/contact" size="lg" icon="arrowL">تماس با ما</Btn>
        <Btn href="/product/platform" size="lg" variant="dark">آشنایی با پلتفرم</Btn>
      </CtaBanner>
    </>
  );
}
