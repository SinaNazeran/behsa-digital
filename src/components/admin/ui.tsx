"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { btnCls, inputCls } from "./styles";

export { btnCls, inputCls };

/* ── Shared action state contract for every admin Server Action ── */
export type ActionState = { ok?: boolean; message?: string; errors?: Record<string, string> } | null;
export type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;


/* ── Buttons ── */

export function SubmitButton({ children, variant = "primary", className, pendingText = "در حال ذخیره…" }: {
  children: ReactNode; variant?: "primary" | "secondary" | "danger"; className?: string; pendingText?: string;
}) {
  const status = useFormStatus();
  const pending = useContext(PendingContext) || status.pending;
  return (
    <button type="submit" disabled={pending} className={cn(btnCls(variant), className)}>
      {pending ? pendingText : children}
    </button>
  );
}


/* ── Form wrapper: wires useActionState + inline status message ──
   Submits via onSubmit + startTransition instead of <form action>, because
   React 19 auto-resets forms after an action — editors would lose their
   typing whenever validation fails. */

const PendingContext = createContext(false);

export function AdminForm({ action, children, className, resetOnSuccess = false, id }: {
  action: FormAction; children: ReactNode; className?: string; resetOnSuccess?: boolean; id?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form
      ref={ref}
      id={id}
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      <PendingContext.Provider value={pending}>
        {children}
        <StatusMessage state={state} />
      </PendingContext.Provider>
    </form>
  );
}

export function StatusMessage({ state }: { state: ActionState }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(true);
    if (state?.ok) {
      const t = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [state]);
  if (!state?.message || !visible) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={cn(
        "mt-4 rounded-[8px] border px-3.5 py-2.5 text-[13.5px] font-semibold",
        state.ok ? "border-accent/30 bg-accent-soft text-ok" : "border-err/30 bg-errbg text-err",
      )}
    >
      {state.message}
      {state.errors && Object.keys(state.errors).length > 0 && (
        <span className="mt-1 block font-normal">
          {Object.values(state.errors).map((e) => `• ${e}`).join("  ")}
        </span>
      )}
    </p>
  );
}

/* ── Field chrome ── */

export function Field({ label, hint, children, className, htmlFor }: {
  label: string; hint?: ReactNode; children: ReactNode; className?: string; htmlFor?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-[13px] font-bold text-ink">{label}</label>
      {children}
      {hint && <p className="text-[12px] leading-5 text-ink3">{hint}</p>}
    </div>
  );
}

/** text input / textarea with a live character counter against a recommended max */
export function CountedInput({ name, defaultValue = "", max, multiline = false, placeholder, id, dir, onValue, rows = 3 }: {
  name: string; defaultValue?: string; max: number; multiline?: boolean; placeholder?: string; id?: string; dir?: "ltr" | "rtl"; onValue?: (v: string) => void; rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const over = value.length > max;
  const common = {
    id, name, value, placeholder, dir,
    onChange: (e: { target: { value: string } }) => { setValue(e.target.value); onValue?.(e.target.value); },
    className: cn(inputCls, over && "border-warn focus:border-warn"),
  };
  return (
    <div>
      {multiline ? <textarea rows={rows} {...common} /> : <input {...common} />}
      <p className={cn("mt-1 text-left text-[11.5px] fa-num", over ? "text-warn font-bold" : "text-ink3")} dir="ltr">
        {value.length} / {max}
      </p>
    </div>
  );
}

export function Card({ title, actions, children, className }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[12px] border border-line bg-surface p-5 md:p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="font-display text-[16px] font-extrabold text-ink">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, lead, actions }: { title: string; lead?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[22px] font-black text-ink md:text-[26px]">{title}</h1>
        {lead && <p className="mt-1.5 max-w-2xl text-[13.5px] leading-7 text-ink2">{lead}</p>}
      </div>
      {actions}
    </div>
  );
}

/** submit button that asks for confirmation first (no browser dialogs) */
export function ConfirmSubmit({ label = "حذف", confirmLabel = "بله، حذف شود" }: { label?: string; confirmLabel?: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  if (!armed) {
    return <button type="button" onClick={() => setArmed(true)} className={btnCls("ghost") + " text-err hover:text-err"}>{label}</button>;
  }
  return <SubmitButton variant="danger" pendingText="…">{confirmLabel}</SubmitButton>;
}

export function Toggle({ name, defaultChecked, label }: { name: string; defaultChecked?: boolean; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13.5px] font-semibold text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-5 w-9 rounded-full bg-line transition-colors peer-checked:bg-accent after:absolute after:top-0.5 after:right-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:-translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40" />
      {label}
    </label>
  );
}
