import Link from "next/link";
import type { Metadata } from "next";
import { CompetitorMark } from "@/components/compare/visuals";
import { ComparisonCell } from "@/components/comparison-mark";
import { CtaLink } from "@/components/motion/cta-link";
import { JsonLd, PageShell } from "@/components/page-shell";
import { COMPETITORS } from "@/lib/compare";
import { COMPARISON, FORM_URL, SITE_URL } from "@/lib/site";

const TITLE = "Doquier vs AI UGC tools: Arcads, HeyGen, Creatify and MakeUGC";
const DESCRIPTION =
  "How Doquier's done-for-you AI UGC studio compares with self-serve tools like Arcads, HeyGen, Creatify and MakeUGC, and with creators and agencies.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/compare" },
  openGraph: { url: "/compare", title: `${TITLE} — Doquier`, description: DESCRIPTION },
  twitter: { title: `${TITLE} — Doquier`, description: DESCRIPTION },
};

export default function CompareIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/compare`,
        url: `${SITE_URL}/compare`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: COMPETITORS.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `Doquier vs ${c.name}`,
            url: `${SITE_URL}/compare/${c.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Doquier", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare` },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      <header className="container-site pt-40 pb-20 sm:pt-48">
        <p className="hero-fade font-mono text-[11px] tracking-[0.18em] text-accent-warm uppercase">Compare</p>
        <h1 className="mt-6 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance">
          <span className="hero-line">
            <span>
              A tool you run, or a team <span className="font-serif-accent text-accent-warm">that runs it.</span>
            </span>
          </span>
        </h1>
        <p className="hero-rise mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-foreground/65">
          Most AI UGC products are self-serve: your team learns the tool, writes the scripts, generates the videos and
          posts them. Doquier does all of that for you, from the content plan to publishing. Here&apos;s how we compare
          with the tools teams usually look at.
        </p>
      </header>

      <section aria-labelledby="tools-heading" className="container-site pb-24">
        <h2 id="tools-heading" className="sr-only">
          Comparisons
        </h2>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {COMPETITORS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/compare/${c.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-[#0f0f10] p-7 transition-colors duration-500 hover:border-accent-warm/50 sm:p-8"
              >
                <span className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny pre-sized brand mark */}
                  <img src="/brand/doquier-logo.svg" alt="" width={104} height={24} className="h-5 w-auto" />
                  <span aria-hidden className="font-serif-accent text-foreground/40">
                    vs
                  </span>
                  <CompetitorMark c={c} className="size-8 rounded-lg text-sm" />
                </span>
                <p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  {c.category}
                </p>
                <h3 className="mt-6 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.035em]">
                  Doquier vs <span className="font-serif-accent text-accent-warm">{c.name}</span>
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-pretty text-foreground/60">{c.verdict}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-accent-warm">
                  Read the comparison
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="categories-heading" className="container-site border-t border-line py-24">
        <h2
          id="categories-heading"
          className="max-w-3xl text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-[-0.04em] text-balance"
        >
          The output of an agency. <span className="font-serif-accent text-accent-warm">The speed of software.</span>
        </h2>
        <div className="-mx-6 mt-10 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">Doquier compared with self-serve AI tools and creators or agencies</caption>
            <thead>
              <tr className="align-bottom">
                <th scope="col" className="w-[28%] pb-5 font-normal text-muted-foreground" />
                <th
                  scope="col"
                  className="rounded-t-2xl bg-accent-warm/[0.07] px-6 pt-6 pb-5 text-base font-semibold text-foreground"
                >
                  Doquier
                </th>
                <th scope="col" className="px-6 pb-5 font-medium text-foreground/70">
                  Self-serve AI tools
                </th>
                <th scope="col" className="px-6 pb-5 font-medium text-foreground/70">
                  Creators &amp; agencies
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.label} className="border-t border-line">
                  <th scope="row" className="py-5 pr-6 font-normal text-foreground/60">
                    {row.label}
                  </th>
                  <td
                    className={`bg-accent-warm/[0.07] px-6 py-5 font-medium text-foreground ${i === COMPARISON.length - 1 ? "rounded-b-2xl" : ""}`}
                  >
                    <ComparisonCell value={row.doquier} mark="yes" highlight />
                  </td>
                  <td className="px-6 py-5 text-foreground/60">
                    <ComparisonCell value={row.tools} mark={row.marks.tools} />
                  </td>
                  <td className="px-6 py-5 text-foreground/60">
                    <ComparisonCell value={row.creators} mark={row.marks.creators} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CtaLink href={`/${FORM_URL}`} className="mt-12">
          Book a strategy call
        </CtaLink>
        <p className="mt-16 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Competitor information comes from their public websites as of September 2026 and may have changed since.
          Product names are trademarks of their owners. Doquier is not affiliated with or endorsed by them.
        </p>
      </section>
    </PageShell>
  );
}
