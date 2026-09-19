import { Icon } from "@/components/icons";
import { Thumb, SERIES } from "@/components/charts";
import { SmartLink } from "@/components/SmartLink";

export type ArticleCardProps = { slug: string; cat: string; title: string; excerpt: string; date: string; read: string; chart: "line" | "bars" | "donut" | "area"; coverUrl?: string | null };

export function ArticleCard({ slug, cat, title, excerpt, date, read, chart, coverUrl }: ArticleCardProps) {
  return (
    <article className="group h-full flex flex-col rounded-m border border-line bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/35">
      <SmartLink href={`/articles/${slug}`} className="block overflow-hidden">
        <div className="transition-transform duration-500 group-hover:scale-[1.04]">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" loading="lazy" decoding="async" className="aspect-[40/22] w-full object-cover" />
          ) : (
            <Thumb chart={chart} cat={cat} accent={cat.includes("خورشیدی") ? SERIES.solar : cat.includes("راکتیو") ? SERIES.deep : SERIES.grid} />
          )}
        </div>
      </SmartLink>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-[11.5px] text-ink3 fa-num">
          <Icon name="calendar" size={13} /> {date}
          <span className="text-line">•</span>
          <Icon name="clock" size={13} /> {read} مطالعه
        </div>
        <h3 className="mt-3 font-display font-bold text-[16.5px] leading-7 text-ink group-hover:text-orange-700 transition-colors">
          <SmartLink href={`/articles/${slug}`}>{title}</SmartLink>
        </h3>
        <p className="mt-2.5 text-[13px] leading-6.5 text-ink2 flex-1">{excerpt}</p>
        <SmartLink href={`/articles/${slug}`} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 hover:gap-3 transition-all">
          ادامه مطلب <Icon name="arrowL" size={14} sw={2.2} />
        </SmartLink>
      </div>
    </article>
  );
}
