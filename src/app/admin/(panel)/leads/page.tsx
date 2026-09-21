import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { PageTitle } from "@/components/admin/ui";
import { formatJalali } from "@/lib/format";
import { setLeadStatus } from "../../_actions/leads";
import type { ContractedPowerBand, LeadStatus, OrganizationType } from "@/db/schema";

export const metadata = { title: "درخواست‌ها" };

const POWER: Record<ContractedPowerBand, string> = {
  "unknown": "نامشخص",
  "<150": "< ۱۵۰ کیلووات",
  "150-500": "۱۵۰–۵۰۰ کیلووات",
  "500-1000": "۵۰۰–۱۰۰۰ کیلووات",
  ">1000": "> ۱۰۰۰ کیلووات",
};

const ORG: Record<OrganizationType, string> = {
  "heavy-industry": "صنعت پرمصرف",
  "holding": "هلدینگ",
  "consultant": "مشاور / طراح",
  "retailer": "خرده‌فروش / توزیع",
  "power-plant": "نیروگاه",
  "organization": "سازمان",
  "other": "سایر",
};

const STATUS: Record<LeadStatus, string> = {
  new: "جدید",
  contacted: "تماس گرفته شد",
  qualified: "واجد شرایط",
  closed: "بسته‌شده",
};

const STATUS_CLS: Record<LeadStatus, string> = {
  new: "bg-orange-50 text-orange-700 border-orange-200",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  qualified: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export default async function LeadsAdmin() {
  const rows = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(200);

  return (
    <>
      <PageTitle
        title="درخواست‌ها"
        lead="درخواست‌های ثبت‌شده از فرم «تماس با ما». قدرت قراردادی، معیار اولویت‌بندی است."
      />

      {rows.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-line bg-surface p-10 text-center text-[13.5px] text-ink2">
          هنوز درخواستی ثبت نشده است.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((l) => (
            <article key={l.id} className="rounded-[10px] border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[15px] text-ink">
                    {l.name}
                    <span className="mr-2 text-[13px] font-semibold text-ink2">— {l.organization}</span>
                  </p>
                  <p className="mt-1 text-[12.5px] text-ink3">
                    {ORG[l.organizationType]} · {POWER[l.contractedPowerBand]}
                    {l.role && ` · ${l.role}`}
                  </p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11.5px] font-bold ${STATUS_CLS[l.status]}`}>
                  {STATUS[l.status]}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
                <a href={`tel:${l.phone}`} dir="ltr" className="fa-num font-bold text-ink hover:text-orange-700">{l.phone}</a>
                {l.email && <a href={`mailto:${l.email}`} dir="ltr" className="text-ink2 hover:text-orange-700">{l.email}</a>}
                <span className="text-ink3">{formatJalali(l.createdAt)}</span>
                {l.sourcePath && <span className="text-ink3" dir="ltr">{l.sourcePath}</span>}
              </div>

              {l.subject && <p className="mt-3 text-[13px] font-semibold text-ink2">موضوع: {l.subject}</p>}
              {l.message && <p className="mt-2 whitespace-pre-line text-[13.5px] leading-7 text-ink2">{l.message}</p>}

              <form action={setLeadStatus} className="mt-4 flex items-center gap-2 border-t border-linesoft pt-3">
                <input type="hidden" name="id" value={l.id} />
                <label htmlFor={`status-${l.id}`} className="text-[12px] font-bold text-ink3">وضعیت</label>
                <select
                  id={`status-${l.id}`}
                  name="status"
                  defaultValue={l.status}
                  className="rounded-[8px] border border-line bg-bg px-3 py-1.5 text-[12.5px] text-ink"
                >
                  {(Object.keys(STATUS) as LeadStatus[]).map((k) => (
                    <option key={k} value={k}>{STATUS[k]}</option>
                  ))}
                </select>
                <button type="submit" className="rounded-[8px] border border-line bg-bg px-3 py-1.5 text-[12.5px] font-bold text-ink hover:border-primary/40 hover:text-orange-700">
                  ذخیره
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
