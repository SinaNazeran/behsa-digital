import { cn } from "../../utils/cn";
import { Icon } from "../icons";
import { Reveal } from "../ui";
import { featureCount, type CapabilityCategory, type ContentBlock } from "@/content/capabilities";

/* Body of every page driven by content/capabilities.ts.

   Two shapes share one component:
   - capability pages carry `featureGroups` — verbatim feature names,
     rendered as a grouped, scannable list;
   - solution / industry pages carry `sections` — prose blocks
     with optional bullet lists (ContentBlocks, shared with report pages).

   Either may be present, both may be present, and neither breaks the
   page: a node with no body still renders its lead. */

export function CapabilityFeatureList({ category }: { category: CapabilityCategory }) {
  const soon = category.status === "coming-soon";
  const groups = category.featureGroups;
  const sections = category.sections ?? [];

  if (soon) {
    return (
      <Reveal>
        <div className="rounded-md border-2 border-dashed border-line bg-surface p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linesoft text-ink3">
            <Icon name="clock" size={26} />
          </span>
          <h2 className="mt-5 font-display text-[19px] font-extrabold text-ink">این بخش در فاز بعدی فعال می‌شود</h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-7 text-ink2">
            «{category.title}» در نقشهٔ محصول ثبت شده است؛ محتوای آن پس از انتشار اضافه خواهد شد.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div>
      {category.description && (
        <Reveal>
          <p className="text-[15.5px] leading-9 text-ink2">{category.description}</p>
        </Reveal>
      )}

      {/* the narrative stage itself is drawn in the hero (Landing StageTrack) */}
      {groups.length > 0 && (
        <Reveal>
          <div className={cn("flex flex-wrap items-center gap-3", category.description && "mt-7")}>
            <span className="text-[12.5px] font-semibold text-ink3 fa-num">
              {featureCount(category).toLocaleString("fa-IR")} قابلیت در {groups.length.toLocaleString("fa-IR")} گروه
            </span>
          </div>
        </Reveal>
      )}

      {/* prose sections — solutions and industries */}
      {sections.length > 0 && <ContentBlocks blocks={sections} className={category.description ? "mt-8" : "mt-2"} />}

      {/* verbatim feature names — capability pages */}
      {groups.length > 0 && (
        <div className="mt-6 space-y-6">
          {groups.map((group, gi) => (
            <Reveal key={group.title ?? gi} delay={gi * 80}>
              <section className="rounded-md border border-line bg-surface p-6 md:p-7">
                {group.title && (
                  <h3 className="flex items-center gap-3 font-display text-[16px] font-extrabold text-ink">
                    <span className="inline-block h-5 w-1.5 rounded-full bg-primary" />
                    {group.title}
                  </h3>
                )}
                <ul className={cn("mt-1", group.title && "mt-5")}>
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="group flex items-start gap-3 border-b border-linesoft py-3.5 last:border-0 last:pb-0 transition-colors hover:bg-bg/70 rounded-sm px-2 -mx-2"
                    >
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-primary-soft text-orange-700 transition-colors group-hover:bg-primary group-hover:text-on-primary">
                        <Icon name="check" size={12} sw={2.6} />
                      </span>
                      <span className="text-[14px] font-medium leading-7 text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

/** prose blocks with optional bullet lists — solution, industry and report pages */
export function ContentBlocks({ blocks, className }: { blocks: ContentBlock[]; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {blocks.map((block, bi) => (
        <Reveal key={bi} delay={bi * 70}>
          <section className="rounded-md border border-line bg-surface p-6 md:p-7">
            <h2 className="flex items-center gap-3 font-display text-[16px] font-extrabold text-ink">
              <span className="inline-block h-5 w-1.5 rounded-full bg-primary" />
              {block.title}
            </h2>
            {block.body?.map((para, pi) => (
              <p key={pi} className="mt-4 text-[14.5px] leading-9 text-ink2">{para}</p>
            ))}
            {block.items && block.items.length > 0 && (
              <ul className="mt-5">
                {block.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="group flex items-start gap-3 border-b border-linesoft py-3.5 last:border-0 last:pb-0 transition-colors hover:bg-bg/70 rounded-sm px-2 -mx-2"
                  >
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-primary-soft text-orange-700 transition-colors group-hover:bg-primary group-hover:text-on-primary">
                      <Icon name="check" size={12} sw={2.6} />
                    </span>
                    <span className="text-[14px] font-medium leading-7 text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>
      ))}
    </div>
  );
}
