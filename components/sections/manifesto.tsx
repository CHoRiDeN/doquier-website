"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { FORM_URL } from "@/lib/site";

/** A pain phrase that gets a highlighter sweep once the reader reaches it. */
function Pain({ children }: { children: string }) {
  return (
    <span
      data-pain
      className="bg-[linear-gradient(rgb(195_184_168/0.22),rgb(195_184_168/0.22))] bg-no-repeat [background-position:0_88%] [background-size:100%_0.32em]"
    >
      {children}
    </span>
  );
}

/** Blur Highlight: words sharpen out of a blur as the reader scrolls, and the pain points get marked. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create("[data-fill]", { type: "words", aria: "none" });
        gsap.fromTo(
          split.words,
          { opacity: 0.12, filter: "blur(6px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: "[data-fill]", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-pain]").forEach((el) => {
          gsap.fromTo(
            el,
            { backgroundSize: "0% 0.32em" },
            {
              backgroundSize: "100% 0.32em",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 70%", end: "top 55%", scrub: 0.6 },
            },
          );
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="Why Doquier" className="py-32 sm:py-44">
      <div className="container-site">
        <p
          data-fill
          className="max-w-5xl text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.12] font-medium tracking-[-0.035em] text-balance"
        >
          AI video tools promised to save you time. Instead you got <Pain>another login</Pain>,{" "}
          <Pain>a learning curve</Pain> and <Pain>a blank prompt</Pain>. Someone still has to plan the content, write the
          scripts, generate, review and post it. Every week, in every market.{" "}
          <span className="font-serif-accent text-accent-warm">Doquier does all of it for you.</span>
        </p>
        <CtaLink href={FORM_URL} className="mt-12">
          Book a strategy call
        </CtaLink>
      </div>
    </section>
  );
}
