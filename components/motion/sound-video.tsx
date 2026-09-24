"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "preview" | "playing" | "paused";

/**
 * Plays a muted preview loop while on screen. Clicking restarts it with sound;
 * further clicks pause and resume. Leaving the viewport pauses sound playback.
 */
export function SoundVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("preview");
  // Mirrors `mode` for the IntersectionObserver callback, which outlives renders.
  const modeRef = useRef<Mode>("preview");
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (poster && !video.poster) video.poster = poster;
          if (!video.src) video.src = src;
          if (modeRef.current === "preview" && !reduced) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
          if (modeRef.current === "playing") setMode("paused");
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, poster]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (!video.src) video.src = src;

    if (mode === "preview") {
      video.muted = false;
      video.loop = false;
      video.currentTime = 0;
      video.play().catch(() => {});
      setMode("playing");
    } else if (mode === "playing") {
      video.pause();
      setMode("paused");
    } else {
      video.play().catch(() => {});
      setMode("playing");
    }
  };

  const onEnded = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.currentTime = 0;
    video.play().catch(() => {});
    setMode("preview");
  };

  const playing = mode === "playing";

  return (
    <div className={cn("group/sound relative h-full w-full", className)}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        onEnded={onEnded}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className="absolute inset-0 flex cursor-pointer items-end justify-start bg-gradient-to-t from-black/55 via-transparent to-transparent p-4 transition-opacity duration-500 focus-visible:outline-offset-[-3px]"
      >
        <span
          className={cn(
            "flex items-center gap-2.5 rounded-full bg-black/35 py-1.5 pr-3.5 pl-1.5 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-md transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/sound:scale-105",
            playing && "opacity-0 group-hover/sound:opacity-100 group-focus-within/sound:opacity-100",
          )}
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
            {playing ? (
              <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
                <path d="M4 3h3v10H4zM9 3h3v10H9z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="ml-0.5 size-3.5" fill="currentColor" aria-hidden>
                <path d="M4 2.5v11l9.5-5.5z" />
              </svg>
            )}
          </span>
          {mode === "preview" ? "Play with sound" : playing ? "Pause" : "Resume"}
          <span className="sr-only">: {label}</span>
        </span>
      </button>
    </div>
  );
}
