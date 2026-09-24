"use client";

import { useEffect, useRef, type ComponentProps } from "react";

/**
 * Muted looping video whose poster and source only download once it nears the viewport,
 * and which only plays while on screen. Keeps initial page weight and decoder count low.
 */
export function LazyVideo({
  src,
  poster,
  className,
  rootMargin = "300px",
  ...props
}: Omit<ComponentProps<"video">, "poster"> & { src: string; poster?: string; rootMargin?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (poster && !video.poster) video.poster = poster;
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
  }, [src, poster, rootMargin]);

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
