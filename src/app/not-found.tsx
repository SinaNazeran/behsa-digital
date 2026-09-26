import "@/styles/index.css";
import { Btn } from "@/components/ui";

export const metadata = { title: "صفحه پیدا نشد", robots: { index: false, follow: true } };

/* Rendered outside the site layout (no header or footer), so it carries
   the design language on its own: the warm ground of the homepage's first
   band, the big tone numeral of its cards, and the site's one button. */
export default function NotFound() {
  return (
    <main className="relative min-h-screen grid place-items-center overflow-hidden bg-gradient-to-b from-orange-50 via-bg to-blue-50 px-5 text-center text-ink font-body">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-light grid-fade" />
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[10%] h-[420px] w-[600px] rounded-full bg-orange-200/50 blur-3xl" />
      <div className="relative">
        <p className="tone-orange kpi-num font-display font-black text-[88px] leading-none tracking-tighter">۴۰۴</p>
        <h1 className="mt-5 font-display font-extrabold text-[24px] md:text-[28px] tracking-tight">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
        <p className="mt-3 text-[14.5px] text-ink2">ممکن است آدرس تغییر کرده یا حذف شده باشد.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Btn href="/">صفحه اصلی</Btn>
          <Btn href="/articles" variant="secondary">مقالات</Btn>
        </div>
      </div>
    </main>
  );
}
