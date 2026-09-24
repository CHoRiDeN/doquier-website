"use client";

import { useRef, useState } from "react";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { USE_CASES } from "@/lib/site";

/** Poster until clicked, then plays the full clip with sound and native controls. */
function PlayableVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <video className="h-full w-full object-cover" src={src} poster={poster} controls autoPlay playsInline />;
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group/play absolute inset-0 cursor-pointer"
      aria-label={`Play ${title} example with sound`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- poster is pre-optimised by scripts/encode-media.sh */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/play:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute bottom-5 left-5 flex items-center gap-3 text-sm font-medium text-white">
        <span className="flex size-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/play:scale-110 group-hover/play:bg-foreground group-hover/play:text-background">
          <svg viewBox="0 0 16 16" className="ml-0.5 size-4" fill="currentColor" aria-hidden>
            <path d="M4 2.5v11l9.5-5.5z" />
          </svg>
        </span>
        Play with sound
      </span>
    </button>
  );
}

export function UseCases() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q("[data-case-media]").forEach((el, i) => {
          gsap.from(el, {
            clipPath: "inset(100% 0% 0% 0% round 24px)",
            duration: 1.5,
            delay: i * 0.1,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="cases-heading" className="py-32 sm:py-44">
      <div className="container-site">
        <ScrambleLabel className="mb-6" index="06">
          Use cases
        </ScrambleLabel>
        <SplitReveal
          id="cases-heading"
          className="max-w-3xl text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
        >
          One studio for <span className="font-serif-accent text-accent-warm">every stage</span> of the funnel.
        </SplitReveal>

        {/* Bento focus: hovering one card quietly dims the others. */}
        <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-8 [@media(hover:hover)]:[&:has(li:hover)>li:not(:hover)]:opacity-45">
          {USE_CASES.map((item) => (
            <li key={item.title} className="transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
              <div
                data-case-media
                className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-muted ring-1 ring-line"
              >
                <PlayableVideo src={item.src} poster={item.poster} title={item.title} />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.035em]">{item.title}</h3>
              <p className="mt-2 max-w-[38ch] leading-relaxed text-pretty text-foreground/55">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
