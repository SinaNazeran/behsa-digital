"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; items: { href: string; label: string; adminOnly?: boolean }[] }[] = [
  { title: "", items: [{ href: "/admin", label: "داشبورد" }, { href: "/admin/leads", label: "درخواست‌ها" }] },
  {
    title: "صفحه اصلی و منو",
    items: [
      { href: "/admin/navigation", label: "منوی سایت" },
      { href: "/admin/sections/hero", label: "بخش هیرو" },
      { href: "/admin/sections", label: "بخش‌های صفحه اصلی" },
    ],
  },
  {
    title: "محتوا",
    items: [
      { href: "/admin/reports", label: "گزارش‌ها" },
      { href: "/admin/report-categories", label: "دسته‌بندی گزارش‌ها" },
      { href: "/admin/articles", label: "مقالات" },
      { href: "/admin/categories", label: "دسته‌بندی مقالات" },
      { href: "/admin/faqs", label: "پرسش‌های متداول" },
      { href: "/admin/testimonials", label: "نظرات مشتریان" },
      { href: "/admin/clients", label: "مشتریان" },
      { href: "/admin/media", label: "رسانه‌ها" },
    ],
  },
  {
    title: "سایت",
    items: [
      { href: "/admin/seo", label: "سئوی صفحات" },
      { href: "/admin/settings", label: "تنظیمات و اطلاعات تماس" },
      { href: "/admin/users", label: "کاربران", adminOnly: true },
      { href: "/admin/account", label: "حساب من" },
    ],
  },
];

export function AdminNav({ role }: { role: "admin" | "editor" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin"
      : href === "/admin/sections" ? pathname === "/admin/sections" || (pathname.startsWith("/admin/sections/") && pathname !== "/admin/sections/hero")
      : pathname.startsWith(href);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mb-3 inline-flex h-10 items-center rounded-[8px] border border-line bg-surface px-4 text-[13.5px] font-bold lg:hidden"
      >
        {open ? "بستن منو" : "منوی مدیریت"}
      </button>
      <nav aria-label="منوی مدیریت" className={cn("space-y-5", !open && "hidden lg:block")}>
        {GROUPS.map((g) => (
          <div key={g.title || "root"}>
            {g.title && <p className="mb-1.5 px-3 text-[11.5px] font-bold text-ink3">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.filter((i) => !i.adminOnly || role === "admin").map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    onClick={() => setOpen(false)}
                    aria-current={active(i.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-[8px] px-3 py-2 text-[13.5px] font-semibold transition-colors",
                      active(i.href) ? "bg-primary-soft text-orange-700" : "text-ink2 hover:bg-bg hover:text-ink",
                    )}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
