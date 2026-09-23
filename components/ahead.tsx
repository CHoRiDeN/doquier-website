import Image from "next/image";

const competitors = [
  {
    name: "Whatever",
    image: "/images/ahead/whatever.png",
    icon: "/images/ahead/icon-2.svg",
  },
  {
    name: "Minshift AI",
    image: "/images/ahead/placeholder.png",
    icon: "/images/ahead/icon-1.svg",
  },
  {
    name: "Whatever",
    image: "/images/ahead/placeholder.png",
    icon: "/images/ahead/icon-3.svg",
  },
  {
    name: "Whatever",
    image: "/images/ahead/placeholder.png",
    icon: "/images/ahead/icon-1.svg",
  },
] as const;

function CompetitorCard({
  name,
  image,
  icon,
}: {
  name: string;
  image: string;
  icon: string;
}) {
  return (
    <li className="flex w-[217px] shrink-0 flex-col gap-4">
      <div className="relative aspect-[217/386] w-full overflow-hidden rounded-[14px]">
        <Image src={image} alt="" fill sizes="217px" className="object-cover" />
      </div>
      <div className="flex items-center justify-between gap-2 pr-1">
        <span className="text-[1.1767rem] font-medium leading-[1.3] tracking-[-0.07px] text-foreground">
          {name}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG has fixed Figma root dimensions */}
        <img src={icon} alt="" width={17.034} height={17.034} />
      </div>
    </li>
  );
}

export function Ahead() {
  return (
    <section
      id="ahead"
      aria-labelledby="ahead-heading"
      className="relative overflow-hidden bg-[#0b0809] pt-20 pb-[400px] sm:pt-24"
      style={{ backgroundImage: 'url("/images/ahead/terrain.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom' }}
    >
      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-8">
        <div className="mx-auto max-w-[505px] text-center">
          <h2
            id="ahead-heading"
            className="font-heading text-[2rem] font-semibold leading-[1] tracking-[-0.15px] text-foreground sm:text-[2.8125rem]"
          >
            So far ahead
          </h2>
          <p className="mt-5 text-pretty text-base leading-[1.7] tracking-[-0.08px] text-foreground sm:mt-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit
            amet fermentum neque, non commodo dolor
          </p>
        </div>

        <div className="mt-12 flex items-start gap-3 sm:mt-16 sm:gap-5 lg:gap-6">
          <div className="flex shrink-0 items-start gap-3 sm:gap-5 lg:gap-6">
            <div className="flex w-[240px] shrink-0 flex-col gap-4">
              <div className="relative aspect-[226/386] w-full overflow-hidden rounded-[14px] bg-muted">
                <video
                  className="h-full w-full object-cover"
                  src="/images/formats/organic-ugc-holafly.mp4"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG has fixed Figma root dimensions */}
                <img
                  src="/images/ahead/doquier-mark.svg"
                  alt=""
                  width={25.1028}
                  height={26.2795}
                />
                <span className="text-[1.1767rem] font-semibold leading-[1.3] tracking-[-0.07px] text-foreground">
                  Doquier
                </span>
              </div>
            </div>

            <div
              className="flex h-[386px] shrink-0 items-center px-1 sm:px-2"
              aria-hidden
            >
              <span className="font-heading text-base font-semibold tracking-[-0.08px] text-foreground">
                VS
              </span>
            </div>
          </div>

          <div
            className="ahead-marquee relative min-w-0 flex-1"
            aria-label="Competitors"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0b0809] to-transparent sm:w-[129px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0b0809] to-transparent sm:w-[129px]"
            />
            <div className="ahead-marquee-track">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  className="ahead-marquee-set"
                  aria-hidden={copy === 1}
                >
                  {competitors.map((competitor, index) => (
                    <CompetitorCard
                      key={`${copy}-${competitor.name}-${index}`}
                      name={competitor.name}
                      image={competitor.image}
                      icon={competitor.icon}
                    />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}
