"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import {
  BRAND_COLORS,
  LOGO_PATHS,
  REVEAL_PATHS,
} from "./logo-paths";

export interface AnimatedBehsaLogoProps {
  /**
   * Optional CSS classes for responsive sizing and layout.
   * e.g., "w-[140px] sm:w-[170px] md:w-[190px]" or "h-[46px] w-auto"
   */
  className?: string;
  /**
   * Whether to autoplay the entrance animation on mount.
   * Defaults to true. When false, renders the final static logo immediately.
   */
  autoplay?: boolean;
  /**
   * Global duration multiplier (default 1).
   * Multiplies all duration values without breaking sequence order or staggers.
   * If <= 0, animation completes immediately.
   */
  durationScale?: number;
  /**
   * Accessible aria-label for the SVG image role when used standalone.
   * Defaults to "لوگوی رسمی بهسا دیجیتال".
   */
  ariaLabel?: string;
  /**
   * Set to true when wrapped in an accessible parent element (e.g. a Link with an aria-label)
   * to prevent redundant/conflicting screen-reader announcements.
   */
  ariaHidden?: boolean;
}

/* The entrance sequence — order, durations, delays and easings — lives in
   `.logo-anim` in src/styles/index.css. It is plain CSS: nothing here
   schedules it, and the only thing this component still does at runtime is
   drop the reveal masks once it has finished (see `masked` below). */

// Deterministic reveal path lengths to eliminate forced synchronous SVG reflows on mount
const REVEAL_LENGTHS = {
  faBody: 1385,
  enB: 175,
  enE: 160,
  enH: 170,
  enS: 180,
  enA: 180,
} as const;

export const AnimatedBehsaLogo: React.FC<AnimatedBehsaLogoProps> = ({
  className = "",
  autoplay = true,
  durationScale = 1,
  ariaLabel = "لوگوی رسمی بهسا دیجیتال",
  ariaHidden = false,
}) => {
  const uniqueId = useId().replace(/:/g, "_");

  // Mask IDs scoped to this component instance
  const maskFaBodyId = `mask-fa-body-${uniqueId}`;
  const maskEnBId = `mask-en-b-${uniqueId}`;
  const maskEnEId = `mask-en-e-${uniqueId}`;
  const maskEnHId = `mask-en-h-${uniqueId}`;
  const maskEnSId = `mask-en-s-${uniqueId}`;
  const maskEnAId = `mask-en-a-${uniqueId}`;

  const scale = durationScale <= 0 ? 0 : Math.max(0.05, durationScale);
  const shouldAnimate = autoplay && scale > 0;

  /* The masks exist only to wipe the artwork in. Once the last letter has
     drawn we drop them, so the finished logo is plain, unmasked vector —
     crisper, and cheaper to repaint on every Navbar scroll re-render. This
     is what the old GSAP onComplete did, and it is the only reason this is
     still a client component. Reduced motion collapses the sequence to 1ms
     (index.css), so the same handler fires and the logo simply appears. */
  const [masked, setMasked] = useState(shouldAnimate);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!shouldAnimate || !svg?.getAnimations) return;
    /* Asking the animations when they finish, rather than listening for
       animationend, because by the time this effect runs they may already
       be over and the event long gone: prefers-reduced-motion collapses the
       whole sequence to 1ms (index.css), and a slow device can hydrate
       later than the 3.58s it normally takes. Either way the masks have to
       come off — a logo stuck behind its own reveal mask renders soft and
       repaints on every Navbar scroll update. */
    let live = true;
    Promise.all(svg.getAnimations({ subtree: true }).map((a) => a.finished))
      .then(() => live && setMasked(false))
      .catch(() => {}); /* an animation cancelled mid-flight — nothing to do */
    return () => { live = false; };
  }, [shouldAnimate]);

  const mask = (id: string) => (masked ? `url(#${id})` : undefined);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 888 664"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden ? true : undefined}
      className={`select-none overflow-visible ${shouldAnimate ? "logo-anim " : ""}${className}`}
      style={{
        transform: "translateZ(0)",
        willChange: masked ? "transform" : "auto",
        contain: "paint layout",
        /* durationScale scales every step of the CSS sequence at once */
        ...(scale === 1 ? null : { "--logo-s": scale }),
      } as React.CSSProperties}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* ── Persian Body Mask: stroke draws from visual RIGHT (895, 88) to visual LEFT (185, -5) ── */}
        <mask id={maskFaBodyId} maskUnits="userSpaceOnUse" x="0" y="0" width="888" height="664">
          <path
            className="logo-fa-mask logo-fa-reveal-path"
            d={REVEAL_PATHS.faBody}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="240"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={shouldAnimate ? REVEAL_LENGTHS.faBody : undefined}
            strokeDashoffset={shouldAnimate ? REVEAL_LENGTHS.faBody : undefined}
          />
        </mask>

        {/* ── English Masks: strokes draw horizontally from visual LEFT to visual RIGHT ── */}
        <mask id={maskEnBId} maskUnits="userSpaceOnUse" x="0" y="0" width="888" height="664">
          <path
            className="logo-en-mask logo-en-reveal-b"
            d={REVEAL_PATHS.enB}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="160"
            strokeLinecap="square"
            strokeDasharray={shouldAnimate ? REVEAL_LENGTHS.enB : undefined}
            strokeDashoffset={shouldAnimate ? REVEAL_LENGTHS.enB : undefined}
          />
        </mask>
        <mask id={maskEnEId} maskUnits="userSpaceOnUse" x="0" y="0" width="888" height="664">
          <path
            className="logo-en-mask logo-en-reveal-e"
            d={REVEAL_PATHS.enE}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="160"
            strokeLinecap="square"
            strokeDasharray={shouldAnimate ? REVEAL_LENGTHS.enE : undefined}
            strokeDashoffset={shouldAnimate ? REVEAL_LENGTHS.enE : undefined}
          />
        </mask>
        <mask id={maskEnHId} maskUnits="userSpaceOnUse" x="0" y="0" width="888" height="664">
          <path
            className="logo-en-mask logo-en-reveal-h"
            d={REVEAL_PATHS.enH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="160"
            strokeLinecap="square"
            strokeDasharray={shouldAnimate ? REVEAL_LENGTHS.enH : undefined}
            strokeDashoffset={shouldAnimate ? REVEAL_LENGTHS.enH : undefined}
          />
        </mask>
        <mask id={maskEnSId} maskUnits="userSpaceOnUse" x="0" y="0" width="888" height="664">
          <path
            className="logo-en-mask logo-en-reveal-s"
            d={REVEAL_PATHS.enS}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="160"
            strokeLinecap="square"
            strokeDasharray={shouldAnimate ? REVEAL_LENGTHS.enS : undefined}
            strokeDashoffset={shouldAnimate ? REVEAL_LENGTHS.enS : undefined}
          />
        </mask>
        <mask id={maskEnAId} maskUnits="userSpaceOnUse" x="0" y="0" width="888" height="664">
          <path
            className="logo-en-mask logo-en-reveal-a"
            d={REVEAL_PATHS.enA}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="160"
            strokeLinecap="square"
            strokeDasharray={shouldAnimate ? REVEAL_LENGTHS.enA : undefined}
            strokeDashoffset={shouldAnimate ? REVEAL_LENGTHS.enA : undefined}
          />
        </mask>
      </defs>

      {/* ════════════════════════════════════════════════════════════
          Section A: Persian "بهسا"
          - Main body: Swooping blue calligraphy mark
          - Persian dot: Circle positioned underneath the fold
         ════════════════════════════════════════════════════════════ */}
      <g className="logo-fa">
        <g className="logo-fa-body" mask={mask(maskFaBodyId)}>
          <path
            d={LOGO_PATHS.faBody.d}
            transform={LOGO_PATHS.faBody.transform}
            fill={BRAND_COLORS.blue}
          />
        </g>
        <circle
          className="logo-fa-dot"
          cx={LOGO_PATHS.faDot.cx}
          cy={LOGO_PATHS.faDot.cy}
          r={LOGO_PATHS.faDot.r}
          fill={BRAND_COLORS.blue}
          style={
            shouldAnimate
              ? { opacity: 0, transformBox: "fill-box", transformOrigin: "center" }
              : { opacity: 1, transformBox: "fill-box", transformOrigin: "center" }
          }
        />
      </g>

      {/* ════════════════════════════════════════════════════════════
          Section B: English "BEHSA"
          - Letter B: Blue (#0062BD)
          - Letters E, H, S, A: Orange (#FA6400)
         ════════════════════════════════════════════════════════════ */}
      <g className="logo-en">
        <g className="logo-en-b" mask={mask(maskEnBId)}>
          <path
            d={LOGO_PATHS.enB.d}
            transform={LOGO_PATHS.enB.transform}
            fill={BRAND_COLORS.blue}
          />
        </g>
        <g className="logo-en-e" mask={mask(maskEnEId)}>
          {LOGO_PATHS.enE.map((item, idx) => (
            <path
              key={idx}
              d={item.d}
              transform={item.transform}
              fill={BRAND_COLORS.orange}
            />
          ))}
        </g>
        <g className="logo-en-h" mask={mask(maskEnHId)}>
          {LOGO_PATHS.enH.map((item, idx) => (
            <path
              key={idx}
              d={item.d}
              transform={item.transform}
              fill={BRAND_COLORS.orange}
            />
          ))}
        </g>
        <g className="logo-en-s" mask={mask(maskEnSId)}>
          {LOGO_PATHS.enS.map((item, idx) => (
            <path
              key={idx}
              d={item.d}
              transform={item.transform}
              fill={BRAND_COLORS.orange}
            />
          ))}
        </g>
        <g className="logo-en-a" mask={mask(maskEnAId)}>
          <path
            d={LOGO_PATHS.enA.d}
            transform={LOGO_PATHS.enA.transform}
            fill={BRAND_COLORS.orange}
          />
        </g>
      </g>
    </svg>
  );
};

export default AnimatedBehsaLogo;
