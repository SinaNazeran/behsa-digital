import { Icon } from "@/components/icons";
import { SmartLink } from "@/components/SmartLink";
import { cn } from "@/utils/cn";

/* The catalogue, offered under a closing banner's buttons (home page,
   PanelCta) to the visitor who is not ready for the panel yet.

   Deliberately a sentence, not a third button: the site asks for one
   thing. So it has to read as a link on its own — underlined at rest,
   because on a coloured ground colour alone does not say "link" — with
   only the action words as the target, a 44px hit area, and an arrow,
   not a download icon: it opens the catalogue page, it does not save a
   file. */
export function CatalogNudge({ href, className }: { href: string; className?: string }) {
  return (
    <p className={cn("text-center text-[13.5px] leading-7 text-blue-100", className)}>
      پیش از شروع، شناخت بیشتری می‌خواهید؟{" "}
      <SmartLink
        href={href}
        className="group inline-flex min-h-11 items-center gap-1.5 font-bold text-white underline decoration-white/45 decoration-1 underline-offset-[7px] transition-colors hover:decoration-white"
      >
        کاتالوگ محصول را ببینید
        <Icon name="arrowL" size={14} sw={2.2} className="transition-transform duration-200 group-hover:-translate-x-1" />
      </SmartLink>
    </p>
  );
}
