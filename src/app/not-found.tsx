import Link from "next/link";
import "@/styles/index.css";

export const metadata = { title: "صفحه پیدا نشد", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-bg px-5 text-center text-ink font-body">
      <div>
        <p className="font-display font-black text-[64px] text-orange-700">۴۰۴</p>
        <h1 className="mt-2 font-display font-extrabold text-[24px]">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
        <p className="mt-3 text-[14.5px] text-ink2">ممکن است آدرس تغییر کرده یا حذف شده باشد.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-11 items-center rounded-s bg-primary px-5 font-semibold text-on-primary">صفحه اصلی</Link>
          <Link href="/articles" className="inline-flex h-11 items-center rounded-s border border-line bg-surface px-5 font-semibold text-steel">مقالات</Link>
        </div>
      </div>
    </main>
  );
}
