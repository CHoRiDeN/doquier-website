"use client";

import { useRef } from "react";
import { Flag } from "@/components/flag";
import { CtaLink } from "@/components/motion/cta-link";
import { SoundVideo } from "@/components/motion/sound-video";
import { SplitFlap } from "@/components/motion/split-flap";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL, LANGUAGE_EXAMPLES } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Languages() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-lang-card]"), {
          clipPath: "inset(100% 0% 0% 0% round 24px)",
          duration: 1.5,
          stagger: 0.12,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q("[data-lang-cards]")[0], start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="languages-heading" className="overflow-hidden py-32 sm:py-44">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SplitReveal
            id="languages-heading"
            className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            One brief. <span className="font-serif-accent text-accent-warm">Every market.</span>
          </SplitReveal>
          <p className="mt-6 max-w-md text-pretty text-foreground/60">
            Launch your winning angle in Berlin, Milan and Madrid in the same week. Every creator is cast for the
            market, with a native accent, local references and lip-sync that holds up with the sound on.
          </p>

          <div className="mt-10">
            <SplitFlap />
          
          </div>

          {/* Desktop CTA sits with the copy; below lg it follows the videos. */}
          <CtaLink href={FORM_URL} className="mt-10 hidden lg:inline-flex">
            Launch in a new market
          </CtaLink>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <ul
            data-lang-cards
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-5"
          >
            {LANGUAGE_EXAMPLES.map((item, i) => (
              <li
                key={item.code}
                className={cn("w-[68vw] max-w-[300px] shrink-0 snap-center sm:w-auto sm:max-w-none", i === 1 && "lg:translate-y-14")}
              >
                <div
                  data-lang-card
                  className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-muted ring-1 ring-line"
                >
                  <SoundVideo src={item.src} poster={item.poster} label={`${item.language} ${item.category.toLowerCase()} ad`} />
                </div>
                <p className="mt-4 flex items-center justify-between gap-3">
                  <Flag code={item.code} label={item.language} />
                  <span className="text-sm text-foreground/50">{item.category}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <CtaLink href={FORM_URL} className="lg:hidden">
          Launch in a new market
        </CtaLink>
      </div>
    </section>
  );
}
