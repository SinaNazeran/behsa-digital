import React from "react";
import { SmartLink } from "@/components/SmartLink";
import { AnimatedBehsaLogo } from "@/components/AnimatedBehsaLogo";

export { AnimatedBehsaLogo } from "@/components/AnimatedBehsaLogo";

export type LogoVariant = "stacked" | "stacked-with-text" | "mark";
export type LogoTheme = "light" | "dark";

export interface BehsaLogoProps {
  /**
   * Layout variant:
   * - 'stacked': Pure stacked lockup (Symbol on top + "BEHSA" directly underneath, exactly like the brand asset)
   * - 'stacked-with-text': Stacked logo + Persian company title and subtitle next to it
   * - 'mark': Symbol only ('ب' mark) for compact contexts
   */
  variant?: LogoVariant;
  /**
   * Target visual height in pixels (default: 46 for Navbar, 56 for Footer, 72 for Auth)
   */
  height?: number;
  /**
   * Theme mode
   */
  theme?: LogoTheme;
  /**
   * Optional custom link href (defaults to "/")
   */
  href?: string;
  /**
   * Above-the-fold prioritization for LCP
   */
  priority?: boolean;
  /**
   * Optional custom CSS class
   */
  className?: string;
  /**
   * Custom Persian subtitle (defaults to "سامانه هوشمند انرژی")
   */
  subtitle?: string;
  /**
   * Whether to use animated inline SVG for primary logo (defaults to true)
   */
  animated?: boolean;
  /**
   * Autoplay animation on mount (defaults to true)
   */
  autoplay?: boolean;
  /**
   * Duration multiplier for animation timing
   */
  durationScale?: number;
}

export const BehsaLogo: React.FC<BehsaLogoProps> = ({
  variant = "stacked-with-text",
  height = 46,
  theme = "light",
  href = "/",
  priority = false,
  className = "",
  subtitle = "سامانه هوشمند مدیریت انرژی",
  animated = true,
  autoplay = true,
  durationScale = 1,
}) => {
  const isMarkOnly = variant === "mark";
  const imageSrc = isMarkOnly ? "/behsa-mark.png" : "/behsa-logo-cropped.png";
  const altText = isMarkOnly
    ? "نشان نمادین بهسا"
    : "لوگوی رسمی بهسا — نماد و نوشته BEHSA";

  // Intrinsic aspect ratio: 888 x 664 for cropped stacked logo
  const intrinsicW = isMarkOnly ? 888 : 888;
  const intrinsicH = isMarkOnly ? 490 : 664;
  const calculatedWidth = Math.round(height * (intrinsicW / intrinsicH));

  const showPersianText = variant === "stacked-with-text";

  const content = (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
    >
      {/* ── بخش نماد و نوشته BEHSA زیر هم (Stacked Lockup) ── */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{
          height: `${height}px`,
          aspectRatio: `${intrinsicW} / ${intrinsicH}`,
        }}
      >
        {isMarkOnly || !animated ? (
          <img
            src={imageSrc}
            alt={altText}
            width={calculatedWidth}
            height={height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="h-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm"
            style={{
              maxHeight: `${height}px`,
              aspectRatio: `${intrinsicW} / ${intrinsicH}`,
            }}
          />
        ) : (
          <AnimatedBehsaLogo
            className="h-full w-auto transition-transform duration-200 group-hover:scale-105"
            autoplay={autoplay}
            durationScale={durationScale}
            ariaLabel={altText}
            ariaHidden={Boolean(href)}
          />
        )}
      </div>

      {/* ── عنوان و زیرعنوان فارسی در کنار لوگوی پشته‌ای (اختیاری) ── */}
      {showPersianText && (
        <div className="flex flex-col justify-center leading-none text-right border-r border-line/70 pr-3 mr-0.5">
          <span
            className={`font-display font-black tracking-tight text-[16px] md:text-[17.5px] ${
              theme === "dark" ? "text-white" : "text-ink"
            }`}
          >
            بهسا دیجیتال
          </span>
          <span
            className={`text-[10px] md:text-[10.5px] font-semibold tracking-wide mt-1 ${
              theme === "dark" ? "text-neutral-400" : "text-ink3"
            }`}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <SmartLink
        href={href}
        className="group inline-flex items-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus transition-all hover:opacity-95"
        aria-label="بهسا دیجیتال — بازگشت به صفحه اصلی"
      >
        {content}
      </SmartLink>
    );
  }

  return content;
};
