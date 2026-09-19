"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { btnCls } from "./ui";

export type MediaOption = { id: string; filename: string; alt: string };

/** Pick an image from the media library; value is submitted via a hidden input. */
export function MediaPicker({ name, defaultValue, options, label = "انتخاب تصویر" }: {
  name: string; defaultValue?: string | null; options: MediaOption[]; label?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap items-center gap-3">
        {selected ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/media/${selected.id}`} alt={selected.alt} className="h-16 w-28 rounded-[8px] border border-line object-cover" />
        ) : (
          <span className="flex h-16 w-28 items-center justify-center rounded-[8px] border border-dashed border-line text-[11.5px] text-ink3">بدون تصویر</span>
        )}
        <button type="button" className={btnCls("secondary")} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {label}
        </button>
        {value && (
          <button type="button" className={btnCls("ghost")} onClick={() => setValue("")}>حذف تصویر</button>
        )}
      </div>

      {open && (
        <div className="mt-3 rounded-[10px] border border-line bg-bg p-3">
          {options.length === 0 ? (
            <p className="text-[13px] text-ink2">
              کتابخانه رسانه خالی است. ابتدا از بخش <a href="/admin/media" className="font-bold text-orange-700">رسانه‌ها</a> تصویر بارگذاری کنید.
            </p>
          ) : (
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-6">
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { setValue(o.id); setOpen(false); }}
                  className={cn(
                    "overflow-hidden rounded-[8px] border-2 bg-surface text-right transition-colors",
                    o.id === value ? "border-primary" : "border-transparent hover:border-primary/40",
                  )}
                  title={o.alt || o.filename}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/${o.id}`} alt={o.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <span className="block truncate px-1.5 py-1 text-[10.5px] text-ink2" dir="ltr">{o.filename}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
