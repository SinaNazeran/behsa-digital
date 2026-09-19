import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { btnCls } from "@/components/admin/styles";
import { logoutAction } from "../_actions/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-4 px-4 md:px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-display text-[15px] font-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/behsa-mark.png" alt="" width={34} height={19} className="h-6 w-auto" />
            مدیریت محتوای بهسا
          </Link>
          <div className="mr-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener" className={btnCls("ghost")}>مشاهده سایت ↗</a>
            <span className="hidden text-[12.5px] text-ink2 sm:inline">{user.name}</span>
            <form action={logoutAction}>
              <button type="submit" className={btnCls("secondary")}>خروج</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-6 md:px-6 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <AdminNav role={user.role} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
