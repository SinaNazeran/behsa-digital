/* One-shot, idempotent content migration for an ALREADY-SEEDED database.

   `npm run db:seed` only inserts rows that are missing, so on an existing
   install it cannot remove the fabricated content the content audit found,
   and cannot replace a menu that was stored before the new IA existed.
   This script does both. Safe to re-run.

   What it does:
     1. deletes the two invented testimonials and the ten invented client
        names (matched exactly, so real entries are never touched)
     2. replaces the company-logo strip with the consumer-type strip
     3. switches off the bands whose copy claims real screenshots or real
        customer results, until those assets exist
     4. inserts the new homepage bands, retires the two merged into
        «گزارش‌ها», and corrects copy pointing at removed routes
     5. rebuilds the navigation tree to the approved IA

   Run:  npm run db:apply-content
*/
import { eq, inArray } from "drizzle-orm";
import { connect } from "./_db";
import { DEFAULT_NAV } from "../src/content/navigation";
import { SECTIONS } from "../src/content/sections";
import { FAQ_ITEMS } from "./seed-data";

/* exact strings from the previous seed — nothing else is removed */
const FABRICATED_TESTIMONIALS = [
  "در کمتر از سه ماه، جریمه دیماند دو کارخانه ما به صفر رسید و قدرت قراردادی را بدون ریسک کاهش دادیم.",
  "برای اولین بار در هلدینگ، همه سایت‌ها را روی یک داشبورد می‌بینیم و گزارش ماهانه از سه هفته به دو روز رسیده است.",
];

const FABRICATED_CLIENTS = [
  "فولاد آریا", "سیمان البرز", "پتروشیمی مهر", "هلدینگ پارسیان", "صنایع غذایی زاگرس",
  "نیروگاه خورشیدی یزد", "کاشی و سرامیک کویر", "ریخته‌گری آذین", "شهرک صنعتی اراک", "توزیع برق آفتاب",
];

/* the real company names that were shown under the hero as if customers */
const NAMED_COMPANIES = [
  "بانک ملت", "عالیس", "فولاد مبارکه", "پتروشیمی خلیج فارس", "مپنا",
  "ایران‌خودرو", "پالایش نفت اصفهان", "همراه اول", "ذوب‌آهن اصفهان", "سیمان تهران",
];

const RETIRED_SECTIONS = ["solutions", "features", "testimonials"];

/* Bands whose copy the approved strategy rewrites. Their rows already
   exist from the previous seed, so they are reset to the new factory
   defaults — hand edits to THESE bands are overwritten, which is the
   point of the rollout. Bands not listed here are never touched. */
const REWRITTEN_SECTIONS = ["hero", "pains", "platform", "industries", "benefits", "cta", "faq", "dashboard"];

/* fingerprints of the previous FAQ set: if the table still holds exactly
   these, no editor has curated it and it is safe to replace wholesale */
const OLD_FAQ_QUESTIONS = [
  "این سامانه برای چه نوع صنایعی مناسب است؟",
  "سامانه به چه داده‌هایی نیاز دارد؟",
  "آیا به کنتور هوشمند نیاز داریم؟",
  "آیا نصب سخت‌افزار لازم است؟",
  "چه خروجی‌هایی از سامانه دریافت می‌کنیم؟",
];

const { client, db, schema } = connect();
const log = (s: string) => console.log(`  ${s}`);

await db.transaction(async (tx) => {
  /* ── 1 · fabricated proof ─────────────────────────────────────── */
  const t = await tx.delete(schema.testimonials)
    .where(inArray(schema.testimonials.quote, FABRICATED_TESTIMONIALS)).returning({ id: schema.testimonials.id });
  log(`testimonials removed: ${t.length}`);

  const c = await tx.delete(schema.clients)
    .where(inArray(schema.clients.name, FABRICATED_CLIENTS)).returning({ id: schema.clients.id });
  log(`invented client names removed: ${c.length}`);

  /* ── 2 · company strip → consumer-type strip ──────────────────── */
  const companyDef = SECTIONS.find((s) => s.key === "companies");
  const strip = await tx.select().from(schema.contentItems).where(eq(schema.contentItems.sectionKey, "companies"));
  const stillNamesCompanies = strip.some((i) => NAMED_COMPANIES.includes(i.title));

  if (stillNamesCompanies && companyDef) {
    await tx.delete(schema.contentItems).where(eq(schema.contentItems.sectionKey, "companies"));
    await tx.insert(schema.contentItems).values(
      (companyDef.defaults.items ?? []).map((i, idx) => ({
        sectionKey: "companies", title: i.title, description: i.description ?? "",
        icon: i.icon ?? "", tag: "", href: "", bullets: [], sortOrder: idx,
      })),
    );
    await tx.update(schema.contentSections)
      .set({ title: companyDef.defaults.title ?? "", mediaId: null })
      .where(eq(schema.contentSections.key, "companies"));
    log(`consumer-type strip installed (${companyDef.defaults.items?.length ?? 0} items)`);
  } else {
    log("consumer-type strip: already migrated or edited by hand — left alone");
  }

  /* ── 3 · bands that must not ship with placeholder content ────── */
  const shots = await tx.select({ id: schema.contentItems.id, mediaId: schema.contentItems.mediaId })
    .from(schema.contentItems).where(eq(schema.contentItems.sectionKey, "dashboard"));
  const hasRealShots = shots.some((i) => i.mediaId !== null);

  if (!hasRealShots) {
    await tx.update(schema.contentSections).set({ isActive: false }).where(eq(schema.contentSections.key, "dashboard"));
    log("screenshot band switched off (no real media uploaded yet)");
  } else {
    log("screenshot band: real media present — left active");
  }

  /* ── 4 · section registry: add new bands, retire merged ones ──── */
  const existing = new Set(
    (await tx.select({ key: schema.contentSections.key }).from(schema.contentSections)).map((r) => r.key),
  );

  let added = 0;
  for (const def of SECTIONS) {
    if (existing.has(def.key)) continue;
    const d = def.defaults;
    await tx.insert(schema.contentSections).values({
      key: def.key,
      eyebrow: d.eyebrow ?? "", title: d.title ?? "", description: d.description ?? "",
      ctaLabel: d.ctaLabel ?? "", ctaHref: d.ctaHref ?? "",
      videoUrl: d.videoUrl ?? "", videoEnabled: d.videoEnabled ?? false,
      isActive: d.isActive ?? true,
    });
    if (d.items?.length) {
      await tx.insert(schema.contentItems).values(d.items.map((i, idx) => ({
        sectionKey: def.key, title: i.title, description: i.description ?? "", icon: i.icon ?? "",
        tag: i.tag ?? "", href: i.href ?? "", bullets: i.bullets ?? [], sortOrder: idx,
      })));
    }
    added++;
  }
  log(`new homepage bands inserted: ${added}`);

  /* cascade removes their items */
  const gone = await tx.delete(schema.contentSections)
    .where(inArray(schema.contentSections.key, RETIRED_SECTIONS)).returning({ key: schema.contentSections.key });
  log(`retired bands removed: ${gone.map((g) => g.key).join(", ") || "none"}`);

  /* ── 4b · reset the bands the strategy rewrites ───────────────── */
  let reset = 0;
  for (const key of REWRITTEN_SECTIONS) {
    const def = SECTIONS.find((x) => x.key === key);
    if (!def || !existing.has(key)) continue;
    const d = def.defaults;

    /* the screenshot band keeps whatever media an editor uploaded */
    const keepMedia = key === "dashboard" && hasRealShots;

    await tx.update(schema.contentSections).set({
      eyebrow: d.eyebrow ?? "", title: d.title ?? "", description: d.description ?? "",
      ctaLabel: d.ctaLabel ?? "", ctaHref: d.ctaHref ?? "",
      ...(keepMedia ? {} : { isActive: d.isActive ?? true }),
    }).where(eq(schema.contentSections.key, key));

    if (d.items?.length && !keepMedia) {
      await tx.delete(schema.contentItems).where(eq(schema.contentItems.sectionKey, key));
      await tx.insert(schema.contentItems).values(d.items.map((i, idx) => ({
        sectionKey: key, title: i.title, description: i.description ?? "", icon: i.icon ?? "",
        tag: i.tag ?? "", href: i.href ?? "", bullets: i.bullets ?? [], sortOrder: idx,
      })));
    }
    reset++;
  }
  log(`bands reset to approved copy: ${reset}`);

  /* ── 4c · FAQ: nine questions, replacing the previous five ────── */
  const faqRows = await tx.select({ question: schema.faqs.question }).from(schema.faqs);
  const untouched =
    faqRows.length === OLD_FAQ_QUESTIONS.length &&
    faqRows.every((r) => OLD_FAQ_QUESTIONS.includes(r.question));

  if (untouched) {
    await tx.delete(schema.faqs);
    await tx.insert(schema.faqs).values(FAQ_ITEMS.map((f, i) => ({ question: f.q, answer: f.a, sortOrder: i })));
    log(`FAQ replaced with the approved set: ${FAQ_ITEMS.length} questions`);
  } else {
    const have = new Set(faqRows.map((r) => r.question));
    const missing = FAQ_ITEMS.filter((f) => !have.has(f.q));
    if (missing.length) {
      await tx.insert(schema.faqs).values(
        missing.map((f, i) => ({ question: f.q, answer: f.a, sortOrder: faqRows.length + i })),
      );
    }
    log(`FAQ curated by an editor — ${missing.length} missing question(s) appended, existing answers left alone`);
  }

  /* ── 4d · retire copy that points at removed routes ───────────────
     The FAQ set is treated as editor-curated once it is in place, so the
     wholesale replace above will not touch it. This corrects the one
     answer that still routed readers to /demo, matched exactly so an
     answer an editor rewrote is left alone. */
  const demoAnswer =
    "قیمت بر اساس تعداد کنتورهای تحت پایش و گزارش‌های موردنیاز تعیین می‌شود. برای دریافت پیشنهاد متناسب با مجموعهٔ خود، درخواست دمو ثبت کنید.";
  const fixed = await tx.update(schema.faqs)
    .set({ answer: FAQ_ITEMS.find((f) => f.q === "مدل قیمت‌گذاری چگونه است؟")!.a })
    .where(eq(schema.faqs.answer, demoAnswer))
    .returning({ id: schema.faqs.id });
  log(`FAQ answers pointing at removed routes corrected: ${fixed.length}`);

  /* ── 5 · navigation → approved IA ─────────────────────────────── */
  await tx.delete(schema.navItems);
  for (const [si, section] of DEFAULT_NAV.entries()) {
    const [row] = await tx.insert(schema.navItems).values({
      label: section.label, href: section.href, description: section.description ?? "", icon: section.icon ?? "",
      kind: section.kind, lens: section.lens, openInNewTab: section.newTab ?? false,
      introTitle: section.intro?.title ?? "", introDescription: section.intro?.description ?? "",
      introCtaLabel: section.intro?.ctaLabel ?? "", introCtaHref: section.intro?.ctaHref ?? "",
      sortOrder: si,
    }).returning({ id: schema.navItems.id });
    if (section.items.length) {
      await tx.insert(schema.navItems).values(section.items.map((i, ii) => ({
        parentId: row.id, label: i.label, href: i.href, description: i.description ?? "",
        icon: i.icon ?? "", openInNewTab: i.newTab ?? false, sortOrder: ii,
        isActive: i.isActive ?? true,
      })));
    }
  }
  log(`navigation rebuilt: ${DEFAULT_NAV.length} sections`);

  /* ── 6 · drop SEO overrides for routes that no longer exist ───── */
  const dead = await tx.delete(schema.pageSeo)
    .where(inArray(schema.pageSeo.path, [
      "/services",
      "/resources/training", "/resources/reports", "/resources/videos", "/resources/guides",
      "/about/expertise", "/about/team",
      "/product/capabilities/multi-site",
    ])).returning({ path: schema.pageSeo.path });
  log(`SEO overrides for retired routes removed: ${dead.length}`);
});

console.log("✔ content strategy applied");
/* The public read layer is cached per tag and this script writes outside
   the app, so a running instance keeps serving the previous menu until
   its caches expire. POST /api/revalidate (or restart) right after. */
console.log('  → next: curl -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" <site>/api/revalidate');
await client.end();
