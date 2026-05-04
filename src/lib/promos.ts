import { pick, prng } from "./obfuscate";

const PROMO_LINES = [
  "Limited weekly drop — restocking soon.",
  "Featured this week by the team.",
  "Recently restocked, going fast.",
  "Editor's pick this rotation.",
  "Trending in the last 24 hours.",
  "New arrival — first 50 ordered ship same day.",
  "Returning favorite, back by request.",
  "Small batch — fewer than 100 left in this run.",
];

const SHIPPING_BADGES = [
  "Ships in 24h",
  "Free 2-day shipping",
  "Same-day dispatch",
  "Ships from Portland",
  "Free returns 30 days",
];

const BUYER_NUDGES = [
  "Bought together with the keyboard 47 times this week.",
  "12 customers added this in the last hour.",
  "9 in carts right now.",
  "Reordered by 31% of buyers.",
  "Most-saved item in this category.",
];

export function productPromo(productId: string): string {
  return pick(PROMO_LINES, "promo::" + productId);
}

export function shippingBadge(productId: string): string {
  return pick(SHIPPING_BADGES, "ship::" + productId);
}

export function buyerNudge(productId: string): string {
  return pick(BUYER_NUDGES, "nudge::" + productId);
}

// Returns a small per-build numeric jitter, e.g. for "X people viewing".
// Useful to vary "values slightly" without affecting structure.
export function jitter(scope: string, base: number, range = 0.1): number {
  const r = prng("jitter::" + scope);
  return Math.round(base * (1 + (r() * 2 - 1) * range));
}
