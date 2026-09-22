import { MediaLayer, HERO_FALLBACK_IMAGE } from "./MediaLayer";
import { Button } from "../ui/Button";
import { Reveal } from "../ui";
import { RevealOnLoad } from "../RevealOnLoad";
import { AccentText } from "../AccentText";
import { LogoStrip } from "../LogoStrip";
import type { SectionView } from "@/lib/cms";

/* Every word, button and media file below comes from the CMS
   (Admin → بخش هیرو). Missing pieces are simply not rendered: the
   layout stays valid with no eyebrow, no text, no buttons and no
   media — the section keeps its own height and the page below it
   never moves. */

const TITLE_SIZE = "block text-[clamp(2rem,1.1rem+4.4vw,4.625rem)] [@media(max-height:560px)]:text-[clamp(1.5rem,5.5vh,2.25rem)]";

export function Hero({ hero, companies }: { hero: SectionView; companies: SectionView }) {
  const poster = hero.imageUrl ?? HERO_FALLBACK_IMAGE;
  const mobilePoster = hero.mobileImageUrl ?? poster;
  const video = hero.videoEnabled && hero.videoUrl ? hero.videoUrl : undefined;
  const buttons = hero.items;

  return (
    <section className="relative isolate min-h-[100vh] supports-[height:1svh]:min-h-[100svh] overflow-hidden bg-navy text-white">
      {/* ── bright, alive media bed: sunny aerial footage with focal legibility scrim ── */}
      <MediaLayer poster={poster} mobilePoster={mobilePoster} videoSrc={video} tone="dark" />

      {/* ── centered statement ── */}
      <div className="relative z-20 mx-auto flex min-h-[100vh] supports-[height:1svh]:min-h-[100svh] max-w-[1080px] flex-col items-center justify-center px-5 pt-[clamp(88px,14vh,168px)] pb-[clamp(64px,10vh,120px)] text-center md:px-8 [@media(max-height:560px)]:pt-20 [@media(max-height:560px)]:pb-12">
        {hero.eyebrow && (
          <RevealOnLoad>
            {/* Luminous enterprise IoT telemetry badge — maximum WCAG contrast with frosted glass isolation */}
            <p className="mb-6 flex items-center justify-center gap-3 [@media(max-height:560px)]:hidden">
              <span className="h-px w-8 bg-gradient-to-l from-primary/70 to-transparent" aria-hidden="true" />
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-navy/85 px-4 py-1.5 text-[13.5px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_20px_rgba(2,8,20,0.6)] backdrop-blur-xl md:px-5 md:py-2 md:text-[14px]">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                </span>
                <span className="tracking-normal [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">{hero.eyebrow}</span>
              </span>
              <span className="h-px w-8 bg-gradient-to-r from-primary/70 to-transparent" aria-hidden="true" />
            </p>
          </RevealOnLoad>
        )}

        {hero.title && (
          <RevealOnLoad delay={90}>
            {/* high-contrast white headline with dual-layer optical occlusion shadow */}
            <h1 className="font-display font-black leading-[1.4] tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] [text-shadow:0_4px_24px_rgba(0,0,0,0.6)] [@media(max-height:560px)]:leading-[1.25]">
              <AccentText
                text={hero.title}
                lineClass={TITLE_SIZE}
                accentClass="text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] [text-shadow:0_0_24px_rgba(250,100,0,0.65),0_0_48px_rgba(250,100,0,0.3)]"
              />
            </h1>
          </RevealOnLoad>
        )}

        {hero.description && (
          <RevealOnLoad delay={170}>
            <p className="relative mx-auto mt-[clamp(16px,2.5vh,24px)] max-w-2xl text-[15.5px] font-medium leading-8 text-neutral-100/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] [text-shadow:0_2px_14px_rgba(0,0,0,0.55)] md:text-[17.5px] md:leading-9 [@media(max-height:560px)]:mt-3 [@media(max-height:560px)]:max-w-xl [@media(max-height:560px)]:text-[13.5px] [@media(max-height:560px)]:leading-6">
              {hero.description}
            </p>
          </RevealOnLoad>
        )}

        {buttons.length > 0 && (
          <RevealOnLoad delay={250}>
            <div className="mt-[clamp(24px,4vh,40px)] flex flex-wrap items-center justify-center gap-4 [@media(max-height:560px)]:mt-5 [@media(max-height:560px)]:gap-3">
              {buttons.map((b, i) => {
                const external = !b.href.startsWith("/");
                return (
                  <Button
                    key={b.id}
                    href={b.href || "#"}
                    target={external ? "_blank" : undefined}
                    variant={i === 0 ? "primary" : "secondary"}
                    size="lg"
                    icon={i === 0 ? "login" : undefined}
                    ariaLabel={external ? `${b.title} (باز شدن در پنجره جدید)` : undefined}
                  >
                    {b.title}
                  </Button>
                );
              })}
            </div>
          </RevealOnLoad>
        )}
      </div>

      {/* audience marquee — part of the hero media; replays on every scroll-in */}
      {companies.isActive && companies.items.length > 0 && (
        <div className="relative z-20">
          <Reveal delay={80} repeat>
            <LogoStrip title={companies.title} items={companies.items} />
          </Reveal>
        </div>
      )}
    </section>
  );
}
