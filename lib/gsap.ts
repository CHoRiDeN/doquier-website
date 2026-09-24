"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin);

gsap.defaults({ ease: "expo.out", duration: 1.1 });

// Expose for debugging scroll positions in the browser console during development.
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  Object.assign(window, { gsap, ScrollTrigger });
}

/** Shared media queries for gsap.matchMedia(). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
