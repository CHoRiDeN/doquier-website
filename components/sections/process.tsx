"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL, PROCESS } from "@/lib/site";

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

/**
 * Process Rail: a bead draws the line through the steps as you scroll. Each step lights up as the bead
 * reaches it and its number rolls in. Horizontal on desktop, vertical below lg.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      const steps = q("[data-step]") as HTMLElement[];

      /** Lights a step (or dims it on the way back) and rolls its number. */
      const setActive = (step: HTMLElement, on: boolean) => {
        if (step.dataset.on === String(on)) return;
        step.dataset.on = String(on);
        const index = steps.indexOf(step) + 1;
        gsap.to(step, { "--active": on ? 1 : 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        gsap.to(step.querySelector("[data-roll]"), {
          yPercent: on ? -10 * index : 0,
          duration: 0.9,
          ease: "expo.out",
          overwrite: "auto",
        });
      };

      mm.add(MQ.motion, () => {
        gsap.from(q("[data-underline]"), {
          drawSVG: "0%",
          duration: 1.4,
          ease: "power2.inOut",
          delay: 0.5,
          scrollTrigger: { trigger: q("[data-underline]")[0], start: "top 85%", once: true },
        });
        gsap.set(steps, { "--active": 0 });
        gsap.set(q("[data-roll]"), { y: 0, yPercent: 0 });
        gsap.from(q("[data-step-copy]"), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.04,
          duration: 1,
          scrollTrigger: { trigger: q("[data-rail]")[0], start: "top 80%", once: true },
        });
        return () => steps.forEach((step) => delete step.dataset.on);
      });

      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const rail = q("[data-rail]")[0] as HTMLElement;
        gsap.fromTo(
          q("[data-rail-fill]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rail,
              start: "top 85%",
              end: "bottom 30%",
              scrub: 0.4,
              onUpdate(self) {
                const x = self.progress * rail.offsetWidth;
                gsap.set(q("[data-bead]"), { x });
                // Each step's dot sits at its left edge, so the step lights when the bead reaches that edge.
                steps.forEach((step) => setActive(step, x >= step.offsetLeft - 2));
              },
            },
          },
        );
      });

      mm.add(`${MQ.motion} and (max-width: 1023.98px)`, () => {
        gsap.fromTo(
          q("[data-rail-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-rail]")[0], start: "top 60%", end: "bottom 60%", scrub: 0.5 },
          },
        );
        steps.forEach((step) => {
          gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: "top 60%",
              onEnter: () => setActive(step, true),
              onLeaveBack: () => setActive(step, false),
            },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="process" ref={ref} aria-labelledby="process-heading" className="overflow-hidden py-32 sm:py-44">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2
            id="process-heading"
            className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            <SplitReveal as="span" className="block">
              Tell us the goal.
            </SplitReveal>
            <span className="relative inline-block">
              <span className="font-serif-accent text-accent-warm">We take it from there.</span>
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
          <div className="flex flex-col gap-8 lg:items-end">
            <p className="max-w-sm text-pretty text-foreground/60 lg:text-right">
              No tool to learn, no prompts to write, no creators to chase. You approve the plan and every batch; our team
              does the work.
            </p>
            <CtaLink href={FORM_URL} className="hidden lg:inline-flex">
              Book a strategy call
            </CtaLink>
          </div>
        </div>

        <div data-rail className="relative mt-20 lg:mt-28">
          {/* The track: vertical on phones and tablets, horizontal on desktop. */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto">
            <span data-rail-fill className="absolute inset-0 origin-top bg-accent-warm lg:origin-left" />
          </span>
          <span
            data-bead
            aria-hidden
            className="absolute top-0 left-0 hidden size-[15px] -translate-x-1/2 rounded-full bg-accent-warm shadow-[0_0_24px_4px_rgb(195_184_168/0.45)] lg:block"
          />

          <ol className="grid gap-16 lg:grid-cols-5 lg:gap-8">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                data-step
                className="relative pl-14 [--active:1] sm:pl-20 lg:pt-14 lg:pl-0"
                style={{ opacity: "calc(0.35 + var(--active) * 0.65)" }}
              >
                <span
                  aria-hidden
                  className="absolute top-2 left-0 size-[15px] rounded-full border border-foreground/25 bg-background lg:top-0"
                >
                  <span
                    className="absolute inset-[3px] rounded-full bg-accent-warm"
                    style={{ transform: "scale(var(--active))" }}
                  />
                </span>
                <p data-step-copy className="flex font-mono text-xs tracking-[0.18em] text-muted-foreground">
                  STEP&nbsp;0
                  {/* Rolling digit: a 0–9 column that slides to the step's number when it lights up. */}
                  <span aria-hidden className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2em]">
                    <span data-roll className="flex flex-col" style={{ transform: `translateY(-${(i + 1) * 10}%)` }}>
                      {DIGITS.map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </span>
                  </span>
                  <span className="sr-only">{i + 1}</span>
                </p>
                <h3 data-step-copy className="mt-3 text-[clamp(1.5rem,2.2vw,1.75rem)] font-semibold tracking-[-0.035em]">
                  {step.title}
                </h3>
                <p data-step-copy className="mt-3 max-w-md leading-relaxed text-pretty text-foreground/60">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Below lg the CTA follows the steps instead of the intro. */}
        <CtaLink href={FORM_URL} className="mt-16 lg:hidden">
          Book a strategy call
        </CtaLink>
      </div>
    </section>
  );
}
