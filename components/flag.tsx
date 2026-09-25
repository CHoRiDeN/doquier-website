import { cn } from "@/lib/utils";

/** Stripes of each flag, top-to-bottom (horizontal) or left-to-right (vertical), as [colour, weight]. */
const FLAGS = {
  AR: { vertical: false, stripes: [["#74acdf", 1], ["#ffffff", 1], ["#74acdf", 1]] },
  CO: { vertical: false, stripes: [["#fcd116", 2], ["#003893", 1], ["#ce1126", 1]] },
  DE: { vertical: false, stripes: [["#000000", 1], ["#dd0000", 1], ["#ffce00", 1]] },
  ES: { vertical: false, stripes: [["#aa151b", 1], ["#f1bf00", 2], ["#aa151b", 1]] },
  FR: { vertical: true, stripes: [["#002395", 1], ["#ffffff", 1], ["#ed2939", 1]] },
  IT: { vertical: true, stripes: [["#009246", 1], ["#ffffff", 1], ["#ce2b37", 1]] },
  MX: { vertical: true, stripes: [["#006847", 1], ["#ffffff", 1], ["#ce1126", 1]] },
  NL: { vertical: false, stripes: [["#ae1c28", 1], ["#ffffff", 1], ["#21468b", 1]] },
  US: {
    vertical: false,
    stripes: Array.from({ length: 13 }, (_, i): [string, number] => [i % 2 ? "#ffffff" : "#b22234", 1]),
    canton: "#3c3b6e",
  },
} satisfies Record<string, { vertical: boolean; stripes: [string, number][]; canton?: string }>;

export type FlagCode = keyof typeof FLAGS;

/** A small striped country flag, drawn in SVG because emoji flags don't render on Windows. */
export function Flag({ code, label, className }: { code: FlagCode; label: string; className?: string }) {
  const flag = FLAGS[code];
  const { vertical, stripes } = flag;
  const total = stripes.reduce((sum, [, w]) => sum + w, 0);
  return (
    <svg
      viewBox="0 0 30 20"
      role="img"
      aria-label={label}
      className={cn("h-5 w-auto shrink-0 overflow-hidden rounded-[4px] ring-1 ring-white/15", className)}
    >
      {stripes.map(([fill, weight], i) => {
        const start = stripes.slice(0, i).reduce((sum, [, w]) => sum + w, 0);
        return vertical ? (
          <rect key={i} x={(start / total) * 30} y="0" width={(weight / total) * 30} height="20" fill={fill} />
        ) : (
          <rect key={i} x="0" y={(start / total) * 20} width="30" height={(weight / total) * 20} fill={fill} />
        );
      })}
      {"canton" in flag ? <rect x="0" y="0" width="12" height={(7 / 13) * 20} fill={flag.canton} /> : null}
    </svg>
  );
}
