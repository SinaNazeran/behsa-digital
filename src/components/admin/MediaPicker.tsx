"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { matchesQuery, searchText } from "@/content/reports";
import { uploadPickerImage } from "@/app/admin/_actions/media";
import { btnCls, inputCls } from "./ui";

export type MediaOption = { id: string; filename: string; alt: string };

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

/* these inputs sit inside the editor's form: Enter must not submit (save) it */
const noSubmit = (e: React.KeyboardEvent) => { if (e.key === "Enter") e.preventDefault(); };

/** Pick an image from the media library — or upload one right here, so an
    editor never leaves a half-written form. The value is submitted via a
    hidden input; the upload controls carry no `name`, so they are never
    part of the surrounding form's submission. */
export function MediaPicker({ name, defaultValue, options, label = "انتخاب تصویر" }: {
  name: string; defaultValue?: string | null; options: MediaOption[]; label?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  /* follow the server when it changes the stored image underneath us (e.g.
     "reset section"); otherwise the old pick would be re-saved silently */
  const [seenDefault, setSeenDefault] = useState(defaultValue);
  if (defaultValue !== seenDefault) {
    setSeenDefault(defaultValue);
    setValue(defaultValue ?? "");
  }

  /* uploaded here, shown at once — the server list catches up on refresh */
  const [uploaded, setUploaded] = useState<MediaOption[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const altRef = useRef<HTMLInputElement>(null);
  const all = [...uploaded, ...options.filter((o) => !uploaded.some((u) => u.id === o.id))];
  const selected = all.find((o) => o.id === value);
  /* instant, in the browser: the whole library is already here */
  const [q, setQ] = useState("");
  const shown = q.trim() ? all.filter((o) => matchesQuery(searchText([o.filename, o.alt]), q.trim())) : all;

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("alt", altRef.current?.value ?? "");
    try {
      const res = await uploadPickerImage(fd);
      if (!res.ok) { setError(res.message); return; }
      setUploaded((u) => [{ id: res.id, filename: res.filename, alt: res.alt }, ...u]);
      setValue(res.id);
      setOpen(false);
    } catch {
      setError("بارگذاری انجام نشد. دوباره تلاش کنید.");
    } finally {
      setUploading(false);
    }
  }

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
        <div className="mt-3 space-y-3 rounded-[10px] border border-line bg-bg p-3">
          <div className="flex flex-wrap items-center gap-2 border-b border-linesoft pb-3">
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) void upload(file);
              }}
            />
            <input
              ref={altRef}
              placeholder="متن جایگزین (اختیاری)…"
              aria-label="متن جایگزین تصویر جدید"
              onKeyDown={noSubmit}
              autoComplete="off"
              className={cn(inputCls, "w-auto min-w-0 flex-1 py-2 text-[13px]")}
            />
            <button type="button" className={btnCls("primary")} disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? "در حال بارگذاری…" : "بارگذاری تصویر جدید"}
            </button>
            <p className="w-full text-[11.5px] text-ink3">JPG، PNG، WebP، GIF یا AVIF تا ۵ مگابایت. تصویر بارگذاری‌شده بلافاصله انتخاب می‌شود.</p>
            {error && <p role="alert" className="w-full text-[12.5px] font-semibold text-err">{error}</p>}
          </div>

          {all.length > 0 && (
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={noSubmit}
              aria-label="جستجو در تصاویر"
              placeholder={`جستجو در ${all.length.toLocaleString("fa-IR")} تصویر (نام فایل یا متن جایگزین)…`}
              autoComplete="off"
              className={cn(inputCls, "py-2 text-[13px]")}
            />
          )}
          {all.length === 0 ? (
            <p className="text-[13px] text-ink2">کتابخانه رسانه هنوز خالی است؛ اولین تصویر را از همین‌جا بارگذاری کنید.</p>
          ) : shown.length === 0 ? (
            <p className="text-[13px] text-ink2">تصویری با «{q.trim()}» یافت نشد.</p>
          ) : (
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-6">
              {shown.map((o) => (
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
                  {/* the alt text says what the picture is; the filename rarely does */}
                  <span className="block truncate px-1.5 py-1 text-[10.5px] text-ink2" dir={o.alt ? "auto" : "ltr"}>{o.alt || o.filename}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
