"use client";

import { useEffect, useRef } from "react";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { LANGUAGES, METRICS } from "@/lib/site";

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇÊÑ";
const FLAP_CELLS = Math.max(...LANGUAGES.map((l) => l.length));

/** Split-flap board: each cell flips through random glyphs before landing on its letter. */
function SplitFlap() {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || window.matchMedia(MQ.reduced).matches) return;

    let index = 0;
    let inView = false;
    const tweens: gsap.core.Tween[] = [];
    const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting));
    io.observe(board);

    const flipTo = (next: string) => {
      const cells = [...board.querySelectorAll<HTMLElement>("[data-cell]")];
      cells.forEach((cell, i) => {
        const target = next[i] ?? " ";
        const flips = 3 + Math.floor(Math.random() * 4) + i;
        let count = 0;
        tweens.push(
          gsap.fromTo(
            cell,
            { rotateX: 0 },
            {
              rotateX: -90,
              duration: 0.07,
              ease: "power1.in",
              repeat: flips * 2 - 1,
              yoyo: true,
              delay: i * 0.035,
              onRepeat() {
                count++;
                if (count % 2 === 1) {
                  cell.textContent =
                    count >= flips * 2 - 1 ? target : FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
                }
              },
            },
          ),
        );
      });
    };

    const timer = window.setInterval(() => {
      if (!inView || document.hidden) return;
      index = (index + 1) % LANGUAGES.length;
      flipTo(LANGUAGES[index]);
    }, 2600);

    return () => {
      window.clearInterval(timer);
      io.disconnect();
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
      <p className="text-[clamp(1.25rem,2vw,1.625rem)] font-medium tracking-[-0.03em] text-foreground/70">Fluent in</p>
      <div ref={boardRef} aria-hidden className="flex gap-1 [perspective:400px]">
        {Array.from({ length: FLAP_CELLS }, (_, i) => (
          <span
            key={i}
            data-cell
            className="relative flex h-11 w-7 items-center justify-center rounded-[5px] bg-[#161617] font-mono text-lg font-medium text-foreground ring-1 ring-line after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/70 sm:h-14 sm:w-9 sm:text-2xl"
          >
            {LANGUAGES[0][i] ?? " "}
          </span>
        ))}
      </div>
      <span className="sr-only">{LANGUAGES.join(", ").toLowerCase()}</span>
    </div>
  );
}

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
        <ScrambleLabel className="mb-6" index="04">
          Results
        </ScrambleLabel>
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

        <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <SplitFlap />
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            &ldquo;Up to&rdquo; figures reflect the best-performing client campaigns to date. Results vary by account,
            offer and spend.
          </p>
        </div>
      </div>
    </section>
  );
}
