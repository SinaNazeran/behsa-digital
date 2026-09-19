/* Fast, dependency-free checks for the CMS content model.
   Run with `npm run check` — no database and no browser needed.
   The full admin CRUD / responsive pass is done in the browser. */
import assert from "node:assert/strict";
import { isSafeHref } from "../src/lib/links";
import { plainText } from "../src/components/AccentText";
import { SECTIONS, SECTION_BY_KEY } from "../src/content/sections";
import { DEFAULT_NAV, isExternalHref, slugOf, sectionKeyForRoute, type NavSectionView } from "../src/content/navigation";

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
ok((SECTION_BY_KEY.companies?.defaults.items?.length ?? 0) > 0, "company strip ships with default companies");

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
ok(sectionKeyForRoute("/solutions/power-quality", sections) === "2", "a deep route highlights its own section");
ok(sectionKeyForRoute("/articles", sections) === "4", "a child link on another path still highlights its section");
ok(sectionKeyForRoute("/contact", sections) === "contact", "contact keeps its own active state");
ok(sectionKeyForRoute("/", sections) === null, "home highlights no section");
ok(sectionKeyForRoute("/nope", sections) === null, "unknown route highlights no section");

console.log(`✔ ${checks} CMS content-model checks passed`);
