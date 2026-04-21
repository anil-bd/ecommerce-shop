import { prng } from "./obfuscate";

export type RatingInfo = {
  rating: number;
  reviewCount: number;
};

export function ratingFor(productId: string): RatingInfo {
  const r = prng("rating::" + productId);
  const rating = Math.round((3.7 + r() * 1.3) * 10) / 10;
  const reviewCount = Math.floor(40 + r() * 960);
  return { rating, reviewCount };
}

export type StockInfo = {
  level: "in-stock" | "low" | "out";
  remaining: number | null;
  soldToday: number;
};

export function stockFor(productId: string): StockInfo {
  const r = prng("stock::" + productId);
  const roll = r();
  if (roll < 0.04) {
    return { level: "out", remaining: 0, soldToday: Math.floor(r() * 30) + 5 };
  }
  if (roll < 0.18) {
    return {
      level: "low",
      remaining: Math.floor(r() * 6) + 2,
      soldToday: Math.floor(r() * 12) + 3,
    };
  }
  return {
    level: "in-stock",
    remaining: null,
    soldToday: Math.floor(r() * 40) + 8,
  };
}

export function viewersNow(productId: string): number {
  const r = prng("viewers::" + productId);
  return Math.floor(r() * 42) + 3;
}
