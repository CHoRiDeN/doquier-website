import Image from "next/image";
import { LazyVideo } from "@/components/motion/lazy-video";
import { SoundVideo } from "@/components/motion/sound-video";
import type { Competitor } from "@/lib/compare";
import { FORMATS, LANGUAGE_EXAMPLES } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The competitor's own icon, or a monogram until one is added. */
export function CompetitorMark({ c, className }: { c: Competitor; className?: string }) {
  return c.icon ? (
    // eslint-disable-next-line @next/next/no-img-element -- small brand icon served as-is
    <img src={c.icon} alt="" width={40} height={40} className={cn("size-10 rounded-xl object-cover", className)} />
  ) : (
    <span
      aria-hidden
      className={cn(
        "flex size-10 items-center justify-center rounded-xl bg-foreground/10 text-base font-semibold text-foreground/80 ring-1 ring-line",
        className,
      )}
    >
      {c.name[0]}
    </span>
  );
}

function DoquierLogo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny inline brand SVG
    <img src="/brand/doquier-logo.svg" alt="Doquier" width={104} height={24} className={cn("h-6 w-auto", className)} />
  );
}

/**
 * Hero visual: Doquier as a finished, published UGC video next to the competitor as a blank tool your
 * team still has to drive. The contrast is the whole argument, told in one picture.
 */
export function FaceOff({ c }: { c: Competitor }) {
  return (
    <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 bg-[radial-gradient(50%_50%_at_30%_50%,rgb(195_184_168/0.16),transparent_70%)] blur-2xl"
      />

      {/* Doquier: the work, done. */}
      <figure className="hero-fade relative aspect-[9/14] overflow-hidden rounded-3xl bg-muted ring-1 ring-accent-warm/60 shadow-[0_40px_120px_-30px_rgb(195_184_168/0.35)]">
        <LazyVideo
          src="/media/formats/talking-head-1.mp4"
          poster="/media/posters/talking-head-1.jpg"
          rootMargin="0px"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />
        <figcaption className="absolute inset-x-0 top-0 p-4 sm:p-5">
          <DoquierLogo className="h-5 sm:h-6" />
          <p className="mt-2 text-xs text-white/75">Done for you</p>
        </figcaption>
        <ul className="absolute inset-x-0 bottom-0 grid gap-1.5 p-4 sm:p-5">
          {["Planned", "Produced", "Posted"].map((step) => (
            <li key={step} className="flex items-center gap-2 text-xs font-medium text-white sm:text-sm">
              <span className="flex size-4 items-center justify-center rounded-full bg-accent-warm text-background">
                <svg
                  viewBox="0 0 16 16"
                  className="size-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  aria-hidden
                >
                  <path d="M3 8.5l3.2 3L13 4.5" />
                </svg>
              </span>
              {step}
            </li>
          ))}
        </ul>
      </figure>

      {/* The competitor: a blank tool waiting for your team. */}
      <figure
        className="hero-fade relative flex aspect-[9/14] flex-col rounded-3xl border border-line bg-[#0f0f10] p-4 sm:p-5"
        style={{ animationDelay: "0.15s" }}
      >
        <figcaption className="flex items-center gap-3">
          <CompetitorMark c={c} className="size-8 rounded-lg text-sm sm:size-10 sm:rounded-xl sm:text-base" />
          <span>
            <span className="block text-sm font-semibold sm:text-base">{c.name}</span>
            <span className="block text-xs text-foreground/45">Your team does it</span>
          </span>
        </figcaption>
        <div aria-hidden className="mt-5 flex flex-1 flex-col gap-2.5 text-[11px] sm:text-xs">
          <div className="flex-1 rounded-xl bg-white/[0.03] p-3 ring-1 ring-line">
            <span className="text-foreground/35">Write your script…</span>
            <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-foreground/60" />
          </div>
          <div className="rounded-xl bg-white/[0.03] px-3 py-2.5 text-foreground/40 ring-1 ring-line">
            Choose an actor ▾
          </div>
          <div className="rounded-xl bg-white/[0.03] px-3 py-2.5 text-foreground/40 ring-1 ring-line">
            Pick a language ▾
          </div>
          <div className="rounded-xl bg-foreground/10 px-3 py-2.5 text-center font-medium text-foreground/55">
            Generate
          </div>
        </div>
      </figure>

      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background font-serif-accent text-lg text-accent-warm ring-1 ring-line"
      >
        vs
      </span>
    </div>
  );
}

/** Side-by-side videos: one of ours next to an example from the competitor's own showcase. */
export function ClipDuel({ c }: { c: Competitor }) {
  if (!c.clip) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:max-w-3xl">
      <figure data-reveal>
        <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-muted ring-1 ring-accent-warm/60 shadow-[0_40px_120px_-30px_rgb(195_184_168/0.35)]">
          <SoundVideo
            src="/media/competitors/doquier-holafly.mp4"
            poster="/media/posters/competitor-doquier-holafly.jpg"
            label="Doquier ad for Holafly"
          />
        </div>
        <figcaption className="mt-4 flex items-center gap-2 text-sm">
          <DoquierLogo className="h-4" />
          <span className="text-foreground/45">for Holafly</span>
        </figcaption>
      </figure>
      <figure data-reveal="0.1">
        <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-muted opacity-85 ring-1 ring-line">
          <LazyVideo src={c.clip.src} poster={c.clip.poster} className="h-full w-full object-cover" />
        </div>
        <figcaption className="mt-4 flex items-center gap-2 text-sm">
          <CompetitorMark c={c} className="size-5 rounded-md text-[10px]" />
          <span className="text-foreground/60">Example from {c.name}</span>
        </figcaption>
      </figure>
    </div>
  );
}

/** A tile per format plus a language example: real Doquier work, so first-time visitors see the quality. */
export function WorkGallery() {
  const language = LANGUAGE_EXAMPLES[2];
  const items = [
    ...FORMATS.map((f) => ({ name: f.name, media: f.media })),
    {
      name: `${language.language} ${language.category.toLowerCase()} ad`,
      media: { type: "video" as const, src: language.src, poster: language.poster },
    },
  ];
  return (
    <ul className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 [@media(hover:hover)]:[&:has(li:hover)>li:not(:hover)]:opacity-50">
      {items.map((item, i) => (
        <li
          key={item.name}
          className="w-[56vw] max-w-[240px] shrink-0 snap-start transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] sm:w-auto sm:max-w-none"
        >
          <div data-reveal={(i % 4) * 0.08}>
            <div className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-muted ring-1 ring-line">
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105">
                {item.media.type === "video" ? (
                  <LazyVideo src={item.media.src} poster={item.media.poster} className="h-full w-full object-cover" />
                ) : (
                  <Image
                    src={item.media.src}
                    alt={`${item.name} example`}
                    fill
                    sizes="(min-width: 1024px) 285px, (min-width: 640px) 25vw, 56vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3.5 pt-10">
                <p className="text-sm font-medium text-white">{item.name}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
