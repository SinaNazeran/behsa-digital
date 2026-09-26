"use client";

import { useEffect } from "react";

/* ── One listener for every .card-live on the site ──
   Feeds the pointer into the hovered card's light (--mx/--my, drawn by
   card-live in index.css). It used to be an onPointerMove on each grid,
   which only client components could carry — so the server-rendered
   inner pages had cards that could not light up. Mounted once in the
   site layout; renders nothing. */
export function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".card-live");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
