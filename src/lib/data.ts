import productsJson from "@data/products.json";
import categoriesJson from "@data/categories.json";
import seedJson from "@data/dom-seed.json";
import type { Category, DomSeed, Product } from "@/types";

export const products: Product[] = productsJson as Product[];
export const categories: Category[] = categoriesJson as Category[];
export const domSeed: DomSeed = seedJson as DomSeed;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}
