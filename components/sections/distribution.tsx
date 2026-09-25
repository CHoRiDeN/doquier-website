"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { Globe } from "@/components/motion/globe";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { DISTRIBUTION_POINTS, FORM_URL } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

/** Distribution: content only works once it's seen. A live globe shows it going out to each market. */
export function Distribution() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-point]"), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          scrollTrigger: { trigger: q("[data-points]")[0], start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="distribution"
      ref={ref}
      aria-labelledby="distribution-heading"
      className="relative overflow-hidden py-32 sm:py-44"
    >
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SplitReveal
            id="distribution-heading"
            className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            Posted where your buyers <span className="font-serif-accent text-accent-warm">actually scroll.</span>
          </SplitReveal>
          <p className="mt-6 max-w-md text-pretty text-foreground/60">
            Content only works once it&apos;s seen. We publish it in each target market on a steady cadence and grow
            reach as far as your plan needs, so a new country stops being a cold start.
          </p>

          <ol data-points className="mt-10 grid gap-x-8 sm:grid-cols-2 max-lg:hidden">
            {DISTRIBUTION_POINTS.map((point, i) => (
              <li key={point.title} data-point className="border-t border-line py-5">
                <p className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-accent-warm">{pad(i + 1)}</span>
                  <span className="font-medium tracking-[-0.02em]">{point.title}</span>
                </p>
                <p className="mt-1.5 pl-7 text-sm leading-relaxed text-pretty text-foreground/55">{point.description}</p>
              </li>
            ))}
          </ol>

          <CtaLink href={FORM_URL} className="mt-8 hidden lg:inline-flex">
            Book a strategy call
          </CtaLink>
        </div>

        <div className="relative lg:col-span-7">
          {/* Warm light behind the globe so it sits in the page rather than on it. */}
          <div
            aria-hidden
            className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(195_184_168/0.14),transparent_65%)] blur-2xl"
          />
          <Globe className="mx-auto max-w-[620px]" />
        </div>

        {/* Below lg the points follow the globe. */}
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:hidden">
          {DISTRIBUTION_POINTS.map((point, i) => (
            <li key={point.title} className="border-t border-line py-5">
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-accent-warm">{pad(i + 1)}</span>
                <span className="font-medium tracking-[-0.02em]">{point.title}</span>
              </p>
              <p className="mt-1.5 pl-7 text-sm leading-relaxed text-pretty text-foreground/55">{point.description}</p>
            </li>
          ))}
        </ol>
        <CtaLink href={FORM_URL} className="lg:hidden">
          Book a strategy call
        </CtaLink>
      </div>
    </section>
  );
}
