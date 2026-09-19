import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "ورود" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/behsa-logo-cropped.png" alt="بهسا دیجیتال" width={96} height={72} className="mx-auto h-[72px] w-auto" />
          <h1 className="mt-4 font-display text-[20px] font-black">پنل مدیریت محتوا</h1>
          <p className="mt-1 text-[13px] text-ink2">برای ادامه وارد حساب خود شوید.</p>
        </div>
        <div className="rounded-[14px] border border-line bg-surface p-6 shadow-card">
          <LoginForm next={next ?? ""} />
        </div>
      </div>
    </main>
  );
}
