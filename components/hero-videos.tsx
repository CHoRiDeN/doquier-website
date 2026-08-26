"use client";

import { useEffect, useId, useRef, useState } from "react";

const HERO_VIDEOS = [
  "/videos/hero/1.mp4",
  "/videos/hero/2.mp4",
  "/videos/hero/3.mp4",
  "/videos/hero/4.mp4",
  "/videos/hero/5.mp4",
  "/videos/hero/6.mp4",
  "/videos/hero/7.mp4",
  "/videos/hero/8.mp4",
  "/videos/hero/9.mp4",
  "/videos/hero/10.mp4",
  "/videos/hero/11.mp4",
  "/videos/hero/12.mp4",
] as const;

const RADIAL_COUNT = 16;
const SPAWN_MS = 500;
const MIN_RADIUS_PX = 450;
const WIDTH_MIN = 90;
const WIDTH_MAX = 150;
const GROW_MS = 9000;
/** Angles start at top (-π/2), spaced evenly. */
const ANGLE_OFFSET = -Math.PI / 2;

type SpawnedVideo = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

/** Distance from center along angle to the section edge. */
function rayEdgeDistance(
  cx: number,
  cy: number,
  angle: number,
  w: number,
  h: number,
) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let tMax = Infinity;

  if (dx > 1e-6) tMax = Math.min(tMax, (w - cx) / dx);
  else if (dx < -1e-6) tMax = Math.min(tMax, -cx / dx);

  if (dy > 1e-6) tMax = Math.min(tMax, (h - cy) / dy);
  else if (dy < -1e-6) tMax = Math.min(tMax, -cy / dy);

  return Number.isFinite(tMax) && tMax > 0 ? tMax : 0;
}

export function HeroVideos() {
  const rootRef = useRef<HTMLDivElement>(null);
  const idBase = useId();
  const seqRef = useRef(0);
  const [items, setItems] = useState<SpawnedVideo[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMQ.matches) return;

    const spawn = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      if (w < 1 || h < 1) return;

      const cx = w / 2;
      const cy = h / 2;
      const radial = Math.floor(Math.random() * RADIAL_COUNT);
      const angle = ANGLE_OFFSET + (radial / RADIAL_COUNT) * Math.PI * 2;
      const width = Math.round(rand(WIDTH_MIN, WIDTH_MAX));
      const height = (width * 16) / 9;
      const halfDiag = Math.hypot(width / 2, height / 2);

      const edgeDist = rayEdgeDistance(cx, cy, angle, w, h);
      const maxDist = Math.max(MIN_RADIUS_PX, edgeDist - halfDiag);
      if (maxDist <= MIN_RADIUS_PX) return;

      const dist = rand(MIN_RADIUS_PX, maxDist);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      seqRef.current += 1;
      const id = `${idBase}-${seqRef.current}`;

      setItems((prev) => [
        ...prev,
        {
          id,
          src: pick(HERO_VIDEOS),
          x,
          y,
          width,
        },
      ]);
    };

    spawn();
    const intervalId = window.setInterval(spawn, SPAWN_MS);

    const onReducedChange = () => {
      if (reducedMQ.matches) {
        window.clearInterval(intervalId);
        setItems([]);
      }
    };
    reducedMQ.addEventListener("change", onReducedChange);

    return () => {
      window.clearInterval(intervalId);
      reducedMQ.removeEventListener("change", onReducedChange);
    };
  }, [idBase]);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((item) => (
        <div
          key={item.id}
          className="hero-video-pop absolute overflow-hidden rounded-lg"
          style={{
            left: item.x,
            top: item.y,
            width: item.width,
            aspectRatio: "9 / 16",
            animationDuration: `${GROW_MS}ms`,
          }}
          onAnimationEnd={() => removeItem(item.id)}
        >
          <video
            className="h-full w-full object-cover"
            src={item.src}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
          />
        </div>
      ))}
    </div>
  );
}
