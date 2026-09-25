/**
 * Single source of truth for landing-page content.
 * Every CTA links to FORM_URL; the strategy-call modal intercepts these links (and a direct /#book-a-call visit).
 */
export const FORM_URL = "#book-a-call";

/** Strategy-call form options. Values are stored in Brevo exactly as written here. */
export const GOALS = [
  "Brand awareness",
  "Sales & conversions",
  "Reviews & reputation",
  "App installs",
  "Launch in a new market",
  "Something else",
] as const;
export const MARKETS = [
  "Spain",
  "Germany",
  "France",
  "Italy",
  "United Kingdom",
  "Netherlands",
  "Portugal",
  "Poland",
  "Other",
] as const;
export const SERVICE_OPTIONS = ["Content strategy", "Video production", "Distribution"] as const;
export const INDUSTRIES = [
  "E-commerce & retail",
  "Fashion & beauty",
  "Real estate",
  "Apps & software",
  "Travel & hospitality",
  "Health & wellness",
  "Professional services",
  "Other",
] as const;
export const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"] as const;
export const MONTHLY_AD_SPEND = [
  "Under €10k",
  "€10k–€50k",
  "€50k–€100k",
  "€100k–€250k",
  "€250k+",
] as const;

/** Production origin. Override with NEXT_PUBLIC_SITE_URL if needed. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.doquierlabs.com").replace(/\/$/, "");

export const SITE = {
  name: "Doquier",
  title: "Doquier — AI UGC content, planned, produced and published for you",
  tagline: "UGC that looks real. Planned, made and posted.",
  description:
    "Doquier is a done-for-you AI content studio for European brands. We turn a business goal into a content plan, produce hundreds of realistic UGC videos in every format and language, and publish them in your target markets.",
  shortDescription: "Done-for-you AI UGC: content strategy, bulk video production and social distribution for European brands.",
  locale: "en_GB",
  keywords: [
    "AI UGC",
    "AI UGC agency",
    "AI content studio",
    "UGC ads",
    "social media distribution",
    "content strategy",
    "Shopify product videos",
    "real estate property videos",
    "AI video ads",
    "user-generated content",
    "creator ads",
    "performance creative",
    "TikTok ads",
    "Meta ads",
    "Reels ads",
    "ad creative agency",
    "AI avatars",
    "Europe",
  ],
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#process" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Rotating word in the hero subline: what the content is for. */
export const HERO_USE_CASES = [
  "product reviews",
  "Shopify product pages",
  "property tours",
  "app launches",
  "paid social ads",
  "brand campaigns",
] as const;

/** The three services, in the order a client moves through them. */
export const SERVICES = [
  {
    step: "Plan",
    title: "Content strategy",
    description:
      "We start from your goal (awareness in a new country, more reviews, more installs) and turn it into a plan: angles, hooks, formats, volume and a publishing calendar.",
    deliverable: "Content plan & calendar",
  },
  {
    step: "Produce",
    title: "AI UGC production",
    description:
      "Our studio produces the plan in bulk: hundreds of on-brand videos across formats and languages, checked by people before they ever reach you.",
    deliverable: "Ready-to-post videos, every week",
  },
  {
    step: "Distribute",
    title: "Social distribution",
    description:
      "We publish natively in each target market on a steady cadence, scale reach as far as the plan needs and report on what's working.",
    deliverable: "Publishing, reach & reporting",
  },
] as const;

export const CLIENTS = [
  "Waynabox",
  "Roamic",
  "Fluido Factory",
  "PowerUp Menu",
  "and more +"
] as const;

/**
 * Headline metrics. Cost and ROAS figures come from the Doquier team;
 * the remaining numbers are placeholders until real data is available.
 */
export const METRICS = [
  {
    value: 80,
    prefix: "Up to ",
    suffix: "%",
    label: "lower cost than creator-made UGC",
  },
  {
    value: 4,
    prefix: "Up to ",
    suffix: "×",
    label: "return on ad spend on winning creatives",
  },
  {
    value: 72,
    prefix: "",
    suffix: "h",
    label: "from brief to your first batch of ads", // placeholder
  },
  {
    value: 30,
    prefix: "",
    suffix: "+",
    label: "hook and angle variations per brief", // placeholder
  },
] as const;

export const LANGUAGES = [
  "ENGLISH",
  "ESPAÑOL",
  "FRANÇAIS",
  "DEUTSCH",
  "ITALIANO",
  "PORTUGUÊS",
  "NEDERLANDS",
  "POLSKI",
] as const;

/** English names of LANGUAGES, for metadata, structured data and llms.txt. */
export const LANGUAGE_NAMES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Polish",
] as const;

/** Example ads, each cast and voiced natively for its market. */
export const LANGUAGE_EXAMPLES = [
  {
    code: "DE",
    language: "German",
    category: "Lifestyle",
    src: "/media/languages/de.mp4",
    poster: "/media/posters/language-de.jpg",
  },
  {
    code: "IT",
    language: "Italian",
    category: "Beauty",
    src: "/media/languages/it.mp4",
    poster: "/media/posters/language-it.jpg",
  },
  {
    code: "ES",
    language: "Spanish",
    category: "Tech",
    src: "/media/languages/es.mp4",
    poster: "/media/posters/language-es.jpg",
  },
] as const;

export type Format = {
  name: string;
  description: string;
  media: { type: "video" | "image"; src: string; poster?: string };
};

export const FORMATS: Format[] = [
  {
    name: "Talking head",
    description: "Straight-to-camera pitches that feel like a friend's recommendation.",
    media: { type: "video", src: "/media/formats/talking-head-1.mp4", poster: "/media/posters/talking-head-1.jpg" },
  },
  {
    name: "Product ad",
    description: "Product front and centre. Clear offer, fast hook, ready to run.",
    media: { type: "video", src: "/media/formats/product-ad-1.mp4", poster: "/media/posters/product-ad-1.jpg" },
  },
  {
    name: "Reaction & demo",
    description: "Someone reacting live while your product does the work.",
    media: { type: "video", src: "/media/formats/reaction-demo-2.mp4", poster: "/media/posters/reaction-demo-2.jpg" },
  },
  {
    name: "Interview",
    description: "Street-style Q&A that builds trust through real-sounding answers.",
    media: { type: "video", src: "/media/formats/interview-1.mp4", poster: "/media/posters/interview-1.jpg" },
  },
  {
    name: "Podcast",
    description: "Long-form credibility, cut into clips that hook in two seconds.",
    media: { type: "video", src: "/media/formats/podcast-1.mp4", poster: "/media/posters/podcast-1.jpg" },
  },
  {
    name: "Wall text",
    description: "Bold on-screen copy that carries the message, sound on or off.",
    media: { type: "video", src: "/media/formats/walltext-1.mp4", poster: "/media/posters/walltext-1.jpg" },
  },
  {
    name: "Carousel",
    description: "Swipe-ready slides for highlights, comparisons and tips.",
    media: { type: "image", src: "/media/formats/carousel-1.jpg" },
  },
];

export const PROCESS = [
  {
    title: "Strategy call",
    description: "Thirty minutes to understand your brand, audience, markets and the goal you want to hit.",
  },
  {
    title: "Content plan",
    description:
      "A plan built around that goal: how many pieces, which formats, which languages and when each one goes live.",
  },
  {
    title: "Production",
    description: "We produce the plan in bulk. You review and approve each batch; we handle every revision.",
  },
  {
    title: "Distribution",
    description:
      "We publish in each target market on a steady cadence, or hand your team ready-to-post files. Your call.",
  },
  {
    title: "Report & iterate",
    description: "We track what performs and feed it into the next batch, so every round beats the last.",
  },
] as const;

export const DISTRIBUTION_POINTS = [
  {
    title: "In-market publishing",
    description: "Posts go out from the country you're targeting, in its language, to the people you want to reach.",
  },
  {
    title: "Reach that scales",
    description: "Add accounts and markets as results come in. There's no cap on how far a plan can go.",
  },
] as const;

/** Ways to work with Doquier. No prices: each engagement is scoped on the strategy call. */
export const ENGAGEMENTS = [
  {
    name: "Production",
    description: "You have the strategy and the channels. We produce the videos, in bulk and on schedule.",
    includes: ["Scripts & hooks", "Every format & language", "Weekly batches"],
    featured: false,
  },
  {
    name: "Production + distribution",
    description: "We produce the videos and publish them in your target markets, then report on what's working.",
    includes: ["Everything in Production", "In-market publishing", "Monthly reporting"],
    featured: false,
  },
  {
    name: "Full programme",
    description: "Goal in, results out. Strategy, production, distribution and optimisation, run as one team.",
    includes: ["Content strategy & calendar", "Production & distribution", "Ongoing optimisation"],
    featured: true,
  },
] as const;

export const COMPETITORS = [
  { name: "Arcads", src: "/media/competitors/arcads.mp4", poster: "/media/posters/competitor-arcads.jpg" },
  { name: "HeyGen", src: "/media/competitors/heygen.mp4", poster: "/media/posters/competitor-heygen.jpg" },
  { name: "Rexen", src: "/media/competitors/rexen.mp4", poster: "/media/posters/competitor-rexen.jpg" },
  { name: "MindShift AI", src: "/media/competitors/mindshift.mp4", poster: "/media/posters/competitor-mindshift.jpg" },
  { name: "CustomiqAI", src: "/media/competitors/customiqai.mp4", poster: "/media/posters/competitor-customiqai.jpg" },
  { name: "Siriusly.ai", src: "/media/competitors/siriusly.mp4", poster: "/media/posters/competitor-siriusly.jpg" },
  { name: "TuComercialVirtual", src: "/media/competitors/tucomercialvirtual.mp4", poster: "/media/posters/competitor-tucomercialvirtual.jpg" },
] as const;

type Cell = string | boolean;

export const COMPARISON: { label: string; doquier: Cell; tools: Cell; creators: Cell }[] = [
  { label: "Looks native to the feed", doquier: true, tools: "Depends on your prompts", creators: true },
  { label: "Strategy & content plan", doquier: "Included", tools: "You write it", creators: "Extra cost" },
  { label: "Tool to learn", doquier: "None, it's done for you", tools: "Weeks to master", creators: "None" },
  { label: "Monthly volume", doquier: "Hundreds of videos", tools: "Limited by your team's hours", creators: "A handful" },
  { label: "Languages & markets", doquier: "8+ languages, cast locally", tools: "One at a time, by hand", creators: "One creator per market" },
  { label: "Distribution", doquier: "Included, optional", tools: false, creators: "Rarely" },
  { label: "Cost per video", doquier: "Up to 80% less", tools: "Subscription + your team's hours", creators: "€150–500+" },
  { label: "Usage rights", doquier: "Perpetual, every channel", tools: "Varies by plan", creators: "Negotiated, time-limited" },
];

export const USE_CASES = [
  {
    title: "Product reviews",
    description: "Your product in real hands, in real homes. Reviews for product pages, marketplaces and paid social.",
    src: "/media/reviews/product.mp4",
    poster: "/media/posters/review-product.jpg",
  },
  {
    title: "Service testimonials",
    description: "Believable customer stories for clinics, apps and experience-led brands.",
    src: "/media/reviews/service.mp4",
    poster: "/media/posters/review-service.jpg",
  },
  {
    title: "Fashion & product pages",
    description:
      "Try-ons and product details that turn a Shopify page into a showroom, without a studio, a crew or a model.",
    src: "/media/reviews/brand-ad.mp4",
    poster: "/media/posters/review-brand-ad.jpg",
  },
] as const;

/** Further sectors we serve, listed under the use-case cards until they have their own examples. */
export const MORE_USE_CASES = [
  "Real estate property tours",
  "App launches",
  "Paid social ads",
  "Hospitality & travel",
  "Clinics & wellness",
] as const;

export const FAQ = [
  {
    q: "Do we need to learn a tool?",
    a: "No. There's no software to learn and no prompts to write. You talk to our team, approve the plan and review the videos. We do the rest.",
  },
  {
    q: "Will people know it's AI?",
    a: "Our videos are built to feel native to the feed: natural delivery, real-world settings and imperfect, human pacing. Where Meta, TikTok or EU rules require AI disclosure, we deliver and publish with the right labels so you stay compliant.",
  },
  {
    q: "How many videos can you produce?",
    a: "From a few dozen to several hundred a month. Volume is set in your content plan and can scale up or down as results come in.",
  },
  {
    q: "Can you publish the content for us?",
    a: "Yes. Distribution is optional: we can publish natively in each target market on a steady cadence and report on performance, or deliver ready-to-post files for your team.",
  },
  {
    q: "Who owns the content?",
    a: "You do. Every video comes with perpetual commercial usage rights across paid, organic and owned channels. No renewals, no creator whitelisting fees.",
  },
  {
    q: "Which languages and markets do you cover?",
    a: "All major European languages, including English, Spanish, French, German, Italian, Portuguese, Dutch and Polish, with creators cast to look and sound local. Most other languages are available on request.",
  },
  {
    q: "How fast can we launch?",
    a: "Most brands have a content plan within a week of the strategy call, and the first batch of videos shortly after.",
  },
  {
    q: "How is pricing structured?",
    a: "Every engagement is scoped on the strategy call around your goal, volume and the services you need. You get a proposal within one business day.",
  },
] as const;
