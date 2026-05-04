import Image from "next/image";
import { hashedClass, noiseAttrs, pick, prng, rndInt } from "@/lib/obfuscate";
import type { Product } from "@/types";
import { ScrambledText, DecoyParagraphs } from "./ScrambledText";

type SectionProps = {
  product: Product;
};

const FAQ_BANK = [
  ["How long does shipping take?", "Most orders leave the warehouse the same day. US orders typically arrive in 2–3 business days."],
  ["What's the return window?", "We accept returns within 30 days, no questions asked. We email a prepaid return label."],
  ["Is this covered by warranty?", "Yes — every product carries a 2-year limited warranty against manufacturing defects."],
  ["Do you ship internationally?", "We ship to most countries. Duties and taxes are calculated at checkout."],
  ["Can I track my order?", "You'll get a tracking link in the confirmation email and again when the package ships."],
  ["What's your fit policy?", "If sizing is off, we cover the cost of one free exchange to a different size."],
  ["Are these responsibly made?", "Every maker on our site has been visited by us. We publish supplier audits annually."],
];

export function FAQSection({ product }: SectionProps) {
  const count = rndInt("faq-count::" + product.id, 3, 4);
  const r = prng("faq-pick::" + product.id);
  const items: typeof FAQ_BANK = [];
  const pool = FAQ_BANK.slice();
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(r() * pool.length);
    items.push(pool[idx]);
    pool.splice(idx, 1);
  }
  const wrapCls = hashedClass("faq-wrap::" + product.id);
  const attrs = noiseAttrs("faq::" + product.id);
  return (
    <section className={`flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 ${wrapCls}`} {...attrs}>
      <h2 className="font-serif text-2xl text-stone-900">Frequently asked</h2>
      <ul className="flex flex-col divide-y divide-stone-100">
        {items.map(([q, a], i) => (
          <li key={i} className="py-3 first:pt-0 last:pb-0">
            <details className="group">
              <summary className="cursor-pointer list-none text-sm font-medium text-stone-900 hover:text-stone-700">
                <span className="mr-2 text-stone-400 group-open:rotate-90 inline-block transition">›</span>
                {q}
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-stone-600">{a}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TRENDING_BLURBS = [
  "What's catching on this week",
  "Most-viewed in the last 24 hours",
  "Loved by recent buyers",
  "Hot in this category",
];

export function TrendingNowSection({ product }: SectionProps) {
  const blurb = pick(TRENDING_BLURBS, "trending-blurb::" + product.id);
  const r = prng("trending-imgs::" + product.id);
  const items = Array.from({ length: 4 }).map((_, i) => ({
    seed: Math.floor(r() * 100000),
    delta: Math.floor(r() * 30) + 5,
  }));
  const wrapCls = hashedClass("trending-wrap::" + product.id);
  const attrs = noiseAttrs("trending::" + product.id);
  return (
    <section className={`flex flex-col gap-4 ${wrapCls}`} {...attrs}>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl text-stone-900">{blurb}</h2>
          <p className="mt-1 text-sm text-stone-500">Refreshed every few hours.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone-100"
            data-trending-rank={i + 1}
          >
            <Image
              src={`https://picsum.photos/seed/trending-${product.id}-${item.seed}/600/750`}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover"
            />
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-stone-900">
              +{item.delta}% views
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

const COMPARISON_HEADERS = [
  ["Made in", "Portland, OR", "California", "Vietnam", "Portugal"],
  ["Warranty", "2 years", "1 year", "1 year", "Lifetime"],
  ["Avg rating", "4.7", "4.4", "4.2", "4.6"],
  ["Avg ship time", "2 days", "5 days", "3 days", "7 days"],
  ["Returns window", "30 days", "14 days", "30 days", "60 days"],
];

export function ComparisonTableSection({ product }: SectionProps) {
  const wrapCls = hashedClass("compare-wrap::" + product.id);
  const attrs = noiseAttrs("compare::" + product.id);
  return (
    <section className={`flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 ${wrapCls}`} {...attrs}>
      <h2 className="font-serif text-2xl text-stone-900">How this stacks up</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wider text-stone-500">
              <th className="py-3 font-medium"></th>
              <th className="py-3 font-semibold text-stone-900">This product</th>
              <th className="py-3 font-medium">Big-box brand A</th>
              <th className="py-3 font-medium">Big-box brand B</th>
              <th className="py-3 font-medium">Boutique brand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {COMPARISON_HEADERS.map((row) => (
              <tr key={row[0]}>
                <td className="py-3 text-xs font-medium uppercase tracking-wider text-stone-500">{row[0]}</td>
                {row.slice(1).map((cell, i) => (
                  <td key={i} className={`py-3 ${i === 0 ? "font-semibold text-stone-900" : "text-stone-600"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const CARE_TIPS = [
  "Wipe down with a soft, damp cloth. Avoid harsh detergents.",
  "Air dry; don't tumble. Store flat to keep its shape.",
  "Recharge once a month even when not in use to extend battery life.",
  "Keep away from direct sunlight to preserve the finish.",
  "Hand wash in cold water; lay flat to dry.",
  "Re-season after every fifth use to maintain non-stick performance.",
];

export function CareGuideSection({ product }: SectionProps) {
  const r = prng("care-pick::" + product.id);
  const count = rndInt("care-count::" + product.id, 3, 5);
  const items: string[] = [];
  const pool = CARE_TIPS.slice();
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(r() * pool.length);
    items.push(pool[idx]);
    pool.splice(idx, 1);
  }
  const wrapCls = hashedClass("care-wrap::" + product.id);
  const attrs = noiseAttrs("care::" + product.id);
  return (
    <section className={`flex flex-col gap-4 rounded-xl bg-stone-100 p-6 ${wrapCls}`} {...attrs}>
      <h2 className="font-serif text-2xl text-stone-900">Care guide</h2>
      <DecoyParagraphs scope={"care-decoy::" + product.id} count={2} />
      <ul className="flex flex-col gap-2 text-sm text-stone-700">
        {items.map((tip, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-stone-500" />
            <ScrambledText text={tip} instanceKey={`care-tip::${product.id}::${i}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const STORY_OPENERS = [
  "From the maker:",
  "Behind the design:",
  "Why we picked it:",
  "A note from the team:",
];

const STORY_BODIES = [
  "We met the maker at a small shop in Oregon and brought a single sample home. Six months later it's our most-asked-after item.",
  "Built one piece at a time in a workshop you could fit in a living room. The maker still answers customer service emails herself.",
  "We tested seven different versions before settling on this one. The difference is in the details that don't show up in spec sheets.",
  "It's the kind of thing we wished existed — so we worked with a maker we trust to bring it to the catalog.",
];

export function MakerNoteSection({ product }: SectionProps) {
  const opener = pick(STORY_OPENERS, "story-opener::" + product.id);
  const body = pick(STORY_BODIES, "story-body::" + product.id);
  const wrapCls = hashedClass("story-wrap::" + product.id);
  const attrs = noiseAttrs("story::" + product.id);
  return (
    <aside className={`flex flex-col gap-3 rounded-xl border-l-4 border-emerald-700 bg-emerald-50/50 p-6 ${wrapCls}`} {...attrs}>
      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900">{opener}</span>
      <ScrambledText
        text={body}
        instanceKey={`story-body-st::${product.id}`}
        as="p"
        className="block text-base leading-relaxed text-stone-800"
      />
    </aside>
  );
}
