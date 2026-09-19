import { Fragment } from "react";

/* Editable headlines need one typographic affordance — highlighting a
   word — without handing editors raw HTML. The CMS accepts plain text
   where *a word* between stars is the accent and every line break is a
   new line. Everything else stays text, so nothing an editor types can
   inject markup. */

export function AccentText({ text, accentClass = "text-orange-700", lineClass }: {
  text: string;
  accentClass?: string;
  /** when set, each line becomes its own block (headline layouts) */
  lineClass?: string;
}) {
  const all = text.split("\n");
  const lines = all.length === 1 ? all : all.filter((l) => l.trim() !== "");
  return (
    <>
      {lines.map((line, li) => {
        const parts = line.split(/\*([^*\n]+)\*/g).map((part, i) =>
          i % 2 === 1 ? <span key={i} className={accentClass}>{part}</span> : <Fragment key={i}>{part}</Fragment>,
        );
        if (lineClass) return <span key={li} className={lineClass}>{parts}</span>;
        return (
          <Fragment key={li}>
            {li > 0 && <br />}
            {parts}
          </Fragment>
        );
      })}
    </>
  );
}

/** same text, stripped of the accent markers — for title/aria strings */
export const plainText = (text: string) => text.replace(/\*([^*\n]+)\*/g, "$1");
