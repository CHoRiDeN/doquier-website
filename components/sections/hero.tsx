"use client";

import { useRef } from "react";
import { HeroVideos } from "@/components/hero-videos";
import { CtaLink } from "@/components/motion/cta-link";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { CLIENTS, FORM_URL } from "@/lib/site";

const delay = (s: number) => ({ animationDelay: `${s}s` });

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Scroll-out parallax: copy drifts up and fades while the video field zooms past.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        tl.to("[data-hero-copy]", { yPercent: -18, autoAlpha: 0 }, 0)
          .to("[data-hero-field]", { scale: 1.25, autoAlpha: 0.2 }, 0)
          .to("[data-hero-clients]", { autoAlpha: 0, y: -40 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate flex h-svh min-h-[680px] flex-col overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_42%,rgb(195_184_168/0.10),transparent_70%),radial-gradient(120%_80%_at_50%_120%,#000,transparent_60%)]"
      />
      <div data-hero-field className="absolute inset-0 -z-10 max-sm:opacity-35">
        <HeroVideos />
      </div>

      <div data-hero-copy className="flex flex-1 flex-col items-center justify-center px-6 pt-20 text-center">
        <div data-hero-exclude className="flex max-w-3xl flex-col items-center">
          <p
            className="hero-fade mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-background/40 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70 backdrop-blur-md"
            style={delay(0.1)}
          >
            <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent-warm" />
            AI UGC studio for performance brands
          </p>

          <h1
            id="hero-heading"
            className="font-heading text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance"
          >
            <span className="hero-line">
              <span style={delay(0.2)}>
                UGC that looks <span className="font-serif-accent pr-[0.04em] text-accent-warm">real.</span>
              </span>
            </span>
            <span className="hero-line">
              <span style={delay(0.3)}>Made on autopilot.</span>
            </span>
          </h1>

          <p
            className="hero-fade mt-7 max-w-xl text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-pretty text-foreground/65"
            style={delay(0.5)}
          >
            Doquier scripts, produces and delivers creator-style video ads with AI. Every format your media buyers need, in
            every language.
          </p>

          <div className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-3" style={delay(0.65)}>
            <CtaLink href={FORM_URL} size="lg">
              Start your project
            </CtaLink>
            <CtaLink href="#formats" size="lg" variant="ghost" arrow={false}>
              See the work
            </CtaLink>
          </div>
        </div>
      </div>

      <div
        data-hero-clients
        className="hero-fade container-site mb-8 flex flex-col items-center gap-4 sm:mb-10"
        style={delay(0.9)}
      >
        <p data-hero-exclude className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by growth teams at
        </p>
        <ul data-hero-exclude className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:gap-x-12">
          {CLIENTS.map((client) => (
            <li
              key={client}
              className="text-[15px] font-semibold tracking-[-0.02em] text-foreground/45 transition-colors duration-500 hover:text-foreground sm:text-lg"
            >
              {client}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
