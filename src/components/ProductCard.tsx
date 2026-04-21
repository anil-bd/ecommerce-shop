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
import { discountedPrice } from "@/lib/format";
import { Price } from "./Price";
import { Wrap } from "./Dyn";
import { Rating } from "./Rating";
import { WishlistButton } from "./WishlistButton";
import { ratingFor, stockFor } from "@/lib/ratings";
import { createElement } from "react";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const cardKey = `card::${product.id}`;
  const CardTag = polyTag(cardKey);
  const cardAttrs = noiseAttrs(cardKey, 2);
  const nameTag = headingTag(cardKey + "::name");
  const finalPrice = discountedPrice(product.currentPrice, product.discountPercent);
  const hasDiscount = product.discountPercent > 0;
  const { rating, reviewCount } = ratingFor(product.id);
  const stock = stockFor(product.id);
  const secondImage = product.images[1] ?? product.images[0];

  const cardCls = clsx(
    "group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg",
    hashedClass("card::" + product.id),
  );

  return createElement(
    CardTag,
    { className: cardCls, ...cardAttrs },
    <>
      <div className="relative">
        <Link
          href={`/product/${product.slug}`}
          className={clsx(
            "relative block aspect-[4/5] overflow-hidden bg-stone-100",
            hashedClass("card-media::" + product.id),
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
            src={secondImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {hasDiscount ? (
            <span className={clsx("rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white", hashedClass("card-badge::" + product.id))}>
              Save {product.discountPercent}%
            </span>
          ) : null}
          {stock.level === "low" ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-900">
              Low stock
            </span>
          ) : null}
          {stock.level === "out" ? (
            <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
              Sold out
            </span>
          ) : null}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton
            label={`Save ${product.name} to wishlist`}
            className="h-8 w-8"
          />
        </div>
      </div>
      <Wrap wrapKey={cardKey + "::body"} className="flex flex-1 flex-col gap-2 p-4">
        {createElement(
          nameTag,
          {
            className: clsx(
              "text-sm font-medium leading-tight text-stone-900",
              hashedClass("card-name::" + product.id),
            ),
          },
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>,
        )}
        <Rating value={rating} count={reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <Price
            amount={finalPrice}
            currency={product.currency}
            label={product.name}
            instanceKey={`card-price::${product.id}`}
            className="text-base font-semibold text-stone-900"
          />
          {hasDiscount ? (
            <Price
              amount={product.currentPrice}
              currency={product.currency}
              strike
              instanceKey={`card-strike::${product.id}`}
              className="text-xs"
            />
          ) : null}
        </div>
      </Wrap>
    </>,
  );
}
