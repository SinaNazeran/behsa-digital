import { Icon } from "./icons";
import { BehsaLogo } from "./BehsaLogo";
import { Btn } from "./ui";
import { faNum } from "@/lib/format";
import type { SiteSettings } from "@/db/schema";
import { NAV_CONTACT, type NavSectionView } from "@/content/navigation";
import { SmartLink } from "@/components/SmartLink";

/* ── Footer — 4-column RTL grid ── */
export function Footer({ settings, sections }: { settings: SiteSettings; sections: NavSectionView[] }) {
  const year = new Intl.DateTimeFormat("en-u-ca-persian", { year: "numeric", timeZone: "Asia/Tehran" }).format(new Date()).replace(/\D/g, "");
  return (
    <footer className="bg-neutral-100 text-ink2 relative overflow-hidden border-t border-line">
      <div className="absolute inset-0 grid-light opacity-70" />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 pt-16 pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand — rightmost */}
          <div className="lg:col-span-4">
            <BehsaLogo variant="stacked-with-text" height={54} autoplay={false} />
            <p className="mt-5 text-[13.5px] leading-7 max-w-xs">
              {settings.footerAbout}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <SmartLink
                href={settings.baleUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="کانال بله بهسا دیجیتال"
                title="کانال رسمی بهسا دیجیتال در پیام‌رسان بله"
                className="inline-flex items-center gap-2.5 h-10 px-3.5 rounded-s border border-line bg-surface text-ink hover:text-white hover:border-[#00B894] hover:bg-[#00B894] transition-all text-[13px] font-bold shadow-sm"
              >
                <Icon name="bale" size={18} />
                <span>کانال بله بهسا دیجیتال</span>
                <Icon name="external" size={12} className="opacity-70" />
              </SmartLink>
            </div>
          </div>

          {/* صفحات اصلی */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-[15px] text-ink mb-5">صفحات اصلی</h3>
            <ul className="space-y-3 text-[13.5px]">
              {sections.map((n) => (
                <li key={n.id}>
                  <SmartLink
                    href={n.href}
                    target={n.newTab ? "_blank" : undefined}
                    rel={n.newTab ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 hover:text-orange-700 transition-colors group"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2.5 transition-all" />
                    {n.title}
                  </SmartLink>
                </li>
              ))}
              <li>
                <SmartLink href={NAV_CONTACT.href} className="inline-flex items-center gap-2 hover:text-orange-700 transition-colors group">
                  <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2.5 transition-all" />
                  {NAV_CONTACT.title}
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  href={settings.panelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-orange-700 hover:text-primary-deep transition-colors group"
                >
                  <span className="h-1 w-1 rounded-full bg-primary group-hover:w-2.5 transition-all" />
                  ورود به سامانه (پنل)
                  <Icon name="external" size={12} className="opacity-70" />
                </SmartLink>
              </li>
            </ul>
          </div>

          {/* محصولات و خدمات */}
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-[15px] text-ink mb-5">محصولات و خدمات</h3>
            <ul className="space-y-3 text-[13.5px]">
              {[
                { l: "پایش و تحلیل مصرف", p: "/product/capabilities/consumption-monitoring" },
                { l: "مدیریت و بهینه‌سازی دیماند", p: "/solutions/demand-management" },
                { l: "کیفیت توان و توان راکتیو", p: "/solutions/power-quality" },
                { l: "تأمین و خرید بهینه انرژی", p: "/solutions/energy-procurement" },
                { l: "خدمات مشاوره تخصصی", p: "/services" },
                { l: "مقالات و تحلیل‌های انرژی", p: "/articles" },
              ].map((n) => (
                <li key={n.l}>
                  <SmartLink href={n.p} className="inline-flex items-center gap-2 hover:text-orange-700 transition-colors group">
                    <span className="h-1 w-1 rounded-full bg-primary/50 group-hover:w-2.5 transition-all" />
                    {n.l}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          {/* تماس — leftmost */}
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-[15px] text-ink mb-5">تماس با ما</h3>
            <ul className="space-y-3.5 text-[13.5px]">
              <li className="flex items-start gap-3">
                <Icon name="phone" size={16} className="text-orange-700 mt-0.5 shrink-0" />
                <SmartLink href={settings.phoneHref} className="fa-num hover:text-orange-700 transition-colors" dir="ltr">{settings.phoneDisplay}</SmartLink>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="mail" size={16} className="text-orange-700 mt-0.5 shrink-0" />
                <SmartLink href={`mailto:${settings.email}`} className="hover:text-orange-700 transition-colors" dir="ltr">{settings.email}</SmartLink>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="clock" size={16} className="text-orange-700 mt-0.5 shrink-0" />
                <span>{settings.workingHours}</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="pin" size={16} className="text-orange-700 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
            </ul>
            <Btn href={settings.panelUrl} target="_blank" size="md" className="mt-6 w-full" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4 text-[12.5px] text-ink3">
          <p>© {faNum(year)} {settings.siteName} — کلیه حقوق محفوظ است.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-dot" />
            ساخته‌شده بر پایه داده؛ برای تصمیم‌های بهتر
          </p>
        </div>
      </div>
    </footer>
  );
}
