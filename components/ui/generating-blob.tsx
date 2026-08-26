import { cn } from "@/lib/utils"

type GeneratingBlobOverlayProps = {
  variant?: "opaque" | "translucent"
  className?: string
  children?: React.ReactNode
}

function GeneratingBlobOverlay({
  variant = "opaque",
  className,
  children,
}: GeneratingBlobOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden backdrop-blur-lg rounded-lg",
        variant === "opaque" ? "bg-[#131314]" : "bg-black/45",
        className,
      )}
      aria-hidden={children ? undefined : true}
      role={children ? "status" : undefined}
    >
      <div
        className="generating-blob generating-blob-1 absolute"
        style={{
          width: "85%",
          height: "85%",
          top: "-10%",
          left: "-15%",
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "rgba(38, 165, 106, 0.55)",
            filter: "blur(80px)",
          }}
        />
      </div>
      <div
        className="generating-blob generating-blob-2 absolute"
        style={{
          width: "80%",
          height: "80%",
          bottom: "-15%",
          right: "-10%",
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "rgba(94, 125, 109, 0.45)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {children ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  )
}

export { GeneratingBlobOverlay }
