import type { CSSProperties } from "react";
import { CUSTOMERS } from "@/content/customers";
import { cn } from "@/lib/utils";

/* ── Customer logo marquee · lives at the base of the hero, over the same media ──
   Logos come from src/content/customers.ts; the title and on/off switch
   from the CMS (Admin → نوار لوگوی مشتریان).

   Every logo is rendered in solid white so no single brand colour
   outshouts the rest over the footage. Size follows equal visual weight,
   not equal height: height ∝ ratio^-0.4, so a wide wordmark is shorter
   than a square emblem but never shrinks to an unreadable sliver.
   The duplicated half is hidden from assistive tech.

   Speed is constant in px/s, not in loop time: the duration is derived
   from the row's real width, so adding a logo or changing breakpoint
   never makes the strip crawl (sub-pixel steps read as judder) or race. */

const weight = (ratio: number) => Math.min(1.25, Math.max(0.62, ratio ** -0.4));

/* px — must match the [--logo:…] and px-… classes on the list below */
const SIZES = { sm: { logo: 52, pad: 32 }, md: { logo: 66, pad: 48 } };
const SPEED = 60; // px per second

export function LogoStrip({ title }: { title: string }) {
  if (CUSTOMERS.length === 0) return null;
  /* a short list would leave a gap mid-loop — repeat it until it fills */
  const base = CUSTOMERS.length < 5 ? Array.from({ length: Math.ceil(5 / CUSTOMERS.length) }, () => CUSTOMERS).flat() : CUSTOMERS;
  const row = [...base, ...base];
  /* one loop travels exactly one copy of the list */
  const loopSeconds = ({ logo, pad }: { logo: number; pad: number }) =>
    (base.reduce((w, c) => w + logo * weight(c.ratio) * c.ratio + 2 * pad, 0) / SPEED).toFixed(1) + "s";

  return (
    <div className="relative py-10 md:py-14" aria-label={title || "مشتریان بهسا"}>
      {title && (
        <p className="px-5 text-center font-display text-[15px] font-extrabold text-white/90 [text-shadow:0_1px_12px_rgb(3_9_18/0.8)] md:text-[19px]">
          {title}
        </p>
      )}

      {/* edges fade by mask, not by painted overlays, so they melt into
          whatever footage is behind them */}
      <div
        dir="ltr"
        className={cn(
          "overflow-hidden [--fade:5rem] md:[--fade:8rem] [mask-image:linear-gradient(to_right,transparent,#000_var(--fade),#000_calc(100%-var(--fade)),transparent)]",
          title && "mt-7 md:mt-10",
        )}
      >
        <ul
          className="ticker-track flex w-max items-center [--logo:52px] [--ticker-dur:var(--t-sm)] md:[--logo:66px] md:[--ticker-dur:var(--t-md)]"
          style={{ "--t-sm": loopSeconds(SIZES.sm), "--t-md": loopSeconds(SIZES.md) } as CSSProperties}
        >
          {row.map((c, i) => (
            <li key={`${c.logo}-${i}`} aria-hidden={i >= base.length} className="flex h-[calc(var(--logo)*1.25)] shrink-0 items-center px-8 md:px-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.logo}
                alt={i >= base.length ? "" : c.name}
                title={c.name}
                width={Math.round(40 * c.ratio)}
                height={40}
                /* not lazy: a lazy logo loads while sliding into view and
                   stalls the strip mid-motion; low priority keeps the 16
                   small files from competing with the hero media */
                fetchPriority="low"
                decoding="async"
                draggable={false}
                style={{ height: `calc(var(--logo) * ${weight(c.ratio).toFixed(3)})` }}
                className="w-auto select-none opacity-70 brightness-0 invert drop-shadow-[0_2px_10px_rgb(3_9_18/0.6)] transition-opacity duration-300 hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
