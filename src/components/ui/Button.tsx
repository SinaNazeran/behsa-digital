import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon, type IconName } from "../icons";
import { SmartLink } from "@/components/SmartLink";

/* ── Behsa Button · the site's one button ──
   There used to be two: this one (hero, header, drawer) and `Btn` in
   components/ui (everywhere else), with different radii (10px / 8px),
   weights, heights and shadows, so the same action looked different
   depending on where it sat. `Btn` is now an alias of this component.

   One scale — sm 36 · md 44 · lg 52 — one radius (10px), bold labels.
   Focus colour comes from the global :focus-visible rule, which already
   adapts to the ground (.on-dark / .on-brand in index.css). */

export type ButtonVariant = "primary" | "secondary" | "glass" | "soft" | "dark" | "green" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  /** primary = the one loud action · secondary = solid light · glass/dark = translucent over colour or footage ·
      soft = primary held back · green = confirmation · ghost = text-weight */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** renders an <a> when provided */
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  icon?: IconName;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

const GLASS =
  "border border-white/20 bg-white/10 text-neutral-100 backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] hover:bg-white/[0.17] hover:border-white/32";

const VARIANTS: Record<ButtonVariant, string> = {
  /* solid brand orange — the single loudest action on the page.
     The label is dark, not white: white on #fa6400 is 3.05:1 and fails
     AA, while the dark ink reaches 5.33:1 and lets the logo colour stay
     exactly as it is instead of being darkened into a brown. */
  primary:
    "bg-primary text-on-primary shadow-[0_8px_22px_rgb(250_100_0/0.3)] hover:bg-primary-deep hover:shadow-[0_12px_28px_rgb(250_100_0/0.4)]",
  /* solid light secondary — hairline edge + controlled ink-family elevation
     keep it clearly behind the primary (no brand fill, accent on hover only) */
  secondary:
    "border border-steel/25 bg-surface text-steel shadow-[0_2px_6px_rgb(22_33_46/0.06),0_10px_24px_-8px_rgb(22_33_46/0.14)] hover:-translate-y-0.5 hover:border-primary/45 hover:text-orange-700 hover:shadow-[0_4px_10px_rgb(22_33_46/0.08),0_16px_32px_-10px_rgb(22_33_46/0.2)]",
  /* enterprise glass — translucent, blurred, edge-lit */
  glass: GLASS,
  /* the old Btn name for the same surface */
  dark: GLASS,
  /* the primary action, held back: an orange tint rather than a fill, for
     where a louder copy of the same action is already on screen
     (orange-700 on orange-50: 5.24:1) */
  soft:
    "border border-orange-200 bg-primary-soft text-orange-700 hover:bg-orange-100 hover:border-orange-300",
  green:
    "bg-accent text-white shadow-[0_6px_16px_rgb(10_118_73/0.3)] hover:bg-green-800",
  ghost:
    "text-orange-700 hover:bg-primary-soft",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px] gap-2",
  md: "h-11 px-5.5 text-[14.5px] gap-2.5",
  lg: "h-[52px] px-7 text-[15.5px] gap-2.5",
};

export function Button({
  variant = "primary", size = "md", href, target, rel, type = "button", onClick, disabled = false,
  icon, className, ariaLabel, children,
}: ButtonProps) {
  const classes = cn(
    "inline-flex cursor-pointer select-none items-center justify-center rounded-control font-body font-bold",
    "transition-all duration-200 ease-fluid active:translate-y-px active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    VARIANTS[variant],
    SIZES[size],
    /* disabled: flat, dimmed, no motion — for <button disabled> and for a
       link marked aria-disabled alike */
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:scale-100",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none",
    className,
  );

  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} size={size === "lg" ? 18 : size === "sm" ? 15 : 16} sw={2.2} />}
    </>
  );

  if (href !== undefined) {
    return (
      <SmartLink
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={onClick}
        className={classes}
      >
        {inner}
      </SmartLink>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={classes}>
      {inner}
    </button>
  );
}
