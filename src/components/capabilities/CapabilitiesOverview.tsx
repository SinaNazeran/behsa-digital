import { cn } from "../../utils/cn";
import { Icon } from "../icons";
import { Reveal } from "../ui";
import {
  CAPABILITY_CATEGORIES, STAGE_META, featureCount, type NarrativeStage,
} from "@/content/capabilities";
import { SmartLink } from "@/components/SmartLink";

/* «معرفی پلتفرم» — overview grid of the 7 real capability categories.
   Naming only (no marketing copy); narrative stage + counts + links. */

const STAGE_ORDER: NarrativeStage[] = ["data", "intelligence", "decision", "optimization", "outcome"];

export function CapabilitiesOverview() {
  return (
    <div>
      {/* narrative pipeline legend */}
      <Reveal>
        <div className="rounded-m border border-line bg-surface p-5">
          <p className="text-[12.5px] font-bold text-ink3">جای‌گذاری قابلیت‌ها در روایت بهسا</p>
          <div className="mt-4 flex flex-wrap items-center gap-y-3" aria-label="مراحل روایت: داده، هوشمندی، تصمیم، بهینه‌سازی، نتیجه کسب و کار">
            {STAGE_ORDER.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-2 rounded-s px-3.5 py-2 text-[12.5px] font-bold"
                  style={{ background: STAGE_META[s].soft, color: STAGE_META[s].color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: STAGE_META[s].color }} />
                  {STAGE_META[s].label}
                </span>
                {i < STAGE_ORDER.length - 1 && (
                  <Icon name="arrowL" size={13} sw={2.2} className="hidden text-line sm:block" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* category grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {CAPABILITY_CATEGORIES.map((c, i) => {
          const stage = STAGE_META[c.narrativeStage];
          const soon = c.status === "coming-soon";
          const count = featureCount(c);
          return (
            <Reveal key={c.id} delay={(i % 3) * 90}>
              <article
                className={cn(
                  "group relative flex h-full flex-col rounded-m border bg-surface p-6 transition-all duration-300",
                  soon
                    ? "border-dashed border-line bg-bg/60"
                    : "border-line hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/35",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-s transition-colors duration-300",
                      soon ? "bg-linesoft text-ink3" : "bg-primary-soft text-orange-700 group-hover:bg-primary group-hover:text-on-primary",
                    )}
                  >
                    <Icon name={c.icon} size={23} />
                  </span>
                  {soon ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xs border border-line bg-linesoft px-2.5 py-1 text-[11.5px] font-bold text-ink3">
                      <Icon name="clock" size={12} sw={2} />
                      به‌زودی
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-xs px-2.5 py-1 text-[11.5px] font-bold"
                      style={{ background: stage.soft, color: stage.color }}
                    >
                      {stage.label}
                    </span>
                  )}
                </div>

                <h3 className={cn("mt-5 font-display text-[17px] font-bold", soon ? "text-ink2" : "text-ink")}>{c.title}</h3>

                <p className="mt-2.5 flex items-center gap-2 text-[12.5px] font-semibold text-ink3 fa-num">
                  <Icon name="board" size={14} />
                  {soon ? "در فاز بعدی فعال می‌شود" : `${count.toLocaleString("fa-IR")} قابلیت`}
                </p>

                <div className="mt-auto pt-5">
                  {soon ? (
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink3">
                      ثبت‌شده در نقشهٔ محصول
                    </span>
                  ) : (
                    <SmartLink
                      href={c.href}
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 hover:gap-3 transition-all"
                    >
                      مشاهدهٔ فهرست قابلیت‌ها
                      <Icon name="arrowL" size={14} sw={2.2} />
                    </SmartLink>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
