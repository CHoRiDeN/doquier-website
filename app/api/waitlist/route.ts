import { COMPANY_SIZES, GOALS, INDUSTRIES, MARKETS, MONTHLY_AD_SPEND, SERVICE_OPTIONS } from "@/lib/site";

/**
 * Strategy-call request → Brevo.
 * 1. Upserts the contact into the "Website leads" list.
 * 2. Upserts a CRM company (by domain) with the qualifying answers and links the contact to it.
 *
 * Required env: BREVO_API_KEY, BREVO_LIST_ID.
 *
 * Company fields (Brevo internal names):
 * - company_size (custom, text): the size range exactly as chosen, e.g. "1–10".
 * - number_of_employees (built-in, number): lower bound of that range, so it still filters and sorts.
 * - marketing_spend (custom, text): the spend range exactly as chosen.
 * - website / domain (built-in, text): normalised company URL and its bare domain.
 * - industry (built-in, text): the sector chosen.
 * - primary_goal, target_markets, services_interest (custom, text): lists are stored comma-separated.
 */
const BREVO = "https://api.brevo.com/v3";

const EMPLOYEES_LOWER_BOUND: Record<(typeof COMPANY_SIZES)[number], number> = {
  "1–10": 1,
  "11–50": 11,
  "51–200": 51,
  "201–500": 201,
  "500+": 501,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accepts "acme.com", "www.acme.com" or a full URL; returns a normalised URL and bare domain, or null. */
function parseWebsite(input: string) {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!url.hostname.includes(".")) return null;
    return { website: url.origin + (url.pathname === "/" ? "" : url.pathname), domain: url.hostname.replace(/^www\./, "") };
  } catch {
    return null;
  }
}

type Payload = {
  company?: unknown;
  email?: unknown;
  size?: unknown;
  spend?: unknown;
  website?: unknown;
  goal?: unknown;
  markets?: unknown;
  services?: unknown;
  industry?: unknown;
  nickname?: unknown; // honeypot
};

/** Keeps only strings that are valid options, in the order they were offered. */
function pick(value: unknown, options: readonly string[]) {
  const chosen = Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  return options.filter((option) => chosen.includes(option));
}

function brevo(path: string, init: RequestInit & { apiKey: string }) {
  const { apiKey, ...rest } = init;
  return fetch(`${BREVO}${path}`, {
    ...rest,
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    cache: "no-store",
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) {
    console.error("[book-a-call] BREVO_API_KEY or BREVO_LIST_ID is not configured");
    return Response.json({ error: "Signups are temporarily unavailable." }, { status: 503 });
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill every field; humans never see this one. Pretend success.
  if (typeof body.nickname === "string" && body.nickname.length > 0) {
    return Response.json({ ok: true });
  }

  const company = typeof body.company === "string" ? body.company.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 160) : "";
  const size = typeof body.size === "string" ? body.size : "";
  const spend = typeof body.spend === "string" ? body.spend : "";
  const site = typeof body.website === "string" ? parseWebsite(body.website.slice(0, 200)) : null;
  const goal = typeof body.goal === "string" ? body.goal : "";
  const industry = typeof body.industry === "string" ? body.industry : "";
  const markets = pick(body.markets, MARKETS);
  const services = pick(body.services, SERVICE_OPTIONS);

  if (!company || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter your company name and a valid email." }, { status: 400 });
  }
  if (!site) {
    return Response.json({ error: "Please enter your company website, e.g. acme.com." }, { status: 400 });
  }
  if (!(GOALS as readonly string[]).includes(goal) || !markets.length || !services.length) {
    return Response.json({ error: "Please choose a goal, at least one market and one service." }, { status: 400 });
  }
  if (
    !(INDUSTRIES as readonly string[]).includes(industry) ||
    !(COMPANY_SIZES as readonly string[]).includes(size) ||
    !(MONTHLY_AD_SPEND as readonly string[]).includes(spend)
  ) {
    return Response.json({ error: "Please choose your sector, company size and monthly spend." }, { status: 400 });
  }

  // 1. Contact → list (updateEnabled makes this an upsert for returning visitors).
  const contactRes = await brevo("/contacts", {
    apiKey,
    method: "POST",
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
  });
  if (!contactRes.ok) {
    console.error("[book-a-call] contact upsert failed", contactRes.status, await contactRes.text());
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  // 2. Company, upserted by domain (Brevo allows one company per domain), linked to the contact.
  //    A failure here still keeps the lead.
  try {
    const lookup = await brevo(`/contacts/${encodeURIComponent(email)}`, { apiKey, method: "GET" });
    const contactId = lookup.ok ? ((await lookup.json()) as { id?: number }).id : undefined;

    const attributes = {
      company_size: size,
      number_of_employees: EMPLOYEES_LOWER_BOUND[size as keyof typeof EMPLOYEES_LOWER_BOUND],
      marketing_spend: spend,
      website: site.website,
      domain: site.domain,
      industry,
      primary_goal: goal,
      target_markets: markets.join(", "),
      services_interest: services.join(", "),
    };

    const filters = encodeURIComponent(JSON.stringify({ "attributes.domain": site.domain }));
    const existingRes = await brevo(`/companies?filters=${filters}&limit=1`, { apiKey, method: "GET" });
    const existing = existingRes.ok
      ? ((await existingRes.json()) as { items?: { id: string }[] }).items?.[0]
      : undefined;

    if (existing) {
      // Same company signing up again (e.g. a colleague): refresh its details and link this contact.
      const update = await brevo(`/companies/${existing.id}`, {
        apiKey,
        method: "PATCH",
        // Re-sending `domain` trips Brevo's uniqueness check even for the same company, so omit it here.
        body: JSON.stringify({ attributes: { ...attributes, domain: undefined } }),
      });
      if (!update.ok) console.error("[book-a-call] company update failed", update.status, await update.text());
      if (contactId) {
        const link = await brevo(`/companies/link-unlink/${existing.id}`, {
          apiKey,
          method: "PATCH",
          body: JSON.stringify({ linkContactIds: [contactId] }),
        });
        if (!link.ok) console.error("[book-a-call] company link failed", link.status, await link.text());
      }
    } else {
      const create = await brevo("/companies", {
        apiKey,
        method: "POST",
        body: JSON.stringify({ name: company, attributes, ...(contactId ? { linkedContactsIds: [contactId] } : {}) }),
      });
      if (!create.ok) console.error("[book-a-call] company create failed", create.status, await create.text());
    }
  } catch (error) {
    console.error("[book-a-call] company step failed", error);
  }

  return Response.json({ ok: true });
}
