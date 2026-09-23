import { Ahead } from "@/components/ahead";
import { Formats } from "@/components/formats";
import { Hero } from "@/components/hero";
import { Reviews } from "@/components/reviews";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Formats />
      <Reviews />
      <Ahead />
    </main>
  );
}
