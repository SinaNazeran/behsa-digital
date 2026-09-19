import { cn } from "../lib/utils";
import { Icon } from "./icons";
import type { NavSectionView } from "@/content/navigation";
import { SmartLink } from "@/components/SmartLink";

/* Desktop mega-menu panel — light surface · RTL: intro column rightmost. */

export function MegaMenu({ section, activePath }: { section: NavSectionView; activePath?: string }) {
  return (
    <div className="grid gap-8 p-7 lg:grid-cols-12 lg:gap-6 lg:p-8">
      {/* intro column — rightmost in RTL */}
      <div className="lg:col-span-3 lg:border-l lg:border-line lg:pl-6">
        <p className="text-[11.5px] font-bold text-orange-700">{section.title} بهسا</p>
        {section.intro?.title && <h3 className="mt-3 font-display text-[19px] font-extrabold text-ink">{section.intro.title}</h3>}
        {section.intro?.description && <p className="mt-3 text-[13px] leading-7 text-ink2">{section.intro.description}</p>}
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

      {/* item grid */}
      <div className="lg:col-span-9">
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
      </div>
    </div>
  );
}
