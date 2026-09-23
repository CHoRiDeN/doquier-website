"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type FormatKind =
  | "carousel"
  | "interview"
  | "podcast"
  | "product-ad"
  | "reaction-demo"
  | "talking-head"
  | "walltext";

type FormatExample = {
  kind: FormatKind;
  name: string;
  description: string;
  src: string;
  media: "video" | "image";
};

const FORMAT_META: Record<
  FormatKind,
  { name: string; description: string }
> = {
  carousel: {
    name: "Carousel",
    description:
      "Swipe-ready slides that break a story into bites — perfect for product highlights and tips.",
  },
  interview: {
    name: "Interview",
    description:
      "Conversational Q&A energy that feels like a real sit-down, built for trust and depth.",
  },
  podcast: {
    name: "Podcast",
    description:
      "Audio-first vibes on camera — casual, intimate, and made for long-form hooks.",
  },
  "product-ad": {
    name: "Product ad",
    description:
      "Short-form ads that put the product front and center — clear offer, fast hook, ready to run.",
  },
  "reaction-demo": {
    name: "Reaction demo",
    description:
      "Watch-and-react energy that shows the product in action while someone responds live.",
  },
  "talking-head": {
    name: "Talking head",
    description:
      "Straight-to-camera delivery for tips, opinions, and clear product pitches.",
  },
  walltext: {
    name: "Wall text",
    description:
      "Bold on-screen text that carries the message — punchy, readable, and scroll-stopping.",
  },
};

const FORMAT_SOURCES: Record<
  FormatKind,
  { src: string; media: "video" | "image" }[]
> = {
  carousel: [
    { src: "/images/formats/carousels/example1.png", media: "image" },
    { src: "/images/formats/carousels/example2.png", media: "image" },
  ],
  interview: [{ src: "/images/formats/interview/example1.mp4", media: "video" }],
  podcast: [{ src: "/images/formats/podcast/example1.mp4", media: "video" },{ src: "/images/formats/podcast/example1.mp4", media: "video" }],
  "product-ad": [
    { src: "/images/formats/product-ad/example1.mp4", media: "video" },
    { src: "/images/formats/product-ad/example2.mp4", media: "video" },
    { src: "/images/formats/product-ad/example3.mp4", media: "video" },
    { src: "/images/formats/product-ad/exmaple4.mp4", media: "video" },
  ],
  "reaction-demo": [
    { src: "/images/formats/reaction-demo/example1.mp4", media: "video" },
    { src: "/images/formats/reaction-demo/example2.mp4", media: "video" },
     { src: "/images/formats/reaction-demo/example3.mp4", media: "video" },
  ],
  "talking-head": [
    { src: "/images/formats/talking-head/example1.mp4", media: "video" },
    { src: "/images/formats/talking-head/example2.mp4", media: "video" },
  ],
  walltext: [
    { src: "/images/formats/walltext/example1.mp4", media: "video" },
    { src: "/images/formats/walltext/example2.mp4", media: "video" },
    { src: "/images/formats/walltext/example3.mp4", media: "video" },
    { src: "/images/formats/walltext/example4.mp4", media: "video" },
    { src: "/images/formats/walltext/example5.mp4", media: "video" },
  ],
};

const FORMAT_ORDER: FormatKind[] = [
  "carousel",
  "interview",
  "podcast",
  "product-ad",
  "reaction-demo",
  "talking-head",
  "walltext",
];

/** Round-robin across formats so examples from different kinds sit side by side. */
function interleaveFormats(): FormatExample[] {
  const queues = FORMAT_ORDER.map((kind) =>
    FORMAT_SOURCES[kind].map((item) => ({
      kind,
      name: FORMAT_META[kind].name,
      description: FORMAT_META[kind].description,
      src: item.src,
      media: item.media,
    })),
  );

  const interleaved: FormatExample[] = [];
  let remaining = true;

  while (remaining) {
    remaining = false;
    for (const queue of queues) {
      const next = queue.shift();
      if (next) {
        interleaved.push(next);
        remaining = true;
      }
    }
  }

  return interleaved;
}

const formats = interleaveFormats();

function FormatCard({
  name,
  description,
  src,
  media,
}: {
  name: string;
  description: string;
  src: string;
  media: "video" | "image";
}) {
  return (
    <li className="flex w-[233px] shrink-0 flex-col gap-4 sm:w-[240px]">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[12.6px] bg-muted">
        {media === "video" ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
          />
        ) : (
          <Image
            src={src}
            alt=""
            fill
            sizes="240px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 text-left">
        <h3 className="text-[1.4375rem] leading-[1.06] text-secondary">{name}</h3>
        <p className="text-pretty text-sm leading-[1.2] tracking-[-0.08px] text-[#b4b4b4]">
          {description}
        </p>
      </div>
    </li>
  );
}

export function Formats() {
  return (
    <section
      id="formats"
      aria-labelledby="formats-heading"
      className="relative overflow-hidden bg-background py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_center,rgb(56,56,56)_0%,rgba(16,16,16)_100%)] opacity-90"
   
      />

      <div className="relative w-full">
        <div className="mx-auto px-4 text-center sm:px-8">
          <h2
            id="formats-heading"
            className="whitespace-nowrap font-heading text-[2rem] font-semibold leading-[1] tracking-[-0.15px] text-foreground sm:text-[2.8125rem]"
          >
            All formats. One Place.
          </h2>
          <p className="mx-auto mt-5 max-w-[505px] text-pretty text-base leading-[1.7] tracking-[-0.08px] text-foreground/90 sm:mt-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit
            amet fermentum neque, non commodo dolor
          </p>
        </div>

        <div className="formats-marquee mt-14 sm:mt-16" aria-label="Format examples">
          <div className="formats-marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="formats-marquee-set" aria-hidden={copy === 1}>
                {formats.map((format, index) => (
                  <FormatCard
                    key={`${copy}-${format.kind}-${index}`}
                    name={format.name}
                    description={format.description}
                    src={format.src}
                    media={format.media}
                  />
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-14 flex justify-center px-4 sm:mt-16 sm:px-8">
          <Button
            variant="secondary"
            size="lg"
            className="h-10 min-w-[180px] rounded-md bg-[#c3b8a8] px-6 text-[13px] font-normal tracking-[-0.09px] text-black hover:bg-[#c3b8a8]/90"
          >
            QUÉ HACEMOS
          </Button>
        </div>
      </div>
    </section>
  );
}
