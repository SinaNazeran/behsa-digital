"use client";

import { useRef, useState } from "react";
import { faNum } from "@/lib/format";
import { btnCls } from "./ui";

type StoredFile = { id: string; filename: string; size: number };

const MAX_BYTES = 20 * 1024 * 1024;

const sizeLabel = (bytes: number) =>
  bytes < 1024 * 1024 ? `${faNum(Math.max(1, Math.round(bytes / 1024)))} KB` : `${faNum((bytes / (1024 * 1024)).toFixed(1))} MB`;

/** The catalogue's PDF. Uploaded on pick to /api/admin/catalog-file (a
    Server Action body cannot carry 20MB — see that route); the form then
    submits only the stored id, through a hidden input, as MediaPicker does.
    XHR rather than fetch: a large file on a slow link needs its progress. */
export function CatalogFileField({ name, defaultValue }: { name: string; defaultValue?: StoredFile | null }) {
  const [file, setFile] = useState(defaultValue ?? null);
  /* follow the server when a save changes the stored file underneath us */
  const [seen, setSeen] = useState(defaultValue?.id);
  if (defaultValue?.id !== seen) {
    setSeen(defaultValue?.id);
    setFile(defaultValue ?? null);
  }
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  function upload(picked: File) {
    if (picked.size > MAX_BYTES) { setError(`${picked.name}: حجم فایل بیش از ۲۰ مگابایت است.`); return; }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/catalog-file");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      setProgress(null);
      const res = xhr.response as (StoredFile & { message?: string }) | null;
      if (xhr.status === 200 && res?.id) setFile(res);
      else setError(res?.message ?? "بارگذاری انجام نشد. دوباره تلاش کنید.");
    };
    xhr.onerror = () => { setProgress(null); setError("ارتباط قطع شد؛ دوباره تلاش کنید."); };
    const fd = new FormData();
    fd.set("file", picked);
    setError("");
    setProgress(0);
    xhr.send(fd);
  }

  return (
    <div>
      <input type="hidden" name={name} value={file?.id ?? ""} />
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const picked = e.target.files?.[0];
          e.target.value = "";
          if (picked) upload(picked);
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        {file ? (
          <a href={`/media/${file.id}`} target="_blank" rel="noopener noreferrer" className="min-w-0 max-w-full truncate text-[13px] font-semibold text-ink underline-offset-4 hover:underline" dir="ltr">
            {file.filename} · {sizeLabel(file.size)}
          </a>
        ) : (
          <span className="text-[13px] text-ink3">هنوز فایلی بارگذاری نشده است.</span>
        )}
        <button type="button" className={btnCls("secondary")} disabled={progress !== null} onClick={() => input.current?.click()}>
          {progress !== null ? `در حال بارگذاری… ${faNum(progress)}٪` : file ? "جایگزینی فایل" : "بارگذاری فایل PDF"}
        </button>
      </div>
      {progress !== null && <progress value={progress} max={100} className="mt-2 h-1.5 w-full accent-primary" aria-label="پیشرفت بارگذاری" />}
      {error && <p role="alert" className="mt-1.5 text-[12.5px] font-semibold text-err">{error}</p>}
    </div>
  );
}
