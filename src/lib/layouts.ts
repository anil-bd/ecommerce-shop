import { daysSinceEpoch, todayBusinessDate } from "./time";
import { getDomSeed } from "./data";

export const LAYOUT_COUNT = 10;

function fnvInt(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function productOffset(productId: string): number {
  return fnvInt(productId) % LAYOUT_COUNT;
}

// Rotation nonce bumps force a new seed on every deploy, so layouts reshuffle
// mid-day when CI pushes — not only at the 3am UTC business-date rollover.
function seedOffset(variant: string): number {
  return fnvInt(`${getDomSeed().seed}::${variant}`) % LAYOUT_COUNT;
}

// `* 7` is coprime with LAYOUT_COUNT=10, so the daily component alone cycles
// through all 10 indices with no adjacent-day repeats; the seed term adds a
// per-deploy shuffle on top.
export function cardLayoutIndex(productId: string): number {
  const day = daysSinceEpoch(todayBusinessDate());
  return (day * 7 + productOffset(productId) + seedOffset("card")) % LAYOUT_COUNT;
}

// Detail uses a different linear coefficient and seed variant so a product's
// card and detail layouts are decorrelated on any given day/deploy.
export function detailLayoutIndex(productId: string): number {
  const day = daysSinceEpoch(todayBusinessDate());
  return (day * 3 + productOffset(productId) + 4 + seedOffset("detail")) % LAYOUT_COUNT;
}
