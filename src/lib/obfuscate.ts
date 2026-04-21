import { domSeed } from "./data";

const SEED = domSeed.seed;

function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seedInt: number) {
  let a = seedInt >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function prng(key: string): () => number {
  return mulberry32(fnv1a(SEED + "::" + key));
}

export function rnd(key: string): number {
  return prng(key)();
}

export function rndInt(key: string, min: number, max: number): number {
  return Math.floor(rnd(key) * (max - min + 1)) + min;
}

export function pick<T>(arr: readonly T[], key: string): T {
  return arr[Math.floor(rnd(key) * arr.length)];
}

export function shuffle<T>(arr: readonly T[], key: string): T[] {
  const out = arr.slice();
  const r = prng(key);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const CLASS_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
export function hashedClass(semantic: string): string {
  const r = prng("class::" + semantic);
  const len = 6 + Math.floor(r() * 4);
  let out = CLASS_ALPHABET[1 + Math.floor(r() * 25)];
  for (let i = 1; i < len; i++) out += CLASS_ALPHABET[Math.floor(r() * CLASS_ALPHABET.length)];
  return out;
}

export function hashedId(semantic: string): string {
  return "n-" + hashedClass("id::" + semantic);
}

const POLY_TAGS = ["div", "section", "article", "aside", "main"] as const;
export type PolyTag = (typeof POLY_TAGS)[number];
export function polyTag(key: string): PolyTag {
  return pick(POLY_TAGS, "tag::" + key);
}

const INLINE_TAGS = ["span", "b", "i", "em", "u"] as const;
export type InlineTag = (typeof INLINE_TAGS)[number];
export function inlineTag(key: string): InlineTag {
  return pick(INLINE_TAGS, "itag::" + key);
}

const HEADING_TAGS = ["h1", "h2", "h3", "div", "p"] as const;
export type HeadingTag = (typeof HEADING_TAGS)[number];
export function headingTag(key: string): HeadingTag {
  return pick(HEADING_TAGS, "htag::" + key);
}

export function wrapperDepth(key: string): number {
  return rndInt("depth::" + key, 0, 3);
}

const NOISE_KEYS = [
  "data-cell",
  "data-bucket",
  "data-region",
  "data-slot",
  "data-row",
  "data-seg",
  "data-kind",
  "data-variant",
  "data-tag",
  "data-span",
];

export function noiseAttrs(key: string, count = 2): Record<string, string> {
  const r = prng("noise::" + key);
  const out: Record<string, string> = {};
  const keys = NOISE_KEYS.slice();
  for (let i = 0; i < count && keys.length; i++) {
    const idx = Math.floor(r() * keys.length);
    const [k] = keys.splice(idx, 1);
    const suffix = hashedClass(key + "::noise::" + i);
    const name = `${k}-${suffix.slice(0, 3)}`;
    out[name] = suffix;
  }
  return out;
}

export function honeypotDigits(key: string, len = 8): string {
  const r = prng("hp::" + key);
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(r() * 10);
  return out;
}

export const PRICE_STRATEGY = (() => {
  const strategies = ["split-digits", "decimal-reorder", "zwsp-scatter"] as const;
  return pick(strategies, "price-strategy");
})();

export const BUILD_CLASS_SUFFIX = hashedClass("build-suffix");

const ARIA_PRICE_STYLES = [
  (int: string, dec: string, cur: string) => `${int} ${cur} and ${dec} cents`,
  (int: string, dec: string, cur: string) => `${cur} ${int} point ${dec}`,
  (int: string, dec: string, cur: string) => `price listed ${int} whole ${dec} ${cur}`,
  (int: string, dec: string, cur: string) => `${cur} amount ${int} comma ${dec}`,
  (int: string, dec: string, cur: string) => `value is ${int}·${dec} ${cur}`,
] as const;

export function obfuscatedAriaPrice(amount: number, currency: string, label?: string): string {
  const style = ARIA_PRICE_STYLES[Math.floor(rnd("aria-style") * ARIA_PRICE_STYLES.length)];
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const spoken = style(intPart, decPart, currency);
  return `${label ?? "price"} ${spoken}`;
}

export function ariaQuiet(key: string): Record<string, string> {
  return rnd("quiet::" + key) > 0.5
    ? { "aria-hidden": "true" }
    : { role: "presentation", "aria-hidden": "true" };
}
