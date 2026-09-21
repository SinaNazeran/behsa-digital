"use server";

import { z } from "zod";
import { and, eq, gt } from "drizzle-orm";
import { db, schema } from "@/db";
import {
  CONTRACTED_POWER_BANDS, LEAD_STATUSES, ORGANIZATION_TYPES,
} from "@/db/schema";

/* Public lead capture — the site's only write path open to anonymous
   visitors, so every field is treated as untrusted input and validated
   server-side regardless of what the client form allows.

   The row is persisted first and any notification happens after: an
   SMTP failure must never lose a qualified lead. */

export type LeadState = { ok?: boolean; message?: string; errors?: Record<string, string> } | null;

/* Iranian mobile/landline, with or without +98, tolerating spaces and
   dashes. Deliberately permissive — rejecting a real number costs more
   than accepting a malformed one. */
const PHONE_RE = /^(?:\+?98|0)?[\d\s()-]{8,18}$/;

const toLatin = (v: string) =>
  v.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
   .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

const LeadSchema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید.").max(120),
  organization: z.string().trim().min(2, "نام سازمان را وارد کنید.").max(160),
  role: z.string().trim().max(120).default(""),
  phone: z.string().trim().min(8, "شماره تماس را وارد کنید.").max(32)
    .refine((v) => PHONE_RE.test(toLatin(v)), "شماره تماس معتبر نیست."),
  email: z.union([z.literal(""), z.email("ایمیل معتبر نیست.").max(255)]).default(""),
  contractedPowerBand: z.enum(CONTRACTED_POWER_BANDS).default("unknown"),
  organizationType: z.enum(ORGANIZATION_TYPES).default("other"),
  subject: z.string().trim().max(160).default(""),
  message: z.string().trim().max(4000).default(""),
  sourcePath: z.string().trim().max(255).default(""),
  /* honeypot: a real person never fills a field they cannot see */
  website: z.string().max(200).default(""),
});

const fieldOf = (path: PropertyKey[]) => String(path[0] ?? "form");

export async function submitLead(_state: LeadState, formData: FormData): Promise<LeadState> {
  const parsed = LeadSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[fieldOf(issue.path)] ??= issue.message;
    return { ok: false, message: "لطفاً خطاهای فرم را برطرف کنید.", errors };
  }

  const data = parsed.data;

  /* Silently accept bot submissions: telling a script it was detected
     just teaches it to try again without the honeypot. */
  if (data.website) return { ok: true, message: "درخواست شما ثبت شد." };

  const phone = toLatin(data.phone).replace(/[\s()-]/g, "");

  /* Minimal abuse / double-submit guard. Not a full rate limiter: it
     keys on the phone number, not the IP, because no IP is stored.
     ponytail: per-phone window; add IP-based limiting if spam appears. */
  const [recent] = await db
    .select({ id: schema.leads.id })
    .from(schema.leads)
    .where(and(
      eq(schema.leads.phone, phone),
      gt(schema.leads.createdAt, new Date(Date.now() - 2 * 60 * 1000)),
    ))
    .limit(1);

  if (recent) {
    return { ok: true, message: "درخواست شما قبلاً ثبت شده است؛ به‌زودی با شما تماس می‌گیریم." };
  }

  try {
    await db.insert(schema.leads).values({
      name: data.name,
      organization: data.organization,
      role: data.role,
      phone,
      email: data.email,
      contractedPowerBand: data.contractedPowerBand,
      organizationType: data.organizationType,
      subject: data.subject,
      message: data.message,
      sourcePath: data.sourcePath.startsWith("/") ? data.sourcePath : "",
      status: LEAD_STATUSES[0],
    });
  } catch {
    return { ok: false, message: "ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید یا تلفنی تماس بگیرید." };
  }

  return { ok: true, message: "درخواست شما ثبت شد." };
}
