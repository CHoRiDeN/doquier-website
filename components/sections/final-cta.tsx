"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { MeshGradient } from "@/components/motion/mesh-gradient";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL, NAV_LINKS } from "@/lib/site";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-cta-fade]", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-cta-fade]", start: "top 90%", once: true },
        });

        // Dock footer: the footer is uncovered with a parallax scrub, its light rises and the wordmark lifts
        // out of the bottom edge as the page runs out.
        const footer = { trigger: "[data-footer]", start: "top bottom", end: "bottom bottom", scrub: 0.6 };
        gsap.from("[data-footer-inner]", { yPercent: -30, ease: "none", scrollTrigger: footer });
        gsap.fromTo("[data-footer-glow]", { scaleY: 0.3, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, ease: "none", scrollTrigger: footer });
        gsap.from("[data-wordmark]", { yPercent: 45, ease: "none", scrollTrigger: footer });
        gsap.from("[data-footer-col]", {
          y: 24,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          scrollTrigger: { trigger: "[data-footer]", start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <section
        id="start"
        aria-labelledby="start-heading"
        className="container-site relative isolate overflow-hidden rounded-[2rem] px-6 py-36 text-center sm:py-48"
      >
        <MeshGradient className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <SplitReveal
            by="chars"
            id="start-heading"
            className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance"
          >
            Tell us the goal. <span className="font-serif-accent text-accent-warm">We&apos;ll bring the plan.</span>
          </SplitReveal>
          <p data-cta-fade className="mt-8 max-w-lg text-pretty text-foreground/70">
            Book a 30-minute strategy call. We&apos;ll look at your brand, markets and objectives, then come back with a
            content plan and a proposal.
          </p>
          <div data-cta-fade className="mt-10 max-sm:w-full">
            <CtaLink href={FORM_URL} size="lg">
              Book a strategy call
            </CtaLink>
          </div>
        </div>
      </section>

      <footer data-footer className="relative isolate mt-16 overflow-hidden">
        {/* Soft champagne light rising off the bottom edge. */}
        <div
          data-footer-glow
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[85%] origin-bottom bg-[radial-gradient(55%_100%_at_50%_100%,rgb(195_184_168/0.2),transparent_72%)]"
        />
        <div data-footer-inner className="pt-16">
          <div className="container-site grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div data-footer-col>
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline brand SVG */}
              <img src="/brand/doquier-logo.svg" alt="Doquier" width={104} height={24} className="h-6 w-auto" />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground/55">
                Done-for-you AI content for European brands. Planned by strategists, produced at scale, published
                in-market.
              </p>
            </div>
            <nav data-footer-col aria-label="Footer">
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Explore</p>
              <ul className="mt-5 grid gap-3 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-foreground/65 transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div data-footer-col>
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Start</p>
              <p className="mt-5 max-w-[26ch] text-sm leading-relaxed text-foreground/65">
                Tell us your goal and we&apos;ll come back with a content plan.
              </p>
              <a
                href={FORM_URL}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-warm transition-colors hover:text-foreground"
              >
                Book a strategy call <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Oversized wordmark, painted with a gradient that fades into the glow. */}
          <div className="container-site mt-16 overflow-hidden sm:mt-20">
            <div
              data-wordmark
              aria-hidden
              className="aspect-[285/67] w-[min(100%,560px)] bg-[linear-gradient(180deg,rgb(238_236_229/0.72)_0%,rgb(238_236_229/0.28)_55%,rgb(238_236_229/0.04)_100%)] [mask:url(/brand/doquier-logo.svg)_center/contain_no-repeat]"
            />
          </div>

          <div className="container-site flex flex-col gap-2 border-t border-line py-8 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} Doquier</span>
            <span>Made in Europe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
