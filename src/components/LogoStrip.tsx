import { Icon } from "./icons";
import type { SectionItemView } from "@/lib/cms";

/* ── Audience marquee · lives at the base of the hero, over the same media ──
   Companies come from the CMS (Admin → مخاطبان بهسا): name, an icon from
   the built-in set, or an uploaded logo. The duplicated half is hidden
   from assistive tech, and the loop works with any number of entries. */

export function LogoStrip({ title, items }: { title: string; items: SectionItemView[] }) {
  if (items.length === 0) return null;
  /* a short list would leave a gap mid-loop — repeat it until it fills */
  const base = items.length < 5 ? Array.from({ length: Math.ceil(5 / items.length) }, () => items).flat() : items;
  const row = [...base, ...base];

  return (
    <div className="relative py-8 md:py-10" aria-label={title || "مخاطبان بهسا"}>
      {title && (
        <p className="px-5 text-center text-[12px] font-bold text-white/85 [text-shadow:0_1px_12px_rgb(3_9_18/0.8)] md:text-[13px]">
          {title}
        </p>
      )}

      <div className={title ? "relative mt-6" : "relative"} dir="ltr">
        {/* edge fades melt the loop into the darkened footage */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-navy to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-navy to-transparent md:w-32" />

        <div className="ticker-track flex w-max items-center">
          {row.map((l, i) => (
            <span
              key={`${l.id}-${i}`}
              aria-hidden={i >= base.length}
              dir="rtl"
              className="flex shrink-0 cursor-default items-center gap-2.5 pr-12 text-white opacity-60 transition-opacity duration-300 hover:opacity-100 md:pr-16"
            >
              {l.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={l.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-auto max-w-[96px] shrink-0 object-contain drop-shadow-[0_2px_8px_rgb(3_9_18/0.6)] md:h-7"
                />
              ) : (
                <Icon
                  name={l.icon ?? "factory"}
                  size={22}
                  className="shrink-0 drop-shadow-[0_2px_8px_rgb(3_9_18/0.6)]"
                />
              )}
              <span className="whitespace-nowrap font-display text-[15px] font-extrabold [text-shadow:0_1px_10px_rgb(3_9_18/0.75)] md:text-[16px]">
                {l.title}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
