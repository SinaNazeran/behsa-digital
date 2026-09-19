import Link from "next/link";
import { dashboardCounts, listArticles } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth";
import { Card, PageTitle } from "@/components/admin/ui";
import { btnCls } from "@/components/admin/styles";
import { faNum, formatJalali } from "@/lib/format";

export const metadata = { title: "داشبورد" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  const [c, recent, { error }] = await Promise.all([dashboardCounts(), listArticles(), searchParams]);

  const tiles = [
    { label: "مقاله منتشرشده", value: c.published, href: "/admin/articles?status=published" },
    { label: "پیش‌نویس", value: c.drafts, href: "/admin/articles?status=draft" },
    { label: "پرسش متداول", value: c.faqs, href: "/admin/faqs" },
    { label: "نظر مشتری", value: c.testimonials, href: "/admin/testimonials" },
    { label: "مشتری", value: c.clients, href: "/admin/clients" },
    { label: "تصویر", value: c.media, href: "/admin/media" },
  ];

  return (
    <>
      <PageTitle
        title={`سلام ${user.name}`}
        lead="از اینجا محتوای صفحه اصلی، منوی سایت، مقالات، پرسش‌های متداول، اطلاعات تماس و سئوی صفحات را مدیریت کنید. تغییرات بلافاصله روی سایت اعمال می‌شوند."
        actions={<Link href="/admin/articles/new" className={btnCls("primary")}>+ مقاله جدید</Link>}
      />
      {error === "forbidden" && (
        <p role="alert" className="mb-5 rounded-[8px] border border-warn/30 bg-warnbg px-4 py-3 text-[13.5px] font-semibold text-warn">
          دسترسی به آن بخش فقط برای مدیر کل امکان‌پذیر است.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="rounded-[12px] border border-line bg-surface p-4 transition-colors hover:border-primary/40">
            <p className="font-display text-[26px] font-black text-ink fa-num">{faNum(t.value)}</p>
            <p className="text-[12.5px] font-semibold text-ink2">{t.label}</p>
          </Link>
        ))}
      </div>

      <Card title="آخرین تغییرات مقالات" className="mt-6" actions={<Link href="/admin/articles" className={btnCls("ghost")}>همه مقالات</Link>}>
        <ul className="divide-y divide-linesoft">
          {recent.slice(0, 6).map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-3 py-2.5">
              <Link href={`/admin/articles/${a.id}`} className="min-w-0 flex-1 truncate text-[14px] font-semibold hover:text-orange-700">{a.title}</Link>
              <span className={a.status === "published" ? "text-[12px] font-bold text-ok" : "text-[12px] font-bold text-warn"}>
                {a.status === "published" ? "منتشرشده" : "پیش‌نویس"}
              </span>
              <span className="text-[12px] text-ink3">ویرایش: {formatJalali(a.updatedAt)}</span>
            </li>
          ))}
          {recent.length === 0 && <li className="py-3 text-[13.5px] text-ink2">هنوز مقاله‌ای ثبت نشده است.</li>}
        </ul>
      </Card>

      <Card title="راهنمای سریع" className="mt-6">
        <ul className="list-disc space-y-1.5 pr-5 text-[13.5px] leading-7 text-ink2">
          <li>برای تغییر متن‌ها و کارت‌های صفحه اصلی: «بخش‌های صفحه اصلی». هر بخش را می‌توانید پنهان کنید، عنوانش را عوض کنید یا کارت‌هایش را اضافه/حذف/جابه‌جا کنید.</li>
          <li>ویدئو، تصویر، عنوان و دکمه‌های ابتدای صفحه اصلی در «بخش هیرو» تنظیم می‌شوند. اگر ویدئو خاموش باشد یا پخش نشود، تصویر پس‌زمینه نمایش داده می‌شود.</li>
          <li>سرفصل‌ها و زیرمنوهای نوار بالای سایت در «منوی سایت» مدیریت می‌شوند؛ همان ترتیب در نسخهٔ موبایل هم اعمال می‌شود.</li>
          <li>برای نوشتن مقاله: «مقالات» ← «مقاله جدید». تا وقتی وضعیت «پیش‌نویس» است روی سایت دیده نمی‌شود؛ با دکمه «پیش‌نمایش» می‌توانید آن را ببینید.</li>
          <li>تصاویر را ابتدا در «رسانه‌ها» بارگذاری کنید و برای هر تصویر «متن جایگزین» بنویسید (برای سئو و دسترس‌پذیری مهم است).</li>
          <li>عنوان و توضیحات گوگل هر صفحه را در «سئوی صفحات» تنظیم کنید. اگر خالی بماند، مقدار پیش‌فرض استفاده می‌شود.</li>
          <li>شماره تماس، ایمیل و آدرس در «تنظیمات» یک‌جا عوض می‌شود و در همه صفحات اعمال می‌شود.</li>
        </ul>
      </Card>
    </>
  );
}
