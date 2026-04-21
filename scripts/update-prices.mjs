#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsPath = resolve(__dirname, "..", "data", "products.json");

const MAX_DRIFT = 0.10;
const FLOOR_RATIO = 0.5;
const CEIL_RATIO = 1.5;

function round2(n) {
  return Math.round(n * 100) / 100;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

async function main() {
  const raw = await readFile(productsPath, "utf8");
  const products = JSON.parse(raw);

  const updated = products.map((p) => {
    const drift = (Math.random() * 2 - 1) * MAX_DRIFT;
    const candidate = p.currentPrice * (1 + drift);
    const floor = p.basePrice * FLOOR_RATIO;
    const ceil = p.basePrice * CEIL_RATIO;
    const next = round2(clamp(candidate, floor, ceil));
    return {
      ...p,
      previousPrice: p.currentPrice,
      currentPrice: next,
    };
  });

  const totalShift = updated.reduce(
    (sum, p, i) => sum + (p.currentPrice - products[i].currentPrice),
    0,
  );

  await writeFile(productsPath, JSON.stringify(updated, null, 2) + "\n");
  console.log(
    `Updated ${updated.length} products. Net price shift: ${totalShift >= 0 ? "+" : ""}${totalShift.toFixed(2)} USD`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
