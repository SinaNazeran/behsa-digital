import { NavigationManager } from "@/components/admin/NavigationManager";
import { PageTitle } from "@/components/admin/ui";
import { listNavItems } from "@/lib/admin-data";

export const metadata = { title: "منوی سایت" };

export default async function NavigationAdmin() {
  const rows = await listNavItems();
  return (
    <>
      <PageTitle
        title="منوی سایت"
        lead="سرفصل‌ها و زیرمنوهای نوار بالای سایت. ترتیب، عنوان، آدرس و نمایش هر مورد از همین‌جا تغییر می‌کند و بلافاصله در نسخهٔ دسکتاپ و موبایل اعمال می‌شود."
      />
      <NavigationManager rows={rows} />
    </>
  );
}
