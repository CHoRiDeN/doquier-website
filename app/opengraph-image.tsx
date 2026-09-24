import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CLIENTS, SITE } from "@/lib/site";

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/doquier-logo.svg"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(70% 60% at 50% 45%, rgba(195,184,168,0.16), rgba(10,10,11,0) 70%), #0a0a0b",
          color: "#eeece5",
        }}
      >
        <img src={`data:image/svg+xml;base64,${logo}`} width={214} height={50} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            UGC that looks&nbsp;<span style={{ color: "#c3b8a8" }}>real.</span>
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            Made on autopilot.
          </div>
          <div style={{ display: "flex", fontSize: 27, color: "rgba(238,236,229,0.62)", marginTop: 12 }}>
            {SITE.shortDescription}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "rgba(238,236,229,0.45)", letterSpacing: 1 }}>
          Trusted by {CLIENTS.join(" · ")}
        </div>
      </div>
    ),
    size,
  );
}
