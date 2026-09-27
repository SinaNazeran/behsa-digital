CREATE TABLE "catalogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"edition" varchar(80) DEFAULT '' NOT NULL,
	"pages" integer,
	"file_id" uuid NOT NULL,
	"cover_media_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- the catalogue page joins «منابع» in the live menu (content/navigation.ts
-- carries the same item for fresh installs). The menu hides it on its own
-- while no catalogue is published, so it can ship active.
INSERT INTO "nav_items" ("parent_id", "label", "href", "description", "icon", "sort_order")
SELECT p."id", 'کاتالوگ محصول', '/resources/catalog', 'دانلود نسخهٔ PDF معرفی سامانه', 'download',
       COALESCE((SELECT max(c."sort_order") + 1 FROM "nav_items" c WHERE c."parent_id" = p."id"), 0)
FROM "nav_items" p
WHERE p."parent_id" IS NULL AND p."href" = '/resources'
  AND NOT EXISTS (SELECT 1 FROM "nav_items" WHERE "href" = '/resources/catalog');
