"use client";

import { useId, useState } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { SplitReveal } from "@/components/motion/split-reveal";
import { FAQ as ITEMS, FORM_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Morphing accordion: panels ease to their natural height, the plus morphs into a minus. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-32 sm:py-44">
      <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div>
        
          <SplitReveal
            id="faq-heading"
            className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            Questions, <span className="font-serif-accent text-accent-warm">answered.</span>
          </SplitReveal>
          <p className="mt-6 max-w-xs text-pretty text-foreground/60">Still unsure? We&apos;ll answer anything else on a call.</p>
          <CtaLink href={FORM_URL} className="mt-8">
            Talk to us
          </CtaLink>
        </div>

        <ul className="border-t border-line">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q-${i}`;
            const panelId = `${baseId}-a-${i}`;
            return (
              <li key={item.q} className="border-b border-line">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group/q flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium tracking-[-0.02em] transition-colors duration-300 hover:text-accent-warm"
                  >
                    {item.q}
                    <span
                      aria-hidden
                      className={cn(
                        "relative flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-line transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                        isOpen && "rotate-180 bg-foreground text-background",
                      )}
                    >
                      <span className="absolute h-px w-3 bg-current" />
                      <span
                        className={cn(
                          "absolute h-3 w-px bg-current transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                          isOpen && "scale-y-0",
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} data-open={isOpen} inert={!isOpen} className="faq-panel">
                  <div className="overflow-hidden">
                    <p
                      className={cn(
                        "max-w-2xl pb-8 leading-relaxed text-pretty text-foreground/60 transition-[opacity,transform] duration-500",
                        isOpen ? "translate-y-0 opacity-100 delay-100" : "-translate-y-2 opacity-0",
                      )}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
