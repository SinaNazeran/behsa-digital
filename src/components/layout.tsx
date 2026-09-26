import { Icon } from "./icons";
import { BehsaLogo } from "./BehsaLogo";
import { Btn } from "./ui";
import { faNum } from "@/lib/format";
import type { SiteSettings } from "@/db/schema";
import { NAV_CONTACT, NAV_CTA_LABEL, type NavSectionView } from "@/content/navigation";
import { SmartLink } from "@/components/SmartLink";

/* ── Footer — 4-column RTL grid ──
   Deep brand blue (blue-700 → blue-800): the heaviest brand tone on the
   page, so every page — whatever light band it ends on — lands on it,
   and one step deeper than the blue-600 CTA banner above it on the home
   page. White text holds 8.15:1 at the top and 10.79:1 at the bottom.

   The logo cannot sit on this ground directly: its mark is blue-600
   (1.35:1 on blue-700) and «EHSA» orange-500, which reaches 3:1 only on
   pure white. So it sits on a solid white plate — not glass, which would
   let the blue through and pull the orange under 3:1 — echoing the white
   navbar capsule the page opened with.

   Glass is used once, for the contact card (glass-on-brand, as on the
   blue and green bands); the link columns stay flat. */
const LINK = "inline-flex min-h-10 lg:min-h-0 items-center gap-2 text-blue-100 hover:text-white transition-colors group";
const HEADING = "flex items-center gap-2.5 font-display font-bold text-[15px] text-white mb-4 lg:mb-5";

const Dot = () => <span className="h-1 w-1 rounded-full bg-orange-300/60 group-hover:w-2.5 group-hover:bg-orange-300 transition-all duration-300 ease-fluid" />;
const Bar = () => <span className="h-4 w-1 rounded-full bg-orange-400" />;

export function Footer({ settings, sections }: { settings: SiteSettings; sections: NavSectionView[] }) {
  const year = new Intl.DateTimeFormat("en-u-ca-persian", { year: "numeric", timeZone: "Asia/Tehran" }).format(new Date()).replace(/\D/g, "");
  return (
    <footer className="on-brand relative overflow-hidden bg-gradient-to-b from-blue-700 to-blue-800 text-blue-100">
      <div className="absolute inset-0 grid-dark grid-fade opacity-40" />
      {/* the footer's one light, behind the contact card so its glass has something to hold */}
      <div className="absolute -top-40 -left-24 h-[420px] w-[560px] rounded-full bg-blue-500/30 blur-3xl pointer-events-none" />
      {/* light catching the top edge, in place of a divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/35 to-transparent" />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-10">
          {/* Brand — rightmost */}
          <div className="col-span-2 lg:col-span-4">
            <div className="on-light inline-flex rounded-sheet bg-surface px-5 py-4 shadow-[0_24px_48px_-20px_rgb(0_20_45/0.65)] ring-1 ring-white/60">
              <BehsaLogo variant="stacked-with-text" height={54} autoplay={false} />
            </div>
            <p className="mt-6 text-[13.5px] leading-7 max-w-xs">
              {settings.footerAbout}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <SmartLink
                href={settings.baleUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="کانال بله بهسا دیجیتال"
                title="کانال رسمی بهسا دیجیتال در پیام‌رسان بله"
                className="inline-flex items-center gap-2.5 h-10 px-3.5 rounded-md border border-white/20 bg-white/10 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] hover:border-[#00B894] hover:bg-[#00B894] active:scale-[0.98] transition-all duration-300 ease-fluid text-[13px] font-bold"
              >
                <Icon name="bale" size={18} />
                <span>کانال بله بهسا دیجیتال</span>
                <Icon name="external" size={12} className="opacity-70" />
              </SmartLink>
            </div>
          </div>

          {/* صفحات اصلی */}
          <div className="lg:col-span-2">
            <h3 className={HEADING}><Bar />صفحات اصلی</h3>
            <ul className="space-y-0.5 lg:space-y-3 text-[13.5px]">
              {sections.map((n) => (
                <li key={n.id}>
                  <SmartLink
                    href={n.href}
                    target={n.newTab ? "_blank" : undefined}
                    rel={n.newTab ? "noopener noreferrer" : undefined}
                    className={LINK}
                  >
                    <Dot />
                    {n.title}
                  </SmartLink>
                </li>
              ))}
              <li>
                <SmartLink href={NAV_CONTACT.href} className={LINK}>
                  <Dot />
                  {NAV_CONTACT.title}
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  href={settings.panelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 lg:min-h-0 items-center gap-2 font-bold text-orange-300 hover:text-orange-200 transition-colors group"
                >
                  <span className="h-1 w-1 rounded-full bg-orange-300 group-hover:w-2.5 transition-all duration-300 ease-fluid" />
                  ورود به سامانه (پنل)
                  <Icon name="external" size={12} className="opacity-70" />
                </SmartLink>
              </li>
            </ul>
          </div>

          {/* report categories come from the catalogue (Admin → دسته‌بندی
              گزارش‌ها), so a renamed or added category shows up here too */}
          <div className="lg:col-span-3">
            <h3 className={HEADING}><Bar />گزارش‌ها و منابع</h3>
            <ul className="space-y-0.5 lg:space-y-3 text-[13.5px]">
              {[
                ...(sections.find((s) => s.groups)?.groups ?? []).map((g) => ({ l: g.title, p: g.href })),
                { l: "الزامات قانونی تأمین برق", p: "/solutions/article-16" },
                { l: "مقالات و تحلیل‌های انرژی", p: "/articles" },
              ].map((n) => (
                <li key={n.l}>
                  <SmartLink href={n.p} className={LINK}>
                    <Dot />
                    {n.l}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          {/* تماس — leftmost */}
          <div className="col-span-2 lg:col-span-3 glass-panel glass-on-brand rounded-lg p-6 self-start">
            <h3 className={HEADING}><Bar />تماس با ما</h3>
            <ul className="space-y-3.5 text-[13.5px] text-white">
              <li className="flex items-center gap-3">
                <span className="tone-orange kpi-icon h-7 w-7 rounded-sm!"><Icon name="phone" size={14} /></span>
                <SmartLink href={settings.phoneHref} className="fa-num hover:text-orange-200 transition-colors" dir="ltr">{settings.phoneDisplay}</SmartLink>
              </li>
              <li className="flex items-center gap-3">
                <span className="tone-orange kpi-icon h-7 w-7 rounded-sm!"><Icon name="mail" size={14} /></span>
                <SmartLink href={`mailto:${settings.email}`} className="hover:text-orange-200 transition-colors" dir="ltr">{settings.email}</SmartLink>
              </li>
              <li className="flex items-center gap-3">
                <span className="tone-orange kpi-icon h-7 w-7 rounded-sm!"><Icon name="clock" size={14} /></span>
                <span>{settings.workingHours}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="tone-orange kpi-icon h-7 w-7 rounded-sm!"><Icon name="pin" size={14} /></span>
                <span>{settings.address}</span>
              </li>
            </ul>
            <Btn href={settings.panelUrl} target="_blank" size="md" className="mt-6 w-full" icon="login" ariaLabel={`${NAV_CTA_LABEL} (باز شدن در پنجره جدید)`}>{NAV_CTA_LABEL}</Btn>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-[12.5px] text-blue-200">
          <p>© {faNum(year)} {settings.siteName} — کلیه حقوق محفوظ است.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 pulse-dot" />
            محاسبه، پیش از صدور قبض.
          </p>
        </div>
      </div>
    </footer>
  );
}
