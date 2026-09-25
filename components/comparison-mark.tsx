import { cn } from "@/lib/utils";

/** How well an option covers a comparison row: fully, partly, or not at all. */
export type Mark = "yes" | "partial" | "no";

const LABELS: Record<Mark, string> = { yes: "Yes", partial: "Partly", no: "No" };

/** Check, dash or cross shown before a comparison cell. `highlight` paints the check in the accent. */
export function ComparisonMark({ mark, highlight, className }: { mark: Mark; highlight?: boolean; className?: string }) {
  return (
    <span
      role="img"
      aria-label={LABELS[mark]}
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full",
        mark === "yes" && (highlight ? "bg-accent-warm text-background" : "bg-foreground/12 text-foreground/80"),
        mark === "partial" && "bg-[oklch(0.8_0.09_80/0.22)] text-[oklch(0.86_0.11_80)]",
        mark === "no" && "bg-[oklch(0.68_0.14_25/0.24)] text-[oklch(0.78_0.14_25)]",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        {mark === "yes" ? <path d="M3.5 8.5l3 3L12.5 5" /> : null}
        {mark === "partial" ? <path d="M4.5 8h7" /> : null}
        {mark === "no" ? <path d="M5 5l6 6M11 5l-6 6" /> : null}
      </svg>
    </span>
  );
}

/** A comparison-table cell: the mark, then the text. Boolean values show the mark alone. */
export function ComparisonCell({
  value,
  mark,
  highlight,
}: {
  value: string | boolean;
  mark: Mark;
  highlight?: boolean;
}) {
  return (
    <span className="flex items-start gap-3">
      <ComparisonMark mark={mark} highlight={highlight} className="mt-px" />
      {typeof value === "string" ? <span>{value}</span> : null}
    </span>
  );
}
