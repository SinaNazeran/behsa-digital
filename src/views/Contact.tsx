import { Icon } from "@/components/icons";
import { Reveal, PageHero } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import type { SiteSettings } from "@/db/schema";
import { SmartLink } from "@/components/SmartLink";

export default function Contact({ settings, subject = "" }: { settings: SiteSettings; subject?: string }) {
  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "تماس با ما" }]}
        title="راه‌های ارتباط با بهسا دیجیتال"
        eyebrow={{ label: "تماس با ما", icon: "phone" }}
        lead="برای مشاوره، استقرار سامانه یا پرسش فنی می‌توانید مستقیماً تماس بگیرید یا فرم زیر را تکمیل کنید."
      />

      {/* ── Contact Info Cards Grid ── */}
      <section className="relative bg-bg overflow-hidden py-16 md:py-20 border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="absolute -top-32 right-[12%] h-[400px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(0_98_189/0.12),transparent_70%)] blur-2xl glow-a" />
        <div className="absolute bottom-[-160px] left-[2%] h-[360px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgb(250_100_0/0.07),transparent_70%)] blur-2xl glow-b" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8">
          {/* Top 3 primary contact cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Phone */}
            <Reveal dir="r" delay={60}>
              <SmartLink
                href={settings.phoneHref}
                className="group flex flex-col justify-between h-full rounded-md border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary-soft text-orange-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <Icon name="phone" size={22} />
                    </span>
                    <span className="text-[12px] font-bold text-orange-700 bg-primary-soft/60 px-3 py-1 rounded-full">تماس مستقیم</span>
                  </div>
                  <span className="block text-[13px] font-bold text-ink3">شماره تماس</span>
                  <span className="mt-2 block font-display font-black text-[20px] text-ink fa-num" dir="ltr" style={{ textAlign: "right" }}>
                    {settings.phoneDisplay}
                  </span>
                  <span className="mt-1 block text-[13px] text-ink2">خطوط تلفن دفتر و کارخانه</span>
                </div>
                <div className="mt-6 pt-4 border-t border-linesoft flex items-center gap-2 text-[12.5px] font-bold text-orange-700 group-hover:gap-3 transition-all">
                  <span>برقراری تماس</span>
                  <Icon name="arrowL" size={14} sw={2.2} />
                </div>
              </SmartLink>
            </Reveal>

            {/* Email */}
            <Reveal dir="r" delay={120}>
              <SmartLink
                href={`mailto:${settings.email}`}
                className="group flex flex-col justify-between h-full rounded-md border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary-soft text-orange-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <Icon name="mail" size={22} />
                    </span>
                    <span className="text-[12px] font-bold text-orange-700 bg-primary-soft/60 px-3 py-1 rounded-full">مکاتبات رسمی</span>
                  </div>
                  <span className="block text-[13px] font-bold text-ink3">ایمیل</span>
                  <span className="mt-2 block font-display font-black text-[20px] text-ink" dir="ltr" style={{ textAlign: "right" }}>
                    {settings.email}
                  </span>
                  <span className="mt-1 block text-[13px] text-ink2">ارسال استعلام، پیشنهادها و RFP</span>
                </div>
                <div className="mt-6 pt-4 border-t border-linesoft flex items-center gap-2 text-[12.5px] font-bold text-orange-700 group-hover:gap-3 transition-all">
                  <span>ارسال ایمیل</span>
                  <Icon name="arrowL" size={14} sw={2.2} />
                </div>
              </SmartLink>
            </Reveal>

            {/* Working Hours */}
            <Reveal dir="r" delay={180}>
              <div className="flex flex-col justify-between h-full rounded-md border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/30">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
                      <Icon name="clock" size={22} />
                    </span>
                    <span className="text-[12px] font-bold text-accent bg-accent-soft/60 px-3 py-1 rounded-full">روزهای کاری</span>
                  </div>
                  <span className="block text-[13px] font-bold text-ink3">ساعات کاری و حضور</span>
                  <span className="mt-2 block font-display font-bold text-[17px] text-ink leading-7">
                    {settings.workingHours}
                  </span>
                  <span className="mt-1 block text-[13px] text-ink2">پنج‌شنبه‌ها و ایام تعطیل رسمی: مجموعه تعطیل است</span>
                </div>
                <div className="mt-6 pt-4 border-t border-linesoft text-[12px] text-ink3">
                  پاسخگویی در ساعات اداری انجام می‌پذیرد.
                </div>
              </div>
            </Reveal>
          </div>

          {/* Secondary Row: Address, Bale Social Network, and Support Panel */}
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Address */}
            <Reveal dir="l" delay={60}>
              <div className="flex flex-col justify-between h-full rounded-md border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/30">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary-soft text-orange-700">
                      <Icon name="pin" size={22} />
                    </span>
                    <span className="text-[12px] font-bold text-orange-700 bg-primary-soft/60 px-3 py-1 rounded-full">کارخانه و دفتر مرکزی</span>
                  </div>
                  <span className="block text-[13px] font-bold text-ink3">آدرس رسمی</span>
                  <p className="mt-2 text-[15.5px] font-bold text-ink leading-8">
                    {settings.address}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-linesoft text-[12.5px] text-ink2">
                  بازدید حضوری با هماهنگی قبلی امکان‌پذیر است.
                </div>
              </div>
            </Reveal>

            {/* Bale Social Network */}
            <Reveal dir="l" delay={120}>
              <div className="flex flex-col justify-between h-full rounded-md border border-[#00B894]/40 bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-[#00B894]/70">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#00B894]/12 text-[#00785F]">
                      <Icon name="bale" size={24} />
                    </span>
                    <span className="text-[12px] font-bold text-[#00785F] bg-[#00B894]/12 px-3 py-1 rounded-full">شبکه اجتماعی فعال</span>
                  </div>
                  <span className="block text-[13px] font-bold text-ink3">کانال رسمی در پیام‌رسان بله</span>
                  <p className="mt-2 text-[15px] font-bold text-ink leading-7">
                    تنها شبکه اجتماعی فعال بهسا دیجیتال، پیام‌رسان «بله» است.
                  </p>
                  <p className="mt-1 text-[13px] text-ink2 leading-6">
                    اطلاعیه‌ها، آموزش‌ها و اخبار جدید را در کانال رسمی ما دنبال کنید.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-linesoft">
                  <SmartLink
                    href={settings.baleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-[9px] bg-[#00785F] px-4 py-2.5 text-[13.5px] font-bold text-white transition-all hover:bg-[#006F58] shadow-sm"
                  >
                    <span>عضویت در کانال بله (behsa_digital@)</span>
                    <Icon name="external" size={13} />
                  </SmartLink>
                </div>
              </div>
            </Reveal>

            {/* Support / Dashboard Panel */}
            <Reveal dir="l" delay={180}>
              <div className="flex flex-col justify-between h-full rounded-md border border-primary/25 bg-primary-soft/50 p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/40">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary text-on-primary">
                      <Icon name="bolt" size={22} />
                    </span>
                    <span className="text-[12px] font-bold text-orange-700 bg-surface px-3 py-1 rounded-full border border-primary/20">مشترکان سامانه</span>
                  </div>
                  <span className="block text-[13px] font-bold text-ink3">ورود به سامانه</span>
                  <p className="mt-2 text-[15px] font-bold text-ink leading-7">
                    پنل آنلاین مدیریت و پایش انرژی بهسا
                  </p>
                  <p className="mt-1 text-[13px] text-ink2 leading-6">
                    مشترکان فعلی می‌توانند جهت پایش لحظه‌ای و ثبت تیکت پشتیبانی وارد شوند.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-primary/20">
                  <SmartLink
                    href={settings.panelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-[9px] bg-primary px-4 py-2.5 text-[13.5px] font-bold text-on-primary transition-all hover:bg-primary-deep shadow-sm"
                  >
                    <span>ورود به سامانه بهسا</span>
                    <Icon name="external" size={13} />
                  </SmartLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Form — the only way a visitor without a panel account can
          start a conversation. Until this shipped, the page offered
          contact details and nothing else (docs/content-audit.md). */}
      <section className="relative bg-surface border-b border-line py-16 md:py-20">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[840px] px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-[22px] md:text-[26px] font-extrabold text-ink text-center">
              پیام خود را بفرستید
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-[14px] leading-8 text-ink2">
              برای مشاوره، استقرار سامانه یا هر پرسش فنی دربارهٔ مجموعهٔ خودتان.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-9 rounded-md border border-line bg-bg p-6 md:p-8 shadow-card">
              <LeadForm
                sourcePath="/contact"
                subject={subject || "تماس عمومی"}
                submitLabel="ارسال پیام"
                phoneDisplay={settings.phoneDisplay}
                phoneHref={settings.phoneHref}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Map · Location preview ── */}
      <section className="relative bg-surface border-t border-line py-14 md:py-16">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-line shadow-card">
              <svg viewBox="0 0 1200 340" className="w-full h-auto block bg-neutral-100" role="img" aria-label="موقعیت شرکت بهسا دیجیتال روی نقشه شهرک صنعتی توس">
                <g stroke="#D3DAE2" strokeWidth="1.5">
                  {Array.from({ length: 24 }, (_, i) => <line key={`v${i}`} x1={i * 52} y1="0" x2={i * 52} y2="340" />)}
                  {Array.from({ length: 8 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 48} x2="1200" y2={i * 48} />)}
                </g>
                <g stroke="#fff" strokeWidth="14" strokeLinecap="round">
                  <path d="M0 210 H1200" />
                  <path d="M300 0 V340" />
                  <path d="M820 0 V340" />
                  <path d="M0 80 H420 L560 30 H1200" />
                </g>
                <g stroke="#B2BCC6" strokeWidth="2" strokeDasharray="10 8">
                  <path d="M0 210 H1200" />
                </g>
                <g fill="#E5EAF0">
                  <rect x="330" y="110" width="180" height="72" rx="6" />
                  <rect x="560" y="40" width="120" height="60" rx="6" />
                  <rect x="860" y="240" width="200" height="70" rx="6" />
                  <rect x="90" y="240" width="150" height="70" rx="6" />
                  <rect x="900" y="90" width="140" height="80" rx="6" />
                </g>
                <rect x="560" y="240" width="150" height="80" rx="8" fill="#E1F2E7" />
                <circle cx="600" cy="275" r="9" fill="#A1D8B7" />
                <circle cx="640" cy="295" r="11" fill="#A1D8B7" />
                <circle cx="680" cy="268" r="8" fill="#A1D8B7" />
                <g transform="translate(600 130)">
                  <circle cx="0" cy="26" r="26" fill="#FA6400" opacity="0.16">
                    <animate attributeName="r" values="20;34;20" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <path d="M0-28C-14-28-24-18-24-5c0 16 24 38 24 38S24 11 24-5C24-18 14-28 0-28Z" fill="#FA6400" />
                  <circle cx="0" cy="-6" r="8" fill="#fff" />
                </g>
                <g transform="translate(600 62)">
                  <rect x="-140" y="-26" width="280" height="40" rx="8" fill="#16212E" />
                  <text x="0" y="0" textAnchor="middle" fontSize="14" fill="#fff" fontFamily="Vazirmatn" fontWeight="700">بهسا دیجیتال — شهرک صنعتی توس، پلاک ۳۷۰</text>
                </g>
              </svg>
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-sm bg-surface/95 border border-line px-4 py-2.5 text-[12.5px] font-bold text-ink shadow-card">
                <Icon name="pin" size={15} className="text-orange-700" />
                مشهد، شهرک صنعتی توس، فاز یک
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
