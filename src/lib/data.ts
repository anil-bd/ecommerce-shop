import productsJson from "@data/products.json";
import categoriesJson from "@data/categories.json";
import type { Category, DomSeed, Product } from "@/types";
import { enrichProduct } from "./pricing";
import { todayBusinessDate } from "./time";

const BASELINE_SEED = "altoandoak-dom-v1";

function fnv1aHex(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function computeDomSeed(date: string): DomSeed {
  const parts = [
    fnv1aHex(BASELINE_SEED + "::a::" + date),
    fnv1aHex(BASELINE_SEED + "::b::" + date),
    fnv1aHex(BASELINE_SEED + "::c::" + date),
    fnv1aHex(BASELINE_SEED + "::d::" + date),
  ];
  const seed = parts.join("");
  return {
    seed,
    generatedAt: new Date().toISOString(),
    buildId: `build-${date}-${seed.slice(0, 6)}`,
    strategyVersion: 2,
  };
}

// Date-keyed memoization — warm serverless instances refresh when the
// business date rolls over (3am UTC).
const _cache = new Map<string, { date: string; value: unknown }>();
function memoByDate<T>(key: string, compute: (date: string) => T): T {
  const date = todayBusinessDate();
  const hit = _cache.get(key);
  if (!hit || hit.date !== date) {
    const value = compute(date);
    _cache.set(key, { date, value });
    return value;
  }
  return hit.value as T;
}

const rawProducts = productsJson as Product[];
export const categories: Category[] = categoriesJson as Category[];

export function getProducts(): Product[] {
  return memoByDate("products", () => rawProducts.map(enrichProduct));
}

export function getDomSeed(): DomSeed {
  return memoByDate("domSeed", (date) => computeDomSeed(date));
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return getProducts().filter((p) => p.category === slug);
}

// Raw list with basePrice only — used for generateStaticParams where we don't
// need today's enriched prices (and for static routing of slugs/ids which are
// identical across days).
export const productSlugs: { id: string; slug: string; category: string }[] =
  rawProducts.map((p) => ({ id: p.id, slug: p.slug, category: p.category }));
