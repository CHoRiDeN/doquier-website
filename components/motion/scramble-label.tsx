"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Mono eyebrow label that decodes itself when scrolled into view (Text Scramble). */
export function ScrambleLabel({
  children,
  className,
  index,
}: {
  children: string;
  className?: string;
  index?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(ref.current, {
          duration: 1.1,
          ease: "none",
          scrambleText: { text: children, chars: "upperCase", speed: 0.6, revealDelay: 0.15 },
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      {index ? <span className="text-accent-warm">{index}</span> : null}
      <span aria-hidden className="h-px w-6 bg-current opacity-40" />
      <span ref={ref}>{children}</span>
    </p>
  );
}
