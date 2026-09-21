/* Fast, dependency-free checks for the CMS content model.
   Run with `npm run check` — no database and no browser needed.
   The full admin CRUD / responsive pass is done in the browser. */
import assert from "node:assert/strict";
import { isSafeHref } from "../src/lib/links";
import { plainText } from "../src/components/AccentText";
import { SECTIONS, SECTION_BY_KEY } from "../src/content/sections";
import { DEFAULT_NAV, isExternalHref, slugOf, sectionKeyForRoute, type NavSectionView } from "../src/content/navigation";
import { capabilityBySlug } from "../src/content/capabilities";

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
ok((SECTION_BY_KEY.companies?.defaults.items?.length ?? 0) > 0, "consumer-type strip ships with default items");
/* The strip must never become a customer-logo wall again: Behsa has no
   permission to display customer brands (docs/content-strategy.md). */
ok(!(SECTION_BY_KEY.companies?.items?.fields ?? []).some((f) => f.name === "image"),
   "consumer-type strip exposes no logo upload");
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
for (const s of DEFAULT_NAV) {
  for (const item of s.items) {
    if (item.isActive === false || isExternalHref(item.href)) continue;
    ok(
      ROUTE_PAGES.has(item.href) || Boolean(capabilityBySlug(slugOf(item.href))),
      `nav "${item.label}" (${item.href}): has page content`,
    );
  }
}

console.log(`✔ ${checks} CMS content-model checks passed`);
