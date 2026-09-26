/* ── Card tones · which colour identity a card wears ──
   The tone-* classes themselves live in styles/index.css; this is only
   the choosing. Shared by every page, so a category, a lens or a peer
   grid gets the same colour wherever it appears. */

/** decorative cycle for peer grids whose cards carry no identity of their own */
export const TONES = ["tone-orange", "tone-blue", "tone-green"] as const;
export type Tone = (typeof TONES)[number];

/* a page's own colour, from the menu lens its hero already wears:
   product and reports blue (data), solutions green (the outcome),
   industries orange (the vertical), company and content blue */
export const LENS_TONE: Record<string, Tone> = {
  feature: "tone-blue",
  report: "tone-blue",
  outcome: "tone-green",
  vertical: "tone-orange",
  content: "tone-blue",
  company: "tone-blue",
};

/* ── Report categories · colour is identity ──
   A category's colour is stored on the category (report_categories.tone),
   because colour must follow the entity, never its name or its rank:
   guessing from keywords in the name gave three of five categories the
   same blue, and deriving it from list position would repaint every
   category below whenever one is added, removed or reordered.

   Seven slots in a fixed, validated order (the ramp note in index.css
   has the measurements). A new category takes the first slot no other
   category uses. Colour here is a secondary channel — every category is
   also named and iconed — so past seven the least-used slot is reused
   rather than a hue being generated; seven is the ceiling at which
   neighbours still clear the colour-vision checks. */
export const CATEGORY_TONES = ["blue", "orange", "green", "violet", "magenta", "olive", "teal"] as const;
export type CategoryTone = (typeof CATEGORY_TONES)[number];

export const CATEGORY_TONE_LABELS: Record<CategoryTone, string> = {
  blue: "آبی", orange: "نارنجی", green: "سبز", violet: "بنفش", magenta: "سرخابی", olive: "زیتونی", teal: "فیروزه‌ای",
};

export const isCategoryTone = (v: unknown): v is CategoryTone =>
  typeof v === "string" && (CATEGORY_TONES as readonly string[]).includes(v);

/** the tone-* class for a stored category tone (an unset one reads as blue) */
export const categoryToneClass = (tone: string | undefined) => `tone-${isCategoryTone(tone) ? tone : "blue"}`;

/** the slot a new category gets: the first unused one, else the least used */
export function nextCategoryTone(used: readonly string[]): CategoryTone {
  const count = (t: CategoryTone) => used.filter((u) => u === t).length;
  return CATEGORY_TONES.reduce((best, t) => (count(t) < count(best) ? t : best), CATEGORY_TONES[0]);
}
