"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL, METRICS } from "@/lib/site";

export function Results() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const counter = { value: 0 };
          el.textContent = "0";
          gsap.to(counter, {
            value: end,
            duration: 2.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value));
            },
          });
        });
        gsap.from(q("[data-metric]"), {
          y: 50,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-metrics]")[0], start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="results" ref={ref} aria-labelledby="results-heading" className="py-32 sm:py-44">
      <div className="container-site">
       
        <SplitReveal
          id="results-heading"
          className="max-w-3xl text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
        >
          Built for performance. <span className="font-serif-accent text-accent-warm">Measured in ROAS.</span>
        </SplitReveal>

        <dl data-metrics className="mt-20 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              data-metric
              className="flex flex-col-reverse justify-end gap-4 border-b border-line py-10 sm:px-8 sm:first:pl-0 sm:odd:border-r lg:border-r lg:last:border-r-0"
            >
              <dt className="max-w-[24ch] text-sm leading-relaxed text-pretty text-foreground/55">{metric.label}</dt>
              <dd className="flex items-baseline gap-2">
                {metric.prefix ? (
                  <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                    {metric.prefix}
                  </span>
                ) : null}
                <span className="text-[clamp(3.5rem,6vw,5.5rem)] leading-none font-semibold tracking-[-0.06em] tabular-nums">
                  <span data-count={metric.value}>{metric.value}</span>
                  <span className="font-serif-accent text-accent-warm">{metric.suffix}</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16">
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            &ldquo;Up to&rdquo; figures reflect the best-performing client campaigns to date. Results vary by account,
            offer and spend.
          </p>
        </div>
        <CtaLink href={FORM_URL} className="mt-14">
          Start your project
        </CtaLink>
      </div>
    </section>
  );
}
