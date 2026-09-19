import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { AdminForm, Card, Field, PageTitle, SubmitButton, Toggle } from "@/components/admin/ui";
import { inputCls } from "@/components/admin/styles";
import { formatJalali } from "@/lib/format";
import { createUser, updateUser } from "../../_actions/users";

export const metadata = { title: "کاربران" };

export default async function UsersAdmin() {
  const me = await requireAdmin();
  const users = await db.select().from(schema.adminUsers).orderBy(asc(schema.adminUsers.id));

  return (
    <>
      <PageTitle title="کاربران پنل" lead="«ویرایشگر» فقط محتوا را مدیریت می‌کند؛ «مدیر» علاوه بر آن کاربران را هم مدیریت می‌کند." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id}>
              <AdminForm action={updateUser} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={u.id} />
                <Field label="نام"><input name="name" defaultValue={u.name} className={inputCls} /></Field>
                <Field label="ایمیل"><input value={u.email} disabled dir="ltr" className={inputCls} /></Field>
                <Field label="نقش">
                  <select name="role" defaultValue={u.role} className={inputCls}>
                    <option value="editor">ویرایشگر</option>
                    <option value="admin">مدیر</option>
                  </select>
                </Field>
                <Field label="رمز جدید (اختیاری)" hint="حداقل ۱۰ نویسه. با تغییر رمز، نشست‌های فعال کاربر بسته می‌شود.">
                  <input name="password" type="password" autoComplete="new-password" dir="ltr" className={inputCls} />
                </Field>
                <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
                  <div className="flex items-center gap-4">
                    <Toggle name="isActive" defaultChecked={u.isActive} label="فعال" />
                    <span className="text-[12px] text-ink3">
                      {u.id === me.id ? "(شما) · " : ""}آخرین ورود: {u.lastLoginAt ? formatJalali(u.lastLoginAt) : "—"}
                    </span>
                  </div>
                  <SubmitButton variant="secondary">ذخیره</SubmitButton>
                </div>
              </AdminForm>
            </Card>
          ))}
        </div>
        <Card title="کاربر جدید" className="xl:sticky xl:top-20 xl:self-start">
          <AdminForm action={createUser} className="space-y-3" resetOnSuccess>
            <Field label="نام"><input name="name" className={inputCls} /></Field>
            <Field label="ایمیل"><input name="email" type="email" dir="ltr" className={inputCls} /></Field>
            <Field label="رمز عبور" hint="حداقل ۱۰ نویسه"><input name="password" type="password" autoComplete="new-password" dir="ltr" className={inputCls} /></Field>
            <Field label="نقش">
              <select name="role" defaultValue="editor" className={inputCls}>
                <option value="editor">ویرایشگر</option>
                <option value="admin">مدیر</option>
              </select>
            </Field>
            <SubmitButton>ساخت کاربر</SubmitButton>
          </AdminForm>
        </Card>
      </div>
    </>
  );
}
