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
  "/videos/hero/13.mp4",
  "/videos/hero/14.mp4",
  "/videos/hero/15.mp4",
  "/videos/hero/16.mp4",
  "/videos/hero/17.mp4",
  "/videos/hero/18.mp4"
] as const;

const RADIAL_COUNT = 18;
const SPAWN_MS = 1000;
const MIN_RADIUS_PX = 450;
const WIDTH_MIN = 85;
const WIDTH_MAX = 130;
const GROW_MS = 9000;
const SPAWN_ATTEMPTS = 32;
const OVERLAP_MARGIN_PX = 25;
const INITIAL_COUNT = 7;
const SEED_DELAY_MIN = 0.15;
const SEED_DELAY_MAX = 0.85;
/** Angles start at top (-π/2), spaced evenly. */
const ANGLE_OFFSET = -Math.PI / 2;

type SpawnedVideo = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  animationDelayMs: number;
};

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function videoHeight(width: number) {
  return (width * 16) / 9;
}

function overlaps(a: Box, b: Box, margin = OVERLAP_MARGIN_PX) {
  const aL = a.x - a.w / 2 - margin;
  const aR = a.x + a.w / 2 + margin;
  const aT = a.y - a.h / 2 - margin;
  const aB = a.y + a.h / 2 + margin;
  const bL = b.x - b.w / 2;
  const bR = b.x + b.w / 2;
  const bT = b.y - b.h / 2;
  const bB = b.y + b.h / 2;
  return aL < bR && aR > bL && aT < bB && aB > bT;
}

function overlapsAny(candidate: Box, others: readonly SpawnedVideo[]) {
  return others.some((other) =>
    overlaps(candidate, {
      x: other.x,
      y: other.y,
      w: other.width,
      h: videoHeight(other.width),
    }),
  );
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

function tryPlaceVideo(
  w: number,
  h: number,
  live: readonly SpawnedVideo[],
  idBase: string,
  nextSeq: () => number,
  animationDelayMs: number,
): SpawnedVideo | null {
  const cx = w / 2;
  const cy = h / 2;

  for (let attempt = 0; attempt < SPAWN_ATTEMPTS; attempt++) {
    const radial = Math.floor(Math.random() * RADIAL_COUNT);
    const angle = ANGLE_OFFSET + (radial / RADIAL_COUNT) * Math.PI * 2;
    const width = Math.round(rand(WIDTH_MIN, WIDTH_MAX));
    const height = videoHeight(width);
    const halfDiag = Math.hypot(width / 2, height / 2);

    const edgeDist = rayEdgeDistance(cx, cy, angle, w, h);
    const maxDist = Math.max(MIN_RADIUS_PX, edgeDist - halfDiag);
    if (maxDist <= MIN_RADIUS_PX) continue;

    const dist = rand(MIN_RADIUS_PX, maxDist);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;

    if (overlapsAny({ x, y, w: width, h: height }, live)) continue;

    return {
      id: `${idBase}-${nextSeq()}`,
      src: pick(HERO_VIDEOS),
      x,
      y,
      width,
      animationDelayMs,
    };
  }

  return null;
}

export function HeroVideos() {
  const rootRef = useRef<HTMLDivElement>(null);
  const idBase = useId();
  const seqRef = useRef(0);
  const itemsRef = useRef<SpawnedVideo[]>([]);
  const [items, setItems] = useState<SpawnedVideo[]>([]);

  itemsRef.current = items;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMQ.matches) return;

    const nextSeq = () => {
      seqRef.current += 1;
      return seqRef.current;
    };

    const spawn = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      if (w < 1 || h < 1) return;

      const next = tryPlaceVideo(
        w,
        h,
        itemsRef.current,
        idBase,
        nextSeq,
        0,
      );
      if (!next) return;

      itemsRef.current = [...itemsRef.current, next];
      setItems(itemsRef.current);
    };

    const w = root.clientWidth;
    const h = root.clientHeight;
    if (w > 0 && h > 0) {
      const seeded: SpawnedVideo[] = [];
      for (let i = 0; i < INITIAL_COUNT; i++) {
        const delayMs = -Math.round(
          rand(SEED_DELAY_MIN, SEED_DELAY_MAX) * GROW_MS,
        );
        const placed = tryPlaceVideo(w, h, seeded, idBase, nextSeq, delayMs);
        if (!placed) break;
        seeded.push(placed);
      }
      itemsRef.current = seeded;
      setItems(seeded);
    }

    // First attempt immediately after seed; interval continues from there.
    spawn();
    const intervalId = window.setInterval(spawn, SPAWN_MS);

    const onReducedChange = () => {
      if (reducedMQ.matches) {
        window.clearInterval(intervalId);
        itemsRef.current = [];
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
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      itemsRef.current = next;
      return next;
    });
  };

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((item) => (
        <div
          key={item.id}
          className="hero-video-pop absolute overflow-hidden rounded-xl"
          style={{
            left: item.x,
            top: item.y,
            width: item.width,
            aspectRatio: "9 / 16",
            animationDuration: `${GROW_MS}ms`,
            animationDelay: `${item.animationDelayMs}ms`,
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
