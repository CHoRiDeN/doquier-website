import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClipDuel, FaceOff, WorkGallery } from "@/components/compare/visuals";
import { ComparisonCell } from "@/components/comparison-mark";
import { CtaLink } from "@/components/motion/cta-link";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd, PageShell } from "@/components/page-shell";
import { COMPETITORS, getCompetitor } from "@/lib/compare";
import { FORM_URL, SERVICES, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCompetitor(slug);
  if (!c) return {};
  const url = `/compare/${c.slug}`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    openGraph: { url, title: `${c.title} — Doquier`, description: c.description },
    twitter: { title: `${c.title} — Doquier`, description: c.description },
  };
}

const BOOK = `/${FORM_URL}`;

function Check({ muted }: { muted?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={muted ? "mt-1 size-4 shrink-0 text-foreground/40" : "mt-1 size-4 shrink-0 text-accent-warm"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

export default async function ComparePage(props: PageProps<"/compare/[slug]">) {
  const { slug } = await props.params;
  const c = getCompetitor(slug);
  if (!c) notFound();
  const others = COMPETITORS.filter((o) => o.slug !== c.slug);
  const pageUrl = `${SITE_URL}/compare/${c.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: c.title,
        description: c.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: [
          { "@id": `${SITE_URL}/#organization` },
          { "@type": "SoftwareApplication", name: c.name, url: c.website },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Doquier", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare` },
          { "@type": "ListItem", position: 3, name: `Doquier vs ${c.name}`, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <header className="container-site grid items-center gap-14 pt-40 pb-20 sm:pt-48 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <nav aria-label="Breadcrumb" className="hero-fade font-mono text-[11px] tracking-[0.16em] uppercase">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li>
                <Link href="/compare" className="transition-colors hover:text-foreground">
                  Compare
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-accent-warm">
                {c.name}
              </li>
            </ol>
          </nav>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance">
            <span className="hero-line">
              <span>
                Doquier vs <span className="font-serif-accent pr-[0.04em] text-accent-warm">{c.name}.</span>
              </span>
            </span>
          </h1>
          <p className="hero-rise mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-foreground/65">{c.verdict}</p>
          <div
            className="hero-fade mt-10 flex flex-wrap items-center gap-3 max-sm:w-full"
            style={{ animationDelay: "0.3s" }}
          >
            <CtaLink href={BOOK} size="lg">
              Book a strategy call
            </CtaLink>
            <CtaLink href="#at-a-glance" size="lg" variant="ghost" arrow={false}>
              See the comparison
            </CtaLink>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md lg:col-span-5">
          <FaceOff c={c} />
        </div>
      </header>

      <Reveal>
        {/* Real work, straight after the hero, so first-time visitors see the quality and range. */}
        <section aria-labelledby="work-heading" className="container-site py-16">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <h2
              id="work-heading"
              data-reveal
              className="max-w-2xl text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-[-0.04em] text-balance"
            >
              Everything we make, <span className="font-serif-accent text-accent-warm">from one brief.</span>
            </h2>
            <p data-reveal="0.1" className="max-w-sm text-pretty text-foreground/60">
              Real Doquier videos across every format we produce. Tap any tile on your phone, or hover on desktop, to
              take a closer look.
            </p>
          </div>
          <div className="mt-10">
            <WorkGallery />
          </div>
        </section>

        {/* At a glance */}
        <section id="at-a-glance" aria-labelledby="glance-heading" className="container-site scroll-mt-24 py-16">
          <h2
            id="glance-heading"
            data-reveal
            className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-[-0.04em] text-balance"
          >
            Doquier and {c.name} <span className="font-serif-accent text-accent-warm">at a glance.</span>
          </h2>
          {/* Phones: one card per row, both answers stacked. */}
          <dl data-reveal className="mt-10 grid gap-3 sm:hidden">
            {c.rows.map((row) => (
              <div key={row.label} className="rounded-2xl border border-line p-5">
                <dt className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">{row.label}</dt>
                <dd className="mt-4 grid gap-3 text-sm leading-relaxed">
                  <p className="rounded-xl bg-accent-warm/[0.07] p-3.5 text-foreground">
                    <span className="mb-1 block text-xs font-medium text-accent-warm">Doquier</span>
                    {row.marks ? <ComparisonCell value={row.doquier} mark={row.marks[0]} highlight /> : row.doquier}
                  </p>
                  <p className="px-3.5 text-foreground/60">
                    <span className="mb-1 block text-xs font-medium text-foreground/45">{c.name}</span>
                    {row.marks ? <ComparisonCell value={row.them} mark={row.marks[1]} /> : row.them}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
          <div data-reveal className="mt-10 hidden sm:block">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Doquier compared with {c.name}: {c.category.toLowerCase()}
              </caption>
              <thead>
                <tr className="align-bottom">
                  <th scope="col" className="w-[22%] pb-5 font-normal text-muted-foreground" />
                  <th
                    scope="col"
                    className="w-[39%] rounded-t-2xl bg-accent-warm/[0.07] px-6 pt-6 pb-5 text-base font-semibold text-foreground"
                  >
                    Doquier
                  </th>
                  <th scope="col" className="w-[39%] px-6 pb-5 text-base font-medium text-foreground/70">
                    {c.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row, i) => (
                  <tr key={row.label} className="border-t border-line align-top">
                    <th scope="row" className="py-5 pr-6 font-normal text-foreground/55">
                      {row.label}
                    </th>
                    <td
                      className={`bg-accent-warm/[0.07] px-6 py-5 leading-relaxed text-foreground ${i === c.rows.length - 1 ? "rounded-b-2xl" : ""}`}
                    >
                      {row.marks ? <ComparisonCell value={row.doquier} mark={row.marks[0]} highlight /> : row.doquier}
                    </td>
                    <td className="px-6 py-5 leading-relaxed text-foreground/60">
                      {row.marks ? <ComparisonCell value={row.them} mark={row.marks[1]} /> : row.them}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {c.clip ? (
          <section aria-labelledby="duel-heading" className="container-site border-t border-line py-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-20">
              <div>
                <h2
                  id="duel-heading"
                  data-reveal
                  className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-[-0.04em] text-balance"
                >
                  See the difference <span className="font-serif-accent text-accent-warm">side by side.</span>
                </h2>
                <p data-reveal="0.1" className="mt-5 max-w-md text-pretty text-foreground/60">
                  One of our videos next to an example from {c.name}&apos;s own showcase. Play ours with sound: realism
                  is the whole game, and it&apos;s where we obsess.
                </p>
                <div data-reveal="0.2">
                  <CtaLink href={BOOK} className="mt-8">
                    Get videos like this
                  </CtaLink>
                </div>
              </div>
              <ClipDuel c={c} />
            </div>
          </section>
        ) : null}

        {/* Which one fits */}
        <section aria-labelledby="fit-heading" className="container-site py-24">
          <h2
            id="fit-heading"
            data-reveal
            className="max-w-3xl text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-[-0.04em] text-balance"
          >
            Which one is right <span className="font-serif-accent text-accent-warm">for you?</span>
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-foreground/60">
            {c.name} is a good product. The real question is whether you want a tool your team runs, or a team that runs
            the whole programme for you.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
            <div data-reveal className="rounded-3xl border border-line bg-[#0f0f10] p-7 sm:p-8">
              <h3 className="text-xl font-semibold tracking-[-0.03em]">Choose {c.name} if…</h3>
              <ul className="mt-6 grid gap-4">
                {c.chooseThem.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-foreground/65">
                    <Check muted />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              data-reveal="0.1"
              className="rounded-3xl border border-accent-warm/50 bg-accent-warm/[0.06] p-7 shadow-[0_40px_120px_-40px_rgb(195_184_168/0.35)] sm:p-8"
            >
              <h3 className="text-xl font-semibold tracking-[-0.03em]">Choose Doquier if…</h3>
              <ul className="mt-6 grid gap-4">
                {c.chooseUs.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-foreground/85">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
              <CtaLink href={BOOK} className="mt-8">
                Book a strategy call
              </CtaLink>
            </div>
          </div>
        </section>

        {/* What done-for-you means */}
        <section aria-labelledby="dfy-heading" className="container-site border-t border-line py-24">
          <h2
            id="dfy-heading"
            data-reveal
            className="max-w-3xl text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-[-0.04em] text-balance"
          >
            What you get instead of <span className="font-serif-accent text-accent-warm">another login.</span>
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
            {SERVICES.map((service, i) => (
              <li key={service.step} data-reveal={i * 0.08} className="rounded-3xl border border-line p-7">
                <p className="flex items-baseline gap-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  <span className="text-accent-warm">{String(i + 1).padStart(2, "0")}</span>
                  {service.step}
                </p>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">{service.title}</h3>
                <p className="mt-3 leading-relaxed text-pretty text-foreground/60">{service.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="container-site grid gap-12 border-t border-line py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-24"
        >
          <h2
            id="faq-heading"
            data-reveal
            className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-[-0.04em] text-balance"
          >
            Doquier vs {c.name}: <span className="font-serif-accent text-accent-warm">questions.</span>
          </h2>
          <div className="divide-y divide-line border-y border-line">
            {c.faq.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-line transition-transform duration-500 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-foreground/60">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Other comparisons + closing CTA */}
        <section aria-labelledby="more-heading" className="container-site border-t border-line py-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="more-heading" className="text-2xl font-semibold tracking-[-0.03em]">
                More comparisons
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/compare/${o.slug}`}
                      className="inline-flex rounded-full px-4 py-2 text-sm text-foreground/75 ring-1 ring-line transition-colors hover:text-foreground hover:ring-foreground/40"
                    >
                      Doquier vs {o.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/compare"
                    className="inline-flex rounded-full px-4 py-2 text-sm text-accent-warm ring-1 ring-accent-warm/40 transition-colors hover:text-foreground"
                  >
                    All comparisons
                  </Link>
                </li>
              </ul>
            </div>
            <CtaLink href={BOOK} size="lg">
              Book a strategy call
            </CtaLink>
          </div>
          <p className="mt-16 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Information about {c.name} comes from its public website (
            <a
              href={c.website}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="underline underline-offset-2"
            >
              {c.website.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
            ) as of {c.checked} and may have changed since. {c.name} is a trademark of its owner. Doquier is not
            affiliated with or endorsed by {c.name}.
          </p>
        </section>
      </Reveal>
    </PageShell>
  );
}
