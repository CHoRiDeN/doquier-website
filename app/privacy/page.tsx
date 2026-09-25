import type { Metadata } from "next";
import { ContactEmail, LegalAddress, LegalPage, type LegalSection } from "@/components/legal-page";
import { LEGAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${LEGAL.company}, trading as Doquier, collects, uses and protects personal data under the GDPR.`,
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          Doquier is a trading name of <strong>{LEGAL.company}</strong>, a company registered in {LEGAL.country} (VAT{" "}
          {LEGAL.vat}), with its address at <LegalAddress />.
        </p>
        <p>
          {LEGAL.company} is the controller of the personal data described in this policy. For anything related to your
          data, contact us at <ContactEmail />.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>
          <strong>When you request a strategy call.</strong> The form on our website asks for your company name, work
          email, company website, main goal, target markets, the services you&apos;re interested in, your sector,
          company size and monthly ad spend range.
        </p>
        <p>
          <strong>When you contact us.</strong> The content of your emails and any details you choose to share, such as
          your name and role.
        </p>
        <p>
          <strong>When you browse the site.</strong> We use privacy-friendly, cookieless analytics that record
          aggregated information such as pages viewed, referring site, country, and device and browser type, plus
          performance measurements of how quickly pages load. Our hosting provider also keeps short-lived server logs
          (including IP address and user agent) for security and reliability.
        </p>
        <p>
          We don&apos;t ask for special categories of data (such as health or political opinions). Please don&apos;t
          send them to us.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it, and why",
    body: (
      <ul>
        <li>
          <strong>To respond to your request</strong>, schedule the call and prepare a content plan and proposal. Legal
          basis: taking steps at your request before entering into a contract (Art. 6(1)(b) GDPR).
        </li>
        <li>
          <strong>To follow up about our services</strong> as a business contact. Legal basis: our legitimate interest
          in developing our business (Art. 6(1)(f) GDPR). You can object at any time and we&apos;ll stop.
        </li>
        <li>
          <strong>To run, secure and improve the website</strong> through aggregated analytics and server logs. Legal
          basis: our legitimate interest in a secure, working website (Art. 6(1)(f) GDPR).
        </li>
        <li>
          <strong>To meet legal obligations</strong>, for example accounting and tax records once you become a client
          (Art. 6(1)(c) GDPR).
        </li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>We don&apos;t sell personal data. We share it only with service providers who process it on our behalf:</p>
        <ul>
          <li>
            <strong>Brevo</strong> (Sendinblue SAS, France): our CRM and email platform, where strategy-call requests
            are stored.
          </li>
          <li>
            <strong>Vercel Inc.</strong> (United States): website hosting, cookieless analytics and performance
            monitoring.
          </li>
        </ul>
        <p>We may also share data with professional advisers, or with authorities when the law requires it.</p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        Some providers, such as Vercel, may process data outside the European Economic Area. When they do, the transfer
        is covered by an adequacy decision (such as the EU–US Data Privacy Framework) or by the European
        Commission&apos;s Standard Contractual Clauses.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <ul>
        <li>
          <strong>Strategy-call requests</strong> that don&apos;t lead to an engagement: up to 24 months after our last
          contact, then deleted.
        </li>
        <li>
          <strong>Client data</strong>: for the length of the relationship, and afterwards only as long as the law
          requires (for example, accounting records).
        </li>
        <li>
          <strong>Server logs</strong>: kept for a short period by our hosting provider for security purposes.
        </li>
      </ul>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        We don&apos;t use advertising or tracking cookies, and our analytics work without cookies. If that changes, we
        will update this policy and ask for your consent where the law requires it.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>
          You can ask us to access, correct or delete your personal data, to restrict or object to how we use it, or to
          receive a copy in a portable format. Where we rely on consent, you can withdraw it at any time.
        </p>
        <p>
          Email <ContactEmail /> and we&apos;ll reply within one month. You also have the right to complain to the
          Office of the Commissioner for Personal Data Protection in Cyprus (
          <a href="https://www.dataprotection.gov.cy" rel="noopener noreferrer" target="_blank">
            dataprotection.gov.cy
          </a>
          ) or to the data protection authority where you live or work.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        We use reputable providers, encrypted connections and access controls limited to the people who need the data to
        do their work. No system is completely secure, but we take reasonable measures to protect your data.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our website and services are for businesses and are not directed at children. We don&apos;t knowingly collect
        data from anyone under 16.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The date at the top shows when it last changed. If the change is
        significant, we&apos;ll let affected contacts know.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={
        <>
          Privacy <span className="font-serif-accent text-accent-warm">policy.</span>
        </>
      }
      intro={
        <p>
          What personal data we collect when you visit doquierlabs.com or request a strategy call, why we collect it and
          the rights you have over it.
        </p>
      }
      sections={sections}
    />
  );
}
