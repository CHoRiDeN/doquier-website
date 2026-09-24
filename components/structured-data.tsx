import { FAQ, FORMATS, LANGUAGE_NAMES, SITE, SITE_URL } from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;

/** schema.org graph describing Doquier for search engines and AI assistants. */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon`, width: 180, height: 180 },
        description: SITE.description,
        areaServed: { "@type": "Place", name: "Europe" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.shortDescription,
        inLanguage: "en-GB",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service`,
        name: "AI UGC video ad production",
        serviceType: "AI-generated user-generated content (UGC) video ads",
        description: SITE.description,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Place", name: "Europe" },
        availableLanguage: [...LANGUAGE_NAMES],
        audience: { "@type": "BusinessAudience", audienceType: "Performance marketing and growth teams" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Video ad formats",
          itemListElement: FORMATS.map((f) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: f.name, description: f.description },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
