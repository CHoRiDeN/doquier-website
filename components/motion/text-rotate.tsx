"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Cycles through words in place (Text Rotate): the current word slides up and out while the next
 * rises in, and the slot's width eases to fit so the surrounding sentence reflows smoothly.
 */
export function TextRotate({
  words,
  interval = 2.4,
  className,
}: {
  words: readonly string[];
  interval?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const slot = ref.current!;
        const items = gsap.utils.toArray<HTMLElement>("[data-word]", slot);
        let index = 0;
        const fit = () => gsap.set(slot, { width: items[index].offsetWidth });

        gsap.set(items.slice(1), { yPercent: 110, autoAlpha: 0 });
        fit();
        document.fonts?.ready.then(fit);

        const timer = window.setInterval(() => {
          if (document.hidden) return;
          const current = items[index];
          index = (index + 1) % items.length;
          const next = items[index];
          gsap
            .timeline({ defaults: { duration: 0.7, ease: "expo.inOut" } })
            .to(current, { yPercent: -110, autoAlpha: 0 }, 0)
            .fromTo(next, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1 }, 0)
            .to(slot, { width: next.offsetWidth }, 0);
        }, interval * 1000);

        return () => window.clearInterval(timer);
      });
    },
    { scope: ref },
  );

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span
        ref={ref}
        aria-hidden
        className={cn("relative inline-flex overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]", className)}
      >
        {words.map((word, i) => (
          <span key={word} data-word className={cn("whitespace-nowrap", i > 0 && "invisible absolute top-0 left-0")}>
            {word}
          </span>
        ))}
      </span>
    </>
  );
}
