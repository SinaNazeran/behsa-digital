"use server";

import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { SiteSettings } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/content/defaults";
import type { ActionState } from "@/components/admin/ui";
import { bool, done, fail, refresh, str, uuidOrNull } from "./helpers";

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const url = (v: string) => !v || /^https?:\/\/\S+$/.test(v);
  const phone = str(fd, "phoneHref", 40).replace(/^tel:/, "").replace(/[^\d+]/g, "");

  const value: SiteSettings = {
    siteName: str(fd, "siteName", 80),
    tagline: str(fd, "tagline", 120),
    defaultDescription: str(fd, "defaultDescription", 300),
    phoneDisplay: str(fd, "phoneDisplay", 40),
    phoneHref: phone ? `tel:${phone}` : "",
    email: str(fd, "email", 120),
    address: str(fd, "address", 300),
    workingHours: str(fd, "workingHours", 120),
    baleUrl: str(fd, "baleUrl", 300),
    panelUrl: str(fd, "panelUrl", 300),
    footerAbout: str(fd, "footerAbout", 400),
    defaultOgMediaId: uuidOrNull(fd, "defaultOgMediaId"),
  };
  if (!url(value.baleUrl) || !url(value.panelUrl)) return fail("آدرس‌های اینترنتی باید با https:// شروع شوند.");
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) return fail("ایمیل نامعتبر است.");

  for (const k of Object.keys(value) as (keyof SiteSettings)[]) {
    if (value[k] === "" && k !== "defaultOgMediaId") (value as Record<string, unknown>)[k] = DEFAULT_SETTINGS[k];
  }

  await db.insert(schema.siteSettings).values({ key: "site", value })
    .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value, updatedAt: new Date() } });
  refresh("settings");
  return done("تنظیمات سایت ذخیره شد.");
}

export async function savePageSeo(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const path = str(fd, "path", 255);
  if (!/^\/[a-z0-9\-/]*$/.test(path)) return fail("مسیر صفحه نامعتبر است.");
  const values = {
    title: str(fd, "title", 255),
    description: str(fd, "description", 1000),
    ogMediaId: uuidOrNull(fd, "ogMediaId"),
    noindex: bool(fd, "noindex"),
  };
  if (!values.title && !values.description && !values.ogMediaId && !values.noindex) {
    await db.delete(schema.pageSeo).where(eq(schema.pageSeo.path, path));
    refresh("seo");
    return done("تنظیمات اختصاصی حذف شد؛ مقادیر پیش‌فرض استفاده می‌شوند.");
  }
  await db.insert(schema.pageSeo).values({ path, ...values })
    .onConflictDoUpdate({ target: schema.pageSeo.path, set: { ...values, updatedAt: new Date() } });
  refresh("seo");
  return done("سئوی صفحه ذخیره شد.");
}
