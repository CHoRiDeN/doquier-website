import fs from "node:fs";
import path from "node:path";

import { HeroView } from "@/components/hero-view";

function getHeroVideoSources(): string[] {
  const dir = path.join(process.cwd(), "public/videos/hero");
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => file.toLowerCase().endsWith(".mp4"))
      .sort()
      .map((file) => `/videos/hero/${file}`);
  } catch {
    return [];
  }
}

export function Hero() {
  return <HeroView sources={getHeroVideoSources()} />;
}
