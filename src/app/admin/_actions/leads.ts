"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { LEAD_STATUSES, type LeadStatus } from "@/db/schema";
import { int, str } from "./helpers";

/* Leads are read-only in the panel except for their status, which turns
   the list into a work queue. They are never created or edited here —
   the only writer is the public form. */

export async function setLeadStatus(formData: FormData): Promise<void> {
  await requireUser();

  const id = int(formData, "id");
  const status = str(formData, "status", 16);

  if (!Number.isFinite(id) || !LEAD_STATUSES.includes(status as LeadStatus)) return;

  await db.update(schema.leads)
    .set({ status: status as LeadStatus })
    .where(eq(schema.leads.id, id));

  revalidatePath("/admin/leads");
}
