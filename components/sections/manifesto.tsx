"use client";

import { useRef } from "react";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";

/** Scroll-scrubbed text fill: words light up as the reader scrolls through them. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create("[data-fill]", { type: "words", aria: "none" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: "[data-fill]", start: "top 78%", end: "bottom 42%", scrub: 0.6 },
          },
        );
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="Why Doquier" className="py-32 sm:py-44">
      <div className="container-site">
        <ScrambleLabel className="mb-10" index="01">
          The problem
        </ScrambleLabel>
        <p
          data-fill
          className="max-w-5xl text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.12] font-medium tracking-[-0.035em] text-balance"
        >
          Creators take weeks. Your ads burn out in days. Performance teams need fresh, human-looking creative every week,
          not every quarter. <span className="font-serif-accent text-accent-warm">Doquier</span> closes that gap: native
          UGC, scripted by strategists and produced by AI, delivered in the time it takes to brief a single creator.
        </p>
      </div>
    </section>
  );
}
