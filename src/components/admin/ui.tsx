"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import Form from "next/form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { faNum } from "@/lib/format";
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
/** field name → error message of the last failed submit; read by <Field> */
const ErrorsContext = createContext<Record<string, string> | undefined>(undefined);

/* ── Unsaved-changes guard ──
   A form is dirty when what it would submit now differs from what it held
   after its last load or successful save. Comparing submitted values (not
   input events) also catches the image and icon pickers, which only write
   hidden inputs. One listener pair serves every form on the page. */

const dirtyForms = new Set<() => boolean>();
const LEAVE_MESSAGE = "تغییرات ذخیره‌نشده دارید. بدون ذخیره از این صفحه خارج می‌شوید؟";
const anyDirty = () => [...dirtyForms].some((isDirty) => isDirty());
const serialize = (form: HTMLFormElement) =>
  [...new FormData(form)].map(([k, v]) => `${k}=${typeof v === "string" ? v : v.name}`).join("&");

let guardInstalled = false;
function installLeaveGuard() {
  if (guardInstalled) return;
  guardInstalled = true;
  /* tab close, reload, typed URL */
  window.addEventListener("beforeunload", (e) => {
    if (anyDirty()) e.preventDefault();
  });
  /* in-app links: captured on document, before Next's <Link> handler sees
     the click, so a cancelled navigation never starts. Browser back/forward
     inside the app is not covered — there is no hook for it. */
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    const to = new URL(a.href, location.href);
    if (to.origin === location.origin && to.pathname === location.pathname && to.search === location.search) return;
    if (anyDirty() && !window.confirm(LEAVE_MESSAGE)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

export function AdminForm({ action, children, className, resetOnSuccess = false, id }: {
  action: FormAction; children: ReactNode; className?: string; resetOnSuccess?: boolean; id?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  const saved = useRef<string | null>(null);
  /* remount rather than form.reset(): reset() leaves the state of controlled
     pickers (image, icon) behind, so the next item silently reused them */
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) setGeneration((g) => g + 1);
  }, [state, resetOnSuccess]);

  /* the clean baseline: first load, every successful save, every remount */
  useEffect(() => {
    if ((!state || state.ok) && ref.current) saved.current = serialize(ref.current);
  }, [state, generation]);

  useEffect(() => {
    installLeaveGuard();
    const isDirty = () => ref.current !== null && saved.current !== null && serialize(ref.current) !== saved.current;
    dirtyForms.add(isDirty);
    return () => { dirtyForms.delete(isDirty); };
  }, []);

  /* a failed save must never look like nothing happened: take the editor
     to the first field in error, or to the message when no field owns it */
  useEffect(() => {
    const form = ref.current;
    if (!form || !state || state.ok) return;
    const names = new Set(Object.keys(state.errors ?? {}));
    const first = [...form.elements].find((el): el is HTMLInputElement =>
      names.has((el as HTMLInputElement).name) && (el as HTMLInputElement).type !== "hidden");
    if (first) {
      first.closest("details")?.setAttribute("open", "");
      first.focus();
    } else {
      form.querySelector("[data-status]")?.scrollIntoView({ block: "center" });
    }
  }, [state]);

  return (
    <form
      key={generation}
      ref={ref}
      id={id}
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        /* the submitter's name/value is included, so one form can hold several
           submit buttons (↑ / ↓) that the action tells apart */
        const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        startTransition(() => formAction(fd));
      }}
    >
      <PendingContext.Provider value={pending}>
        <ErrorsContext.Provider value={state?.ok ? undefined : state?.errors}>
          {children}
          <StatusMessage state={state} />
        </ErrorsContext.Provider>
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
      data-status
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

/* ── Field chrome ──
   Wires itself to its control after mount, so every form gets it without
   each caller threading ids: the label targets the control (unless the
   caller passed htmlFor), and an error the last submit returned for the
   control's name is shown under it and announced via aria-invalid /
   aria-describedby. A checkbox group gets the error text but no label
   target — a label pointing at the first box would toggle it. */

const CONTROL = "input:not([type=hidden]), textarea, select";

export function Field({ label, hint, children, className, htmlFor }: {
  label: string; hint?: ReactNode; children: ReactNode; className?: string; htmlFor?: string;
}) {
  const autoId = useId();
  const errorId = `${autoId}-error`;
  const box = useRef<HTMLDivElement>(null);
  const [control, setControl] = useState<{ id: string | null; name: string } | null>(null);
  const errors = useContext(ErrorsContext);

  useEffect(() => {
    const el = box.current?.querySelector<HTMLInputElement>(htmlFor ? `#${CSS.escape(htmlFor)}` : CONTROL);
    if (!el) return;
    const group = el.type === "checkbox" || el.type === "radio";
    if (!group && !el.id) el.id = autoId;
    setControl({ id: group ? null : el.id, name: el.name });
  }, [htmlFor, autoId]);

  const error = control?.name ? errors?.[control.name] : undefined;

  useEffect(() => {
    const el = control?.id ? document.getElementById(control.id) : null;
    if (!el) return;
    if (error) {
      el.setAttribute("aria-invalid", "true");
      el.setAttribute("aria-describedby", errorId);
    } else {
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
    }
  }, [control, error, errorId]);

  return (
    <div ref={box} className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor ?? control?.id ?? undefined} className="block text-[13px] font-bold text-ink">{label}</label>
      {children}
      {error && <p id={errorId} className="text-[12.5px] font-semibold leading-5 text-err">{error}</p>}
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

/** ↑ / ↓ for one step, plus a position select that moves an item straight
    to any place in its list (submits on change). Give it key={index} so it
    remounts — and shows the right position — whenever the order changes. */
export function MoveControls({ action, fields, index, count }: {
  action: FormAction; fields: Record<string, string | number>; index: number; count: number;
}) {
  if (count < 2) return null;
  return (
    <AdminForm action={action} className="mr-auto flex items-center gap-1">
      {Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <button type="submit" name="dir" value="up" disabled={index === 0} className={btnCls("ghost")} aria-label="انتقال به بالا">↑</button>
      <button type="submit" name="dir" value="down" disabled={index === count - 1} className={btnCls("ghost")} aria-label="انتقال به پایین">↓</button>
      <select
        name="to"
        defaultValue={index + 1}
        aria-label="انتقال به جایگاه"
        title="انتقال به جایگاه"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-10 cursor-pointer rounded-[8px] border border-control bg-surface px-2 text-[13px] text-ink fa-num"
      >
        {Array.from({ length: count }, (_, k) => <option key={k} value={k + 1}>{faNum(k + 1)}</option>)}
      </select>
    </AdminForm>
  );
}

/** a <select> inside a plain <form action> that saves the moment it changes;
    disabled while that save is in flight */
export function AutoSubmitSelect({ onChange, disabled, ...props }: React.ComponentProps<"select">) {
  const { pending } = useFormStatus();
  return (
    <select
      {...props}
      disabled={pending || disabled}
      onChange={(e) => { onChange?.(e); e.currentTarget.form?.requestSubmit(); }}
    />
  );
}

/** search box for a list page: the query lives in the URL (?q=), so a
    filtered list survives reload and can be linked; `keep` carries the
    page's other params (a status tab, the selected SEO page) through */
export function SearchBox({ action, q = "", label, placeholder, keep = {} }: {
  action: string; q?: string; label: string; placeholder: string; keep?: Record<string, string | undefined>;
}) {
  const kept = Object.entries(keep).filter((e): e is [string, string] => Boolean(e[1]));
  const clear = kept.length ? `${action}?${new URLSearchParams(kept)}` : action;
  return (
    <Form action={action} role="search" className="flex items-center gap-2">
      {kept.map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <input
        key={q}
        type="search"
        name="q"
        defaultValue={q}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(inputCls, "min-w-0 flex-1 py-2 text-[13.5px]")}
      />
      <button type="submit" className={btnCls("secondary")}>جستجو</button>
      {q && <Link href={clear} className={btnCls("ghost")}>پاک کردن</Link>}
    </Form>
  );
}
