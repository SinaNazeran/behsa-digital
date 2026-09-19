import { AdminForm, Card, Field, PageTitle, SubmitButton } from "@/components/admin/ui";
import { inputCls } from "@/components/admin/styles";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { listMediaOptions } from "@/lib/admin-data";
import { getSettings } from "@/lib/cms";
import { saveSettings } from "../../_actions/settings";

export const metadata = { title: "تنظیمات سایت" };

export default async function SettingsAdmin() {
  const [s, media] = await Promise.all([getSettings(), listMediaOptions()]);
  const text = (name: keyof typeof s, label: string, opts: { ltr?: boolean; hint?: string; multiline?: boolean } = {}) => (
    <Field label={label} htmlFor={name} hint={opts.hint}>
      {opts.multiline ? (
        <textarea id={name} name={name} defaultValue={String(s[name] ?? "")} rows={3} className={inputCls} />
      ) : (
        <input id={name} name={name} defaultValue={String(s[name] ?? "")} dir={opts.ltr ? "ltr" : undefined} className={inputCls} />
      )}
    </Field>
  );

  return (
    <>
      <PageTitle title="تنظیمات سایت" lead="این اطلاعات در سربرگ، پابرگ، صفحه تماس و داده‌های ساختاریافته گوگل استفاده می‌شوند. فیلد خالی = مقدار پیش‌فرض." />
      <AdminForm action={saveSettings} className="space-y-6">
        <Card title="هویت و سئوی پیش‌فرض">
          <div className="grid gap-4 md:grid-cols-2">
            {text("siteName", "نام سایت")}
            {text("tagline", "شعار (در عنوان صفحه اصلی)")}
            <div className="md:col-span-2">{text("defaultDescription", "توضیحات پیش‌فرض متا", { multiline: true, hint: "برای صفحاتی که توضیحات اختصاصی ندارند. حدود ۱۵۰ نویسه." })}</div>
            <div className="md:col-span-2">
              <Field label="تصویر پیش‌فرض اشتراک‌گذاری" hint="اگر انتخاب نشود، og-image.png فعلی سایت استفاده می‌شود.">
                <MediaPicker name="defaultOgMediaId" defaultValue={s.defaultOgMediaId} options={media} />
              </Field>
            </div>
          </div>
        </Card>
        <Card title="اطلاعات تماس">
          <div className="grid gap-4 md:grid-cols-2">
            {text("phoneDisplay", "شماره تلفن (نمایشی)", { ltr: true })}
            {text("phoneHref", "شماره تلفن برای تماس مستقیم", { ltr: true, hint: "فقط ارقام با پیش‌شماره کشور، مثل +985135412240" })}
            {text("email", "ایمیل", { ltr: true })}
            {text("workingHours", "ساعات کاری")}
            <div className="md:col-span-2">{text("address", "آدرس")}</div>
          </div>
        </Card>
        <Card title="لینک‌ها و پابرگ">
          <div className="grid gap-4 md:grid-cols-2">
            {text("panelUrl", "آدرس ورود به سامانه", { ltr: true })}
            {text("baleUrl", "کانال بله", { ltr: true })}
            <div className="md:col-span-2">{text("footerAbout", "متن معرفی در پابرگ", { multiline: true })}</div>
          </div>
        </Card>
        <SubmitButton>ذخیره تنظیمات</SubmitButton>
      </AdminForm>
    </>
  );
}
