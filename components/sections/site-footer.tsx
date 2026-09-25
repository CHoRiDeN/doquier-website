"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { FORM_URL, LEGAL, LEGAL_LINKS, NAV_LINKS } from "@/lib/site";

/**
 * Site footer. On the homepage its links are in-page anchors; elsewhere (`home={false}`) they point back
 * to the homepage, where `/#book-a-call` opens the strategy-call form.
 */
export function SiteFooter({ home = true }: { home?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const base = home ? "" : "/";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Dock footer: the footer is uncovered with a parallax scrub, its light rises and the wordmark lifts
        // out of the bottom edge as the page runs out.
        const footer = { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 };
        gsap.from("[data-footer-inner]", { yPercent: -30, ease: "none", scrollTrigger: footer });
        gsap.fromTo(
          "[data-footer-glow]",
          { scaleY: 0.3, autoAlpha: 0 },
          { scaleY: 1, autoAlpha: 1, ease: "none", scrollTrigger: footer },
        );
        gsap.from("[data-wordmark]", { yPercent: 45, ease: "none", scrollTrigger: footer });
        gsap.from("[data-footer-col]", {
          y: 24,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  const heading = "font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase";
  const link = "text-foreground/65 transition-colors hover:text-foreground";

  return (
    <footer ref={ref} className="relative isolate mt-16 overflow-hidden">
      {/* Soft champagne light rising off the bottom edge. */}
      <div
        data-footer-glow
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[85%] origin-bottom bg-[radial-gradient(55%_100%_at_50%_100%,rgb(195_184_168/0.2),transparent_72%)]"
      />
      <div data-footer-inner className="pt-16">
        <div className="container-site grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div data-footer-col>
            <a href={home ? "#top" : "/"} aria-label="Doquier home" className="inline-block rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline brand SVG */}
              <img src="/brand/doquier-logo.svg" alt="Doquier" width={104} height={24} className="h-6 w-auto" />
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground/55">
              Done-for-you AI content for European brands. Planned by strategists, produced at scale, published
              in-market.
            </p>
          </div>
          <nav data-footer-col aria-label="Footer">
            <p className={heading}>Explore</p>
            <ul className="mt-5 grid gap-3 text-sm">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a href={`${base}${item.href}`} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/compare" className={link}>
                  Compare
                </Link>
              </li>
            </ul>
          </nav>
          <nav data-footer-col aria-label="Legal">
            <p className={heading}>Legal</p>
            <ul className="mt-5 grid gap-3 text-sm">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div data-footer-col>
            <p className={heading}>Start</p>
            <p className="mt-5 max-w-[26ch] text-sm leading-relaxed text-foreground/65">
              Tell us your goal and we&apos;ll come back with a content plan.
            </p>
            <a
              href={`${base}${FORM_URL}`}
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
          <span>
            © {new Date().getFullYear()} {LEGAL.company}. Doquier is a trading name of {LEGAL.company}.
          </span>
          <span>Made in Europe</span>
        </div>
      </div>
    </footer>
  );
}
