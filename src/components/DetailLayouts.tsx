import clsx from "clsx";
import { ScrambledText, DecoyParagraphs } from "./ScrambledText";
import { createElement } from "react";
import type { Product } from "@/types";
import { Price } from "./Price";
import {
  hashedClass,
  headingTag,
  noiseAttrs,
  polyTag,
} from "@/lib/obfuscate";
import { formatMoney, discountedPrice } from "@/lib/format";
import { detailLayoutIndex, LAYOUT_COUNT } from "@/lib/layouts";

type DetailProps = {
  product: Product;
  finalPrice: number;
  hasDiscount: boolean;
  delta: number | null;
};

function DeltaLine({ delta }: { delta: number | null }) {
  if (delta == null) return null;
  return (
    <p className="text-xs text-stone-500">
      {delta >= 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}% vs yesterday — prices refresh daily
    </p>
  );
}

// ---------- D0: article + h1 + inline price paragraph ----------
function D0({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <article className={clsx("flex flex-col gap-6", hashedClass("detail::D0::" + product.id))} {...noiseAttrs("detail::D0::" + product.id, 2)}>
      <h1 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h1>
      <div className="flex flex-wrap items-baseline gap-3">
        <Price amount={finalPrice} currency={product.currency} label={product.name} instanceKey={`detail::${product.id}`} className="text-3xl font-semibold text-stone-900" />
        {hasDiscount ? (
          <>
            <Price amount={product.currentPrice} currency={product.currency} strike instanceKey={`detail-strike::${product.id}`} className="text-lg" />
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">Save {product.discountPercent}%</span>
          </>
        ) : null}
      </div>
      <DeltaLine delta={delta} />
      <p className="text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></p>
    </article>
  );
}

// ---------- D1: definition list ----------
function D1({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <dl className={clsx("flex flex-col gap-6", hashedClass("detail::D1::" + product.id))} {...noiseAttrs("detail::D1::" + product.id, 2)}>
      <div>
        <dt className="sr-only">Product name</dt>
        <dd className="m-0"><h2 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h2></dd>
      </div>
      <div className="flex flex-wrap items-baseline gap-3">
        <dt className="sr-only">Price</dt>
        <dd className="m-0 flex items-baseline gap-3">
          <Price amount={finalPrice} currency={product.currency} label={product.name} instanceKey={`detail::${product.id}`} className="text-3xl font-semibold text-stone-900" />
          {hasDiscount ? (
            <>
              <Price amount={product.currentPrice} currency={product.currency} strike instanceKey={`detail-strike::${product.id}`} className="text-lg" />
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">Save {product.discountPercent}%</span>
            </>
          ) : null}
        </dd>
      </div>
      <DeltaLine delta={delta} />
      <div>
        <dt className="sr-only">Description</dt>
        <dd className="m-0 text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></dd>
      </div>
    </dl>
  );
}

// ---------- D2: table rows ----------
function D2({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <table className={clsx("block w-full border-separate border-spacing-0", hashedClass("detail::D2::" + product.id))} {...noiseAttrs("detail::D2::" + product.id, 2)}>
      <tbody className="flex flex-col gap-6">
        <tr className="block"><td className="block p-0"><h2 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h2></td></tr>
        <tr className="block">
          <td className="block p-0">
            <div className="flex flex-wrap items-baseline gap-3">
              <Price amount={finalPrice} currency={product.currency} label={product.name} instanceKey={`detail::${product.id}`} className="text-3xl font-semibold text-stone-900" />
              {hasDiscount ? (
                <>
                  <Price amount={product.currentPrice} currency={product.currency} strike instanceKey={`detail-strike::${product.id}`} className="text-lg" />
                  <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">Save {product.discountPercent}%</span>
                </>
              ) : null}
            </div>
          </td>
        </tr>
        {delta != null ? <tr className="block"><td className="block p-0"><DeltaLine delta={delta} /></td></tr> : null}
        <tr className="block"><td className="block p-0 text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></td></tr>
      </tbody>
    </table>
  );
}

// ---------- D3: details/summary ----------
function D3({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <details open className={clsx("flex flex-col gap-6 [&>summary]:list-none", hashedClass("detail::D3::" + product.id))} {...noiseAttrs("detail::D3::" + product.id, 2)}>
      <summary className="block cursor-default [&::-webkit-details-marker]:hidden">
        <h2 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h2>
      </summary>
      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <Price amount={finalPrice} currency={product.currency} label={product.name} instanceKey={`detail::${product.id}`} className="text-3xl font-semibold text-stone-900" />
        {hasDiscount ? (
          <>
            <Price amount={product.currentPrice} currency={product.currency} strike instanceKey={`detail-strike::${product.id}`} className="text-lg" />
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">Save {product.discountPercent}%</span>
          </>
        ) : null}
      </div>
      <DeltaLine delta={delta} />
      <p className="mt-4 text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></p>
    </details>
  );
}

// ---------- D4: reversed — description first in DOM, name last ----------
function D4({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <section className={clsx("flex flex-col-reverse gap-6", hashedClass("detail::D4::" + product.id))} {...noiseAttrs("detail::D4::" + product.id, 2)}>
      <h2 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h2>
      <div className="flex flex-wrap items-baseline gap-3">
        <Price amount={finalPrice} currency={product.currency} label={product.name} instanceKey={`detail::${product.id}`} className="text-3xl font-semibold text-stone-900" />
        {hasDiscount ? (
          <>
            <Price amount={product.currentPrice} currency={product.currency} strike instanceKey={`detail-strike::${product.id}`} className="text-lg" />
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">Save {product.discountPercent}%</span>
          </>
        ) : null}
      </div>
      <DeltaLine delta={delta} />
      <p className="text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></p>
    </section>
  );
}

// ---------- D5: form + disabled inputs ----------
function D5({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <form className={clsx("flex flex-col gap-6", hashedClass("detail::D5::" + product.id))} {...noiseAttrs("detail::D5::" + product.id, 2)}>
      <fieldset className="m-0 flex flex-col gap-6 border-0 p-0">
        <legend className="sr-only">Product</legend>
        <label className="contents">
          <span className="sr-only">Name</span>
          <input
            type="text"
            readOnly
            tabIndex={-1}
            value={product.name}
            className="w-full cursor-default border-0 bg-transparent p-0 font-serif text-4xl leading-tight text-stone-900 focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap items-baseline gap-3">
          <output className="text-3xl font-semibold text-stone-900 tabular-nums" aria-label={`${product.name} price`}>
            {formatMoney(finalPrice, product.currency)}
          </output>
          {hasDiscount ? (
            <>
              <s className="text-lg text-stone-400">{formatMoney(product.currentPrice, product.currency)}</s>
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">Save {product.discountPercent}%</span>
            </>
          ) : null}
        </div>
        <DeltaLine delta={delta} />
        <label className="contents">
          <span className="sr-only">Description</span>
          <textarea
            readOnly
            tabIndex={-1}
            value={product.description}
            className="w-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed text-stone-700 focus:outline-none"
            rows={Math.ceil(product.description.length / 60)}
          />
        </label>
      </fieldset>
    </form>
  );
}

// ---------- D6: section > header/main/aside ----------
function D6({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <section className={clsx("flex flex-col gap-6", hashedClass("detail::D6::" + product.id))} {...noiseAttrs("detail::D6::" + product.id, 2)}>
      <header>
        <h2 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h2>
      </header>
      <aside className="flex flex-wrap items-baseline gap-3">
        <Price amount={finalPrice} currency={product.currency} label={product.name} instanceKey={`detail::${product.id}`} className="text-3xl font-semibold text-stone-900" />
        {hasDiscount ? (
          <>
            <Price amount={product.currentPrice} currency={product.currency} strike instanceKey={`detail-strike::${product.id}`} className="text-lg" />
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">Save {product.discountPercent}%</span>
          </>
        ) : null}
      </aside>
      <DeltaLine delta={delta} />
      <main>
        <p className="text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></p>
      </main>
    </section>
  );
}

// ---------- D7: blockquote > cite for name, footer for price ----------
function D7({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <blockquote className={clsx("m-0 flex flex-col gap-6 border-0 p-0", hashedClass("detail::D7::" + product.id))} {...noiseAttrs("detail::D7::" + product.id, 2)}>
      <cite className="not-italic">
        <h2 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h2>
      </cite>
      <p className="text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></p>
      <DeltaLine delta={delta} />
      <footer className="flex flex-wrap items-baseline gap-3">
        <ins className="no-underline">
          <Price amount={finalPrice} currency={product.currency} label={product.name} instanceKey={`detail::${product.id}`} className="text-3xl font-semibold text-stone-900" />
        </ins>
        {hasDiscount ? (
          <>
            <del>
              <Price amount={product.currentPrice} currency={product.currency} strike instanceKey={`detail-strike::${product.id}`} className="text-lg" />
            </del>
            <data value={String(product.discountPercent)} className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">
              Save {product.discountPercent}%
            </data>
          </>
        ) : null}
      </footer>
    </blockquote>
  );
}

// ---------- D8: polyTag root, dynamic heading tag, output element for price ----------
function D8({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  const RootTag = polyTag("detail::D8::root::" + product.id);
  const TitleTag = headingTag("detail::D8::title::" + product.id);
  return createElement(
    RootTag,
    {
      className: clsx("flex flex-col gap-6", hashedClass("detail::D8::" + product.id)),
      ...noiseAttrs("detail::D8::" + product.id, 2),
    },
    <>
      {createElement(TitleTag, { className: "font-serif text-4xl leading-tight text-stone-900" }, product.name)}
      <div className="flex flex-wrap items-baseline gap-3">
        <output className="text-3xl font-semibold text-stone-900 tabular-nums" aria-label={`${product.name} price`}>
          {formatMoney(finalPrice, product.currency)}
        </output>
        {hasDiscount ? (
          <>
            <s className="text-lg text-stone-400">{formatMoney(product.currentPrice, product.currency)}</s>
            <kbd className="rounded-full bg-rose-600 px-2.5 py-1 font-sans text-xs font-semibold text-white">
              −{product.discountPercent}%
            </kbd>
          </>
        ) : null}
      </div>
      <DeltaLine delta={delta} />
      <p className="text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></p>
    </>,
  );
}

// ---------- D9: figure + figcaption for name, samp for price ----------
function D9({ product, finalPrice, hasDiscount, delta }: DetailProps) {
  return (
    <figure className={clsx("m-0 flex flex-col gap-6", hashedClass("detail::D9::" + product.id))} {...noiseAttrs("detail::D9::" + product.id, 2)}>
      <figcaption>
        <h2 className="font-serif text-4xl leading-tight text-stone-900"><ScrambledText text={product.name} instanceKey={`name-detail::${product.id}`} /></h2>
      </figcaption>
      <div className="flex flex-wrap items-baseline gap-3">
        <samp className="font-sans text-3xl font-semibold text-stone-900 tabular-nums">{formatMoney(finalPrice, product.currency)}</samp>
        {hasDiscount ? (
          <>
            <samp className="font-sans text-lg text-stone-400 line-through">{formatMoney(product.currentPrice, product.currency)}</samp>
            <abbr title={`Save ${product.discountPercent} percent`} className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white no-underline">
              -{product.discountPercent}%
            </abbr>
          </>
        ) : null}
      </div>
      <DeltaLine delta={delta} />
      <p className="text-base leading-relaxed text-stone-700"><ScrambledText text={product.description} instanceKey={`desc-detail::${product.id}`} className="block" /></p>
    </figure>
  );
}

const DETAIL_LAYOUTS = [D0, D1, D2, D3, D4, D5, D6, D7, D8, D9];

export function ProductDetailAnchor(props: {
  product: Product;
  delta: number | null;
}) {
  const { product, delta } = props;
  const finalPrice = discountedPrice(product.currentPrice, product.discountPercent);
  const hasDiscount = product.discountPercent > 0;
  const idx = detailLayoutIndex(product.id) % LAYOUT_COUNT;
  const Layout = DETAIL_LAYOUTS[idx];
  return (
    <Layout
      product={product}
      finalPrice={finalPrice}
      hasDiscount={hasDiscount}
      delta={delta}
    />
  );
}
