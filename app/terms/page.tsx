import type { Metadata } from "next";
import { ContactEmail, LegalAddress, LegalPage, type LegalSection } from "@/components/legal-page";
import { LEGAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `The terms that apply when you use the Doquier website, operated by ${LEGAL.company}.`,
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          This website is operated by <strong>{LEGAL.company}</strong>, trading as Doquier (VAT {LEGAL.vat}),{" "}
          <LegalAddress />. By using the site, you agree to these terms. If you don&apos;t agree, please don&apos;t use
          it.
        </p>
        <p>These terms cover the website only. Our services are governed by a separate agreement (see below).</p>
      </>
    ),
  },
  {
    id: "services",
    title: "Our services",
    body: (
      <p>
        The website describes the content strategy, production and distribution services we offer. Nothing on it is a
        binding offer. Every engagement is scoped on a strategy call and governed by a written proposal or agreement,
        which takes precedence over anything on this site. We take on a limited number of brands at a time, so
        availability isn&apos;t guaranteed.
      </p>
    ),
  },
  {
    id: "examples",
    title: "Figures, examples and mock-ups",
    body: (
      <ul>
        <li>
          Figures described as &ldquo;up to&rdquo; reflect our best-performing client campaigns to date. They are not a
          promise of results, which depend on your account, offer, market and spend.
        </li>
        <li>
          Plans, dashboards, accounts and numbers shown in product mock-ups are illustrative examples, not real client
          data.
        </li>
        <li>
          Example videos are AI-generated samples and may feature synthetic people. They are shown to illustrate our
          work.
        </li>
      </ul>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <p>
        The website, its design, text, videos and the Doquier name and logo belong to {LEGAL.company} or its licensors.
        You may view and share pages for your own reference, but you may not copy, modify or reuse our content for
        commercial purposes without written permission. Rights in content we produce for clients are set out in each
        client agreement.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using the site, you agree not to:</p>
        <ul>
          <li>use it for anything unlawful, or to send false or misleading information through our forms;</li>
          <li>interfere with its security or operation, or try to access areas you&apos;re not authorised to;</li>
          <li>
            copy it at scale by automated means, other than search engines and AI assistants that respect our
            robots.txt.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party names and links",
    body: (
      <p>
        We mention other companies and tools for comparison. Their names and trademarks belong to their owners, and we
        are not affiliated with or endorsed by them. Comparisons reflect our assessment at the time of writing. Links to
        other websites are provided for convenience, and we aren&apos;t responsible for their content.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Disclaimer and liability",
    body: (
      <p>
        The website is provided &ldquo;as is&rdquo;. We work to keep it accurate and available but don&apos;t guarantee
        that it will always be complete, current or error-free. To the extent permitted by law, we aren&apos;t liable
        for any loss arising from your use of the site. Nothing in these terms limits liability that cannot be limited
        by law.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    body: (
      <p>
        How we handle personal data is explained in our <a href="/privacy">privacy policy</a>.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of the Republic of Cyprus, and the courts of Cyprus have jurisdiction over
        any dispute arising from them, without affecting any mandatory rights you may have under the law of your
        country.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <p>
        We may update these terms from time to time. The date at the top shows when they last changed. Questions? Email{" "}
        <ContactEmail />.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={
        <>
          Terms of <span className="font-serif-accent text-accent-warm">use.</span>
        </>
      }
      intro={<p>The rules for using this website, and what the figures and examples on it do and don&apos;t mean.</p>}
      sections={sections}
    />
  );
}
