import { sql } from "drizzle-orm";
import {
  boolean,
  type AnyPgColumn,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* ════════════════════════════════════════════════════════════════
   Behsa CMS — PostgreSQL schema
   Everything a non-technical editor manages lives here: articles and
   their taxonomy, ordered collections, media, settings, per-page SEO,
   the navigation tree and the editable page sections (hero included).
   src/content/* now only holds the factory defaults for those tables
   plus deep product copy (capabilities) that is not editor-managed.
   ════════════════════════════════════════════════════════════════ */

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

/* ── Auth ───────────────────────────────────────────────────────── */

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  /** admin: everything incl. users · editor: content only */
  role: varchar("role", { length: 16 }).$type<"admin" | "editor">().notNull().default("editor"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("admin_users_email_uq").on(sql`lower(${t.email})`)]);

export const sessions = pgTable("sessions", {
  /** sha256(token) — the raw token only ever lives in the cookie */
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: integer("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ip: varchar("ip", { length: 64 }),
  userAgent: text("user_agent"),
  createdAt: createdAt(),
}, (t) => [index("sessions_user_idx").on(t.userId), index("sessions_exp_idx").on(t.expiresAt)]);

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  ip: varchar("ip", { length: 64 }),
  success: boolean("success").notNull(),
  createdAt: createdAt(),
}, (t) => [index("login_attempts_lookup_idx").on(t.email, t.createdAt)]);

/* ── Media (stored in Postgres → one backup covers everything) ─── */

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mime: varchar("mime", { length: 64 }).notNull(),
  size: integer("size").notNull(),
  alt: varchar("alt", { length: 255 }).notNull().default(""),
  data: bytea("data").notNull(),
  createdAt: createdAt(),
});

/* ── Articles ───────────────────────────────────────────────────── */

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type ArticleSection = { h?: string; p: string[] };
export type ChartStyle = "line" | "bars" | "donut" | "area";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: jsonb("body").$type<ArticleSection[]>().notNull().default([]),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  authorName: varchar("author_name", { length: 120 }).notNull().default("تیم تحلیل بهسا"),
  coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  chartStyle: varchar("chart_style", { length: 12 }).$type<ChartStyle>().notNull().default("area"),
  status: varchar("status", { length: 12 }).$type<"draft" | "published">().notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  /* SEO overrides — empty = derived from title/excerpt */
  seoTitle: varchar("seo_title", { length: 255 }).notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
  canonicalUrl: varchar("canonical_url", { length: 500 }).notNull().default(""),
  noindex: boolean("noindex").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("articles_status_pub_idx").on(t.status, t.publishedAt)]);

/* ── Simple ordered collections ─────────────────────────────────── */

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  org: varchar("org", { length: 160 }).notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/* ── Leads (demo / contact requests) ─────────────────────────────
   The site previously had no form at all: every primary CTA pointed at
   the customer panel, which a prospect cannot use. Submissions are
   persisted first and notified second — an SMTP failure must not lose a
   qualified lead. `contractedPowerBand` is the qualifier, not decoration:
   it is what separates a lead from a browser. */

export const CONTRACTED_POWER_BANDS = ["<150", "150-500", "500-1000", ">1000", "unknown"] as const;
export type ContractedPowerBand = (typeof CONTRACTED_POWER_BANDS)[number];

export const ORGANIZATION_TYPES = [
  "heavy-industry", "holding", "consultant", "retailer", "power-plant", "organization", "other",
] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  organization: varchar("organization", { length: 160 }).notNull(),
  role: varchar("role", { length: 120 }).notNull().default(""),
  phone: varchar("phone", { length: 32 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().default(""),
  contractedPowerBand: varchar("contracted_power_band", { length: 16 })
    .$type<ContractedPowerBand>().notNull().default("unknown"),
  organizationType: varchar("organization_type", { length: 24 })
    .$type<OrganizationType>().notNull().default("other"),
  subject: varchar("subject", { length: 160 }).notNull().default(""),
  message: text("message").notNull().default(""),
  /** the page the request came from — tells sales what they were reading */
  sourcePath: varchar("source_path", { length: 255 }).notNull().default(""),
  status: varchar("status", { length: 16 }).$type<LeadStatus>().notNull().default("new"),
  createdAt: createdAt(),
}, (t) => [index("leads_status_idx").on(t.status, t.createdAt)]);

/* ── Site-wide settings & per-page SEO ──────────────────────────── */

export type SiteSettings = {
  siteName: string;
  tagline: string;
  defaultDescription: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  address: string;
  workingHours: string;
  baleUrl: string;
  panelUrl: string;
  footerAbout: string;
  defaultOgMediaId: string | null;
};

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: jsonb("value").$type<SiteSettings>().notNull(),
  updatedAt: updatedAt(),
});

export const pageSeo = pgTable("page_seo", {
  /** route path, e.g. "/" or "/solutions/demand-management" */
  path: varchar("path", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull().default(""),
  description: text("description").notNull().default(""),
  ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
  noindex: boolean("noindex").notNull().default(false),
  updatedAt: updatedAt(),
});

/* ── Navigation (menu tree) ────────────────────────────────────── */

/** messaging lens of a nav section — drives the landing template tone */
export type NavLens = "feature" | "outcome" | "vertical" | "content" | "company";
export const NAV_LENSES = ["feature", "outcome", "vertical", "content", "company"] as const;
export type NavKind = "mega" | "dropdown" | "reports";

export const navItems = pgTable("nav_items", {
  id: serial("id").primaryKey(),
  /** null = top-level section · otherwise the section this item belongs to */
  parentId: integer("parent_id").references((): AnyPgColumn => navItems.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 120 }).notNull(),
  /** internal path ("/solutions") or absolute URL ("https://…") */
  href: varchar("href", { length: 500 }).notNull(),
  description: varchar("description", { length: 255 }).notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default(""),
  /** panel style of a top-level section · "reports" = children are built
      from the report catalogue, never stored here */
  kind: varchar("kind", { length: 12 }).$type<NavKind>().notNull().default("dropdown"),
  lens: varchar("lens", { length: 12 }).$type<NavLens>().notNull().default("content"),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  /* mega-panel intro column (top-level only, optional) */
  introTitle: varchar("intro_title", { length: 160 }).notNull().default(""),
  introDescription: text("intro_description").notNull().default(""),
  introCtaLabel: varchar("intro_cta_label", { length: 120 }).notNull().default(""),
  introCtaHref: varchar("intro_cta_href", { length: 500 }).notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("nav_items_parent_idx").on(t.parentId, t.sortOrder)]);

/* ── Report catalogue ─────────────────────────────────────────────
   The product's named reports, owned by the content team. Every page
   uses one fixed template (src/views/ReportDetail.tsx): editors fill
   fields, they never compose layout. Audience keys and their labels
   live in src/content/reports.ts so client components can read them. */

export type ReportSection = { title: string; body?: string[]; items?: string[] };
export type ReportImage = { mediaId: string; caption: string };

export const reportCategories = pgTable("report_categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  /** the management question every report in the category answers */
  question: varchar("question", { length: 255 }).notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  /** slugs this report was published under before — they 308 to the current one */
  previousSlugs: jsonb("previous_slugs").$type<string[]>().notNull().default([]),
  /** full name, verbatim as in the product panel */
  title: varchar("title", { length: 255 }).notNull(),
  /** short label for menus and cards; empty = title */
  menuTitle: varchar("menu_title", { length: 120 }).notNull().default(""),
  question: varchar("question", { length: 255 }).notNull().default(""),
  lead: text("lead").notNull().default(""),
  /* restrict: a category is emptied before it is deleted, never silently */
  categoryId: integer("category_id").notNull().references(() => reportCategories.id, { onDelete: "restrict" }),
  audiences: jsonb("audiences").$type<string[]>().notNull().default([]),
  icon: varchar("icon", { length: 40 }).notNull().default(""),
  sections: jsonb("sections").$type<ReportSection[]>().notNull().default([]),
  gallery: jsonb("gallery").$type<ReportImage[]>().notNull().default([]),
  relatedReportIds: jsonb("related_report_ids").$type<number[]>().notNull().default([]),
  /** landing slugs, e.g. "solutions/demand-management" */
  relatedPages: jsonb("related_pages").$type<string[]>().notNull().default([]),
  /** synonyms the /reports search should also match, e.g. «پیک» for peak demand */
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  status: varchar("status", { length: 12 }).$type<"draft" | "published">().notNull().default("draft"),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  seoTitle: varchar("seo_title", { length: 255 }).notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
  noindex: boolean("noindex").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("reports_category_idx").on(t.categoryId, t.sortOrder)]);

/* ── Editable page sections (hero, homepage bands, company strip) ─
   One generic shape keeps the model small: a section owns its heading
   and an ordered list of items. Which fields an editor actually sees is
   declared per section in src/content/sections.ts, so the CMS stays a
   content editor and never becomes a free-form page builder.          */

export const contentSections = pgTable("content_sections", {
  /** stable key from the section registry, e.g. "hero" or "solutions" */
  key: varchar("key", { length: 48 }).primaryKey(),
  eyebrow: varchar("eyebrow", { length: 120 }).notNull().default(""),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  ctaLabel: varchar("cta_label", { length: 120 }).notNull().default(""),
  ctaHref: varchar("cta_href", { length: 500 }).notNull().default(""),
  /** desktop/background image — also the video poster and fallback */
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  /** narrow-viewport image */
  mobileMediaId: uuid("mobile_media_id").references(() => media.id, { onDelete: "set null" }),
  videoUrl: varchar("video_url", { length: 500 }).notNull().default(""),
  videoEnabled: boolean("video_enabled").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: updatedAt(),
});

export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  sectionKey: varchar("section_key", { length: 48 }).notNull()
    .references(() => contentSections.key, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull().default(""),
  description: text("description").notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default(""),
  /** small badge or link label, depending on the section */
  tag: varchar("tag", { length: 120 }).notNull().default(""),
  href: varchar("href", { length: 500 }).notNull().default(""),
  bullets: jsonb("bullets").$type<string[]>().notNull().default([]),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("content_items_section_idx").on(t.sectionKey, t.sortOrder)]);
