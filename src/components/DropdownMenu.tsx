import { cn } from "../lib/utils";
import { Icon } from "./icons";
import type { NavSectionView } from "@/content/navigation";
import { SmartLink } from "@/components/SmartLink";

/* Desktop simple dropdown — light surface · for منابع / درباره ما. */

export function DropdownMenu({ section, activePath }: { section: NavSectionView; activePath?: string }) {
  return (
    <ul className="w-[300px] p-2.5">
      {section.items.map((item) => (
        <li key={item.id}>
          <SmartLink
            href={item.href}
            target={item.newTab ? "_blank" : undefined}
            rel={item.newTab ? "noopener noreferrer" : undefined}
            className={cn(
              "group flex items-center gap-3.5 rounded-[10px] px-3.5 py-3 transition-colors duration-200",
              activePath === item.href ? "bg-primary-soft/70" : "hover:bg-bg",
            )}
          >
            {/* same hover language as the mega menu: tint, not invert */}
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-s border border-line bg-bg text-orange-700 transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary-soft">
              {item.icon && <Icon name={item.icon} size={17} />}
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-bold text-ink transition-colors group-hover:text-orange-700">{item.title}</span>
              {item.description && <span className="mt-0.5 block truncate text-[11.5px] text-ink3">{item.description}</span>}
            </span>
            <Icon name="arrowL" size={13} className="mr-auto text-ink3 opacity-0 transition-all group-hover:opacity-100" />
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
