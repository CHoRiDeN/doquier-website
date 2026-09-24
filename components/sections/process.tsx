"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL, PROCESS } from "@/lib/site";

/** Process Rail: a progress line draws down the steps and lights each one as it passes. */
export function Process() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-underline]"), {
          drawSVG: "0%",
          duration: 1.4,
          ease: "power2.inOut",
          delay: 0.5,
          scrollTrigger: { trigger: q("[data-underline]")[0], start: "top 85%", once: true },
        });

        gsap.fromTo(
          q("[data-rail-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-steps]")[0], start: "top 60%", end: "bottom 60%", scrub: 0.5 },
          },
        );

        q("[data-step]").forEach((step) => {
          gsap.from(step.querySelectorAll("[data-step-copy]"), {
            y: 40,
            autoAlpha: 0,
            stagger: 0.08,
            scrollTrigger: { trigger: step, start: "top 80%", once: true },
          });
          gsap.fromTo(step, { "--active": 0 }, {
            "--active": 1,
            ease: "none",
            scrollTrigger: { trigger: step, start: "top 62%", end: "top 45%", scrub: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="process" ref={ref} aria-labelledby="process-heading" className="py-32 sm:py-44">
      <div className="container-site grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <ScrambleLabel className="mb-6" index="03">
            How it works
          </ScrambleLabel>
          <h2
            id="process-heading"
            className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            <SplitReveal as="span" className="block">
              From brief to live ads in
            </SplitReveal>
            <span className="relative inline-block">
              <span className="font-serif-accent text-accent-warm">72 hours.</span>
              <svg
                aria-hidden
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full overflow-visible text-accent-warm"
              >
                <path
                  data-underline
                  d="M2 14 C 60 4, 120 4, 170 10 S 260 18, 298 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="mt-8 max-w-md text-pretty text-foreground/60">
            No casting calls, no shipping samples, no chasing creators for revisions. You brief once; we handle strategy,
            production and iteration.
          </p>
          <CtaLink href={FORM_URL} className="mt-10 hidden lg:inline-flex">
            Send your brief
          </CtaLink>
        </div>

        <div data-steps className="relative">
          <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line">
            <span data-rail-fill className="absolute inset-0 origin-top bg-accent-warm" />
          </span>
          <ol>
          {PROCESS.map((step, i) => (
            <li
              key={step.title}
              data-step
              className="relative pb-20 pl-14 last:pb-0 [--active:1] sm:pl-20"
              style={{ opacity: "calc(0.35 + var(--active) * 0.65)" }}
            >
              <span
                aria-hidden
                className="absolute top-2 left-0 size-[15px] rounded-full border border-foreground/25 bg-background"
              >
                <span
                  className="absolute inset-[3px] rounded-full bg-accent-warm"
                  style={{ transform: "scale(var(--active))" }}
                />
              </span>
              <p data-step-copy className="font-mono text-xs tracking-[0.18em] text-muted-foreground">
                STEP {String(i + 1).padStart(2, "0")}
              </p>
              <h3 data-step-copy className="mt-3 text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.035em]">
                {step.title}
              </h3>
              <p data-step-copy className="mt-3 max-w-md leading-relaxed text-pretty text-foreground/60">
                {step.description}
              </p>
            </li>
          ))}
          </ol>
        </div>

        {/* On mobile the CTA follows the steps instead of the intro. */}
        <div className="lg:hidden">
          <CtaLink href={FORM_URL}>Send your brief</CtaLink>
        </div>
      </div>
    </section>
  );
}
