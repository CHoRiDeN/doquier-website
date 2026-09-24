/**
 * Single source of truth for landing-page content.
 * Every CTA on the page points to FORM_URL — swap it once the form exists.
 */
export const FORM_URL = "#start";

/** Production origin. Set NEXT_PUBLIC_SITE_URL once the domain is final. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://doquier.com").replace(/\/$/, "");

export const SITE = {
  name: "Doquier",
  title: "Doquier — UGC ads that look real, made with AI",
  tagline: "UGC that looks real. Made on autopilot.",
  description:
    "Doquier is an AI UGC studio for European performance brands. We script, produce and deliver creator-style video ads in every format and European language, at up to 80% less than traditional UGC.",
  shortDescription: "AI-made UGC video ads for European performance brands, delivered in 72 hours.",
  locale: "en_GB",
  keywords: [
    "AI UGC",
    "UGC ads",
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
  { label: "Formats", href: "#formats" },
  { label: "Process", href: "#process" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
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
    title: "Brief",
    description:
      "Tell us about your product, audience and offer in a ten-minute form. No kick-off calls required.",
  },
  {
    title: "Strategy & scripts",
    description:
      "Performance strategists write hooks and angles based on what's winning in your category right now.",
  },
  {
    title: "Casting & production",
    description:
      "We cast AI creators who look like your buyers, then produce every format and variation.",
  },
  {
    title: "Launch & iterate",
    description:
      "Ad-ready files in 9:16, 4:5 and 1:1. We read the results and double down on the winners.",
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

export const COMPARISON: { label: string; doquier: Cell; creators: Cell; tools: Cell }[] = [
  { label: "Looks native to the feed", doquier: true, creators: true, tools: "Depends on your prompts" },
  { label: "Brief to first ads", doquier: "72 hours", creators: "2–4 weeks", tools: "Whenever your team finds time" },
  { label: "Cost per video", doquier: "Up to 80% less", creators: "€150–500+", tools: "Subscription + your team's hours" },
  { label: "Strategy & scripting", doquier: "Included", creators: "Extra", tools: "You write it" },
  { label: "Variations for testing", doquier: "30+ per brief", creators: "1–3 per creator", tools: "Manual" },
  { label: "Usage rights", doquier: "Perpetual, every channel", creators: "Negotiated, time-limited", tools: "Varies by plan" },
  { label: "Done for you", doquier: true, creators: false, tools: false },
];

export const USE_CASES = [
  {
    title: "Product reviews",
    description: "Your product in real hands, in real kitchens and bathrooms. The review that closes the sale.",
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
    title: "Brand campaigns",
    description:
      "Cinematic brand spots for fashion, beauty and lifestyle, without booking a studio, a crew or a model.",
    src: "/media/reviews/brand-ad.mp4",
    poster: "/media/posters/review-brand-ad.jpg",
  },
] as const;

export const FAQ = [
  {
    q: "Will people know it's AI?",
    a: "Our videos are built to feel native to the feed: natural delivery, real-world settings and imperfect, human pacing. Where Meta, TikTok or EU rules require AI disclosure, we deliver files with the right labels so you stay compliant without losing performance.",
  },
  {
    q: "Who owns the content?",
    a: "You do. Every video comes with perpetual commercial usage rights across paid, organic and owned channels. No renewals, no creator whitelisting fees.",
  },
  {
    q: "Which languages and markets do you cover?",
    a: "All major European languages, including English, Spanish, French, German, Italian, Portuguese, Dutch and Polish, with creators cast to look and sound local.",
  },
  {
    q: "What do you need from us?",
    a: "A short brief, your brand assets and product visuals. For physical products, a few photos or a sample helps us get the details exactly right.",
  },
  {
    q: "How fast can we launch?",
    a: "Your first batch lands within 72 hours of an approved brief. After that, we ship new variations every week based on what's performing.",
  },
  {
    q: "How is pricing structured?",
    a: "Plans are tailored to your monthly creative volume. Tell us about your goals and we'll send a proposal within one business day.",
  },
] as const;
