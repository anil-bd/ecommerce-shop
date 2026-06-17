import Link from "next/link";
import { categories, getDomSeed, getProducts } from "@/lib/data";
import { buildClassSuffix, hashedClass, noiseAttrs, priceStrategy, rnd } from "@/lib/obfuscate";
import { productPromo, buyerNudge, shippingBadge } from "@/lib/promos";
import { todayBusinessDate, yesterdayBusinessDate } from "@/lib/time";

export const revalidate = 300;

export const metadata = {
  title: "Build info — Alto & Oak",
  description:
    "Live view of the current DOM rotation: which sections are showing today, sample hashed class names, per-product promo lines, and the seed driving it all.",
};

const PRODUCT_SECTIONS = [
  { key: "story", label: "Maker note (\"From the maker\")" },
  { key: "faq", label: "Frequently asked" },
  { key: "compare", label: "How this stacks up (comparison table)" },
  { key: "care", label: "Care guide" },
  { key: "trending", label: "Trending now / Most-viewed" },
];

const HOME_SECTIONS = [
  { key: "categories", label: "Shop by category" },
  { key: "featured", label: "Featured today" },
  { key: "vp", label: "Value props strip" },
  { key: "makers", label: "Makers banner" },
  { key: "new", label: "New arrivals" },
  { key: "tst", label: "Testimonials" },
  { key: "nl", label: "Newsletter signup" },
];

export default function BuildInfoPage() {
  const seed = getDomSeed();
  const products = getProducts();

  // Re-compute the visibility flags exactly the way the pages do.
  // (Anything that calls rnd(...) with the same key returns the same value.)
  const today = todayBusinessDate();
  const yesterday = yesterdayBusinessDate();

  const homeFlags = HOME_SECTIONS.map((s) => ({
    ...s,
    show: rnd("home-section-show::" + s.key) > 0.4,
  }));

  const sampleProduct = products[0];
  const productSectionFlags = PRODUCT_SECTIONS.map((s) => ({
    ...s,
    show: rnd("page-section-show::" + sampleProduct.id + "::" + s.key) > 0.45,
  }));

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Link href="/" className="text-xs text-stone-500 hover:text-stone-900">
          ← Back to shop
        </Link>
        <h1 className="font-serif text-4xl text-stone-900">Current rotation</h1>
        <p className="max-w-2xl text-sm text-stone-600">
          This page exposes the state of the daily DOM rotation. Reload it after
          triggering a new build and you&apos;ll see different values across the
          board — which is exactly what scrapers see (and break on).
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 rounded-xl border border-stone-200 bg-white p-6 md:grid-cols-2">
        <Stat label="Build ID" value={seed.buildId} mono />
        <Stat label="Strategy version" value={String(seed.strategyVersion)} />
        <Stat label="Business date (today)" value={today} mono />
        <Stat label="Business date (yesterday)" value={yesterday} mono />
        <Stat label="Generated at (this render)" value={seed.generatedAt} mono />
        <Stat label="Seed (first 16 of 32)" value={seed.seed.slice(0, 16) + "…"} mono />
        <Stat label="Build class suffix" value={buildClassSuffix()} mono />
        <Stat label="Price strategy" value={priceStrategy()} mono />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-stone-900">Home page sections today</h2>
        <p className="text-sm text-stone-600">
          Each is coin-flipped per build. Even when a section shows, it&apos;s placed
          in a shuffled order alongside the others.
        </p>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {homeFlags.map((s) => (
            <li
              key={s.key}
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
                s.show ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-stone-50"
              }`}
            >
              <span className={s.show ? "text-emerald-900" : "text-stone-500"}>{s.label}</span>
              <span className={s.show ? "text-emerald-700" : "text-stone-400"}>
                {s.show ? "✓ on" : "— off"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-stone-900">
          Product-detail optional sections today
        </h2>
        <p className="text-sm text-stone-600">
          Computed against {sampleProduct.name}; flags vary per product. Reload
          after a rotation to see which ones flip.
        </p>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {productSectionFlags.map((s) => (
            <li
              key={s.key}
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
                s.show ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-stone-50"
              }`}
            >
              <span className={s.show ? "text-emerald-900" : "text-stone-500"}>{s.label}</span>
              <span className={s.show ? "text-emerald-700" : "text-stone-400"}>
                {s.show ? "✓ on" : "— off"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-stone-900">Per-product values today</h2>
        <p className="text-sm text-stone-600">
          Promo line, buyer nudge, and shipping badge — all picked from a small
          bank using the rotation seed. They change every build.
        </p>
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Today&apos;s price</th>
                <th className="px-4 py-3 font-medium">Promo</th>
                <th className="px-4 py-3 font-medium">Nudge</th>
                <th className="px-4 py-3 font-medium">Ship badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-stone-900">{p.name}</td>
                  <td className="px-4 py-3 tabular-nums">${p.currentPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">{productPromo(p.id)}</td>
                  <td className="px-4 py-3">{buyerNudge(p.id)}</td>
                  <td className="px-4 py-3">{shippingBadge(p.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-stone-900">Sample obfuscation values</h2>
        <p className="text-sm text-stone-600">
          Snapshot of a few hashed classes and noise <code>data-*</code> attrs
          generated for the home page. Reload after rotation; they should all
          change.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Block
            title="Sample hashed classes"
            items={[
              hashedClass("card::sample::1"),
              hashedClass("card::sample::2"),
              hashedClass("card-name::sample::1"),
              hashedClass("card-name::sample::2"),
              hashedClass("page-section-wrap::sample"),
            ]}
          />
          <Block
            title="Sample noise data-* attrs"
            items={Object.entries(noiseAttrs("sample::hp::1", 3))
              .concat(Object.entries(noiseAttrs("sample::hp::2", 3)))
              .map(([k, v]) => `${k}="${v}"`)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl text-stone-900">Try a rotation</h2>
        <pre className="overflow-x-auto rounded-lg bg-stone-900 p-4 text-xs text-stone-100">
{`# Trigger a fresh rotation, then reload this page:
gh workflow run daily-rebuild.yml -R anil-bd/ecommerce-shop`}
        </pre>
        <p className="text-xs text-stone-500">
          Vercel rebuilds within ~60 seconds of the workflow committing the new
          nonce. Reload this page after and every value above will be different.
        </p>
      </section>

      <footer className="border-t border-stone-200 pt-6 text-xs text-stone-500">
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <Link href={`/category/${categories[0].slug}`} className="hover:text-stone-900">
            Category sample
          </Link>
          <Link href={`/product/${products[0].slug}`} className="hover:text-stone-900">
            Product sample
          </Link>
          <a
            href="https://github.com/anil-bd/ecommerce-shop"
            className="hover:text-stone-900"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
          <a
            href="https://github.com/anil-bd/ecommerce-shop/actions"
            className="hover:text-stone-900"
            target="_blank"
            rel="noreferrer"
          >
            Workflow runs
          </a>
        </div>
      </footer>
    </div>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-stone-500">{label}</span>
      <span className={`text-sm text-stone-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-900">
        {title}
      </h3>
      <ul className="flex flex-col gap-1 font-mono text-xs text-stone-600">
        {items.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
