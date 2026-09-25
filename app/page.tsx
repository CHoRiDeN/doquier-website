import { Compare } from "@/components/sections/compare";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Formats } from "@/components/sections/formats";
import { Hero } from "@/components/sections/hero";
import { Languages } from "@/components/sections/languages";
import { Manifesto } from "@/components/sections/manifesto";
import { Process } from "@/components/sections/process";
import { Results } from "@/components/sections/results";
import { SiteNav } from "@/components/sections/site-nav";
import { UseCases } from "@/components/sections/use-cases";
import { StructuredData } from "@/components/structured-data";
import { WaitlistModal } from "@/components/waitlist-modal";

export default function Home() {
  return (
    <>
      <StructuredData />
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main" className="flex-1">
        <Hero />
        <Manifesto />
        <Formats />
        <Languages />
        <Process />
        <Results />
        <Compare />
        <UseCases />
        <Faq />
        <FinalCta />
      </main>
      <WaitlistModal />
    </>
  );
}
