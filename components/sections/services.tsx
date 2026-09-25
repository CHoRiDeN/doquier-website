"use client";

import { useRef, useSyncExternalStore } from "react";
import { Flag, type FlagCode } from "@/components/flag";
import { CtaLink } from "@/components/motion/cta-link";
import { SplitReveal } from "@/components/motion/split-reveal";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FORM_URL, SERVICES } from "@/lib/site";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/* ── Illustrative UI for each chapter. The numbers are an example plan, not client data. ─────────── */

/** An example month for one goal: each row is a planned video. */
const PLAN_ROWS = [
  { date: "Mon 03", format: "Talking head", hook: "Why everyone in Berlin is switching to this", lang: "DE" },
  { date: "Tue 04", format: "Product ad", hook: "The 10-second fix for your morning", lang: "DE" },
  { date: "Wed 05", format: "Reaction & demo", hook: "I tried it for 7 days. Honest review", lang: "EN" },
  { date: "Thu 06", format: "Interview", hook: "Asking Munich what they'd never go without", lang: "DE" },
  { date: "Fri 07", format: "Podcast clip", hook: "The review nobody asked for", lang: "EN" },
  { date: "Sat 08", format: "Wall text", hook: "POV: you finally found one that works", lang: "DE" },
] as const;
const PLAN_TOTAL = 120;

function PlanVisual() {
  return (
    <div data-visual className="flex h-full flex-col p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          Content plan · Month 1
        </p>
        <span className="rounded-full bg-accent-warm/12 px-3 py-1 text-xs text-accent-warm ring-1 ring-accent-warm/30">
          Goal: awareness in Germany
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {(
          [
            ["Videos", PLAN_TOTAL, true],
            ["Formats", 6, false],
            ["Languages", 2, false],
          ] as const
        ).map(([label, value, counts]) => (
          <div key={label} data-pv-stat className="rounded-xl bg-white/[0.03] px-3.5 py-3 ring-1 ring-line">
            <p className="text-[11px] text-foreground/45">{label}</p>
            <p
              data-pv-count={counts ? value : undefined}
              className="mt-1 text-xl font-semibold tracking-[-0.03em] tabular-nums"
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <ul className="mt-5 grid flex-1 grid-cols-[minmax(0,1fr)] content-start divide-y divide-line/70 rounded-xl ring-1 ring-line/70">
        {PLAN_ROWS.map((row, i) => (
          <li
            key={row.date}
            data-pv-row
            className={cn("flex items-center gap-3 px-3.5 py-2.5 sm:gap-4", i >= 4 && "max-sm:hidden")}
          >
            <span className="w-11 shrink-0 font-mono text-[10px] leading-tight text-foreground/40">{row.date}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium tracking-[-0.01em]">{row.format}</span>
              {/* The hook "types" in as the row is planned. */}
              <span data-pv-hook className="block truncate text-xs text-foreground/50">
                &ldquo;{row.hook}&rdquo;
              </span>
            </span>
            <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] text-foreground/60 ring-1 ring-line">
              {row.lang}
            </span>
            <span
              data-pv-check
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-warm text-background"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <path d="M3 8.5l3.2 3L13 4.5" />
              </svg>
            </span>
          </li>
        ))}
      </ul>
      <p data-pv-more className="mt-3 text-xs text-foreground/45">
        + {PLAN_TOTAL - PLAN_ROWS.length} more planned this month
      </p>
    </div>
  );
}

const POSTERS = [
  "talking-head-1",
  "review-product",
  "product-ad-1",
  "language-it",
  "reaction-demo-2",
  "review-service",
  "interview-1",
  "language-de",
  "podcast-1",
  "review-brand-ad",
  "walltext-1",
  "language-es",
].map((name) => `/media/posters/${name}.jpg`);

function ProduceVisual() {
  return (
    <div data-visual className="flex h-full flex-col p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Production · Batch 03</p>
        <p className="text-xs text-foreground/50">Human-reviewed</p>
      </div>
      <ul className="mt-5 grid flex-1 grid-cols-4 content-center gap-2 sm:grid-cols-6">
        {POSTERS.map((src, i) => (
          <li
            key={src}
            data-pr-tile
            className={cn(
              "relative aspect-[9/16] overflow-hidden rounded-lg bg-muted ring-1 ring-line",
              i >= 8 && "max-sm:hidden",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny pre-optimised posters in a decorative mock */}
            <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <span
              data-pr-check
              className="absolute right-1.5 bottom-1.5 flex size-5 items-center justify-center rounded-full bg-accent-warm text-background"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <path d="M3 8.5l3.2 3L13 4.5" />
              </svg>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <div className="flex items-baseline justify-between text-sm">
          <p className="text-foreground/60">
            <span data-pr-count data-to="120" className="font-semibold text-foreground tabular-nums">
              120
            </span>{" "}
            videos approved this month
          </p>
          <p className="font-mono text-[11px] text-foreground/40 max-sm:hidden">6 formats · 2 languages</p>
        </div>
        <span className="mt-3 block h-1 overflow-hidden rounded-full bg-line">
          <span data-pr-bar className="block h-full origin-left rounded-full bg-accent-warm" />
        </span>
      </div>
    </div>
  );
}

/** Managed accounts in the example plan's target market (awareness in Germany). */
const ACCOUNTS: { name: string; code: FlagCode }[] = Array.from({ length: 5 }, (_, i) => ({
  name: `Account ${String(i + 1).padStart(2, "0")}`,
  code: "DE",
}));
const SLOTS = 14; // 7 days × 2 posts
const TOTAL_VIEWS = 1_240_000;

/** 1240000 → "1.24M", 86000 → "86K". */
const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${Math.round(n / 1_000)}K` : String(Math.round(n));

function DistributeVisual() {
  return (
    <div data-visual className="flex h-full flex-col p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Distribution · Week 1</p>
        <p className="text-xs text-foreground/50 max-sm:hidden">2 posts / account / day</p>
      </div>
      <ul className="mt-6 grid gap-3.5">
        {ACCOUNTS.map((account) => (
          <li key={account.name} data-ds-row className="flex items-center gap-3">
            <Flag code={account.code} label="Germany" className="h-3.5" />
            <span className="w-24 shrink-0 text-sm text-foreground/75 max-sm:w-20 max-sm:text-xs">{account.name}</span>
            {/* One dot per posting slot; each lights up when that post goes out. */}
            <span className="flex flex-1 items-center justify-between">
              {Array.from({ length: SLOTS }, (_, slot) => (
                <span key={slot} data-ds-slot={slot} className="size-2 rounded-full bg-accent-warm" />
              ))}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-foreground/60">Total views</p>
          <p className="text-sm text-foreground/50">
            <span data-ds-views data-to={TOTAL_VIEWS} className="text-lg font-semibold text-foreground tabular-nums">
              {compact(TOTAL_VIEWS)}
            </span>{" "}
            across {ACCOUNTS.length} accounts
          </p>
        </div>
        <svg viewBox="0 0 300 70" preserveAspectRatio="none" className="mt-2 h-16 w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="reach-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(195 184 168)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(195 184 168)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            data-ds-area
            d="M0 66 C 40 62, 70 58, 100 50 S 160 40, 190 30 S 250 10, 300 4 L 300 70 L 0 70 Z"
            fill="url(#reach-fill)"
          />
          <path
            data-ds-line
            d="M0 66 C 40 62, 70 58, 100 50 S 160 40, 190 30 S 250 10, 300 4"
            fill="none"
            stroke="rgb(195 184 168)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}

const VISUALS = [PlanVisual, ProduceVisual, DistributeVisual];

/** The build-in animation for one chapter's visual. Paused; the caller decides when it plays. */
function buildVisual(index: number, root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  if (index === 0) {
    const rows = q("[data-pv-row]");
    const count = q("[data-pv-count]")[0] as HTMLElement;
    const counter = { value: 0 };
    const STEP = 0.38; // seconds between planned rows
    const START = 0.5;
    tl.from(q("[data-pv-stat]"), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.8 })
      // The video count climbs as the plan fills in.
      .fromTo(
        counter,
        { value: 0 },
        {
          value: Number(count.dataset.pvCount),
          duration: rows.length * STEP + 0.4,
          ease: "power1.inOut",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.value));
          },
        },
        START,
      );
    rows.forEach((row, i) => {
      const at = START + i * STEP;
      tl.from(row, { x: -14, autoAlpha: 0, duration: 0.5 }, at)
        .fromTo(
          row.querySelector("[data-pv-hook]"),
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.out" },
          at + 0.1,
        )
        .from(row.querySelector("[data-pv-check]"), { scale: 0, duration: 0.4, ease: "back.out(2.5)" }, at + 0.55);
    });
    tl.from(q("[data-pv-more]"), { autoAlpha: 0, y: 8, duration: 0.6 }, START + rows.length * STEP + 0.2);
  } else if (index === 1) {
    const count = q("[data-pr-count]")[0] as HTMLElement;
    const counter = { value: 0 };
    tl.from(q("[data-pr-tile]"), {
      y: 30,
      scale: 0.9,
      autoAlpha: 0,
      duration: 0.8,
      stagger: { each: 0.05, from: "random" },
    })
      .from(
        q("[data-pr-check]"),
        { scale: 0, duration: 0.45, ease: "back.out(2.5)", stagger: { each: 0.06, from: "random" } },
        0.5,
      )
      .fromTo(q("[data-pr-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.3)
      .fromTo(
        counter,
        { value: 0 },
        {
          value: Number(count.dataset.to),
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.value));
          },
        },
        0.3,
      );
  } else {
    tl.from(q("[data-ds-row]"), { x: -16, autoAlpha: 0, stagger: 0.08, duration: 0.6 });
    // Every account posts in the same slot, so dots light column by column across the week.
    for (let slot = 0; slot < SLOTS; slot++) {
      tl.fromTo(
        q(`[data-ds-slot="${slot}"]`),
        { scale: 0.6, backgroundColor: "rgba(238, 236, 229, 0.1)" },
        { scale: 1, backgroundColor: "rgb(195, 184, 168)", duration: 0.35, ease: "back.out(3)" },
        0.3 + slot * 0.07,
      );
    }
    const views = q("[data-ds-views]")[0] as HTMLElement;
    const counter = { value: 0 };
    tl.from(q("[data-ds-line]"), { drawSVG: "0%", duration: 1.4, ease: "power2.inOut" }, 0.4)
      .from(q("[data-ds-area]"), { autoAlpha: 0, duration: 1 }, 1)
      // Views climb with the curve.
      .fromTo(
        counter,
        { value: 0 },
        {
          value: Number(views.dataset.to),
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            views.textContent = compact(counter.value);
          },
        },
        0.4,
      );
  }
  return tl;
}

function Deliverable({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2.5 text-sm text-foreground/80">
      <svg
        viewBox="0 0 16 16"
        className="size-4 text-accent-warm"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M3 8.5l3.2 3L13 4.5" />
      </svg>
      {children}
    </p>
  );
}

const PINNED_QUERY = `${MQ.motion} and ${MQ.desktop}`;
const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(PINNED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * Services as a three-chapter scroll story (Feature Rail + Grid Chapters). On desktop the section pins,
 * the chapter list tracks progress on the left and the stage swaps to each chapter's live mock-up.
 * On phones and with reduced motion, the chapters simply stack.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null);
  // Only the layout in use is mounted, so phones never build (or hydrate) the pinned stage. The server
  // renders the stacked layout, which is also what reduced-motion visitors get.
  const pinned = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PINNED_QUERY).matches,
    () => false,
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add(PINNED_QUERY, () => {
        const visuals = q("[data-stage] [data-visual]") as HTMLElement[];
        if (!visuals.length) return;
        const chapters = q("[data-chapter]") as HTMLElement[];
        const fills = q("[data-chapter-fill]");
        const builds = visuals.map((el, i) => buildVisual(i, el));
        let active = -1;

        let arrived = false;
        const show = (next: number) => {
          if (next === active) return;
          const prev = active;
          active = next;
          chapters.forEach((el, i) => (el.dataset.active = String(i === next)));
          if (prev >= 0)
            gsap.to(visuals[prev], { autoAlpha: 0, y: -24, duration: 0.45, ease: "power2.in", overwrite: true });
          gsap.fromTo(
            visuals[next],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7, delay: prev >= 0 ? 0.25 : 0, ease: "expo.out", overwrite: true },
          );
          // The first chapter's build waits until the reader actually reaches the section.
          if (arrived) builds[next].restart(true);
        };

        gsap.set(visuals, { autoAlpha: 0 });
        show(0);
        const arrival = ScrollTrigger.create({
          trigger: ref.current,
          start: "top 60%",
          once: true,
          onEnter: () => {
            arrived = true;
            builds[active].restart(true);
          },
        });

        const trigger = ScrollTrigger.create({
          trigger: ref.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.4}`,
          invalidateOnRefresh: true,
          // This pin mounts after hydration, once the desktop layout is known, so every trigger further down
          // was measured without its spacing. Refresh it first, then re-measure the rest.
          refreshPriority: 1,
          onUpdate(self) {
            const progress = self.progress * SERVICES.length;
            show(Math.min(SERVICES.length - 1, Math.floor(progress)));
            fills.forEach((fill, i) => gsap.set(fill, { scaleX: gsap.utils.clamp(0, 1, progress - i) }));
          },
        });

        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => {
          arrival.kill();
          trigger.kill();
          builds.forEach((tl) => tl.kill());
        };
      });

      // Stacked layout: each visual builds once as it scrolls into view.
      mm.add(MQ.motion, () => {
        (q("[data-stack] [data-visual]") as HTMLElement[]).forEach((el, i) => {
          const tl = buildVisual(i, el);
          ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: () => tl.play() });
        });
      });
    },
    { scope: ref, dependencies: [pinned], revertOnUpdate: true },
  );

  return (
    <section
      id="services"
      ref={ref}
      aria-labelledby="services-heading"
      className={cn(pinned ? "flex h-svh min-h-[720px] flex-col justify-center" : "py-32 sm:py-44")}
    >
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SplitReveal
            id="services-heading"
            className="max-w-2xl text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance"
          >
            From goal to <span className="font-serif-accent text-accent-warm">published.</span>
          </SplitReveal>
          <p className="max-w-sm text-pretty text-foreground/60">
            Three services, one team. Take the full programme or only the part you need, and we&apos;ll run it end to
            end.
          </p>
        </div>

        {/* Desktop: chapter rail + stage, driven by the pinned scroll. */}
        {pinned ? (
          <div className="mt-12 grid grid-cols-12 gap-10">
            <ol className="col-span-5 flex flex-col justify-center">
              {SERVICES.map((service, i) => (
                <li
                  key={service.step}
                  data-chapter
                  data-active={i === 0}
                  className="group/ch border-t border-line py-6"
                >
                  <span aria-hidden className="relative -mt-6 mb-6 block h-px">
                    <span data-chapter-fill className="absolute inset-0 origin-left scale-x-0 bg-accent-warm" />
                  </span>
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-xs text-foreground/35 transition-colors duration-500 group-data-[active=true]/ch:text-accent-warm">
                      {pad(i + 1)}
                    </span>
                    <div className="flex-1">
                      <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                        {service.step}
                      </p>
                      <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,1.875rem)] font-semibold tracking-[-0.035em] text-foreground/35 transition-colors duration-500 group-data-[active=true]/ch:text-foreground">
                        {service.title}
                      </h3>
                      {/* The active chapter opens to show its details (grid-rows 0fr → 1fr). */}
                      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-data-[active=true]/ch:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                          <p className="mt-3 max-w-md leading-relaxed text-pretty text-foreground/60">
                            {service.description}
                          </p>
                          <div className="mt-4">
                            <Deliverable>{service.deliverable}</Deliverable>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              <li className="pt-8">
                <CtaLink href={FORM_URL}>Book a strategy call</CtaLink>
              </li>
            </ol>

            <div
              data-stage
              className="relative col-span-7 h-[min(60svh,540px)] overflow-hidden rounded-3xl border border-line bg-[#0f0f10] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(80%_100%_at_50%_0%,rgb(195_184_168/0.08),transparent_70%)]"
              />
              {VISUALS.map((Visual, i) => (
                <div key={i} aria-hidden className="absolute inset-0">
                  <Visual />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Phones, tablets and reduced motion: the chapters stack, each with its own mock-up. */}
            <ol data-stack className="mt-14 grid gap-16">
              {SERVICES.map((service, i) => {
                const Visual = VISUALS[i];
                return (
                  <li key={service.step} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                    <div>
                      <p className="flex items-baseline gap-4 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        <span className="text-accent-warm">{pad(i + 1)}</span>
                        {service.step}
                      </p>
                      <h3 className="mt-3 text-[clamp(1.5rem,5vw,2rem)] font-semibold tracking-[-0.035em]">
                        {service.title}
                      </h3>
                      <p className="mt-3 max-w-md leading-relaxed text-pretty text-foreground/60">
                        {service.description}
                      </p>
                      <div className="mt-5">
                        <Deliverable>{service.deliverable}</Deliverable>
                      </div>
                    </div>
                    <div
                      aria-hidden
                      className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-[#0f0f10] sm:aspect-[4/3]"
                    >
                      <Visual />
                    </div>
                  </li>
                );
              })}
            </ol>
            <CtaLink href={FORM_URL} className="mt-14">
              Book a strategy call
            </CtaLink>
          </>
        )}
      </div>
    </section>
  );
}
