"use client";

import { useRef, type ComponentProps } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type CtaLinkProps = ComponentProps<"a"> & {
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  magnetic?: boolean;
  arrow?: boolean;
};

/** Pill link with a curved fill, a rolling label and a magnetic pull on fine pointers. */
export function CtaLink({
  variant = "primary",
  size = "md",
  magnetic = true,
  arrow = true,
  className,
  children,
  ...props
}: CtaLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      if (!magnetic) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.finePointer}`, () => {
        const el = ref.current!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <a
      ref={ref}
      className={cn(
        "group/cta relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap outline-none transition-[color,border-color] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] focus-visible:ring-2 focus-visible:ring-accent-warm focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        size === "lg" ? "h-13 px-7 text-[15px]" : "h-10 px-5 text-sm",
        variant === "primary"
          ? "bg-foreground text-background"
          : "border border-foreground/15 text-foreground hover:border-transparent hover:text-background",
        className,
      )}
      {...props}
    >
      {/* Curve fill: an oversized ellipse rising from below the pill */}
      <span
        aria-hidden
        className={cn(
          "absolute top-full left-1/2 -z-10 aspect-square w-[160%] -translate-x-1/2 rounded-[50%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/cta:-translate-y-[62%]",
          variant === "primary" ? "bg-accent-warm" : "bg-foreground",
        )}
      />
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/cta:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/cta:translate-y-0"
        >
          {children}
        </span>
      </span>
      {arrow ? (
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/cta:translate-x-0.5 group-hover/cta:-rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
      ) : null}
    </a>
  );
}
