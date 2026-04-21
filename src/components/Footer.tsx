import Link from "next/link";
import { getDomSeed, categories } from "@/lib/data";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & delivery", href: "/" },
      { label: "Returns & exchanges", href: "/" },
      { label: "Size guide", href: "/" },
      { label: "Care guides", href: "/" },
      { label: "Contact us", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/" },
      { label: "Makers we work with", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Journal", href: "/" },
      { label: "Press", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/" },
      { label: "Terms of service", href: "/" },
      { label: "Accessibility", href: "/" },
      { label: "Cookie preferences", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="font-serif text-2xl text-stone-900">Alto</span>
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500">& Oak</span>
          </Link>
          <p className="text-sm leading-relaxed text-stone-600">
            A small catalog of well-made things from makers we trust. Based in Portland, shipping worldwide.
          </p>
          <div className="flex gap-3 text-xs text-stone-500">
            <span>© {new Date().getFullYear()} Alto &amp; Oak</span>
            <span>·</span>
            <span>Prices in USD</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">Shop</h3>
          <ul className="flex flex-col gap-2 text-stone-600">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-stone-900">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" className="hover:text-stone-900">
                New arrivals
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-stone-900">
                Gift cards
              </Link>
            </li>
          </ul>
        </div>

        {COLUMNS.slice(1).map((col) => (
          <div key={col.title} className="flex flex-col gap-3 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-2 text-stone-600">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-stone-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple Pay</span>
            <span>Shop Pay</span>
          </div>
          <span className="font-mono text-[11px] text-stone-400">build {getDomSeed().buildId}</span>
        </div>
      </div>
    </footer>
  );
}
