ALTER TABLE "report_categories" ADD COLUMN IF NOT EXISTS "tone" varchar(20) DEFAULT '' NOT NULL;--> statement-breakpoint
-- existing categories take the validated slots in their display order, so
-- the first seven are distinct (CATEGORY_TONES in src/components/tones.ts)
UPDATE "report_categories" AS c
SET "tone" = (ARRAY['blue','orange','green','violet','magenta','olive','teal'])[((o.n - 1) % 7) + 1]
FROM (SELECT "id", row_number() OVER (ORDER BY "sort_order", "id") AS n FROM "report_categories") AS o
WHERE c."id" = o."id" AND c."tone" = '';
