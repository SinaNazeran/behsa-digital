import Home from "@/views/Home";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent, getFaqs, getPublishedArticles, getSettings, getTestimonials, toCardView } from "@/lib/cms";
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
  const [articles, testimonials, faqs, content, settings] = await Promise.all([
    getPublishedArticles(), getTestimonials(), getFaqs(), getContent(), getSettings(),
  ]);

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
      />
    </>
  );
}
