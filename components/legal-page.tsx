import type { ReactNode } from "react";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteNav } from "@/components/sections/site-nav";
import { LEGAL } from "@/lib/site";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Shared layout for the legal and policy pages: title block, sticky contents on desktop, readable prose. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SiteNav home={false} />
      <main id="main" className="flex-1">
        <header className="container-site pt-40 pb-16 sm:pt-48 sm:pb-20">
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent-warm uppercase">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
            {title}
          </h1>
          <div className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-foreground/65">{intro}</div>
          <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            Last updated {LEGAL.updated}
          </p>
        </header>

        <div className="container-site grid gap-12 border-t border-line pt-16 pb-24 lg:grid-cols-[240px_1fr] lg:gap-20">
          <nav aria-label="On this page" className="hidden lg:block">
            <ol className="sticky top-32 grid gap-2.5 text-sm">
              {sections.map((section, i) => (
                <li key={section.id} className="flex gap-3">
                  <span className="font-mono text-[11px] leading-5 text-foreground/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a href={`#${section.id}`} className="text-foreground/55 transition-colors hover:text-foreground">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-2xl [&_a]:text-accent-warm [&_a]:underline [&_a]:decoration-accent-warm/40 [&_a]:underline-offset-4 hover:[&_a]:decoration-accent-warm [&_li]:mt-2 [&_li]:pl-1 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-accent-warm/60">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 pb-12 leading-relaxed text-foreground/70 last:pb-0"
              >
                <h2 className="flex items-baseline gap-4 text-[clamp(1.375rem,2.4vw,1.75rem)] font-semibold tracking-[-0.03em] text-foreground">
                  <span className="font-mono text-xs font-normal text-accent-warm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                {section.body}
              </section>
            ))}
          </article>
        </div>
      </main>
      <SiteFooter home={false} />
    </>
  );
}

/** The company's postal address on one line. */
export function LegalAddress() {
  return (
    <>
      {LEGAL.company}, {LEGAL.street}, {LEGAL.postalCode} {LEGAL.locality}, {LEGAL.region}, {LEGAL.country}
    </>
  );
}

export function ContactEmail() {
  return <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;
}
