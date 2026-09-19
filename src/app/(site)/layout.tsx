import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNavigation, getSettings } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

/* Public pages render per request; the data underneath is cached in
   lib/cms.ts and invalidated from the admin, so edits are instant and
   `next build` never needs a database connection. */
export const dynamic = "force-dynamic";

/* Old Vite URLs were hash-based (/#/about). The hash never reaches the
   server, so this tiny inline script forwards them before paint. */
const LEGACY_HASH_REDIRECT = `(function(){var h=location.hash;if(h.indexOf("#/")===0){var p=h.slice(1);if(p==="/products")p="/product";location.replace(p);}})();`;

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
      <script dangerouslySetInnerHTML={{ __html: LEGACY_HASH_REDIRECT }} />
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
