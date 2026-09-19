import { cn } from "@/lib/utils";

/* Plain class helpers — importable from server AND client components. */

/* border-control, not border-line: a form field's edge is the only thing
   that marks where the control is, so it needs 3:1 (WCAG 1.4.11). The
   decorative card border sits at 1.41:1 and does not qualify. */
export const inputCls =
  "w-full rounded-[8px] border border-control bg-surface px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink3 focus:border-focus focus:ring-2 focus:ring-focus/25 disabled:bg-bg";

export function btnCls(variant: "primary" | "secondary" | "danger" | "ghost" = "primary") {
  return cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-[13.5px] font-bold transition-colors disabled:opacity-60 disabled:cursor-wait cursor-pointer",
    variant === "primary" && "bg-primary text-on-primary hover:bg-primary-deep",
    variant === "secondary" && "border border-control bg-surface text-ink hover:border-primary/60 hover:text-orange-700",
    variant === "danger" && "border border-err/40 bg-errbg text-err hover:bg-err hover:text-white",
    variant === "ghost" && "text-ink2 hover:bg-bg hover:text-orange-700",
  );
}
