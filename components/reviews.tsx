import WebsiteShaderCanvas from "@/components/ui/shader-aurora-veil";

const reviews = [
  {
    title: "Product reviews",
    description:
      "Native-looking product reviews that show your item in real use. The kind of UGC that stops the scroll.",
    video: "/images/formats/product-review.mp4",
  },
  {
    title: "Service reviews",
    description:
      "Believable service testimonials that feel like customer stories. Built for clinics, apps, and experience-led brands.",
    video: "/images/formats/service-review.mp4",
  },
] as const;

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="relative overflow-hidden"
    >
      <WebsiteShaderCanvas
        preset="aurora-veil"
        tone="dark"
        className="px-4 py-16 sm:px-8 sm:py-24"
      >
        <h2 id="reviews-heading" className="sr-only">
          Product and service reviews
        </h2>

        <div className="relative mx-auto grid w-full max-w-[935px] gap-16 sm:gap-20 md:grid-cols-2 md:gap-24">
          {reviews.map((review) => (
            <article key={review.title} className="flex flex-col items-start">
              <div className="relative aspect-[290/496] w-full max-w-[290px] overflow-hidden rounded-[16px] bg-muted">
                <video
                  className="h-full w-full object-cover"
                  src={review.video}
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <h3 className="mt-8 font-heading text-[2.0625rem] font-semibold leading-[1] tracking-[-0.15px] text-foreground">
                {review.title}
              </h3>
              <p className="mt-4 max-w-[417px] text-pretty text-base leading-[1.7] tracking-[-0.08px] text-[#a1a1a1]">
                {review.description}
              </p>
            </article>
          ))}
        </div>
      </WebsiteShaderCanvas>
    </section>
  );
}
