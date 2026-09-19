CREATE TABLE "content_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" varchar(48) NOT NULL,
	"title" varchar(255) DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"icon" varchar(40) DEFAULT '' NOT NULL,
	"tag" varchar(120) DEFAULT '' NOT NULL,
	"href" varchar(500) DEFAULT '' NOT NULL,
	"bullets" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"media_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_sections" (
	"key" varchar(48) PRIMARY KEY NOT NULL,
	"eyebrow" varchar(120) DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"cta_label" varchar(120) DEFAULT '' NOT NULL,
	"cta_href" varchar(500) DEFAULT '' NOT NULL,
	"media_id" uuid,
	"mobile_media_id" uuid,
	"video_url" varchar(500) DEFAULT '' NOT NULL,
	"video_enabled" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"label" varchar(120) NOT NULL,
	"href" varchar(500) NOT NULL,
	"description" varchar(255) DEFAULT '' NOT NULL,
	"icon" varchar(40) DEFAULT '' NOT NULL,
	"kind" varchar(12) DEFAULT 'dropdown' NOT NULL,
	"lens" varchar(12) DEFAULT 'content' NOT NULL,
	"open_in_new_tab" boolean DEFAULT false NOT NULL,
	"intro_title" varchar(160) DEFAULT '' NOT NULL,
	"intro_description" text DEFAULT '' NOT NULL,
	"intro_cta_label" varchar(120) DEFAULT '' NOT NULL,
	"intro_cta_href" varchar(500) DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_section_key_content_sections_key_fk" FOREIGN KEY ("section_key") REFERENCES "public"."content_sections"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_sections" ADD CONSTRAINT "content_sections_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_sections" ADD CONSTRAINT "content_sections_mobile_media_id_media_id_fk" FOREIGN KEY ("mobile_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nav_items" ADD CONSTRAINT "nav_items_parent_id_nav_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."nav_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_items_section_idx" ON "content_items" USING btree ("section_key","sort_order");--> statement-breakpoint
CREATE INDEX "nav_items_parent_idx" ON "nav_items" USING btree ("parent_id","sort_order");