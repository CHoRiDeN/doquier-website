"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { MeshGradient } from "@/components/motion/mesh-gradient";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL, NAV_LINKS } from "@/lib/site";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Oversized wordmark rises out of the footer edge.
        gsap.from("[data-wordmark]", {
          yPercent: 60,
          ease: "none",
          scrollTrigger: { trigger: "[data-wordmark]", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        });
        gsap.from("[data-cta-fade]", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-cta-fade]", start: "top 90%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <section
        id="start"
        aria-labelledby="start-heading"
        className="relative isolate mx-3 overflow-hidden rounded-[2rem] px-6 py-36 text-center sm:mx-5 sm:py-48"
      >
        <MeshGradient className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <SplitReveal
            by="chars"
            id="start-heading"
            className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance"
          >
            Your next winning ad is <span className="font-serif-accent text-accent-warm">72 hours</span> away.
          </SplitReveal>
          <p data-cta-fade className="mt-8 max-w-lg text-pretty text-foreground/70">
            Tell us about your brand and goals. We&apos;ll reply within one business day with sample concepts and a
            proposal.
          </p>
          <div data-cta-fade className="mt-10">
            <CtaLink href={FORM_URL} size="lg">
              Start your project
            </CtaLink>
          </div>
        </div>
      </section>

      <footer className="overflow-hidden px-6 pt-20 sm:px-10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xs text-sm leading-relaxed text-foreground/50">
            AI-generated UGC for European performance brands. Scripted by strategists, made to feel real.
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-foreground/60 transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={FORM_URL} className="text-accent-warm transition-colors hover:text-foreground">
                  Start a project
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mx-auto mt-20 max-w-[90rem] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative brand SVG */}
          <img data-wordmark src="/brand/doquier-logo.svg" alt="" width={285} height={67} className="w-full opacity-[0.06]" />
        </div>

        <div className="mx-auto flex max-w-[90rem] flex-col gap-2 border-t border-line py-8 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Doquier</span>
          <span>Made in Europe</span>
        </div>
      </footer>
    </div>
  );
}
