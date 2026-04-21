import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-stone-100">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 px-8 py-12 md:px-12 md:py-20">
          <span className="inline-flex w-fit items-center rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-900">
            Spring Collection 2026
          </span>
          <h1 className="font-serif text-4xl leading-tight text-stone-900 md:text-6xl">
            Honest things,<br />priced honestly.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-stone-600">
            A small, curated catalog from makers we trust. Prices move with the market — so you always see what it costs today, not last season&apos;s sticker.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/category/electronics"
              className="inline-flex items-center justify-center rounded-md bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Shop the collection
            </Link>
            <Link
              href="/category/apparel"
              className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-900 transition hover:border-stone-900"
            >
              Browse apparel
            </Link>
          </div>
          <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-600">
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-400">Makers</dt>
              <dd className="font-medium text-stone-900">42 independent</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-400">Avg rating</dt>
              <dd className="font-medium text-stone-900">4.7 / 5</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-stone-400">Ships from</dt>
              <dd className="font-medium text-stone-900">Portland, OR</dd>
            </div>
          </dl>
        </div>
        <div className="relative min-h-[340px] md:min-h-[560px]">
          <Image
            src="https://picsum.photos/seed/hero-spring-2026/1400/1200"
            alt="Featured collection"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
