"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type SplitRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "lines" slides masked lines up; "chars" staggers characters in. */
  by?: "lines" | "chars";
  delay?: number;
  start?: string;
};

/** Masked text reveal on scroll (Text Reveal / Character Appear). */
export function SplitReveal({
  as: Tag = "h2",
  children,
  className,
  id,
  by = "lines",
  delay = 0,
  start = "top 85%",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let split: SplitText | undefined;
        // Split lazily, a screen before the heading arrives: splitting every heading at once on load
        // is a long layout task, and none of them are visible yet.
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting || split) return;
            io.disconnect();
            split = SplitText.create(ref.current, {
              type: by === "chars" ? "lines,words,chars" : "lines",
              mask: "lines",
              // Splitting lines keeps words intact, so the text stays readable as-is. Char splits need a label,
              // which is only valid on headings.
              aria: by === "chars" ? "auto" : "none",
              autoSplit: true,
              onSplit(self) {
                const targets = by === "chars" ? self.chars : self.lines;
                return gsap.from(targets, {
                  yPercent: 110,
                  rotate: by === "chars" ? 8 : 2,
                  duration: by === "chars" ? 1 : 1.2,
                  stagger: by === "chars" ? 0.018 : 0.09,
                  delay,
                  scrollTrigger: { trigger: ref.current, start, once: true },
                });
              },
            });
          },
          { rootMargin: "0px 0px 100% 0px" },
        );
        io.observe(ref.current!);
        return () => {
          io.disconnect();
          split?.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      {children}
    </Tag>
  );
}
