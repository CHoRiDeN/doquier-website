"use client";

import { HeroVideos } from "@/components/hero-videos";
import { Button } from "@/components/ui/button";

export function HeroView() {
  return (
    <section className="relative flex h-[90svh] flex-col overflow-hidden bg-[#050505]">
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/placeholder-hero.webp')] bg-cover bg-center bg-no-repeat" />
        <div className="pointer-events-none absolute inset-0 bg-black/[0.04] backdrop-blur-[15px]" />
        <div className="pointer-events-none absolute inset-0 hero-grain opacity-100" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-[#050505]/25" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        <HeroVideos />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <h1 className="hero-enter font-heading text-balance text-6xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
            Contenido UGC
            <br />
            <span className="text-primary">casi </span> real en autopilot
          </h1>

          <p className="hero-enter hero-enter-delay-1 mt-6 max-w-2xl text-pretty text-base leading-relaxed text-foreground/80 sm:mt-8 sm:text-lg">
            Convertimos la complejidad en movimiento. Diseñamos, generamos y
            distribuimos contenido que generan resultados.
          </p>

          <div className="hero-enter hero-enter-delay-2 mt-10 sm:mt-12">
            <Button size="lg" className="h-11 px-6 text-sm">
              Descubre más
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
