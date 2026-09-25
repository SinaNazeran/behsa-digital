import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNavigation, getSettings } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

/* Public pages are prerendered and revalidated on a one-hour floor. The
   admin already expires them on every edit (updateTag + revalidatePath in
   _actions/helpers.ts), so edits stay instant; the hour is only a backstop.
   Rendering per request cost ~55ms of CPU and, worse, sent
   `Cache-Control: private, no-store`, which put every page view through
   the origin. Routes that read cookies or searchParams (/contact,
   /articles/[slug]) still opt themselves out and render dynamically. */
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, sections] = await Promise.all([getSettings(), getNavigation()]);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: settings.siteName,
    alternateName: "Behsa Digital",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    description: settings.defaultDescription,
    email: settings.email,
    telephone: settings.phoneHref.replace(/^tel:/, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "مشهد",
      addressCountry: "IR",
    },
    sameAs: [settings.baleUrl].filter(Boolean),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: settings.siteName,
    inLanguage: "fa-IR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={[organization, website]} />
      <div className="min-h-screen flex flex-col bg-bg text-ink font-body">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[70] focus:inline-flex focus:items-center focus:rounded-[10px] focus:bg-primary focus:px-4 focus:py-2 focus:text-[13.5px] focus:font-bold focus:text-on-primary focus:shadow-lift"
        >
          پرش به محتوای اصلی
        </a>
        <Navbar
          sections={sections}
          panelUrl={settings.panelUrl}
          phoneHref={settings.phoneHref}
          phoneDisplay={settings.phoneDisplay}
        />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer settings={settings} sections={sections} />
      </div>
    </>
  );
}
