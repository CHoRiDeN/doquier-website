import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const icon = await readFile(join(process.cwd(), "app/icon.svg"), "base64");
  return new ImageResponse(
    (
      <img src={`data:image/svg+xml;base64,${icon}`} width={180} height={180} alt="" />
    ),
    size,
  );
}
