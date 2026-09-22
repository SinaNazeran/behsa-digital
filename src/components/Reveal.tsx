"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

/* ── Scroll reveal ──
   One observer for the whole page rather than one per element. Every Reveal
   asks for the same threshold and the same root margin, so they can all share
   a single registration; the homepage alone mounts 68 of them, and each extra
   IntersectionObserver is another set of intersection computations the browser
   runs against the same scroll. Built lazily on first use, so it never exists
   during server rendering.

   Only elements that opted into `repeat` are tracked, because the observer
   callback is shared and has to know which target wants to re-arm. A WeakSet
   keeps that off the element and out of the way of the garbage collector. */
const repeaters = new WeakSet<Element>();
let revealObserver: IntersectionObserver | null = null;

function getRevealObserver(): IntersectionObserver {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            /* a one-shot reveal has done its job — stop paying for it */
            if (!repeaters.has(e.target)) revealObserver?.unobserve(e.target);
          } else if (repeaters.has(e.target)) {
            /* re-arm the transition so it replays on every re-entry */
            e.target.classList.remove("is-in");
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -36px 0px" },
    );
  }
  return revealObserver;
}

/** Below-the-fold reveal. For content in the first viewport use
 *  <RevealOnLoad>, which needs no JavaScript to become visible. */
export function Reveal({
  children, className, delay = 0, dir, repeat = false,
}: { children: ReactNode; className?: string; delay?: number; dir?: "l" | "r"; repeat?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    if (repeat) repeaters.add(el);
    const io = getRevealObserver();
    io.observe(el);
    return () => {
      io.unobserve(el);
      repeaters.delete(el);
    };
  }, [repeat]);
  return (
    <div ref={ref} className={cn(dir === "l" ? "rv-l" : dir === "r" ? "rv-r" : "rv", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
