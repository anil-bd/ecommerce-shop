import Link from "next/link";
import Image from "next/image";
import { categories, getProducts, getProductsByCategory } from "@/lib/data";

// Regenerate at most every 5 minutes so the 3am UTC rotation lands promptly.
export const revalidate = 300;

import { ProductCard } from "@/components/ProductCard";
import { Honeypots } from "@/components/Honeypots";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { Newsletter } from "@/components/Newsletter";
import { Testimonials } from "@/components/Testimonials";
import { shuffle } from "@/lib/obfuscate";

export default function HomePage() {
  const products = getProducts();
  const featured = shuffle(products, "home-featured").slice(0, 8);
  const newArrivals = shuffle(products, "new-arrivals").slice(0, 4);

  return (
    <div className="flex flex-col gap-20">
      <Hero />

      <ValueProps />

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">Shop by category</h2>
            <p className="mt-2 text-sm text-stone-600">Three small, deliberate collections.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {categories.map((c) => {
            const count = getProductsByCategory(c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group relative flex aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100"
              >
                <Image
                  src={`https://picsum.photos/seed/cat-${c.slug}/900/1100`}
                  alt={c.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative mt-auto flex w-full flex-col gap-2 p-6 text-white">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                    {count} products
                  </span>
                  <h3 className="font-serif text-3xl leading-tight">{c.name}</h3>
                  <p className="max-w-xs text-sm text-white/90">{c.description}</p>
                  <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition group-hover:bg-white group-hover:text-stone-900">
                    Shop {c.name.toLowerCase()} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">Featured today</h2>
            <p className="mt-2 text-sm text-stone-600">
              Prices refresh every morning — what you see is what it costs today.
            </p>
          </div>
          <Link href="/category/electronics" className="hidden text-sm text-stone-700 hover:text-stone-900 sm:inline">
            Shop all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-emerald-900 text-white">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="https://picsum.photos/seed/alto-makers-banner/1600/700"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative grid grid-cols-1 items-center gap-6 px-8 py-14 md:grid-cols-2 md:px-12">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
              Our makers
            </span>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              42 independent makers.<br />One short list.
            </h2>
            <p className="max-w-md text-sm text-white/80">
              We talk to every maker before they&apos;re on the site, and visit most of them. No marketplaces, no re-sellers, no white-labels.
            </p>
            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-emerald-900 transition hover:bg-stone-100"
            >
              Meet the makers
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">New arrivals</h2>
            <p className="mt-2 text-sm text-stone-600">Added this week.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Testimonials />

      <Newsletter />

      <Honeypots scope="home" />
    </div>
  );
}
