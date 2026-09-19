"use client";

import { useState } from "react";
import { btnCls } from "./ui";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={btnCls("ghost")}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(new URL(text, location.origin).href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch { /* clipboard blocked */ }
      }}
    >
      {copied ? "کپی شد ✓" : "کپی آدرس"}
    </button>
  );
}
