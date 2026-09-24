"use client";

import Image from "next/image";
import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { LazyVideo } from "@/components/motion/lazy-video";
import { ScrambleLabel } from "@/components/motion/scramble-label";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORMATS, FORM_URL } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

/** Pinned horizontal rail on desktop (Feature/Lens Rail), native swipe rail on touch. */
export function Formats() {
  const ref = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.from(q("[data-card]"), {
          y: 80,
          autoAlpha: 0,
          duration: 1.4,
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-track]")[0], start: "top 85%", once: true },
        });
      });

      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;
        // Scroll length per pixel of travel: >1 gives each card more dwell time before the section unpins.
        const SCROLL_PER_PX = 1.5;
        const cards = q("[data-card]");

        const rail = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            pin: true,
            pinSpacing: true,
            start: "top top",
            end: () => `+=${distance() * SCROLL_PER_PX}`,
            // No scrub lag: the rail must finish exactly as the section unpins (Lenis already smooths input).
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              gsap.set(q("[data-progress]"), { scaleX: self.progress });
              const index = Math.min(FORMATS.length, Math.floor(self.progress * FORMATS.length) + 1);
              if (counterRef.current) counterRef.current.textContent = pad(index);
            },
          },
        });

        // Lens parallax: media drifts inside its frame as each card crosses the viewport.
        cards.forEach((card) => {
          const media = card.querySelector("[data-media]");
          if (!media) return;
          gsap.fromTo(
            media,
            { xPercent: -7, scale: 1.14 },
            {
              xPercent: 7,
              scale: 1.14,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: rail, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="formats"
      ref={ref}
      aria-labelledby="formats-heading"
      className="relative flex flex-col justify-center overflow-hidden py-24 lg:h-svh lg:py-0"
    >
      <div className="container-site mb-12 flex flex-col gap-8 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="">
          <ScrambleLabel className="mb-6" index="02">
            Formats
          </ScrambleLabel>
          <SplitReveal
            id="formats-heading"
            className="text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em]"
          >
            Every format. <span className="font-serif-accent text-accent-warm">One studio.</span>
          </SplitReveal>
       
        </div>

        <div aria-hidden className="hidden w-64 items-center gap-4 font-mono text-xs text-muted-foreground lg:flex">
          <span className="tabular-nums text-foreground">
            <span ref={counterRef}>01</span>
          </span>
          <span className="relative h-px flex-1 bg-line">
            <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-accent-warm" />
          </span>
          <span className="tabular-nums">{pad(FORMATS.length)}</span>
        </div>
      </div>

      <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        <ul
          data-track
          className="flex w-max snap-x snap-mandatory gap-4 px-6 sm:gap-6 sm:px-10 lg:snap-none lg:gap-8 lg:px-[max(2.5rem,calc((100%-1200px)/2))]"
        >
          {FORMATS.map((format, i) => (
            <li key={format.name} data-card className="w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
              <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-muted ring-1 ring-line lg:h-[min(58svh,640px)]">
                <div data-media className="absolute inset-0">
                  {format.media.type === "video" ? (
                    <LazyVideo
                      src={format.media.src}
                      poster={format.media.poster}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={format.media.src}
                      alt={`${format.name} example`}
                      fill
                      sizes="(min-width: 1024px) 330px, 68vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white/80 backdrop-blur-md">
                  {pad(i + 1)}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{format.name}</h3>
              <p className="mt-1.5 max-w-[30ch] text-sm leading-relaxed text-pretty text-foreground/55">
                {format.description}
              </p>
            </li>
          ))}

          <li data-card className="flex w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-[min(32.6svh,360px)]">
            <div className="flex aspect-[9/16] w-full flex-col justify-between rounded-2xl border border-dashed border-foreground/15 p-6 lg:h-[min(58svh,640px)]">
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">+</span>
              <div>
                <p className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-balance">
                  Need a format that isn&apos;t here?
                </p>
                <p className="mt-3 text-sm text-foreground/55">We&apos;ll build it around your funnel.</p>
                <CtaLink href={FORM_URL} className="mt-6">
                  Talk to us
                </CtaLink>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
