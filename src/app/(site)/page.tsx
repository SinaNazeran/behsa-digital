import Home from "@/views/Home";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent, getFaqs, getPublishedArticles, getReportCatalogue, getSettings, getTestimonials, toCardView } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    path: "/",
    title: `${settings.siteName} — ${settings.tagline}`,
    description: settings.defaultDescription,
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [articles, testimonials, faqs, content, settings, { reports }] = await Promise.all([
    getPublishedArticles(), getTestimonials(), getFaqs(), getContent(), getSettings(), getReportCatalogue(),
  ]);
  /* a homepage report card wears the colour of its report's category */
  const reportTones = Object.fromEntries(reports.map((r) => [r.href, r.category.toneClass]));

  const faqLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      {faqLd && <JsonLd data={faqLd} />}
      <Home
        articles={articles.slice(0, 3).map(toCardView)}
        testimonials={testimonials}
        faqs={faqs}
        content={content}
        panelUrl={settings.panelUrl}
        reportTones={reportTones}
      />
    </>
  );
}
