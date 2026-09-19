"use server";

import { redirect } from "next/navigation";
import { login, logout } from "@/lib/auth";
import type { ActionState } from "@/components/admin/ui";

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = String(fd.get("email") ?? "");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "ایمیل و رمز عبور را وارد کنید." };
  const res = await login(email, password);
  if (!res.ok) return { ok: false, message: res.error };
  const next = String(fd.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}
