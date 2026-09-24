"use client";

import { useRef } from "react";
import { LazyVideo } from "@/components/motion/lazy-video";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { COMPARISON, COMPETITORS } from "@/lib/site";
import { cn } from "@/lib/utils";

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <svg
        viewBox="0 0 16 16"
        className={cn("size-4", highlight ? "text-accent-warm" : "text-foreground/70")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        role="img"
        aria-label="Yes"
      >
        <path d="M3 8.5l3.2 3L13 4.5" />
      </svg>
    ) : (
      <span className="text-foreground/30" role="img" aria-label="No">
        —
      </span>
    );
  }
  return <span>{value}</span>;
}

export function Compare() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Infinite marquee whose speed reacts to scroll velocity.
        const loop = gsap.to(q("[data-marquee]"), { xPercent: -50, duration: 60, ease: "none", repeat: -1 });
        const boost = { speed: 1 };
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          onUpdate(self) {
            const v = Math.min(Math.abs(self.getVelocity()) / 250, 6);
            gsap.to(boost, {
              speed: 1 + v,
              duration: 0.2,
              overwrite: true,
              onUpdate: () => {
                loop.timeScale(boost.speed);
              },
              onComplete: () => {
                gsap.to(boost, { speed: 1, duration: 1.2, onUpdate: () => loop.timeScale(boost.speed) });
              },
            });
          },
        });

        gsap.from(q("[data-doquier-card]"), {
          clipPath: "inset(30% 20% 30% 20% round 24px)",
          scale: 1.08,
          duration: 1.6,
          scrollTrigger: { trigger: q("[data-doquier-card]")[0], start: "top 85%", once: true },
        });

        gsap.from(q("[data-row]"), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.06,
          duration: 0.9,
          scrollTrigger: { trigger: q("table")[0], start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="compare-heading" className="overflow-hidden py-32 sm:py-44">
      <div className="mx-auto max-w-[90rem] px-6 sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <ScrambleLabel className="mb-6" index="05">
              Side by side
            </ScrambleLabel>
            <SplitReveal
              id="compare-heading"
              className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
            >
              Most AI UGC looks like AI. <span className="font-serif-accent text-accent-warm">Ours doesn&apos;t.</span>
            </SplitReveal>
          </div>
          <p className="max-w-sm text-pretty text-foreground/60">
            Put us next to the tools and see which one you&apos;d stop scrolling for. Realism is the whole game, so we
            obsess over it.
          </p>
        </div>
      </div>

      <div className="mt-16 flex items-center gap-6 pl-6 sm:gap-10 sm:pl-10 lg:pl-[max(2.5rem,calc((100vw-90rem)/2+2.5rem))]">
        <figure className="relative z-10 w-[44vw] max-w-[300px] shrink-0 sm:w-[260px]">
          <div
            data-doquier-card
            className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-muted shadow-[0_40px_120px_-30px_rgb(195_184_168/0.35)] ring-1 ring-accent-warm/60"
          >
            <LazyVideo
              src="/media/formats/talking-head-2.mp4"
              poster="/media/posters/talking-head-2.jpg"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="mt-4 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline brand SVG */}
            <img src="/brand/doquier-logo.svg" alt="Doquier" width={96} height={22} className="h-5 w-auto" />
          </figcaption>
        </figure>

        <span aria-hidden className="shrink-0 font-serif-accent text-3xl text-foreground/40 sm:text-4xl">
          vs
        </span>

        <div className="relative min-w-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div data-marquee className="flex w-max gap-4 sm:gap-5">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex gap-4 sm:gap-5">
                {COMPETITORS.map((c) => (
                  <li key={c.name} className="w-[30vw] max-w-[190px] shrink-0 sm:w-[170px]">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-muted opacity-80 ring-1 ring-line saturate-[0.85]">
                      <LazyVideo src={c.src} poster={c.poster} rootMargin="0px" className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-3 text-sm text-foreground/50">{c.name}</p>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-[90rem] px-6 sm:px-10">
        <h3 className="mb-10 max-w-xl text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.035em] text-balance">
          The speed of software. The feel of a real creator.
        </h3>
        <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">Doquier compared with creator-made UGC and self-serve AI tools</caption>
            <thead>
              <tr className="align-bottom">
                <th scope="col" className="w-[28%] pb-5 font-normal text-muted-foreground" />
                <th
                  scope="col"
                  className="rounded-t-2xl bg-accent-warm/[0.07] px-6 pt-6 pb-5 text-base font-semibold text-foreground"
                >
                  Doquier
                </th>
                <th scope="col" className="px-6 pb-5 font-medium text-foreground/70">
                  Creator UGC
                </th>
                <th scope="col" className="px-6 pb-5 font-medium text-foreground/70">
                  Self-serve AI tools
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {COMPETITORS.map((c) => c.name).join(", ")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.label} data-row className="border-t border-line">
                  <th scope="row" className="py-5 pr-6 font-normal text-foreground/60">
                    {row.label}
                  </th>
                  <td
                    className={cn(
                      "bg-accent-warm/[0.07] px-6 py-5 font-medium text-foreground",
                      i === COMPARISON.length - 1 && "rounded-b-2xl",
                    )}
                  >
                    <Cell value={row.doquier} highlight />
                  </td>
                  <td className="px-6 py-5 text-foreground/60">
                    <Cell value={row.creators} />
                  </td>
                  <td className="px-6 py-5 text-foreground/60">
                    <Cell value={row.tools} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
