import type { Metadata } from "next";
import { ContactEmail, LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Responsible AI",
  description:
    "How Doquier labels AI-generated content, handles likeness and consent, keeps claims truthful and reviews every video before it goes live.",
  alternates: { canonical: "/responsible-ai" },
  openGraph: { url: "/responsible-ai" },
};

const sections: LegalSection[] = [
  {
    id: "disclosure",
    title: "We're open about AI",
    body: (
      <>
        <p>
          Realistic doesn&apos;t mean hidden. We label AI-generated content wherever a platform or the law requires it,
          including TikTok&apos;s and Meta&apos;s AI labels, YouTube&apos;s altered or synthetic content disclosure, and
          the transparency obligations for synthetic audio and video under the EU AI Act.
        </p>
        <p>
          When we deliver files, we tell you which labels apply in each market. When we publish for you, we apply them
          ourselves.
        </p>
      </>
    ),
  },
  {
    id: "likeness",
    title: "No real person without consent",
    body: (
      <ul>
        <li>
          Our presenters are synthetic characters, or are based on likenesses licensed with the person&apos;s consent.
        </li>
        <li>
          We never imitate a real, identifiable person, including public figures, your competitors&apos; spokespeople or
          your own staff, without their written permission.
        </li>
        <li>We don&apos;t clone anyone&apos;s voice without their explicit consent.</li>
      </ul>
    ),
  },
  {
    id: "reviews",
    title: "Brand content, not fake reviews",
    body: (
      <>
        <p>
          AI presenters are not customers. We don&apos;t produce content that claims to be a genuine customer&apos;s
          review or testimonial, and we don&apos;t attribute experiences to real people who didn&apos;t have them. EU
          consumer law prohibits fake reviews, and so do we.
        </p>
        <p>
          Review-style videos present real product facts and the claims you can substantiate, and they are published as
          brand advertising with the disclosures that requires.
        </p>
      </>
    ),
  },
  {
    id: "claims",
    title: "Truthful claims",
    body: (
      <p>
        Every product claim in a script comes from you, and you confirm you can back it up. We don&apos;t write medical,
        health, financial or environmental claims that aren&apos;t permitted, and we follow the advertising rules of
        each platform and market we work in.
      </p>
    ),
  },
  {
    id: "wont-make",
    title: "What we won't make",
    body: (
      <ul>
        <li>Political or electoral persuasion.</li>
        <li>Content aimed at children, or products that can&apos;t legally be advertised to your audience.</li>
        <li>Misleading health claims, scams or get-rich-quick offers.</li>
        <li>Hateful, sexual or violent content.</li>
        <li>Anything designed to deceive people about who is speaking or what is real.</li>
      </ul>
    ),
  },
  {
    id: "review",
    title: "People review every video",
    body: (
      <p>
        AI does the production; people make the calls. Strategists write and approve every script, and every video is
        checked for accuracy, brand safety and the right disclosures before it reaches you. You approve each batch
        before anything is published.
      </p>
    ),
  },
  {
    id: "your-assets",
    title: "Your data and brand assets",
    body: (
      <p>
        Brand assets, product information and briefs you share are used only to produce your content. They are stored
        with access limited to the team working on your account, and returned or deleted when the engagement ends if you
        ask us to. See our <a href="/privacy">privacy policy</a> for how we handle personal data.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Clear rights",
    body: (
      <p>
        We only use music, stock footage, fonts and other materials we are licensed to use. The usage rights you receive
        for each video are set out in your agreement.
      </p>
    ),
  },
  {
    id: "concerns",
    title: "Raise a concern",
    body: (
      <p>
        If you believe content we made misuses your likeness, misleads people or breaks these principles, email{" "}
        <ContactEmail />. We review every report and take content down when it&apos;s warranted.
      </p>
    ),
  },
];

export default function ResponsibleAiPage() {
  return (
    <LegalPage
      eyebrow="Principles"
      title={
        <>
          Responsible <span className="font-serif-accent text-accent-warm">AI.</span>
        </>
      }
      intro={
        <p>
          We make UGC that looks real, with AI. That comes with responsibilities: to the people who watch it, to the
          platforms it runs on and to the brands whose names are on it. Here&apos;s how we handle them.
        </p>
      }
      sections={sections}
    />
  );
}
