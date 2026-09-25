"use client";

import { useEffect, useRef } from "react";
import { Flag, type FlagCode } from "@/components/flag";
import { gsap, MQ } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Market = { id: string; code: FlagCode; name: string; location: [number, number]; label?: "top" | "bottom" };

/** Markets drawn on the globe. Arcs fan out from the first one; `label` places its name above or below. */
const MARKETS: Market[] = [
  { id: "es", code: "ES", name: "Spain", location: [40.4168, -3.7038], label: "bottom" },
  { id: "fr", code: "FR", name: "France", location: [48.8566, 2.3522] },
  { id: "de", code: "DE", name: "Germany", location: [52.52, 13.405], label: "top" },
  { id: "nl", code: "NL", name: "Netherlands", location: [52.3676, 4.9041] },
  { id: "it", code: "IT", name: "Italy", location: [41.9028, 12.4964] },
  { id: "us", code: "US", name: "United States", location: [40.7128, -74.006], label: "top" },
  { id: "mx", code: "MX", name: "Mexico", location: [19.4326, -99.1332], label: "bottom" },
  { id: "co", code: "CO", name: "Colombia", location: [4.711, -74.0721], label: "bottom" },
  { id: "ar", code: "AR", name: "Argentina", location: [-34.6037, -58.3816], label: "bottom" },
];
const EXTRA_MARKERS: [number, number][] = [
  [51.5072, -0.1276], // London
  [38.7223, -9.1393], // Lisbon
  [52.2297, 21.0122], // Warsaw
  [50.8503, 4.3517], // Brussels
  [48.2082, 16.3738], // Vienna
];

const ACCENT: [number, number, number] = [195 / 255, 184 / 255, 168 / 255];
const deg = (d: number) => (d * Math.PI) / 180;
// Longitude/latitude the globe faces at rest: the mid-Atlantic, so Europe and the Americas share the frame.
const HOME_PHI = Math.PI - (deg(-38) - Math.PI / 2);
const HOME_THETA = deg(16);

/**
 * Dotted WebGL globe (cobe) facing the Atlantic, with markers on each market and arcs that fan out as the
 * section enters. It sways gently, can be dragged, and only renders while on screen.
 */
export function Globe({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia(MQ.reduced).matches;
    let globe: { update: (s: Record<string, unknown>) => void; destroy: () => void } | null = null;
    let visible = false;
    let started = false;
    let disposed = false;
    const state = { sway: 0, drag: 0, dragVelocity: 0, arcs: 0 };
    let pointerX: number | null = null;

    const size = () => {
      const width = wrap.offsetWidth;
      return { width: width * Math.min(2, window.devicePixelRatio), height: width * Math.min(2, window.devicePixelRatio) };
    };

    const arcsFor = (count: number) =>
      MARKETS.slice(1, 1 + count).map((m) => ({ from: MARKETS[0].location, to: m.location, id: `es-${m.id}` }));

    const tick = (time: number) => {
      if (!globe || !visible) return;
      if (pointerX === null) {
        state.drag += state.dragVelocity;
        state.dragVelocity *= 0.94;
        // Ease any drag back to the resting view so the story stays on screen.
        state.drag *= 0.985;
      }
      const sway = reduced ? 0 : Math.sin(time * 0.35) * 0.18;
      globe.update({ phi: HOME_PHI + sway + state.drag, arcs: arcsFor(Math.round(state.arcs)) });
    };

    const start = async () => {
      if (started) return;
      started = true;
      const { default: createGlobe } = await import("cobe");
      if (disposed) return;
      globe = createGlobe(canvas, {
        ...size(),
        devicePixelRatio: Math.min(2, window.devicePixelRatio),
        phi: HOME_PHI,
        theta: HOME_THETA,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 20000,
        mapBrightness: 5,
        mapBaseBrightness: 0.02,
        baseColor: [0.22, 0.22, 0.22],
        markerColor: ACCENT,
        glowColor: [0.16, 0.15, 0.13],
        markers: [
          ...MARKETS.map((m) => ({ location: m.location, size: 0.035, id: m.id })),
          ...EXTRA_MARKERS.map((location) => ({ location, size: 0.018 })),
        ],
        arcs: [],
        arcColor: ACCENT,
        arcWidth: 0.8,
        arcHeight: 0.2,
        markerElevation: 0.01,
        scale: 1.02,
        opacity: 0.95,
      }) as typeof globe;
      gsap.fromTo(canvas, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 1.6, ease: "expo.out" });
      // Arcs fan out one by one once the globe is up.
      gsap.to(state, { arcs: MARKETS.length - 1, duration: reduced ? 0 : 2.4, delay: reduced ? 0 : 0.6, ease: "none" });
      gsap.ticker.add(tick);
      tick(gsap.ticker.time);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { rootMargin: "200px" },
    );
    io.observe(wrap);

    const onResize = () => globe?.update(size());
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    const onDown = (e: PointerEvent) => {
      pointerX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (pointerX === null) return;
      const delta = (e.clientX - pointerX) / 180;
      pointerX = e.clientX;
      state.drag += delta;
      state.dragVelocity = delta;
    };
    const onUp = () => (pointerX = null);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      gsap.ticker.remove(tick);
      gsap.killTweensOf(state);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      globe?.destroy();
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative aspect-square w-full", className)}>
      {/* The globe is zoomed past the canvas edge; this fades the crop into the page. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="invisible size-full cursor-grab touch-pan-y [mask-image:radial-gradient(circle_at_center,#000_60%,transparent_75%)] active:cursor-grabbing"
      />
      {/* Market labels follow their markers via CSS anchor positioning where supported. */}
      {MARKETS.filter((m) => m.label).map((m) => (
        <span
          key={m.id}
          aria-hidden
          data-side={m.label}
          className="globe-label pointer-events-none absolute flex max-sm:hidden items-center gap-1.5 rounded-full bg-background/70 py-1 pr-2.5 pl-1.5 text-[11px] text-foreground/85 ring-1 ring-line backdrop-blur-md"
          style={
            {
              positionAnchor: `--cobe-${m.id}`,
              "--visible": `var(--cobe-visible-${m.id}, 0)`,
            } as React.CSSProperties
          }
        >
          <Flag code={m.code} label="" className="h-2.5" />
          {m.name}
        </span>
      ))}
      <p className="sr-only">Markets: {MARKETS.map((m) => m.name).join(", ")}, and more on request.</p>
    </div>
  );
}
