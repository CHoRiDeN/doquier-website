"use client";

import { useRef } from "react";
import { CtaLink } from "@/components/motion/cta-link";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FORM_URL, NAV_LINKS } from "@/lib/site";

/**
 * Floating nav that condenses into a pill once scrolled and hides while scrolling down. Outside the
 * homepage (`home={false}`) its links point back to the homepage sections.
 */
export function SiteNav({ home = true }: { home?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const base = home ? "" : "/";

  useGSAP(() => {
    const nav = ref.current!;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const y = self.scroll();
        nav.dataset.scrolled = String(y > 40);
        nav.dataset.hidden = String(y > 480 && self.direction === 1);
      },
    });
  });

  return (
    <header
      ref={ref}
      data-scrolled="false"
      data-hidden="false"
      className="group/nav fixed inset-x-0 top-0 z-50 flex justify-center pt-4 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] data-[hidden=true]:-translate-y-[130%] sm:pt-5"
    >
      <nav
        aria-label="Main"
        className="hero-fade container-site flex items-center justify-between gap-6 rounded-full border border-transparent py-2 transition-[max-width,padding,background-color,border-color,box-shadow] group-data-[scrolled=true]/nav:pr-2 group-data-[scrolled=true]/nav:pl-5 duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-data-[scrolled=true]/nav:max-w-3xl group-data-[scrolled=true]/nav:border-line group-data-[scrolled=true]/nav:bg-[#111112]/75 group-data-[scrolled=true]/nav:shadow-[0_10px_40px_-12px_rgb(0_0_0/0.6)] group-data-[scrolled=true]/nav:backdrop-blur-xl"
      >
        <a href={home ? "#top" : "/"} aria-label={home ? "Doquier, back to top" : "Doquier home"} className="shrink-0 rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny inline brand SVG */}
          <img src="/brand/doquier-logo.svg" alt="Doquier" width={104} height={24} className="h-6 w-auto" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={`${base}${link.href}`}
                className="relative rounded-full px-3.5 py-2 text-sm text-foreground/65 transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <CtaLink href={`${base}${FORM_URL}`} arrow={false} fullWidthMobile={false} className="h-9 px-4 text-[13px]">
          Book a call
        </CtaLink>
      </nav>
    </header>
  );
}
