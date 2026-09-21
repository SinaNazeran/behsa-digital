CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"organization" varchar(160) NOT NULL,
	"role" varchar(120) DEFAULT '' NOT NULL,
	"phone" varchar(32) NOT NULL,
	"email" varchar(255) DEFAULT '' NOT NULL,
	"contracted_power_band" varchar(16) DEFAULT 'unknown' NOT NULL,
	"organization_type" varchar(24) DEFAULT 'other' NOT NULL,
	"subject" varchar(160) DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"source_path" varchar(255) DEFAULT '' NOT NULL,
	"status" varchar(16) DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status","created_at");