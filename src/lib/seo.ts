import "server-only";
import type { Metadata } from "next";
import { getPageSeo, getSettings, mediaUrl } from "@/lib/cms";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://behsa-digital.ir").replace(/\/+$/, "");
export const SITE_NOINDEX = process.env.SITE_NOINDEX === "true";
export const DEFAULT_OG_IMAGE = "/og-image.png";

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** Google truncates around these lengths; used for admin hints too */
export const SEO_LIMITS = { title: 60, description: 160 } as const;

type BuildMetaInput = {
  /** canonical route path, e.g. "/about" */
  path: string;
  title: string;
  description: string;
  /** "article" enables article:* OG fields */
  type?: "website" | "article";
  image?: string | null;
  noindex?: boolean;
  canonical?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  section?: string;
  /** home title must not get the "| brand" suffix */
  absoluteTitle?: boolean;
};

/**
 * Single entry point for page metadata. Editor overrides stored in
 * `page_seo` (Admin → SEO) always win over the code defaults.
 */
export async function buildMetadata(input: BuildMetaInput): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeo(input.path), getSettings()]);

  const title = override?.title || input.title;
  const description = override?.description || input.description || settings.defaultDescription;
  const image =
    mediaUrl(override?.ogMediaId) ?? input.image ?? mediaUrl(settings.defaultOgMediaId) ?? DEFAULT_OG_IMAGE;
  const noindex = SITE_NOINDEX || Boolean(override?.noindex) || Boolean(input.noindex);
  const canonical = input.canonical || input.path;
  const ogTitle = input.absoluteTitle || override?.title ? title : `${title} | ${settings.siteName}`;

  return {
    title: input.absoluteTitle || override?.title ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      type: input.type ?? "website",
      locale: "fa_IR",
      siteName: settings.siteName,
      url: canonical,
      title: ogTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime ?? undefined,
            modifiedTime: input.modifiedTime ?? undefined,
            authors: input.authors,
            section: input.section,
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [image] },
  };
}
