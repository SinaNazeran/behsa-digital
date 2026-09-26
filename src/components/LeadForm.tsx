"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/icons";
import { submitLead, type LeadState } from "@/app/(site)/_actions/lead";

/* The contact form on /contact — the only route into the pipeline for a
   visitor who has no panel account.

   The form qualifies as well as collects: `contractedPowerBand` is the
   field that separates a lead from a browser, and `subject` is
   pre-filled from the ?subject= parameter that pages already pass. */

const FIELD =
  "w-full rounded-control border bg-bg px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink3 focus:border-primary/60 focus:ring-2 focus:ring-primary/15";

const POWER_BANDS: { value: string; label: string }[] = [
  { value: "unknown", label: "نمی‌دانم" },
  { value: "<150", label: "کمتر از ۱۵۰ کیلووات" },
  { value: "150-500", label: "۱۵۰ تا ۵۰۰ کیلووات" },
  { value: "500-1000", label: "۵۰۰ تا ۱۰۰۰ کیلووات" },
  { value: ">1000", label: "بیش از ۱۰۰۰ کیلووات" },
];

const ORG_TYPES: { value: string; label: string }[] = [
  { value: "heavy-industry", label: "صنعت پرمصرف (فولاد، سیمان، پتروشیمی، غذایی…)" },
  { value: "holding", label: "هلدینگ یا گروه چندسایتی" },
  { value: "consultant", label: "مشاور یا طراح برق" },
  { value: "retailer", label: "خرده‌فروش یا شرکت توزیع برق" },
  { value: "power-plant", label: "نیروگاه (خورشیدی یا مقیاس کوچک)" },
  { value: "organization", label: "سازمان یا مجموعهٔ اداری" },
  { value: "other", label: "سایر" },
];

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-primary px-6 text-[14.5px] font-bold text-on-primary transition-all",
        "hover:bg-primary-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        pending ? "cursor-wait opacity-70" : "cursor-pointer active:translate-y-px",
      )}
    >
      {pending ? "در حال ارسال…" : label}
      {!pending && <Icon name="arrowL" size={15} sw={2.2} />}
    </button>
  );
}

function Field({
  id, name, label, required, children, error,
}: {
  id: string; name: string; label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-bold text-ink">
        {label}
        {required && <span className="mr-1 text-orange-700" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-[12.5px] font-semibold text-err">
          {error}
        </p>
      )}
    </div>
  );
}

export function LeadForm({
  sourcePath,
  subject = "",
  submitLabel = "ارسال درخواست",
  phoneDisplay,
  phoneHref,
}: {
  sourcePath: string;
  subject?: string;
  submitLabel?: string;
  phoneDisplay?: string;
  phoneHref?: string;
}) {
  const [state, action] = useActionState<LeadState, FormData>(submitLead, null);
  const uid = useId();
  const f = (n: string) => `${uid}-${n}`;
  const err = (n: string) => state?.errors?.[n];
  const invalid = (n: string) => (err(n) ? "border-err" : "border-line");

  if (state?.ok) {
    return (
      <div className="tone-green kpi-card p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Icon name="check" size={28} sw={2.4} />
        </span>
        <p className="mt-5 font-display text-[18px] font-extrabold text-ink">{state.message}</p>
        <p className="mt-3 text-[14px] leading-8 text-ink2">
          همکاران ما در ساعات کاری با شما تماس می‌گیرند.
        </p>
        {phoneHref && phoneDisplay && (
          <p className="mt-2 text-[13.5px] text-ink2">
            اگر ترجیح می‌دهید زودتر صحبت کنید:{" "}
            <a href={phoneHref} dir="ltr" className="fa-num font-bold text-orange-700 hover:underline">{phoneDisplay}</a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="sourcePath" value={sourcePath} />
      {/* honeypot — hidden from people, not from scripts */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={f("website")}>وب‌سایت</label>
        <input id={f("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={f("name")} name="name" label="نام و نام خانوادگی" required error={err("name")}>
          <input
            id={f("name")} name="name" type="text" required autoComplete="name"
            aria-invalid={Boolean(err("name"))} aria-describedby={err("name") ? "name-error" : undefined}
            className={cn(FIELD, invalid("name"))}
          />
        </Field>

        <Field id={f("organization")} name="organization" label="نام سازمان" required error={err("organization")}>
          <input
            id={f("organization")} name="organization" type="text" required autoComplete="organization"
            aria-invalid={Boolean(err("organization"))}
            className={cn(FIELD, invalid("organization"))}
          />
        </Field>

        <Field id={f("phone")} name="phone" label="شمارهٔ تماس" required error={err("phone")}>
          <input
            id={f("phone")} name="phone" type="tel" required inputMode="tel" autoComplete="tel" dir="ltr"
            aria-invalid={Boolean(err("phone"))}
            className={cn(FIELD, invalid("phone"), "text-right")}
          />
        </Field>

        <Field id={f("email")} name="email" label="ایمیل (اختیاری)" error={err("email")}>
          <input
            id={f("email")} name="email" type="email" autoComplete="email" dir="ltr"
            aria-invalid={Boolean(err("email"))}
            className={cn(FIELD, invalid("email"), "text-right")}
          />
        </Field>

        <Field id={f("organizationType")} name="organizationType" label="نوع مجموعه" required>
          <select id={f("organizationType")} name="organizationType" required defaultValue="heavy-industry" className={cn(FIELD, "border-line")}>
            {ORG_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field id={f("contractedPowerBand")} name="contractedPowerBand" label="قدرت قراردادی" required>
          <select id={f("contractedPowerBand")} name="contractedPowerBand" required defaultValue="unknown" className={cn(FIELD, "border-line")}>
            {POWER_BANDS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>

      <Field id={f("subject")} name="subject" label="موضوع (اختیاری)">
        <input id={f("subject")} name="subject" type="text" defaultValue={subject} className={cn(FIELD, "border-line")} />
      </Field>

      <Field id={f("message")} name="message" label="توضیح (اختیاری)" error={err("message")}>
        <textarea
          id={f("message")} name="message" rows={4}
          placeholder="اگر مورد خاصی مدنظرتان است — مثلاً جریمهٔ دیماند یا طراحی بانک خازنی — اینجا بنویسید."
          className={cn(FIELD, invalid("message"), "resize-y leading-7")}
        />
      </Field>

      {state?.ok === false && state.message && (
        <p role="alert" className="rounded-control border border-err/30 bg-err/5 px-4 py-3 text-[13.5px] font-semibold text-err">
          {state.message}
        </p>
      )}

      <Submit label={submitLabel} />

      <p className="text-center text-[12px] leading-6 text-ink3">
        اطلاعات شما فقط برای تماس دربارهٔ همین درخواست استفاده می‌شود.
      </p>
    </form>
  );
}
