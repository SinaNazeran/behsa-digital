"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

/* ─────────────────────────────────────────────────────────────
   MediaLayer · "video-ready" hero background
   - renders high-priority <img> poster immediately (keeps LCP fast and stable)
   - streams <video> smoothly over the poster once decodable/playing
   - ensures `muted` property is explicitly set on the DOM element so browsers
     never block autoplay
   - uses `preload="auto"` and checks `readyState` so video appears immediately
     even on warm cache or fast connections
   - a layered scrim guarantees WCAG contrast for Persian text
   ───────────────────────────────────────────────────────────── */

export interface MediaLayerProps {
  /** Optional footage. Pass a .mp4 URL to enable video. */
  videoSrc?: string;
  /** Required still frame — shown as placeholder, on mobile/error, or before video plays. */
  poster: string;
  /** Narrow-viewport still frame; defaults to `poster`. Swapped by the
      browser through <picture>, so mobile never downloads the desktop one. */
  mobilePoster?: string;
  /** scrim direction: light heroes need a bright legibility wash, dark heroes a dark one */
  tone?: "light" | "dark";
  /** Optional decorative flow/graphic children rendered above media, below scrim. */
  children?: React.ReactNode;
  className?: string;
  /**
   * If true, suppresses video autoplay when OS prefers-reduced-motion is enabled.
   * Default is false (ambient slow background videos remain active).
   */
  respectReducedMotion?: boolean;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useSaveData(): boolean {
  const [save, setSave] = useState(false);
  useEffect(() => {
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    setSave(Boolean(conn?.saveData));
  }, []);
  return save;
}

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

export function MediaLayer({
  videoSrc,
  poster,
  mobilePoster,
  tone = "light",
  children,
  className,
  respectReducedMotion = false,
}: MediaLayerProps) {
  const reduced = usePrefersReducedMotion();
  const saveData = useSaveData();
  const desktop = useIsDesktop();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const shouldSuppressVideo = respectReducedMotion ? reduced : false;
  const canUseVideo = Boolean(videoSrc) && desktop && !shouldSuppressVideo && !saveData && !failed;

  // Auto-bust stale immutable browser cache for local videos and posters
  const resolvedVideoSrc =
    videoSrc && videoSrc.startsWith("/videos/") && !videoSrc.includes("?")
      ? `${videoSrc}?v=2`
      : videoSrc;

  const resolvedPoster =
    poster && poster.startsWith("/videos/") && !poster.includes("?")
      ? `${poster}?v=2`
      : poster;

  useEffect(() => {
    if (!canUseVideo) return;
    const video = videoRef.current;
    if (!video) return;

    // Critical for autoplay policy: browser requires muted property directly on DOM element
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Check if video is already buffered/ready (e.g. from cache)
    if (video.readyState >= 2) {
      setReady(true);
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setReady(true);
        })
        .catch((err) => {
          console.warn("Hero video autoplay delayed or prevented:", err);
        });
    }
  }, [canUseVideo, resolvedVideoSrc]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {/* poster first — always present until a video frame is decodable (keeps LCP stable).
          <picture> does the desktop/mobile swap natively: one request, no
          layout shift, and no JavaScript needed before first paint. */}
      <picture
        className={cn(
          "absolute inset-0 block h-full w-full transition-opacity duration-1000 ease-out",
          canUseVideo && ready ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        {mobilePoster && mobilePoster !== poster && <source media="(max-width: 767px)" srcSet={mobilePoster} />}
        <img
          src={resolvedPoster}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>

      {/* footage fades in over the poster once playable */}
      {canUseVideo && (
        <video
          ref={videoRef}
          poster={resolvedPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setReady(true)}
          onPlaying={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={resolvedVideoSrc} type="video/mp4" />
        </video>
      )}

      {children}

      {/* ── legibility scrim · tone-aware wash keeps the headline readable over any media ── */}
      {tone === "light" ? (
        <>
          {/* Focal radial scrim: drops luminance variance in the center reading zone
              while leaving the outer 70% of the video at 100% clarity, brightness, and sharpness */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_46%,rgb(4_12_24/0.55)_0%,rgb(4_12_24/0.25)_55%,transparent_85%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy/30 to-transparent"
            aria-hidden="true"
          />
          {/* bottom melt into the dark audience band */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy via-navy/60 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          {/* moderate cinematic scrim — footage stays clearly visible, text stays razor-sharp and legible */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_46%,rgb(4_12_24/0.65)_0%,rgb(4_12_24/0.32)_55%,transparent_85%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy/40 to-transparent"
            aria-hidden="true"
          />
          {/* bottom melt into the dark audience band */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy via-navy/65 to-transparent"
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}

/* Last-resort still frame: used only when the CMS hero has no image at
   all, so the section is never blank. Everything else (image, mobile
   image, footage, on/off) is editor-managed. Video stays desktop-only
   and is dropped on Save-Data or explicit reduced-motion. */
export const HERO_FALLBACK_IMAGE = "/videos/hero-poster.avif";
