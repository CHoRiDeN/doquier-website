import { COMPETITORS } from "@/lib/compare";
import {
  CLIENTS,
  COMPARISON,
  DISTRIBUTION_POINTS,
  ENGAGEMENTS,
  FAQ,
  FORM_URL,
  FORMATS,
  LANGUAGE_NAMES,
  LEGAL,
  LEGAL_LINKS,
  METRICS,
  PROCESS,
  SITE,
  SERVICES,
  SITE_URL,
  USE_CASES,
  MORE_USE_CASES,
} from "@/lib/site";

export const dynamic = "force-static";

const cell = (v: string | boolean) => (typeof v === "boolean" ? (v ? "Yes" : "No") : v);

/** Plain-markdown summary of the site for LLMs and AI agents (https://llmstxt.org). */
function render() {
  return `# ${SITE.name}

> ${SITE.description}

${SITE.name} is a done-for-you service, not a self-serve tool: there is no software to learn. Clients book a strategy call, receive a content plan built around their goal, and ${SITE.name} produces the videos in bulk and can publish them in each target market. There is no public pricing; every engagement is scoped on the strategy call. Book one at ${SITE_URL}/${FORM_URL}.

## Services

${SERVICES.map((s) => `- **${s.step}: ${s.title}**: ${s.description} Deliverable: ${s.deliverable}.`).join("\n")}

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
- Also: ${MORE_USE_CASES.join(", ")}

## Distribution

${DISTRIBUTION_POINTS.map((d) => `- **${d.title}**: ${d.description}`).join("\n")}

## Ways to work together

${ENGAGEMENTS.map((e) => `- **${e.name}**: ${e.description} Includes: ${e.includes.join(", ")}.`).join("\n")}

## Compared with alternatives

| | ${SITE.name} | Self-serve AI tools | Creators & agencies |
|---|---|---|---|
${COMPARISON.map((r) => `| ${r.label} | ${cell(r.doquier)} | ${cell(r.tools)} | ${cell(r.creators)} |`).join("\n")}

## Doquier vs other AI UGC products

${COMPETITORS.map((c) => `### Doquier vs ${c.name}\n\n${c.verdict}\n\nChoose ${c.name} if: ${c.chooseThem.join(" ")}\n\nChoose Doquier if: ${c.chooseUs.join(" ")}\n\nDetails: ${SITE_URL}/compare/${c.slug}`).join("\n\n")}

## FAQ

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Links

- [Website](${SITE_URL}/): Landing page
- [Book a strategy call](${SITE_URL}/${FORM_URL}): Contact form for new clients
- [Compare](${SITE_URL}/compare): How Doquier compares with self-serve AI UGC tools
${COMPETITORS.map((c) => `- [Doquier vs ${c.name}](${SITE_URL}/compare/${c.slug}): ${c.description}`).join("\n")}
${LEGAL_LINKS.map((l) => `- [${l.label}](${SITE_URL}${l.href})`).join("\n")}

## Company

${SITE.name} is a trading name of ${LEGAL.company}, ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.locality}, ${LEGAL.country}. VAT ${LEGAL.vat}. Contact: ${LEGAL.email}
`;
}

export function GET() {
  return new Response(render(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
