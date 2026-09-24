"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

const HERO_VIDEOS = Array.from({ length: 18 }, (_, i) => `/media/hero/${i + 1}.mp4`);

const RADIAL_COUNT = 18;
const LIFETIME_MS = 9000;
const SPAWN_ATTEMPTS = 40;
const GAP_PX = 22;
/** Angles start at top (-π/2), spaced evenly. */
const ANGLE_OFFSET = -Math.PI / 2;

/** `behindCopy`: small screens have no free space around the copy, so clips drift behind it instead. */
type Layout = { spawnMs: number; maxLive: number; seed: number; wMin: number; wMax: number; behindCopy?: boolean };

function layoutFor(width: number): Layout {
  if (width < 640) return { spawnMs: 1500, maxLive: 6, seed: 4, wMin: 64, wMax: 92, behindCopy: true };
  if (width < 1024) return { spawnMs: 1400, maxLive: 7, seed: 5, wMin: 70, wMax: 100 };
  return { spawnMs: 1100, maxLive: 10, seed: 7, wMin: 86, wMax: 132 };
}

type Box = { x: number; y: number; w: number; h: number };

type SpawnedVideo = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  fromX: number;
  fromY: number;
  delayMs: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function overlaps(a: Box, b: Box) {
  return (
    a.x - a.w / 2 - GAP_PX < b.x + b.w / 2 &&
    a.x + a.w / 2 + GAP_PX > b.x - b.w / 2 &&
    a.y - a.h / 2 - GAP_PX < b.y + b.h / 2 &&
    a.y + a.h / 2 + GAP_PX > b.y - b.h / 2
  );
}

/** Center-based boxes of every element marked data-hero-exclude, relative to root. */
function exclusionBoxes(root: HTMLElement): Box[] {
  const origin = root.getBoundingClientRect();
  return [...(root.closest("section") ?? document).querySelectorAll<HTMLElement>("[data-hero-exclude]")].map((el) => {
    const r = el.getBoundingClientRect();
    return {
      x: r.left - origin.left + r.width / 2,
      y: r.top - origin.top + r.height / 2,
      w: r.width + 24,
      h: r.height + 24,
    };
  });
}

function tryPlace(
  root: HTMLElement,
  layout: Layout,
  live: readonly SpawnedVideo[],
  makeId: () => string,
  delayMs: number,
): SpawnedVideo | null {
  const w = root.clientWidth;
  const h = root.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  const blocked = [
    ...(layout.behindCopy ? [] : exclusionBoxes(root)),
    ...live.map((v) => ({ x: v.x, y: v.y, w: v.width, h: (v.width * 16) / 9 })),
  ];
  const usedSrc = new Set(live.map((v) => v.src));

  for (let attempt = 0; attempt < SPAWN_ATTEMPTS; attempt++) {
    const angle = ANGLE_OFFSET + (Math.floor(Math.random() * RADIAL_COUNT) / RADIAL_COUNT) * Math.PI * 2;
    const width = Math.round(rand(layout.wMin, layout.wMax));
    const height = (width * 16) / 9;
    const dist = rand(Math.min(w, h) * 0.18, Math.hypot(cx, cy));
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;

    const inside = x - width / 2 > 8 && x + width / 2 < w - 8 && y - height / 2 > 8 && y + height / 2 < h - 8;
    if (!inside) continue;
    const box = { x, y, w: width, h: height };
    if (blocked.some((b) => overlaps(box, b))) continue;

    const pool = HERO_VIDEOS.filter((src) => !usedSrc.has(src));
    return {
      id: makeId(),
      src: pool[Math.floor(Math.random() * pool.length)] ?? HERO_VIDEOS[0],
      x,
      y,
      width,
      // Start pulled toward the headline so each clip appears to fly out of it.
      fromX: (cx - x) * 0.45,
      fromY: (cy - y) * 0.45,
      delayMs,
    };
  }
  return null;
}

/** Short AI-UGC clips that bloom outward around the hero headline. */
export function HeroVideos() {
  const rootRef = useRef<HTMLDivElement>(null);
  const idBase = useId();
  const seq = useRef(0);
  const liveRef = useRef<SpawnedVideo[]>([]);
  const [items, setItems] = useState<SpawnedVideo[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const makeId = () => `${idBase}-${++seq.current}`;
    const commit = (next: SpawnedVideo[]) => {
      liveRef.current = next;
      setItems(next);
    };

    let layout = layoutFor(root.clientWidth);
    let timer = 0;
    let visible = true;

    const spawn = () => {
      if (!visible || document.hidden || liveRef.current.length >= layout.maxLive) return;
      const next = tryPlace(root, layout, liveRef.current, makeId, 0);
      if (next) commit([...liveRef.current, next]);
    };

    // Seed a few mid-animation so the hero never starts empty.
    const seeded: SpawnedVideo[] = [];
    for (let i = 0; i < layout.seed; i++) {
      const placed = tryPlace(root, layout, seeded, makeId, -Math.round(rand(0.2, 0.7) * LIFETIME_MS));
      if (placed) seeded.push(placed);
    }
    commit(seeded);

    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(spawn, layout.spawnMs);
    };
    start();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);

    const onResize = () => {
      const next = layoutFor(root.clientWidth);
      if (next.spawnMs !== layout.spawnMs) {
        layout = next;
        commit([]);
        start();
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearInterval(timer);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [idBase]);

  const remove = (id: string) => {
    const next = liveRef.current.filter((item) => item.id !== id);
    liveRef.current = next;
    setItems(next);
  };

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((item) => (
        <div
          key={item.id}
          className="hero-video absolute overflow-hidden rounded-[10px] bg-muted shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10"
          style={
            {
              left: item.x,
              top: item.y,
              width: item.width,
              aspectRatio: "9 / 16",
              animationDuration: `${LIFETIME_MS}ms`,
              animationDelay: `${item.delayMs}ms`,
              "--from-x": `${item.fromX}px`,
              "--from-y": `${item.fromY}px`,
            } as CSSProperties
          }
          onAnimationEnd={() => remove(item.id)}
        >
          <video className="h-full w-full object-cover" src={item.src} muted playsInline autoPlay loop preload="auto" />
        </div>
      ))}
    </div>
  );
}
