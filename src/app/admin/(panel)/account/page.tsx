import { requireUser } from "@/lib/auth";
import { AdminForm, Card, Field, PageTitle, SubmitButton } from "@/components/admin/ui";
import { inputCls } from "@/components/admin/styles";
import { changeOwnPassword } from "../../_actions/users";

export const metadata = { title: "حساب من" };

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <>
      <PageTitle title="حساب من" lead={`${me.name} · ${me.email} · ${me.role === "admin" ? "مدیر" : "ویرایشگر"}`} />
      <Card title="تغییر رمز عبور" className="max-w-lg">
        <AdminForm action={changeOwnPassword} className="space-y-4" resetOnSuccess>
          <Field label="رمز فعلی" htmlFor="current"><input id="current" name="current" type="password" autoComplete="current-password" dir="ltr" className={inputCls} /></Field>
          <Field label="رمز جدید" htmlFor="next" hint="حداقل ۱۰ نویسه"><input id="next" name="next" type="password" autoComplete="new-password" dir="ltr" className={inputCls} /></Field>
          <Field label="تکرار رمز جدید" htmlFor="confirm"><input id="confirm" name="confirm" type="password" autoComplete="new-password" dir="ltr" className={inputCls} /></Field>
          <SubmitButton>تغییر رمز</SubmitButton>
        </AdminForm>
      </Card>
    </>
  );
}
