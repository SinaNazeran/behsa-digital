/* Fast, dependency-free checks for the CMS content model.
   Run with `npm run check` — no database and no browser needed.
   The full admin CRUD / responsive pass is done in the browser. */
import assert from "node:assert/strict";
import { isSafeHref } from "../src/lib/links";
import { plainText } from "../src/components/AccentText";
import { SECTIONS, SECTION_BY_KEY } from "../src/content/sections";
import { DEFAULT_NAV, isExternalHref, slugOf, sectionKeyForRoute, type NavSectionView } from "../src/content/navigation";
import { capabilityBySlug } from "../src/content/capabilities";
import { CUSTOMERS } from "../src/content/customers";
import { REPORT_AUDIENCES, audienceLabels, matchesQuery, searchText } from "../src/content/reports";
import { REPORT_AUDIENCE, REPORT_CATEGORIES, REPORT_MENU, REPORT_PAGES } from "./seed-reports";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

let checks = 0;
const ok = (cond: unknown, msg: string) => { assert.ok(cond, msg); checks++; };

/* ── link safety (editor input is untrusted) ── */
for (const good of ["", "/", "/solutions", "/a/b?x=1", "https://panel.example.ir/login", "mailto:a@b.ir", "tel:+985135412240", "#solutions"]) {
  ok(isSafeHref(good), `href accepted: ${good}`);
}
for (const bad of ["javascript:alert(1)", "JAVASCRIPT:alert(1)", "data:text/html,<script>", "vbscript:msgbox", "ftp://x", "//evil.com", " javascript:x"]) {
  ok(!isSafeHref(bad), `href rejected: ${bad}`);
}

/* ── headline markup is limited to the accent marker ── */
ok(plainText("از *کنتور* تا *قبض*") === "از کنتور تا قبض", "accent markers are stripped for plain text");
ok(plainText("<b>x</b>") === "<b>x</b>", "html is never interpreted, only escaped by React");

/* ── section registry integrity ── */
ok(new Set(SECTIONS.map((s) => s.key)).size === SECTIONS.length, "section keys are unique");
const KNOWN_FIELDS = new Set(["icon", "tag", "href", "bullets", "image", "description"]);
for (const def of SECTIONS) {
  ok(def.label && def.hint, `${def.key}: has an editor label and hint`);
  ok(SECTION_BY_KEY[def.key] === def, `${def.key}: reachable by key`);
  for (const f of def.items?.fields ?? []) ok(KNOWN_FIELDS.has(f.name), `${def.key}: item field "${f.name}" is known`);
  for (const item of def.defaults.items ?? []) {
    ok(item.title, `${def.key}: default item has a title`);
    ok(isSafeHref(item.href ?? ""), `${def.key}: default item link is safe`);
  }
  ok(isSafeHref(def.defaults.ctaHref ?? ""), `${def.key}: default CTA link is safe`);
  ok(isSafeHref(def.defaults.videoUrl ?? ""), `${def.key}: default video URL is safe`);
}
ok(SECTION_BY_KEY.hero?.header.media && SECTION_BY_KEY.hero?.header.video, "hero owns image and video fields");
/* Customer logos ship as reviewed SVG files, never through the media
   library (which refuses SVG). Each must exist, stay free of scripts and
   raster payloads, and declare the ratio its viewBox actually has —
   the strip sizes logos from that ratio. */
ok(!SECTION_BY_KEY.companies?.items, "customer logo strip has no CMS item editor");
for (const c of CUSTOMERS) {
  const file = join("public", c.logo);
  ok(existsSync(file), `${c.logo}: file exists`);
  const svg = readFileSync(file, "utf8");
  ok(!/<script|\son\w+=|<image|<foreignObject/i.test(svg), `${c.logo}: no scripts or embedded raster`);
  const vb = svg.match(/<svg\b[^>]*\bviewBox="([^"]+)"/)?.[1].trim().split(/[\s,]+/).map(Number);
  ok(vb && Math.abs(vb[2] / vb[3] - c.ratio) < 0.02, `${c.logo}: ratio matches viewBox`);
}
/* Bands whose own copy claims real screenshots or real customer results
   must not ship switched on with placeholder content. */
ok(SECTION_BY_KEY.dashboard?.defaults.isActive === false, "screenshot band ships inactive until real media exists");
ok(SECTION_BY_KEY.proof?.defaults.isActive === false, "customer-results band ships inactive until real proof exists");

/* ── navigation defaults + active-route resolution ── */
for (const s of DEFAULT_NAV) {
  ok(isSafeHref(s.href), `nav "${s.label}": link is safe`);
  ok(s.items.every((i) => isSafeHref(i.href)), `nav "${s.label}": child links are safe`);
  ok(!s.intro || isSafeHref(s.intro.ctaHref), `nav "${s.label}": intro link is safe`);
}
ok(isExternalHref("https://x.ir") && !isExternalHref("/about"), "internal/external links are told apart");
ok(slugOf("/solutions/power-quality") === "solutions/power-quality", "landing slug is derived from the path");

const sections: NavSectionView[] = DEFAULT_NAV.map((s, i) => ({
  id: i + 1, title: s.label, href: s.href, description: "", newTab: false,
  kind: s.kind, lens: s.lens, intro: null,
  items: s.items.map((it, j) => ({ id: (i + 1) * 100 + j, title: it.label, href: it.href, description: "", newTab: false })),
}));
ok(sectionKeyForRoute("/solutions/power-quality", sections) === "3", "a deep route highlights its own section");
ok(sectionKeyForRoute("/articles", sections) === "5", "a child link on another path still highlights its section");
ok(sectionKeyForRoute("/contact", sections) === "contact", "contact keeps its own active state");
ok(sectionKeyForRoute("/", sections) === null, "home highlights no section");
ok(sectionKeyForRoute("/nope", sections) === null, "unknown route highlights no section");

/* ── every menu entry resolves to written content ──────────────────
   The rule of record from docs/content-strategy.md: a nav item ships
   with its page. This guards against the ~21 empty indexed landing
   pages the content audit found. Routes with a hand-written page
   component, and section roots that render their own children grid,
   are listed as exceptions. */
const ROUTE_PAGES = new Set(["/articles", "/about", "/contact", "/product/platform"]);
/* report pages live in the database; links to them must match what the seed imports */
const SEEDED_REPORTS = new Set(REPORT_PAGES.map((p) => p.href));
/* the report menu is built from the catalogue, so its factory section holds no items */
const reportNav = DEFAULT_NAV.find((s) => s.href === "/reports");
ok(reportNav?.kind === "reports" && reportNav.items.length === 0, "report menu is catalogue-driven, with no hand-written items");
for (const s of DEFAULT_NAV) {
  for (const item of s.items) {
    if (item.isActive === false || isExternalHref(item.href)) continue;
    ok(
      ROUTE_PAGES.has(item.href) || SEEDED_REPORTS.has(item.href) || Boolean(capabilityBySlug(slugOf(item.href))),
      `nav "${item.label}" (${item.href}): has page content`,
    );
  }
}

/* ── report catalogue seed ──────────────────────────────────────────
   Every seeded report lands in exactly one category, with at least one
   known audience, or `npm run db:seed` would publish an incomplete page. */
const AUDIENCE_KEYS = new Set<string>(REPORT_AUDIENCES.map((a) => a.key));
const placed = REPORT_CATEGORIES.flatMap((c) => c.reports);
ok(new Set(placed).size === placed.length, "no report is seeded into two categories");
ok(new Set(REPORT_CATEGORIES.map((c) => c.slug)).size === REPORT_CATEGORIES.length, "report category slugs are unique");
for (const page of REPORT_PAGES) {
  ok(placed.includes(page.id), `report ${page.id}: has a category`);
  ok(REPORT_MENU[page.href]?.label && REPORT_MENU[page.href]?.question, `report ${page.id}: has a menu label and question`);
  const audiences = REPORT_AUDIENCE[page.id] ?? [];
  ok(audiences.length > 0 && audiences.every((a) => AUDIENCE_KEYS.has(a)), `report ${page.id}: has known audiences`);
  ok(page.slug === slugOf(page.href) && page.slug.startsWith("reports/"), `report ${page.id}: slug matches its URL`);
  ok((page.sections ?? []).some((b) => b.body?.length || b.items?.length), `report ${page.id}: has body content`);
  for (const l of page.links ?? []) {
    ok(SEEDED_REPORTS.has(`/${l.slug}`) || capabilityBySlug(l.slug), `report ${page.id}: link ${l.slug} resolves`);
  }
}
ok(audienceLabels(["finance", "gone"]).join() === "مدیر مالی", "unknown audience keys are dropped, never shown raw");

/* ── report search folds Persian spelling variants ── */
const hay = searchText(["گزارش‌های دادهٔ کنتور", "ضریب توان ۰٫۹۱"]);
ok(matchesQuery(hay, "گزارشهای داده کنتور"), "search ignores the zero-width joiner and ٔ");
ok(matchesQuery(hay, "گزارش ها"), "search matches a word typed with a space");
ok(matchesQuery(hay, "كنتور"), "search folds Arabic kaf");
ok(matchesQuery(hay, "ضريب"), "search folds Arabic yeh");
ok(matchesQuery(hay, "91") && matchesQuery(hay, "۹۱"), "search folds Persian digits");
ok(matchesQuery(hay, "  "), "an empty query matches everything");
ok(!matchesQuery(hay, "کنتور خورشیدی"), "every word of the query must match");

console.log(`✔ ${checks} CMS content-model checks passed`);
