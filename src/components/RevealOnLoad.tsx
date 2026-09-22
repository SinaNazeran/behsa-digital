import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/* The on-load counterpart of <Reveal> (components/ui.tsx).
 *
 * Use <Reveal> for anything below the fold — it waits to be scrolled into
 * view. Use this for content that is already on screen when the page paints.
 * The distinction matters because <Reveal> is a client component that hides
 * its children until an IntersectionObserver runs, which above the fold means
 * the first thing the visitor came to read is invisible until hydration
 * finishes. This one is a plain server component over a CSS animation: the
 * markup ships visible-by-default and animates at first paint, with or
 * without JavaScript.
 */
export function RevealOnLoad({
  children,
  className,
  delay = 0,
  dir,
}: {
  children: ReactNode;
  className?: string;
  /** milliseconds to stagger this element behind the previous one */
  delay?: number;
  dir?: "l" | "r";
}) {
  return (
    <div
      className={cn(dir === "l" ? "rv-now-l" : dir === "r" ? "rv-now-r" : "rv-now", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
