"use client";

import { useEffect, useRef } from "react";
import { MQ, gsap } from "@/lib/gsap";
import { LANGUAGES } from "@/lib/site";

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇÊÑ";
const FLAP_CELLS = Math.max(...LANGUAGES.map((l) => l.length));

/** Split-flap board: each cell flips through random glyphs before landing on its letter. */
export function SplitFlap() {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || window.matchMedia(MQ.reduced).matches) return;

    let index = 0;
    let inView = false;
    const tweens: gsap.core.Tween[] = [];
    const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting));
    io.observe(board);

    const flipTo = (next: string) => {
      const cells = [...board.querySelectorAll<HTMLElement>("[data-cell]")];
      cells.forEach((cell, i) => {
        const target = next[i] ?? " ";
        const flips = 3 + Math.floor(Math.random() * 4) + i;
        let count = 0;
        tweens.push(
          gsap.fromTo(
            cell,
            { rotateX: 0 },
            {
              rotateX: -90,
              duration: 0.07,
              ease: "power1.in",
              repeat: flips * 2 - 1,
              yoyo: true,
              delay: i * 0.035,
              onRepeat() {
                count++;
                if (count % 2 === 1) {
                  cell.textContent =
                    count >= flips * 2 - 1 ? target : FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];
                }
              },
            },
          ),
        );
      });
    };

    const timer = window.setInterval(() => {
      if (!inView || document.hidden) return;
      index = (index + 1) % LANGUAGES.length;
      flipTo(LANGUAGES[index]);
    }, 2600);

    return () => {
      window.clearInterval(timer);
      io.disconnect();
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
      <p className="text-[clamp(1.25rem,2vw,1.625rem)] font-medium tracking-[-0.03em] text-foreground/70">Fluent in</p>
      <div ref={boardRef} aria-hidden className="flex gap-1 [perspective:400px]">
        {Array.from({ length: FLAP_CELLS }, (_, i) => (
          <span
            key={i}
            data-cell
            className="relative flex h-11 w-7 items-center justify-center rounded-[5px] bg-[#161617] font-mono text-lg font-medium text-foreground ring-1 ring-line after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/70 sm:h-14 sm:w-9 sm:text-2xl"
          >
            {LANGUAGES[0][i] ?? " "}
          </span>
        ))}
      </div>
      <span className="sr-only">{LANGUAGES.join(", ").toLowerCase()}</span>
    </div>
  );
}
