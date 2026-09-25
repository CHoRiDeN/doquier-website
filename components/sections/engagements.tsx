"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { ENGAGEMENTS, FORM_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Ways to work with us. No prices: each engagement is scoped on the strategy call. */
export function Engagements() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-plan]"), {
          y: 60,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.2,
          scrollTrigger: {
            trigger: q("[data-plans]")[0],
            start: "top 82%",
            once: true,
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="engagements" ref={ref} aria-labelledby="engagements-heading" className="py-32 sm:py-44">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SplitReveal
            id="engagements-heading"
            className="max-w-2xl text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            Start where you <span className="font-serif-accent text-accent-warm">need us.</span>
          </SplitReveal>
          <p className="max-w-sm text-pretty text-foreground/60">
            Every engagement is scoped on the strategy call around your goal and volume. Move up whenever you&apos;re
            ready.
          </p>
        </div>

        {/* Bento focus: hovering one plan quietly dims the others. */}
        <ul
          data-plans
          className="mt-16 grid gap-4 md:grid-cols-3 md:gap-5 [@media(hover:hover)]:[&:has(li:hover)>li:not(:hover)]:opacity-50"
        >
          {ENGAGEMENTS.map((plan) => (
            <li key={plan.name} className="flex transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
              <div
                data-plan
                className={cn(
                  "relative flex w-full flex-col rounded-3xl border p-7 sm:p-8",
                  plan.featured
                    ? "border-accent-warm/50 bg-accent-warm/[0.06] shadow-[0_40px_120px_-40px_rgb(195_184_168/0.35)]"
                    : "border-line bg-[#0f0f10]",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-[-0.035em]">{plan.name}</h3>
                  {plan.featured ? (
                    <span className="rounded-full bg-accent-warm/15 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-accent-warm uppercase">
                      Recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 leading-relaxed text-pretty text-foreground/60">{plan.description}</p>
                <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <svg
                        viewBox="0 0 16 16"
                        className="size-4 shrink-0 text-accent-warm"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden
                      >
                        <path d="M3 8.5l3.2 3L13 4.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <CtaLink
                  href={FORM_URL}
                  variant={plan.featured ? "primary" : "ghost"}
                  className="mt-10 w-full justify-center"
                >
                  Book a strategy call
                </CtaLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
