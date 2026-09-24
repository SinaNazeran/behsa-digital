import { cn } from "../lib/utils";
import { Icon } from "./icons";
import type { NavSectionView } from "@/content/navigation";
import { SmartLink } from "@/components/SmartLink";

/* Desktop mega-menu panel — light surface · RTL: intro column rightmost.
   A section with `groups` (the report catalogue) renders one block per
   category instead of the flat item grid. */

export function MegaMenu({ section, activePath }: { section: NavSectionView; activePath?: string }) {
  return (
    <div className="grid gap-8 p-7 lg:grid-cols-12 lg:gap-6 lg:p-8">
      {/* intro column — rightmost in RTL */}
      <div className="lg:col-span-3 lg:border-l lg:border-line lg:pl-6">
        <p className="text-[11.5px] font-bold text-orange-700">{section.title} بهسا</p>
        {section.intro?.title && <h3 className="mt-3 font-display text-[19px] font-extrabold text-ink">{section.intro.title}</h3>}
        {section.intro?.description && <p className="mt-3 text-[13px] leading-7 text-ink2">{section.intro.description}</p>}
        {section.groups && <ReportSearchForm id="nav-report-search" className="mt-4" />}
        {section.intro?.cta && (
          <SmartLink
            href={section.intro.cta.href}
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-orange-700 transition-all hover:gap-3.5 hover:text-primary-deep"
          >
            {section.intro.cta.label}
            <Icon name="arrowL" size={14} sw={2.2} />
          </SmartLink>
        )}
        <SmartLink
          href={section.href}
          className="mt-3 flex items-center gap-2 text-[12px] font-semibold text-ink3 transition-colors hover:text-orange-700"
        >
          مرور همهٔ {section.title}
          <Icon name="arrowL" size={12} sw={2.2} />
        </SmartLink>
      </div>

      {/* item grid — or, for the report catalogue, one block per category */}
      <div className="lg:col-span-9">
        {section.groups ? (
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
            {section.groups.map((group) => (
              <section key={group.id} aria-labelledby={`nav-group-${group.id}`}>
                <h3 id={`nav-group-${group.id}`}>
                  <SmartLink href={group.href} className="group flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 text-[13.5px] font-extrabold text-ink transition-colors hover:text-orange-700">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-line bg-bg text-orange-700 transition-colors group-hover:border-primary/40 group-hover:bg-primary-soft">
                      {group.icon && <Icon name={group.icon} size={16} />}
                    </span>
                    {group.title}
                  </SmartLink>
                </h3>
                <ul className="mt-1 border-r border-linesoft pr-3 mr-6">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <SmartLink
                        href={item.href}
                        className={cn(
                          "block rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold transition-colors",
                          activePath === item.href ? "bg-primary-soft/70 text-orange-700" : "text-ink2 hover:bg-bg hover:text-orange-700",
                        )}
                      >
                        {item.title}
                      </SmartLink>
                    </li>
                  ))}
                  {group.more && (
                    <li>
                      <SmartLink href={group.href} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-bold text-orange-700 hover:gap-2.5 transition-all">
                        همهٔ گزارش‌های این دسته
                        <Icon name="arrowL" size={11} sw={2.2} />
                      </SmartLink>
                    </li>
                  )}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className={cn("grid gap-1.5", section.items.length > 6 ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")}>
            {section.items.map((item) => (
              <li key={item.id}>
                <SmartLink
                  href={item.href}
                  target={item.newTab ? "_blank" : undefined}
                  rel={item.newTab ? "noopener noreferrer" : undefined}
                  className={cn(
                    "group flex items-start gap-3.5 rounded-[12px] p-3.5 transition-colors duration-200",
                    activePath === item.href ? "bg-primary-soft/70" : "hover:bg-bg",
                  )}
                >
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-bg text-orange-700 transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary-soft">
                    {item.icon && <Icon name={item.icon} size={19} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold text-ink transition-colors group-hover:text-orange-700">{item.title}</span>
                    {item.description && <span className="mt-1 block text-[12px] leading-5.5 text-ink2">{item.description}</span>}
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** a plain GET form: /reports?q=… — the catalogue page applies the query */
export function ReportSearchForm({ id, className }: { id: string; className?: string }) {
  return (
    <form action="/reports" method="get" role="search" className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">جستجوی گزارش</label>
      <Icon name="search" size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink3" />
      <input
        id={id}
        name="q"
        type="search"
        required
        placeholder="جستجوی گزارش…"
        className="h-10 w-full rounded-[10px] border border-line bg-bg pr-9 pl-3 text-[13px] text-ink placeholder:text-ink3 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      />
    </form>
  );
}
