import { prng } from "./obfuscate";

export type Variant = {
  id: string;
  label: string;
  swatch?: string;
  available: boolean;
};

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["7", "8", "9", "10", "11", "12"];
const COLORS = [
  { id: "black", label: "Black", swatch: "#1f1f1f" },
  { id: "stone", label: "Stone", swatch: "#d6d0c4" },
  { id: "navy", label: "Navy", swatch: "#1e2b4a" },
  { id: "olive", label: "Olive", swatch: "#5a6b3a" },
  { id: "rust", label: "Rust", swatch: "#b15439" },
  { id: "cream", label: "Cream", swatch: "#efe7d4" },
];

export type VariantGroup = {
  kind: "size" | "color" | "capacity" | "finish";
  label: string;
  variants: Variant[];
};

export function variantsFor(productId: string, categorySlug: string): VariantGroup[] {
  const r = prng("variants::" + productId);
  const groups: VariantGroup[] = [];

  if (categorySlug === "apparel") {
    const isShoe = productId === "p-011";
    const sizes = (isShoe ? SHOE_SIZES : APPAREL_SIZES).map((s, i) => ({
      id: s.toLowerCase(),
      label: s,
      available: r() > 0.1 || i === 0,
    }));
    groups.push({ kind: "size", label: "Size", variants: sizes });
    const colorCount = 2 + Math.floor(r() * 3);
    const colors = pickN(COLORS, colorCount, r).map((c) => ({
      id: c.id,
      label: c.label,
      swatch: c.swatch,
      available: r() > 0.12,
    }));
    groups.push({ kind: "color", label: "Color", variants: colors });
    return groups;
  }

  if (categorySlug === "electronics") {
    const colorCount = 2 + Math.floor(r() * 2);
    const colors = pickN(COLORS.slice(0, 4), colorCount, r).map((c) => ({
      id: c.id,
      label: c.label,
      swatch: c.swatch,
      available: true,
    }));
    groups.push({ kind: "color", label: "Finish", variants: colors });
    if (r() > 0.5) {
      const options = ["64GB", "128GB", "256GB"].slice(0, 2 + Math.floor(r() * 2));
      groups.push({
        kind: "capacity",
        label: "Storage",
        variants: options.map((o) => ({ id: o.toLowerCase(), label: o, available: true })),
      });
    }
    return groups;
  }

  // home-kitchen
  const colorCount = 2 + Math.floor(r() * 3);
  const colors = pickN(COLORS, colorCount, r).map((c) => ({
    id: c.id,
    label: c.label,
    swatch: c.swatch,
    available: true,
  }));
  groups.push({ kind: "color", label: "Color", variants: colors });
  return groups;
}

function pickN<T>(arr: readonly T[], n: number, r: () => number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(r() * copy.length);
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out;
}
