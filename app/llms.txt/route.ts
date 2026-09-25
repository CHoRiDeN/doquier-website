import {
  CLIENTS,
  COMPARISON,
  FAQ,
  FORMATS,
  LANGUAGE_NAMES,
  METRICS,
  PROCESS,
  SITE,
  SITE_URL,
  USE_CASES,
} from "@/lib/site";

export const dynamic = "force-static";

const cell = (v: string | boolean) => (typeof v === "boolean" ? (v ? "Yes" : "No") : v);

/** Plain-markdown summary of the site for LLMs and AI agents (https://llmstxt.org). */
function render() {
  return `# ${SITE.name}

> ${SITE.description}

${SITE.name} is a done-for-you service, not a self-serve tool: clients send a short brief and receive ready-to-run video ads. There is no public pricing; plans are tailored to monthly creative volume. We are currently at capacity; prospective clients can join the waitlist at ${SITE_URL}/#waitlist.

## Key facts

${METRICS.map((m) => `- ${m.prefix}${m.value}${m.suffix} ${m.label}`).join("\n")}
- Languages: ${LANGUAGE_NAMES.join(", ")}
- Market: Europe
- Trusted by: ${CLIENTS.join(", ")}

## Formats

${FORMATS.map((f) => `- **${f.name}**: ${f.description}`).join("\n")}

## How it works

${PROCESS.map((p, i) => `${i + 1}. **${p.title}**: ${p.description}`).join("\n")}

## Use cases

${USE_CASES.map((u) => `- **${u.title}**: ${u.description}`).join("\n")}

## Compared with alternatives

| | ${SITE.name} | Creator UGC | Self-serve AI tools |
|---|---|---|---|
${COMPARISON.map((r) => `| ${r.label} | ${cell(r.doquier)} | ${cell(r.creators)} | ${cell(r.tools)} |`).join("\n")}

## FAQ

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Links

- [Website](${SITE_URL}/): Landing page
- [Join the waitlist](${SITE_URL}/#waitlist): Waitlist form for new clients
`;
}

export function GET() {
  return new Response(render(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
