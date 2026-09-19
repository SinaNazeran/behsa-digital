"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon, ICON_NAMES, type IconName } from "@/components/icons";
import { btnCls } from "./styles";

/** Pick one of the built-in icons. The value is a constrained enum —
    editors choose a picture, never a class name or raw SVG. */
export function IconPicker({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-line bg-bg text-orange-700">
          {value ? <Icon name={value as IconName} size={22} /> : <span className="text-[11px] text-ink3">—</span>}
        </span>
        <button type="button" className={btnCls("secondary")} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "بستن" : "انتخاب آیکون"}
        </button>
        {value && <button type="button" className={btnCls("ghost")} onClick={() => setValue("")}>بدون آیکون</button>}
      </div>

      {open && (
        <div className="mt-2.5 grid max-h-56 grid-cols-6 gap-1.5 overflow-y-auto rounded-[10px] border border-line bg-bg p-2 sm:grid-cols-10">
          {ICON_NAMES.map((n) => (
            <button
              key={n}
              type="button"
              title={n}
              aria-label={n}
              aria-pressed={n === value}
              onClick={() => { setValue(n); setOpen(false); }}
              className={cn(
                "inline-flex h-9 w-full items-center justify-center rounded-[8px] border transition-colors",
                n === value ? "border-primary bg-primary-soft text-orange-700" : "border-transparent text-ink2 hover:border-primary/40 hover:text-orange-700",
              )}
            >
              <Icon name={n} size={19} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
