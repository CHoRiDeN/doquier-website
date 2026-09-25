"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { MeshGradient } from "@/components/motion/mesh-gradient";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL } from "@/lib/site";
import { SiteFooter } from "./site-footer";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
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
        className="container-site relative isolate overflow-hidden rounded-[2rem] px-6 py-36 text-center sm:py-48"
      >
        <MeshGradient className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <SplitReveal
            by="chars"
            id="start-heading"
            className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance"
          >
            Tell us the goal. <span className="font-serif-accent text-accent-warm">We&apos;ll bring the plan.</span>
          </SplitReveal>
          <p data-cta-fade className="mt-8 max-w-lg text-pretty text-foreground/70">
            Book a 30-minute strategy call. We&apos;ll look at your brand, markets and objectives, then come back with a
            content plan and a proposal.
          </p>
          <div data-cta-fade className="mt-10 max-sm:w-full">
            <CtaLink href={FORM_URL} size="lg">
              Book a strategy call
            </CtaLink>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
