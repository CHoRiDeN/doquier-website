"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      anchors: { offset: -24 },
    });
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    // Exposed so overlays (the waitlist modal) can pause page scrolling.
    window.__lenis = lenis;
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
