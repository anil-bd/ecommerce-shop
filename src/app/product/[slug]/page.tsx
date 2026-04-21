import Link from "next/link";
import { notFound } from "next/navigation";
import { createElement } from "react";
import clsx from "clsx";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
  productSlugs,
} from "@/lib/data";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { Price } from "@/components/Price";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Honeypots } from "@/components/Honeypots";
import { Wrap } from "@/components/Dyn";
import { VariantPicker } from "@/components/VariantPicker";
import { ProductTabs } from "@/components/ProductTabs";
import { Rating } from "@/components/Rating";
import { WishlistButton } from "@/components/WishlistButton";
import { TruckIcon, RefreshIcon, ShieldIcon, LeafIcon } from "@/components/Icons";
import { discountedPrice, priceDeltaPercent } from "@/lib/format";
import { ratingFor, stockFor, viewersNow } from "@/lib/ratings";
import { variantsFor } from "@/lib/variants";
import {
  hashedClass,
  headingTag,
  noiseAttrs,
  shuffle,
} from "@/lib/obfuscate";

export const revalidate = 300;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return productSlugs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: `${product.name} — Alto & Oak`, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = shuffle(
    getProductsByCategory(product.category).filter((p) => p.id !== product.id),
    `related::${product.id}`,
  ).slice(0, 4);
  const finalPrice = discountedPrice(product.currentPrice, product.discountPercent);
  const delta = priceDeltaPercent(product.currentPrice, product.previousPrice);
  const { rating, reviewCount } = ratingFor(product.id);
  const stock = stockFor(product.id);
  const viewers = viewersNow(product.id);
  const variantGroups = variantsFor(product.id, product.category);

  const pageKey = `product::${product.id}`;
  const TitleTag = headingTag(pageKey + "::title");
  const titleCls = hashedClass(pageKey + "::title-cls");
  const pageAttrs = noiseAttrs(pageKey, 2);

  return (
    <div className="flex flex-col gap-16" {...pageAttrs}>
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        {category ? (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-stone-900">
              {category.name}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="truncate text-stone-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
        <ProductGallery
          images={product.images}
          alt={product.name}
          galleryClass={hashedClass(pageKey + "::gallery")}
          thumbClass={hashedClass(pageKey + "::thumb")}
        />

        <Wrap wrapKey={pageKey + "::info"} className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500">
              {category?.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-900">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {viewers} people viewing
            </span>
          </div>

          {createElement(
            TitleTag,
            { className: clsx("font-serif text-4xl leading-tight text-stone-900", titleCls) },
            product.name,
          )}

          <div className="flex items-center gap-3">
            <Rating value={rating} count={reviewCount} showValue size="md" />
            <span className="text-xs text-stone-400">·</span>
            <button className="text-xs text-stone-500 underline-offset-2 hover:underline">
              {stock.soldToday} sold today
            </button>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <Price
              amount={finalPrice}
              currency={product.currency}
              label={product.name}
              instanceKey={`detail::${product.id}`}
              className="text-3xl font-semibold text-stone-900"
            />
            {product.discountPercent > 0 ? (
              <>
                <Price
                  amount={product.currentPrice}
                  currency={product.currency}
                  strike
                  instanceKey={`detail-strike::${product.id}`}
                  className="text-lg"
                />
                <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">
                  Save {product.discountPercent}%
                </span>
              </>
            ) : null}
          </div>

          {delta !== null ? (
            <p className="text-xs text-stone-500">
              {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}% vs yesterday — prices refresh daily
            </p>
          ) : null}

          <p className="text-base leading-relaxed text-stone-700">{product.description}</p>

          {variantGroups.length ? <VariantPicker groups={variantGroups} /> : null}

          {stock.level === "low" ? (
            <div className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
              Only {stock.remaining} left in stock — order soon
            </div>
          ) : null}
          {stock.level === "out" ? (
            <div className="flex items-center gap-3 rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-700">
              Currently sold out — join the waitlist below
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            {stock.level !== "out" ? (
              <AddToCartButton productId={product.id} className="flex-1 h-12 text-base" />
            ) : (
              <button
                type="button"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-base font-medium text-stone-900 hover:bg-stone-50"
              >
                Notify when back
              </button>
            )}
            <WishlistButton
              label="Save for later"
              className="h-12 w-12"
            />
          </div>

          <ul className="mt-2 grid grid-cols-2 gap-3 text-sm text-stone-700">
            <li className="flex items-start gap-2 rounded-lg border border-stone-200 p-3">
              <TruckIcon className="mt-0.5 h-4 w-4 text-stone-500" />
              <span>Free shipping over $75</span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border border-stone-200 p-3">
              <RefreshIcon className="mt-0.5 h-4 w-4 text-stone-500" />
              <span>30-day free returns</span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border border-stone-200 p-3">
              <ShieldIcon className="mt-0.5 h-4 w-4 text-stone-500" />
              <span>2-year warranty</span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border border-stone-200 p-3">
              <LeafIcon className="mt-0.5 h-4 w-4 text-stone-500" />
              <span>Responsibly sourced</span>
            </li>
          </ul>
        </Wrap>
      </div>

      <ProductTabs description={product.description} rating={rating} reviewCount={reviewCount} />

      {related.length ? (
        <section className="flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl text-stone-900">You might also like</h2>
            <Link
              href={`/category/${product.category}`}
              className="text-sm text-stone-500 hover:text-stone-900"
            >
              See more in {category?.name} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <Honeypots scope={`product::${product.slug}`} />
    </div>
  );
}
