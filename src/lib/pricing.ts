import type { Product } from "@/types";
import { todayBusinessDate, yesterdayBusinessDate } from "./time";

const BASELINE_SEED = "altoandoak-pricing-v1";

function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

// Returns a float in [-1, 1] derived deterministically from (date, productId).
function priceNoise(date: string, productId: string): number {
  const h = fnv1a(`${BASELINE_SEED}::${date}::${productId}`);
  return ((h % 200_001) - 100_000) / 100_000;
}

// Each day's price = basePrice * (1 + noise * 0.15), bounded to [0.7, 1.3] * basePrice.
function factorFor(date: string, productId: string): number {
  const raw = 1 + priceNoise(date, productId) * 0.15;
  return Math.max(0.7, Math.min(1.3, raw));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function computePrices(product: Product): {
  currentPrice: number;
  previousPrice: number;
} {
  const currentPrice = round2(product.basePrice * factorFor(todayBusinessDate(), product.id));
  const previousPrice = round2(
    product.basePrice * factorFor(yesterdayBusinessDate(), product.id),
  );
  return { currentPrice, previousPrice };
}

export function enrichProduct(product: Product): Product {
  const { currentPrice, previousPrice } = computePrices(product);
  return { ...product, currentPrice, previousPrice };
}
