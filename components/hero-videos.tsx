"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  type RefObject,
  useCallback,
  useRef,
} from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const EXIT_Z = 700;
const PLATEAU_Z_START = -100
const PLATEAU_Z_END = 100;
const HOLE_X_MAX = 0.55;
const HOLE_Y_MAX = 0.48;
const HOLE_SOFT_EDGE = 60;
const VELOCITY_LERP = 0.06;
const VELOCITY_DIVISOR = 60;
const PAN_LERP_DUR = 1.2;
const PAN_Y_RATIO = 0.8;
const PERSPECTIVE_PX = 1200;
const SPAWN_ATTEMPTS = 48;
const COLLISION_MARGIN = 1;
/** Min |xFrac| so cards stay in left/right gutters, not under copy. */
const GUTTER_X_MIN = 0.24;
const SECTOR_COUNT = 12;
/** Lane frees once a card is this faint — lets denser respawns without stacking. */
const LANE_FREE_OPACITY = 0.8;

const SIZE_CLASSES = [
  "w-[clamp(64px,5.5vw,96px)]",
  "w-[clamp(80px,7vw,120px)]",
  "w-[clamp(100px,8.5vw,140px)]",
  "w-[clamp(70px,6vw,105px)]",
  "w-[clamp(88px,7.5vw,128px)]",
] as const;

/** Scale at EXIT_Z — counters perspective blow-up near the camera. */
const EXIT_SCALE = 0.4;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

type CardState = {
  xFrac: number;
  yFrac: number;
  progress: number;
  /** True when waiting for a free lane — held invisible at spawn depth. */
  parked: boolean;
  sector: number;
};

type HeroVideosProps = {
  sources: string[];
  contentRef: RefObject<HTMLElement | null>;
  /** Section used for cursor pan + viewport size (must receive pointer events). */
  panTargetRef: RefObject<HTMLElement | null>;
  duration?: number;
  depth?: number;
  speed?: number;
  scrollBoost?: number;
  pan?: number;
  holeBuffer?: number;
};

export function HeroVideos({
  sources,
  contentRef,
  panTargetRef,
  duration = 10,
  depth = 2000,
  speed = 0.7,
  scrollBoost = 3.5,
  pan = 40,
  holeBuffer = 100,
}: HeroVideosProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  cardRefs.current = [];

  const addCardRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      const panTarget = panTargetRef.current;
      const content = contentRef.current;
      const cards = cardRefs.current;

      if (!root || !stage || !cards.length) return;

      const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const reduced = reducedMQ.matches;

      const sizeEl = panTarget ?? root;
      let viewportW = sizeEl.clientWidth || window.innerWidth;
      let viewportH = sizeEl.clientHeight || window.innerHeight;
      let velocityMultiplier = 1;
      let lastScrollY = window.scrollY || window.pageYOffset || 0;
      let running = false;

      const cardStates: CardState[] = [];
      const setters: {
        x: (v: number) => void;
        y: (v: number) => void;
        z: (v: number) => void;
        scale: (v: number) => void;
        opacity: (v: number) => void;
      }[] = [];

      let holeXHalfPx = 0;
      let holeYHalfPx = 0;
      const cardHalfW: number[] = [];
      const cardHalfH: number[] = [];

      function measureHole() {
        holeXHalfPx = 0;
        holeYHalfPx = 0;
        if (!content) return;
        const rect = content.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        holeXHalfPx = Math.min(
          rect.width / 2 + holeBuffer,
          viewportW * HOLE_X_MAX,
        );
        holeYHalfPx = Math.min(
          rect.height / 2 + holeBuffer,
          viewportH * HOLE_Y_MAX,
        );
      }

      function measureCards() {
        cards.forEach((card, i) => {
          cardHalfW[i] = card.offsetWidth / 2;
          cardHalfH[i] = card.offsetHeight / 2;
        });
      }

      function opacityForZ(z: number) {
        if (z <= -depth) return 0;
        if (z < PLATEAU_Z_START) {
          const t = (z + depth) / (PLATEAU_Z_START + depth);
          return smoothstep(clamp01(t));
        }
        if (z <= PLATEAU_Z_END) return 1;
        if (z < EXIT_Z) {
          const t = (z - PLATEAU_Z_END) / (EXIT_Z - PLATEAU_Z_END);
          return 1 - smoothstep(clamp01(t));
        }
        return 0;
      }

      /** Shrink on exit so perspective doesn't make near cards huge. */
      function scaleForZ(z: number) {
        if (z <= PLATEAU_Z_END) return 1;
        if (z >= EXIT_Z) return EXIT_SCALE;
        const t = (z - PLATEAU_Z_END) / (EXIT_Z - PLATEAU_Z_END);
        return 1 - smoothstep(clamp01(t)) * (1 - EXIT_SCALE);
      }

      function inContentHole(
        xFrac: number,
        yFrac: number,
        halfW: number,
        halfH: number,
      ) {
        return (
          Math.abs(xFrac) * viewportW < holeXHalfPx + halfW &&
          Math.abs(yFrac) * viewportH < holeYHalfPx + halfH
        );
      }

      /** Circular lane collision — only blocks lanes that are still clearly visible. */
      function overlapsOthers(
        selfIndex: number,
        xFrac: number,
        yFrac: number,
        halfW: number,
        halfH: number,
      ) {
        const selfR = Math.hypot(halfW, halfH) * COLLISION_MARGIN;
        const totalTravel = EXIT_Z - -depth;

        for (let j = 0; j < cardStates.length; j++) {
          if (j === selfIndex) continue;
          const other = cardStates[j];
          if (!other || other.parked) continue;

          const otherZ = -depth + other.progress * totalTravel;
          if (opacityForZ(otherZ) < LANE_FREE_OPACITY) continue;

          const oHalfW = cardHalfW[j] || halfW;
          const oHalfH = cardHalfH[j] || halfH;
          const otherR = Math.hypot(oHalfW, oHalfH) * COLLISION_MARGIN;

          const dx = (xFrac - other.xFrac) * viewportW;
          const dy = (yFrac - other.yFrac) * viewportH;
          if (Math.hypot(dx, dy) < selfR + otherR) return true;
        }
        return false;
      }

      function sampleInSector(
        sector: number,
        halfW: number,
        halfH: number,
      ): { xFrac: number; yFrac: number } | null {
        const sectorAngle = (2 * Math.PI * sector) / SECTOR_COUNT;
        const angle = sectorAngle + (Math.random() - 0.5) * ((2 * Math.PI) / SECTOR_COUNT) * 0.7;

        const minRx = (holeXHalfPx + halfW) / Math.max(viewportW, 1);
        const minRy = (holeYHalfPx + halfH) / Math.max(viewportH, 1);
        const minR = Math.min(0.46, Math.max(minRx, minRy, GUTTER_X_MIN));
        const maxR = 0.48;
        const r = minR + Math.random() * Math.max(0.02, maxR - minR);

        let xFrac = Math.cos(angle) * r;
        let yFrac = Math.sin(angle) * r;
        xFrac = Math.max(-0.48, Math.min(0.48, xFrac));
        yFrac = Math.max(-0.48, Math.min(0.48, yFrac));

        // Keep cards in left/right gutters (protect vertical center band)
        if (Math.abs(xFrac) < GUTTER_X_MIN) {
          xFrac = Math.sign(xFrac || (Math.random() < 0.5 ? -1 : 1)) * GUTTER_X_MIN;
        }

        if (inContentHole(xFrac, yFrac, halfW, halfH)) return null;
        return { xFrac, yFrac };
      }

      function scatterPosition(
        selfIndex: number,
        halfW: number,
        halfH: number,
        preferredSector: number,
      ): { xFrac: number; yFrac: number; sector: number } | null {
        for (let attempt = 0; attempt < SPAWN_ATTEMPTS; attempt++) {
          const sector = (preferredSector + attempt) % SECTOR_COUNT;
          const pos = sampleInSector(sector, halfW, halfH);
          if (!pos) continue;
          if (overlapsOthers(selfIndex, pos.xFrac, pos.yFrac, halfW, halfH)) {
            continue;
          }
          return { ...pos, sector };
        }
        return null;
      }

      function spawnCard(state: CardState, delayIntoCycle: number, i: number) {
        const halfW = cardHalfW[i] || 0;
        const halfH = cardHalfH[i] || 0;
        const preferred = state.sector >= 0 ? state.sector : i % SECTOR_COUNT;
        const pos = scatterPosition(i, halfW, halfH, preferred);

        if (!pos) {
          state.parked = true;
          state.progress = 0;
          state.xFrac = 0;
          state.yFrac = 0;
          return;
        }

        state.parked = false;
        state.xFrac = pos.xFrac;
        state.yFrac = pos.yFrac;
        state.sector = pos.sector;
        state.progress = delayIntoCycle || 0;
      }

      function tryUnpark(state: CardState, i: number) {
        if (!state.parked) return;
        spawnCard(state, 0, i);
      }

      function holeFadeFactor(i: number, z: number, panX: number, panY: number) {
        if (!holeXHalfPx && !holeYHalfPx) return 1;
        const s = PERSPECTIVE_PX / (PERSPECTIVE_PX - z);
        const state = cardStates[i]!;
        const projX = (state.xFrac * viewportW + panX) * s;
        const projY = (state.yFrac * viewportH + panY) * s;
        const sepX =
          Math.abs(projX) - (holeXHalfPx + (cardHalfW[i] || 0) * s);
        const sepY =
          Math.abs(projY) - (holeYHalfPx + (cardHalfH[i] || 0) * s);

        // Fully hide when projected card intersects the content hole
        if (sepX < 0 && sepY < 0) return 0;

        return smoothstep(clamp01(Math.max(sepX, sepY) / HOLE_SOFT_EDGE));
      }

      function buildCardStates() {
        cardStates.length = 0;
        setters.length = 0;
        cards.forEach((card, i) => {
          const state: CardState = {
            xFrac: 0,
            yFrac: 0,
            progress: 0,
            parked: false,
            sector: i % SECTOR_COUNT,
          };
          cardStates.push(state);
          spawnCard(state, i / cards.length, i);
          setters.push({
            x: gsap.quickSetter(card, "x", "px") as (v: number) => void,
            y: gsap.quickSetter(card, "y", "px") as (v: number) => void,
            z: gsap.quickSetter(card, "z", "px") as (v: number) => void,
            scale: gsap.quickSetter(card, "scale") as (v: number) => void,
            opacity: gsap.quickSetter(card, "opacity") as (v: number) => void,
          });
        });
      }

      let quickPanX: ((v: number) => void) | null = null;
      let quickPanY: ((v: number) => void) | null = null;

      function tick() {
        if (!running) return;
        const dt = gsap.ticker.deltaRatio(60) / 60;
        const rate = (speed * velocityMultiplier) / duration;
        velocityMultiplier += (1 - velocityMultiplier) * VELOCITY_LERP;
        const totalTravel = EXIT_Z - -depth;

        const panX = quickPanX
          ? Number(gsap.getProperty(stage, "x")) || 0
          : 0;
        const panY = quickPanY
          ? Number(gsap.getProperty(stage, "y")) || 0
          : 0;

        for (let i = 0; i < cardStates.length; i++) {
          const state = cardStates[i]!;

          if (state.parked) {
            tryUnpark(state, i);
            setters[i]!.opacity(0);
            setters[i]!.z(-depth);
            continue;
          }

          state.progress += rate * dt;
          if (state.progress >= 1) spawnCard(state, state.progress - 1, i);

          if (state.parked) {
            setters[i]!.opacity(0);
            setters[i]!.z(-depth);
            continue;
          }

          const z = -depth + state.progress * totalTravel;
          const opacity = opacityForZ(z) * holeFadeFactor(i, z, panX, panY);
          setters[i]!.x(state.xFrac * viewportW);
          setters[i]!.y(state.yFrac * viewportH);
          setters[i]!.z(z);
          setters[i]!.scale(scaleForZ(z));
          setters[i]!.opacity(opacity);
        }
      }

      function startTicker() {
        if (running) return;
        running = true;
        gsap.ticker.add(tick);
      }

      function stopTicker() {
        running = false;
        gsap.ticker.remove(tick);
      }

      function onPointerMove(e: PointerEvent) {
        if (!quickPanX || !quickPanY) return;
        const rect = sizeEl.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        quickPanX(nx * pan);
        quickPanY(ny * pan * PAN_Y_RATIO);
      }

      function onPointerLeave() {
        quickPanX?.(0);
        quickPanY?.(0);
      }

      if (!isCoarsePointer && !reduced && pan > 0 && panTarget) {
        quickPanX = gsap.quickTo(stage, "x", {
          duration: PAN_LERP_DUR,
          ease: "power3.out",
        });
        quickPanY = gsap.quickTo(stage, "y", {
          duration: PAN_LERP_DUR,
          ease: "power3.out",
        });
        panTarget.addEventListener("pointermove", onPointerMove);
        panTarget.addEventListener("pointerleave", onPointerLeave);
      }

      function onScroll() {
        const y = window.scrollY || window.pageYOffset || 0;
        const dlt = Math.abs(y - lastScrollY);
        lastScrollY = y;
        if (scrollBoost > 0) {
          const boost =
            1 + Math.min(dlt / VELOCITY_DIVISOR, 1) * (scrollBoost - 1);
          velocityMultiplier = Math.max(velocityMultiplier, boost);
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true });

      let resizeTimer: ReturnType<typeof setTimeout>;
      function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          viewportW = sizeEl.clientWidth || window.innerWidth;
          viewportH = sizeEl.clientHeight || window.innerHeight;
          measureHole();
          measureCards();
        }, 150);
      }
      window.addEventListener("resize", onResize);

      let isIntersecting = true;
      let io: IntersectionObserver | null = null;
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isIntersecting = entry.isIntersecting;
              if (isIntersecting && !document.hidden) startTicker();
              else stopTicker();
            });
          },
          { threshold: 0 },
        );
        io.observe(sizeEl);
      }

      function onVisibilityChange() {
        if (document.hidden) {
          stopTicker();
          gsap.globalTimeline.pause();
        } else {
          gsap.globalTimeline.resume();
          if (isIntersecting) startTicker();
        }
      }
      document.addEventListener("visibilitychange", onVisibilityChange);

      gsap.set(cards, { force3D: true, willChange: "transform, opacity" });
      gsap.set(stage, { force3D: true });
      measureHole();
      measureCards();
      buildCardStates();

      if (reduced) {
        cards.forEach((card, i) => {
          const state = cardStates[i]!;
          if (state.parked) {
            gsap.set(card, { opacity: 0 });
            return;
          }
          gsap.set(card, {
            x: state.xFrac * viewportW,
            y: state.yFrac * viewportH,
            z: -200,
            opacity: 0.9 * holeFadeFactor(i, -200, 0, 0),
          });
        });
      } else {
        startTicker();
      }

      return () => {
        stopTicker();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        panTarget?.removeEventListener("pointermove", onPointerMove);
        panTarget?.removeEventListener("pointerleave", onPointerLeave);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (io) io.disconnect();
        clearTimeout(resizeTimer);
      };
    },
    {
      scope: rootRef,
      dependencies: [
        sources,
        contentRef,
        panTargetRef,
        duration,
        depth,
        speed,
        scrollBoost,
        pan,
        holeBuffer,
      ],
    },
  );

  if (sources.length === 0) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden [perspective:1200px]"
    >
      <div
        ref={stageRef}
        className="absolute inset-0 [transform-style:preserve-3d]"
      >
        {sources.map((src, i) => (
          <div
            key={src}
            ref={addCardRef}
            className={[
              "absolute top-1/2 left-1/2 origin-center overflow-hidden rounded-xl opacity-0 shadow-lg shadow-black/40 [backface-visibility:hidden] [transform-style:preserve-3d] aspect-[9/16]",
              SIZE_CLASSES[i % SIZE_CLASSES.length],
              i % 3 === 0 ? "max-sm:hidden" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <video
              src={src}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
