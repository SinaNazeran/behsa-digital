"use client";

import { AdminForm, Field, SubmitButton, inputCls } from "@/components/admin/ui";
import { loginAction } from "../_actions/auth";

export function LoginForm({ next }: { next: string }) {
  return (
    <AdminForm action={loginAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="ایمیل" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="username" dir="ltr" required className={inputCls} />
      </Field>
      <Field label="رمز عبور" htmlFor="password">
        <input id="password" name="password" type="password" autoComplete="current-password" dir="ltr" required className={inputCls} />
      </Field>
      <SubmitButton className="w-full" pendingText="در حال ورود…">ورود</SubmitButton>
    </AdminForm>
  );
}
