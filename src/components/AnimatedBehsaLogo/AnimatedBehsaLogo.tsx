"use client";

import React, { useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  BRAND_COLORS,
  LOGO_PATHS,
  REVEAL_PATHS,
} from "./logo-paths";

// Register GSAP plugins safely on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

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

/**
 * Centralized, easy-to-edit timing configuration (in seconds).
 */
export const BEHSA_LOGO_TIMING = {
  persianDuration: 1.8,
  dotsDuration: 0.4,
  dotStagger: 0.08,
  pauseAfterPersian: 0.15,
  englishLetterDuration: 0.8,
  englishStagger: 0.1,
} as const;

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
  const containerRef = useRef<SVGSVGElement>(null);
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

  // Track mask state in React so that re-renders (e.g. scroll state in Navbar) never re-attach masks
  const [isMasked, setIsMasked] = useState(shouldAnimate);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const svg = containerRef.current;

      const faBodyGroup = svg.querySelector<SVGGElement>(".logo-fa-body");
      const faDot = svg.querySelector<SVGCircleElement>(".logo-fa-dot");
      const faRevealPath = svg.querySelector<SVGPathElement>(".logo-fa-reveal-path");

      const letterGroups = {
        b: svg.querySelector<SVGGElement>(".logo-en-b"),
        e: svg.querySelector<SVGGElement>(".logo-en-e"),
        h: svg.querySelector<SVGGElement>(".logo-en-h"),
        s: svg.querySelector<SVGGElement>(".logo-en-s"),
        a: svg.querySelector<SVGGElement>(".logo-en-a"),
      };

      const letterRevealPaths = {
        b: svg.querySelector<SVGPathElement>(".logo-en-reveal-b"),
        e: svg.querySelector<SVGPathElement>(".logo-en-reveal-e"),
        h: svg.querySelector<SVGPathElement>(".logo-en-reveal-h"),
        s: svg.querySelector<SVGPathElement>(".logo-en-reveal-s"),
        a: svg.querySelector<SVGPathElement>(".logo-en-reveal-a"),
      };

      const removeAllMasks = () => {
        faBodyGroup?.removeAttribute("mask");
        Object.values(letterGroups).forEach((g) => g?.removeAttribute("mask"));
        setIsMasked(false);
      };

      // Check prefers-reduced-motion safely on client
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // If autoplay is disabled, duration is zero, or user prefers reduced motion: show static logo immediately
      if (!shouldAnimate || prefersReduced) {
        removeAllMasks();
        if (faDot) {
          gsap.set(faDot, { opacity: 1, scale: 1 });
        }
        return;
      }

      // Ensure masks are attached at the start of animation
      faBodyGroup?.setAttribute("mask", `url(#${maskFaBodyId})`);
      letterGroups.b?.setAttribute("mask", `url(#${maskEnBId})`);
      letterGroups.e?.setAttribute("mask", `url(#${maskEnEId})`);
      letterGroups.h?.setAttribute("mask", `url(#${maskEnHId})`);
      letterGroups.s?.setAttribute("mask", `url(#${maskEnSId})`);
      letterGroups.a?.setAttribute("mask", `url(#${maskEnAId})`);

      // Initialize Persian reveal path stroke using deterministic length
      if (faRevealPath) {
        gsap.set(faRevealPath, {
          strokeDasharray: REVEAL_LENGTHS.faBody,
          strokeDashoffset: REVEAL_LENGTHS.faBody,
        });
      }

      // Initialize dot: hidden until Persian body completes.
      // Uses transformBox: fill-box and transformOrigin: center for cross-browser Safari/Chromium parity.
      if (faDot) {
        gsap.set(faDot, {
          opacity: 0,
          scale: 0,
          transformBox: "fill-box",
          transformOrigin: "center center",
        });
      }

      // Initialize English letter reveal strokes using deterministic lengths
      (["b", "e", "h", "s", "a"] as const).forEach((key) => {
        const path = letterRevealPaths[key];
        if (path) {
          const len = REVEAL_LENGTHS[`en${key.toUpperCase()}` as keyof typeof REVEAL_LENGTHS];
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
        }
      });

      // Master animation timeline (plays once, no loop, no reverse)
      const tl = gsap.timeline({
        onComplete: () => {
          // Final static state: remove all masks so vector rendering is 100% crisp and unmasked
          removeAllMasks();
        },
      });

      // Phase 1: Persian word "بهسا" body reveal (strictly RIGHT -> LEFT)
      if (faRevealPath) {
        tl.to(faRevealPath, {
          strokeDashoffset: 0,
          duration: BEHSA_LOGO_TIMING.persianDuration * scale,
          ease: "power2.inOut",
        });
      }

      // Phase 2: Persian dot reveals separately only AFTER the body completes
      if (faDot) {
        tl.to(
          faDot,
          {
            opacity: 1,
            scale: 1,
            duration: BEHSA_LOGO_TIMING.dotsDuration * scale,
            ease: "power2.out",
          },
          "+=0.03"
        );
      }

      // Phase 3: Short pause between Persian and English sections
      tl.to({}, { duration: BEHSA_LOGO_TIMING.pauseAfterPersian * scale });

      // Phase 4: English "BEHSA" reveal (strictly LEFT -> RIGHT in order B -> E -> H -> S -> A)
      const letterOrder = ["b", "e", "h", "s", "a"] as const;
      letterOrder.forEach((key, index) => {
        const path = letterRevealPaths[key];
        if (path) {
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: BEHSA_LOGO_TIMING.englishLetterDuration * scale,
              ease: "power1.inOut",
            },
            index === 0 ? undefined : `<${BEHSA_LOGO_TIMING.englishStagger * scale}`
          );
        }
      });
    },
    { scope: containerRef, dependencies: [shouldAnimate, scale] }
  );

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 888 664"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden ? true : undefined}
      className={`select-none overflow-visible ${className}`}
      style={{
        transform: "translateZ(0)",
        willChange: isMasked ? "transform" : "auto",
        contain: "paint layout",
      }}
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
        <g className="logo-fa-body" mask={isMasked ? `url(#${maskFaBodyId})` : undefined}>
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
        <g className="logo-en-b" mask={isMasked ? `url(#${maskEnBId})` : undefined}>
          <path
            d={LOGO_PATHS.enB.d}
            transform={LOGO_PATHS.enB.transform}
            fill={BRAND_COLORS.blue}
          />
        </g>
        <g className="logo-en-e" mask={isMasked ? `url(#${maskEnEId})` : undefined}>
          {LOGO_PATHS.enE.map((item, idx) => (
            <path
              key={idx}
              d={item.d}
              transform={item.transform}
              fill={BRAND_COLORS.orange}
            />
          ))}
        </g>
        <g className="logo-en-h" mask={isMasked ? `url(#${maskEnHId})` : undefined}>
          {LOGO_PATHS.enH.map((item, idx) => (
            <path
              key={idx}
              d={item.d}
              transform={item.transform}
              fill={BRAND_COLORS.orange}
            />
          ))}
        </g>
        <g className="logo-en-s" mask={isMasked ? `url(#${maskEnSId})` : undefined}>
          {LOGO_PATHS.enS.map((item, idx) => (
            <path
              key={idx}
              d={item.d}
              transform={item.transform}
              fill={BRAND_COLORS.orange}
            />
          ))}
        </g>
        <g className="logo-en-a" mask={isMasked ? `url(#${maskEnAId})` : undefined}>
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
