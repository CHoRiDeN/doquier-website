"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/**
 * Muted looping video that only downloads and plays while on screen.
 * Keeps the number of decoding videos small no matter how many are on the page.
 */
export function LazyVideo({
  src,
  className,
  rootMargin = "200px",
  ...props
}: ComponentProps<"video"> & { src: string; rootMargin?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          if (!reduced) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, rootMargin]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      {...props}
    />
  );
}
