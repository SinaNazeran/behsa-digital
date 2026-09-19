import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon, type IconName } from "../icons";
import { SmartLink } from "@/components/SmartLink";

/* ── Behsa Button · typed variants for dark industrial surfaces ── */

export type ButtonVariant = "primary" | "secondary" | "glass";
export type ButtonSize = "md" | "lg";

interface BaseButtonProps {
  /** primary = brand accent (action) · secondary = solid light (contrast) · glass = translucent blur */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** renders an <a> when provided */
  href?: string;
  onClick?: () => void;
  icon?: IconName;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

type ButtonElementProps = BaseButtonProps & { href?: undefined; type?: "button" | "submit" };
type LinkElementProps = BaseButtonProps & { href: string; target?: string; rel?: string };

export type ButtonProps = ButtonElementProps | LinkElementProps;

const VARIANTS: Record<ButtonVariant, string> = {
  /* solid brand orange — the single loudest action on the page.
     The label is dark, not white: white on #fa6400 is 3.05:1 and fails
     AA, while the dark ink reaches 5.33:1 and lets the logo colour stay
     exactly as it is instead of being darkened into a brown. */
  primary:
    "bg-primary text-on-primary shadow-[0_10px_28px_rgb(250_100_0/0.35)] hover:bg-primary-deep hover:shadow-[0_14px_34px_rgb(250_100_0/0.45)]",
  /* solid light secondary — hairline edge + controlled ink-family elevation
     keep it clearly behind the primary (no brand fill, accent on hover only) */
  secondary:
    "border border-steel/25 bg-surface text-ink shadow-[0_2px_6px_rgb(22_33_46/0.06),0_10px_24px_-8px_rgb(22_33_46/0.14)] hover:-translate-y-0.5 hover:border-primary/45 hover:text-orange-700 hover:shadow-[0_4px_10px_rgb(22_33_46/0.08),0_16px_32px_-10px_rgb(22_33_46/0.2)]",
  /* enterprise glass — translucent, blurred, edge-lit */
  glass:
    "border border-white/20 bg-white/10 text-neutral-100 backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] hover:bg-white/[0.17] hover:border-white/32",
};

const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-6 text-[14px]",
  lg: "h-[54px] px-8 text-[15.5px]",
};

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, className, children, onClick } = props;

  const classes = cn(
    "inline-flex cursor-pointer select-none items-center justify-center gap-2.5 rounded-[10px] font-body font-bold",
    "transition-all duration-200 active:translate-y-px",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} sw={2.2} />}
    </>
  );

  if (props.href !== undefined) {
    const { target, rel, ariaLabel } = props;
    return (
      <SmartLink
        href={props.href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
        onClick={onClick}
        className={classes}
      >
        {inner}
      </SmartLink>
    );
  }

  return (
    <button type={props.type ?? "button"} onClick={onClick} aria-label={props.ariaLabel} className={classes}>
      {inner}
    </button>
  );
}
