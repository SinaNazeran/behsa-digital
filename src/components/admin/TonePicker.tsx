import { cn } from "@/utils/cn";
import { CATEGORY_TONES, CATEGORY_TONE_LABELS, categoryToneClass } from "@/components/tones";

/* The seven validated category colours as a radio group. A colour already
   worn by another category says so under its swatch — picking it is
   allowed (the site stays correct: every category is also named and
   iconed), but the editor sees the collision before making it. */
export function TonePicker({ name = "tone", defaultValue, takenBy, idPrefix }: {
  name?: string;
  defaultValue: string;
  /** tone → name of the other category using it */
  takenBy: Record<string, string>;
  idPrefix: string;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-[13px] font-bold text-ink">رنگ دسته در سایت</legend>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TONES.map((t) => {
          const id = `${idPrefix}-${t}`;
          const other = takenBy[t];
          return (
            <label key={t} htmlFor={id} className={cn(categoryToneClass(t), "group cursor-pointer")}>
              <input id={id} type="radio" name={name} value={t} defaultChecked={defaultValue === t} className="peer sr-only" />
              <span className="flex min-w-[76px] flex-col items-center gap-1 rounded-control border border-line bg-surface px-2.5 py-2 text-[12px] font-bold text-ink2 transition-colors peer-checked:border-(--tone-600) peer-checked:bg-(--tone-50) peer-checked:text-(--tone-700) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus group-hover:border-(--tone-300)">
                <span aria-hidden className="h-5 w-5 rounded-full bg-(--tone-600) shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]" />
                {CATEGORY_TONE_LABELS[t]}
                {other && <span className="max-w-[88px] truncate text-[10.5px] font-medium text-ink3" title={other}>در {other}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
