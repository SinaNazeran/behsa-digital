CREATE TABLE "report_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"question" varchar(255) DEFAULT '' NOT NULL,
	"icon" varchar(40) DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "report_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"previous_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"title" varchar(255) NOT NULL,
	"menu_title" varchar(120) DEFAULT '' NOT NULL,
	"question" varchar(255) DEFAULT '' NOT NULL,
	"lead" text DEFAULT '' NOT NULL,
	"category_id" integer NOT NULL,
	"audiences" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"icon" varchar(40) DEFAULT '' NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_report_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_pages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(12) DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" varchar(255) DEFAULT '' NOT NULL,
	"seo_description" text DEFAULT '' NOT NULL,
	"og_media_id" uuid,
	"noindex" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reports_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_category_id_report_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."report_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_og_media_id_media_id_fk" FOREIGN KEY ("og_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reports_category_idx" ON "reports" USING btree ("category_id","sort_order");