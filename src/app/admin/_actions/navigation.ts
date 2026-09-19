"use server";

import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { NAV_LENSES, type NavLens } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { isIconName } from "@/components/icons";
import type { ActionState } from "@/components/admin/ui";
import { bool, done, fail, int, isSafeHref, refresh, str } from "./helpers";

/* Menu tree: top-level sections (parent_id IS NULL) + their items.
   Every mutation re-checks the session and validates the payload —
   the form is never trusted. */

function readItem(fd: FormData) {
  const errors: Record<string, string> = {};
  const label = str(fd, "label", 120);
  const href = str(fd, "href", 500);
  const icon = str(fd, "icon", 40);
  const kind = str(fd, "kind", 12) === "mega" ? "mega" : "dropdown";
  const lens = str(fd, "lens", 12);
  const introCtaHref = str(fd, "introCtaHref", 500);

  if (!label) errors.label = "عنوان الزامی است.";
  if (!href) errors.href = "آدرس الزامی است.";
  else if (!isSafeHref(href)) errors.href = "آدرس باید با / یا https:// شروع شود.";
  if (introCtaHref && !isSafeHref(introCtaHref)) errors.introCtaHref = "آدرس دکمهٔ معرفی نامعتبر است.";

  return {
    errors,
    values: {
      label,
      href,
      description: str(fd, "description", 255),
      icon: isIconName(icon) ? icon : "",
      kind: kind as "mega" | "dropdown",
      lens: (NAV_LENSES as readonly string[]).includes(lens) ? (lens as NavLens) : "content",
      openInNewTab: bool(fd, "openInNewTab"),
      introTitle: str(fd, "introTitle", 160),
      introDescription: str(fd, "introDescription", 1000),
      introCtaLabel: str(fd, "introCtaLabel", 120),
      introCtaHref,
      isActive: bool(fd, "isActive"),
    },
  };
}

export async function saveNavItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const parentRaw = int(fd, "parentId");
  const parentId = parentRaw > 0 ? parentRaw : null;
  const { errors, values } = readItem(fd);
  if (Object.keys(errors).length) return fail("لطفاً خطاهای فرم را برطرف کنید.", errors);

  if (parentId !== null) {
    const [parent] = await db.select({ id: schema.navItems.id }).from(schema.navItems)
      .where(and(eq(schema.navItems.id, parentId), isNull(schema.navItems.parentId))).limit(1);
    if (!parent) return fail("منوی والد پیدا نشد.");
    if (id === parentId) return fail("یک آیتم نمی‌تواند زیرمجموعهٔ خودش باشد.");
  }

  if (id > 0) {
    const res = await db.update(schema.navItems).set(values).where(eq(schema.navItems.id, id)).returning({ id: schema.navItems.id });
    if (!res.length) return fail("این آیتم دیگر وجود ندارد.");
  } else {
    const siblings = await db.select({ s: schema.navItems.sortOrder }).from(schema.navItems)
      .where(parentId === null ? isNull(schema.navItems.parentId) : eq(schema.navItems.parentId, parentId));
    const next = siblings.reduce((m, r) => Math.max(m, r.s), -1) + 1;
    await db.insert(schema.navItems).values({ ...values, parentId, sortOrder: next });
  }
  refresh("nav");
  return done(id > 0 ? "منو به‌روزرسانی شد." : "به منو اضافه شد.");
}

export async function deleteNavItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  if (!(id > 0)) return fail("شناسه نامعتبر است.");
  await db.delete(schema.navItems).where(eq(schema.navItems.id, id));
  refresh("nav");
  return done("حذف شد.");
}

/** swap with the previous/next sibling, then renumber densely */
export async function moveNavItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const parentRaw = int(fd, "parentId");
  const parentId = parentRaw > 0 ? parentRaw : null;
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  if (!(id > 0)) return fail("شناسه نامعتبر است.");

  await db.transaction(async (tx) => {
    const rows = await tx.select({ id: schema.navItems.id }).from(schema.navItems)
      .where(parentId === null ? isNull(schema.navItems.parentId) : eq(schema.navItems.parentId, parentId))
      .orderBy(asc(schema.navItems.sortOrder), asc(schema.navItems.id));
    const i = rows.findIndex((r) => r.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= rows.length) return;
    [rows[i], rows[j]] = [rows[j], rows[i]];
    for (let k = 0; k < rows.length; k++) await tx.update(schema.navItems).set({ sortOrder: k }).where(eq(schema.navItems.id, rows[k].id));
  });
  refresh("nav");
  return { ok: true };
}

/** first-run helper: copy the factory menu into the database */
export async function seedDefaultNav(_prev: ActionState, _fd: FormData): Promise<ActionState> {
  await requireUser();
  const { DEFAULT_NAV } = await import("@/content/navigation");
  const [existing] = await db.select({ id: schema.navItems.id }).from(schema.navItems).limit(1);
  if (existing) return fail("منو از قبل در دیتابیس ثبت شده است.");

  await db.transaction(async (tx) => {
    for (const [si, s] of DEFAULT_NAV.entries()) {
      const [row] = await tx.insert(schema.navItems).values({
        label: s.label, href: s.href, description: s.description ?? "", icon: s.icon ?? "",
        kind: s.kind, lens: s.lens, openInNewTab: s.newTab ?? false,
        introTitle: s.intro?.title ?? "", introDescription: s.intro?.description ?? "",
        introCtaLabel: s.intro?.ctaLabel ?? "", introCtaHref: s.intro?.ctaHref ?? "",
        sortOrder: si,
      }).returning({ id: schema.navItems.id });
      for (const [ii, i] of s.items.entries()) {
        await tx.insert(schema.navItems).values({
          parentId: row.id, label: i.label, href: i.href, description: i.description ?? "",
          icon: i.icon ?? "", openInNewTab: i.newTab ?? false, sortOrder: ii,
        });
      }
    }
  });
  refresh("nav");
  return done("منوی پیش‌فرض در دیتابیس ثبت شد.");
}
