import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import type { Product } from "@/types";
import {
  hashedClass,
  headingTag,
  noiseAttrs,
  polyTag,
} from "@/lib/obfuscate";
import { formatMoney, discountedPrice } from "@/lib/format";
import { ratingFor, stockFor } from "@/lib/ratings";
import { cardLayoutIndex, LAYOUT_COUNT } from "@/lib/layouts";
import { Price } from "./Price";
import { Rating } from "./Rating";
import { WishlistButton } from "./WishlistButton";
import { createElement } from "react";

type LayoutProps = {
  product: Product;
  finalPrice: number;
  hasDiscount: boolean;
  rating: number;
  reviewCount: number;
  stockLevel: "in-stock" | "low" | "out";
  cardKey: string;
};

const CARD_STYLES =
  "group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg";

function StockBadge({ level }: { level: "in-stock" | "low" | "out" }) {
  if (level === "low") {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-900">
        Low stock
      </span>
    );
  }
  if (level === "out") {
    return (
      <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
        Sold out
      </span>
    );
  }
  return null;
}

function ImageBlock({ product, className }: { product: Product; className?: string }) {
  const second = product.images[1] ?? product.images[0];
  return (
    <Link
      href={`/product/${product.slug}`}
      className={clsx(
        "relative block aspect-[4/5] overflow-hidden bg-stone-100",
        hashedClass("card-media::" + product.id),
        className,
      )}
    >
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
      />
      <Image
        src={second}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </Link>
  );
}

function PriceBlock({
  product,
  finalPrice,
  hasDiscount,
  keyPrefix = "card",
}: {
  product: Product;
  finalPrice: number;
  hasDiscount: boolean;
  keyPrefix?: string;
}) {
  return (
    <>
      <Price
        amount={finalPrice}
        currency={product.currency}
        label={product.name}
        instanceKey={`${keyPrefix}-price::${product.id}`}
        className="text-base font-semibold text-stone-900"
      />
      {hasDiscount ? (
        <Price
          amount={product.currentPrice}
          currency={product.currency}
          strike
          instanceKey={`${keyPrefix}-strike::${product.id}`}
          className="text-xs"
        />
      ) : null}
    </>
  );
}

// ---------- Strategy 0: classic article + figure/figcaption ----------
function Layout0(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <article className={clsx(CARD_STYLES, hashedClass(cardKey + "::L0"))} {...noiseAttrs(cardKey + "::L0", 2)}>
      <figure className="relative m-0">
        <ImageBlock product={product} />
        <figcaption className="flex flex-col gap-2 p-4">
          <h3 className={clsx("text-sm font-medium text-stone-900", hashedClass("card-name::" + product.id))}>
            <Link href={`/product/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <Rating value={rating} count={reviewCount} />
          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <PriceBlock product={product} finalPrice={finalPrice} hasDiscount={hasDiscount} />
          </div>
        </figcaption>
      </figure>
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        {hasDiscount ? (
          <span className={clsx("rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white", hashedClass("card-badge::" + product.id))}>
            Save {product.discountPercent}%
          </span>
        ) : null}
        <StockBadge level={stockLevel} />
      </div>
      <div className="absolute right-3 top-3">
        <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
      </div>
    </article>
  );
}

// ---------- Strategy 1: definition list ----------
function Layout1(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <dl className={clsx(CARD_STYLES, "block", hashedClass(cardKey + "::L1"))} {...noiseAttrs(cardKey + "::L1", 2)}>
      <dt className="sr-only">Preview</dt>
      <dd className="relative m-0">
        <ImageBlock product={product} />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount ? (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
              -{product.discountPercent}%
            </span>
          ) : null}
          <StockBadge level={stockLevel} />
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
        </div>
      </dd>
      <div className="flex flex-col gap-2 p-4">
        <dt className="sr-only">Name</dt>
        <dd className="m-0">
          <Link href={`/product/${product.slug}`} className={clsx("text-sm font-medium text-stone-900 hover:underline", hashedClass("card-name::" + product.id))}>
            {product.name}
          </Link>
        </dd>
        <dt className="sr-only">Rating</dt>
        <dd className="m-0"><Rating value={rating} count={reviewCount} /></dd>
        <dt className="sr-only">Price</dt>
        <dd className="m-0 mt-auto flex items-baseline gap-2 pt-2">
          <PriceBlock product={product} finalPrice={finalPrice} hasDiscount={hasDiscount} />
        </dd>
      </div>
    </dl>
  );
}

// ---------- Strategy 2: table rows ----------
function Layout2(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <table className={clsx(CARD_STYLES, "block w-full border-separate border-spacing-0", hashedClass(cardKey + "::L2"))} {...noiseAttrs(cardKey + "::L2", 2)}>
      <tbody className="block">
        <tr className="block relative">
          <td className="block p-0">
            <ImageBlock product={product} />
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {hasDiscount ? (
                <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                  Save {product.discountPercent}%
                </span>
              ) : null}
              <StockBadge level={stockLevel} />
            </div>
            <div className="absolute right-3 top-3">
              <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
            </div>
          </td>
        </tr>
        <tr className="block">
          <td className="block p-4">
            <div className="flex flex-col gap-2">
              <Link href={`/product/${product.slug}`} className={clsx("text-sm font-medium text-stone-900 hover:underline", hashedClass("card-name::" + product.id))}>
                {product.name}
              </Link>
              <Rating value={rating} count={reviewCount} />
              <div className="mt-auto flex items-baseline gap-2 pt-2">
                <PriceBlock product={product} finalPrice={finalPrice} hasDiscount={hasDiscount} />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ---------- Strategy 3: details/summary ----------
function Layout3(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <details open className={clsx(CARD_STYLES, "block [&>summary]:list-none", hashedClass(cardKey + "::L3"))} {...noiseAttrs(cardKey + "::L3", 2)}>
      <summary className="block cursor-default [&::-webkit-details-marker]:hidden">
        <div className="relative">
          <ImageBlock product={product} />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {hasDiscount ? (
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                Save {product.discountPercent}%
              </span>
            ) : null}
            <StockBadge level={stockLevel} />
          </div>
          <div className="absolute right-3 top-3">
            <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
          </div>
        </div>
      </summary>
      <div className="flex flex-col gap-2 p-4">
        <Link href={`/product/${product.slug}`} className={clsx("text-sm font-medium text-stone-900 hover:underline", hashedClass("card-name::" + product.id))}>
          {product.name}
        </Link>
        <Rating value={rating} count={reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <PriceBlock product={product} finalPrice={finalPrice} hasDiscount={hasDiscount} />
        </div>
      </div>
    </details>
  );
}

// ---------- Strategy 4: reversed flex (price first in DOM, name last) ----------
function Layout4(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <section className={clsx(CARD_STYLES, "flex-col-reverse", hashedClass(cardKey + "::L4"))} {...noiseAttrs(cardKey + "::L4", 2)}>
      <div className="flex flex-col-reverse gap-2 p-4">
        <Link href={`/product/${product.slug}`} className={clsx("text-sm font-medium text-stone-900 hover:underline", hashedClass("card-name::" + product.id))}>
          {product.name}
        </Link>
        <Rating value={rating} count={reviewCount} />
        <div className="flex items-baseline gap-2">
          <PriceBlock product={product} finalPrice={finalPrice} hasDiscount={hasDiscount} />
        </div>
      </div>
      <div className="relative">
        <ImageBlock product={product} />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount ? (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
              Save {product.discountPercent}%
            </span>
          ) : null}
          <StockBadge level={stockLevel} />
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
        </div>
      </div>
    </section>
  );
}

// ---------- Strategy 5: background-image (no <img>) ----------
function Layout5(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <aside className={clsx(CARD_STYLES, hashedClass(cardKey + "::L5"))} {...noiseAttrs(cardKey + "::L5", 2)}>
      <Link
        href={`/product/${product.slug}`}
        aria-label={product.name}
        className="relative block aspect-[4/5] bg-stone-100 bg-cover bg-center transition-opacity"
        style={{ backgroundImage: `url(${product.images[0]})` }}
      >
        <span className="sr-only">{product.name}</span>
        <span className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount ? (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
              Save {product.discountPercent}%
            </span>
          ) : null}
          <StockBadge level={stockLevel} />
        </span>
        <span className="absolute right-3 top-3">
          <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
        </span>
      </Link>
      <div className="flex flex-col gap-2 p-4">
        <Link href={`/product/${product.slug}`} className={clsx("text-sm font-medium text-stone-900 hover:underline", hashedClass("card-name::" + product.id))}>
          {product.name}
        </Link>
        <Rating value={rating} count={reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <PriceBlock product={product} finalPrice={finalPrice} hasDiscount={hasDiscount} />
        </div>
      </div>
    </aside>
  );
}

// ---------- Strategy 6: nested semantic header/main/footer ----------
function Layout6(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <section className={clsx(CARD_STYLES, hashedClass(cardKey + "::L6"))} {...noiseAttrs(cardKey + "::L6", 2)}>
      <header className="relative">
        <ImageBlock product={product} />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount ? (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
              Save {product.discountPercent}%
            </span>
          ) : null}
          <StockBadge level={stockLevel} />
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
        </div>
      </header>
      <main className="flex flex-col gap-2 px-4 pt-4">
        <p className={clsx("text-sm font-medium text-stone-900", hashedClass("card-name::" + product.id))}>
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </p>
        <Rating value={rating} count={reviewCount} />
      </main>
      <footer className="mt-auto flex items-baseline gap-2 px-4 pb-4 pt-2">
        <PriceBlock product={product} finalPrice={finalPrice} hasDiscount={hasDiscount} />
      </footer>
    </section>
  );
}

// ---------- Strategy 7: role=listitem with data-attrs + blockquote/cite for name ----------
function Layout7(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <div
      role="listitem"
      data-title={product.name}
      data-sku={product.id}
      className={clsx(CARD_STYLES, hashedClass(cardKey + "::L7"))}
      {...noiseAttrs(cardKey + "::L7", 2)}
    >
      <div className="relative">
        <ImageBlock product={product} />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount ? (
            <data value={String(product.discountPercent)} className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
              Save {product.discountPercent}%
            </data>
          ) : null}
          <StockBadge level={stockLevel} />
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
        </div>
      </div>
      <blockquote className="m-0 flex flex-col gap-2 border-0 p-4">
        <cite className={clsx("not-italic text-sm font-medium text-stone-900", hashedClass("card-name::" + product.id))}>
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </cite>
        <Rating value={rating} count={reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <ins className="no-underline">
            <Price
              amount={finalPrice}
              currency={product.currency}
              label={product.name}
              instanceKey={`card-price::${product.id}`}
              className="text-base font-semibold text-stone-900"
            />
          </ins>
          {hasDiscount ? (
            <del>
              <Price
                amount={product.currentPrice}
                currency={product.currency}
                strike
                instanceKey={`card-strike::${product.id}`}
                className="text-xs"
              />
            </del>
          ) : null}
        </div>
      </blockquote>
    </div>
  );
}

// ---------- Strategy 8: dynamic polyTag root + output element for price ----------
function Layout8(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  const RootTag = polyTag(cardKey + "::L8::root");
  const NameTag = headingTag(cardKey + "::L8::name");
  const formatted = formatMoney(finalPrice, product.currency);
  return createElement(
    RootTag,
    {
      className: clsx(CARD_STYLES, hashedClass(cardKey + "::L8")),
      ...noiseAttrs(cardKey + "::L8", 2),
    },
    <>
      <div className="relative">
        <ImageBlock product={product} />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount ? (
            <kbd className="rounded-full bg-rose-600 px-2.5 py-1 font-sans text-[11px] font-semibold text-white">
              −{product.discountPercent}%
            </kbd>
          ) : null}
          <StockBadge level={stockLevel} />
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {createElement(
          NameTag,
          {
            className: clsx("text-sm font-medium text-stone-900", hashedClass("card-name::" + product.id)),
          },
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>,
        )}
        <Rating value={rating} count={reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <output className="text-base font-semibold text-stone-900 tabular-nums" aria-label={`${product.name} price`}>
            {formatted}
          </output>
          {hasDiscount ? (
            <s className="text-xs text-stone-400">{formatMoney(product.currentPrice, product.currency)}</s>
          ) : null}
        </div>
      </div>
    </>,
  );
}

// ---------- Strategy 9: form + fieldset + disabled inputs ----------
function Layout9(p: LayoutProps) {
  const { product, finalPrice, hasDiscount, rating, reviewCount, stockLevel, cardKey } = p;
  return (
    <form
      className={clsx(CARD_STYLES, hashedClass(cardKey + "::L9"))}
      {...noiseAttrs(cardKey + "::L9", 2)}
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Product {product.name}</legend>
        <div className="relative">
          <ImageBlock product={product} />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {hasDiscount ? (
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                Save {product.discountPercent}%
              </span>
            ) : null}
            <StockBadge level={stockLevel} />
          </div>
          <div className="absolute right-3 top-3">
            <WishlistButton label={`Save ${product.name}`} className="h-8 w-8" />
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <label className="contents">
            <span className="sr-only">Name</span>
            <Link href={`/product/${product.slug}`} className={clsx("text-sm font-medium text-stone-900 hover:underline", hashedClass("card-name::" + product.id))}>
              {product.name}
            </Link>
          </label>
          <Rating value={rating} count={reviewCount} />
          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <input
              type="text"
              readOnly
              tabIndex={-1}
              aria-label={`${product.name} price`}
              value={formatMoney(finalPrice, product.currency)}
              className="w-auto cursor-default border-0 bg-transparent p-0 text-base font-semibold text-stone-900 tabular-nums focus:outline-none"
            />
            {hasDiscount ? (
              <input
                type="text"
                readOnly
                tabIndex={-1}
                aria-label={`${product.name} original price`}
                value={formatMoney(product.currentPrice, product.currency)}
                className="w-auto cursor-default border-0 bg-transparent p-0 text-xs text-stone-400 line-through focus:outline-none"
              />
            ) : null}
          </div>
        </div>
      </fieldset>
    </form>
  );
}

const LAYOUTS = [Layout0, Layout1, Layout2, Layout3, Layout4, Layout5, Layout6, Layout7, Layout8, Layout9];

export function ProductCardLayouts({ product }: { product: Product }) {
  const cardKey = `card::${product.id}`;
  const finalPrice = discountedPrice(product.currentPrice, product.discountPercent);
  const hasDiscount = product.discountPercent > 0;
  const { rating, reviewCount } = ratingFor(product.id);
  const stock = stockFor(product.id);

  const idx = cardLayoutIndex(product.id) % LAYOUT_COUNT;
  const Layout = LAYOUTS[idx];
  return (
    <Layout
      product={product}
      finalPrice={finalPrice}
      hasDiscount={hasDiscount}
      rating={rating}
      reviewCount={reviewCount}
      stockLevel={stock.level}
      cardKey={cardKey}
    />
  );
}
