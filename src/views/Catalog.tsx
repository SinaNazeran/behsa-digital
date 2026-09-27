import { Icon } from "@/components/icons";
import { Reveal, Btn, PageHero, CtaBanner, HERO_PANEL } from "@/components/ui";
import { TONES } from "@/components/tones";
import { SmartLink } from "@/components/SmartLink";
import { CATALOG_PATH } from "@/content/navigation";
import { faNum } from "@/lib/format";
import { cn } from "@/utils/cn";
import type { CatalogView } from "@/lib/cms";

/* /resources/catalog — the downloadable product catalogues (Admin →
   کاتالوگ‌ها). The page exists so a catalogue can be judged before it is
   downloaded (cover, contents, format and size up front) and so search
   lands on a page with the menu and a way to talk to us, never on the
   bare PDF. Downloading is open: no form stands in front of it. */

/** "PDF، ۴٫۲ مگابایت، ۲۴ صفحه" — what a visitor weighs before downloading */
const facts = (c: CatalogView) => [c.format, c.size, c.pages ? `${faNum(c.pages)} صفحه` : ""].filter(Boolean);

/** the facts on one line, comma-separated (a middle dot beside Persian
    digits reads as «۰»); each isolated, or "PDF" beside Persian digits
    drags its neighbours into the wrong order */
export const FactLine = ({ catalog }: { catalog: CatalogView }) =>
  facts(catalog).map((f, i) => <span key={f}>{i > 0 && "، "}<bdi>{f}</bdi></span>);

const downloadLabel = (c: CatalogView) => `دانلود ${c.title} (${facts(c).join("، ")})`;

function Cover({ catalog, className }: { catalog: CatalogView; className?: string }) {
  return catalog.coverUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={catalog.coverUrl} alt={catalog.coverAlt} className={cn("aspect-[3/4] w-full rounded-md object-cover shadow-[0_18px_40px_-18px_rgb(22_33_46/0.55)] ring-1 ring-black/5", className)} />
  ) : (
    /* no cover uploaded yet: a drawn document, never an empty box */
    <span aria-hidden className={cn("flex aspect-[3/4] w-full items-center justify-center rounded-md bg-gradient-to-b from-(--tone-500) to-(--tone-700) text-white shadow-[0_18px_40px_-18px_rgb(22_33_46/0.55)]", className)}>
      <Icon name="doc" size={44} sw={1.4} />
    </span>
  );
}

export default function Catalog({ catalogs, panelUrl }: { catalogs: CatalogView[]; panelUrl: string }) {
  const many = catalogs.length > 1;
  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "منابع", path: "/resources" }, { label: "کاتالوگ محصول" }]}
        title={many ? "کاتالوگ‌های *محصول* بهسا دیجیتال" : "کاتالوگ *محصول* بهسا دیجیتال"}
        lead="تصمیم دربارهٔ انرژی یک مجموعه را معمولاً یک نفر به‌تنهایی نمی‌گیرد. کاتالوگ بهسا را با فراغت بخوانید و با همکارانتان در میان بگذارید."
        eyebrow={{ label: "منابع", icon: "download" }}
      >
        {/* No download in the hero: the card below carries the action, and a
            second copy up here would have to pick one catalogue over the
            rest. With several, the panel is a table of contents instead —
            the same jump list /reports uses for its categories. */}
        {many && (
          <Reveal dir="l" delay={150}>
            <nav aria-label="کاتالوگ‌ها" className={cn(HERO_PANEL, "p-2")}>
              <p className="flex items-center gap-2 px-3 pt-2 pb-1.5 text-[12px] font-bold text-white/75">
                <Icon name="doc" size={14} />
                پرش به کاتالوگ
              </p>
              <ul className="grid gap-0.5">
                {catalogs.map((c) => (
                  <li key={c.id}>
                    <a href={`#catalog-${c.id}`} className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-white/10">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/10 text-orange-200 ring-1 ring-white/15 transition-colors group-hover:bg-primary group-hover:text-on-primary group-hover:ring-transparent">
                        <Icon name="doc" size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-bold text-white">{c.title}</span>
                        <span className="mt-0.5 block text-[12px] text-blue-100/85 fa-num"><FactLine catalog={c} /></span>
                      </span>
                      <Icon name="chevron" size={15} className="shrink-0 text-white/45 transition-all group-hover:translate-y-0.5 group-hover:text-white" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        )}
      </PageHero>

      <section className="relative bg-bg py-16 md:py-20">
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="relative mx-auto max-w-[1200px] space-y-8 px-5 md:px-8">
          {catalogs.map((c, i) => (
            <Reveal key={c.id}>
              <article id={`catalog-${c.id}`} className={cn(TONES[(i + 1) % TONES.length], "kpi-card grid scroll-mt-32 gap-8 p-6 md:grid-cols-[240px_1fr] md:p-10")}>
                {/* smaller on a phone, so the title and the action are not a screen away */}
                <Cover catalog={c} className="mx-auto max-w-[150px] md:max-w-[240px]" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {facts(c).map((f) => (
                      <span key={f} className="rounded-full bg-(--tone-50) px-3 py-1 text-[12px] font-bold text-(--tone-700) ring-1 ring-inset ring-(--tone-200) fa-num">{f}</span>
                    ))}
                    {c.edition && <span className="text-[12.5px] font-semibold text-ink3">{c.edition}</span>}
                  </div>
                  <h2 className="mt-4 font-display text-[22px] font-extrabold text-ink md:text-[26px]">{c.title}</h2>
                  {c.description && <p className="mt-3 max-w-2xl text-[15px] leading-8 text-ink2">{c.description}</p>}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Btn href={c.fileUrl} download icon="download" ariaLabel={downloadLabel(c)}>دانلود کاتالوگ</Btn>
                    {/* phones (Android above all) save a PDF instead of showing
                        it, so there the button would only repeat «دانلود» */}
                    <Btn href={c.fileUrl} target="_blank" variant="secondary" icon="external" className="hidden md:inline-flex" ariaLabel={`مشاهدهٔ آنلاین ${c.title} (باز شدن در پنجره جدید)`}>مشاهدهٔ آنلاین</Btn>
                  </div>
                  {c.highlights.length > 0 && (
                    <>
                      <h3 className="mt-8 border-t border-(--tone-100) pt-6 text-[13.5px] font-bold text-ink">در این کاتالوگ می‌خوانید</h3>
                      <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                        {c.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2.5 text-[14px] leading-7 text-ink2">
                            <span className="mt-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-(--tone-500) text-white">
                              <Icon name="check" size={10} sw={3} />
                            </span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="mt-6 text-[12.5px] text-ink3">آخرین به‌روزرسانی: <span className="fa-num">{c.updated}</span></p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner title="پس از مطالعه، *دادهٔ مجموعهٔ خودتان* را در سامانه ببینید." lead="اگر پرسشی دربارهٔ استقرار یا تناسب سامانه با مجموعه‌تان دارید، کارشناسان ما پاسخ می‌دهند.">
        <Btn href={panelUrl} target="_blank" size="lg" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
        <Btn href="/contact" size="lg" variant="dark">گفت‌وگو با کارشناس</Btn>
      </CtaBanner>
    </>
  );
}

/** The catalogue, offered beside the product pages (Landing's side rail).
    Leads to the page, not the file: with the contents in front of them a
    visitor downloads what they meant to, and "which catalogue" never has
    to be guessed. */
export function CatalogTeaser({ catalog }: { catalog: CatalogView }) {
  return (
    <SmartLink href={CATALOG_PATH} className="tone-orange kpi-card card-live group flex items-center gap-4 p-5">
      <Cover catalog={catalog} className="w-16 shrink-0 rounded-sm" />
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-bold text-(--tone-700)">کاتالوگ محصول</span>
        <span className="mt-1 block font-display text-[15px] font-extrabold leading-7 text-ink">{catalog.title}</span>
        <span className="mt-0.5 block text-[12px] text-ink3 fa-num"><FactLine catalog={catalog} /></span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-(--tone-700) transition-all group-hover:gap-2.5">
          مشاهده و دانلود <Icon name="arrowL" size={13} sw={2.2} />
        </span>
      </span>
    </SmartLink>
  );
}
