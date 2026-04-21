"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/data";
import { discountedPrice, formatMoney } from "@/lib/format";
import { TruckIcon, ShieldIcon, RefreshIcon } from "./Icons";

export function CartContents() {
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const [mounted, setMounted] = useState(false);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <p className="text-stone-500">Loading cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-white p-16 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-2xl">
          🛍
        </span>
        <h2 className="text-xl font-semibold text-stone-900">Your cart is empty</h2>
        <p className="max-w-sm text-sm text-stone-500">
          Looks like you haven&apos;t added anything yet. Browse the collection to find something you love.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const rows = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      const unit = discountedPrice(product.currentPrice, product.discountPercent);
      return { line, product, unit, subtotal: unit * line.quantity };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const subtotal = rows.reduce((sum, r) => sum + r.subtotal, 0);
  const currency = rows[0]?.product.currency ?? "USD";
  const discount = promoApplied ? Math.round(subtotal * 10) / 100 : 0;
  const shipping = subtotal > 75 ? 0 : 6;
  const total = subtotal - discount + shipping;
  const freeShippingGap = Math.max(0, 75 - subtotal);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-5">
        {freeShippingGap > 0 ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between text-sm text-emerald-900">
              <span className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4" />
                <span>
                  Add <strong>{formatMoney(freeShippingGap, currency)}</strong> more for free shipping
                </span>
              </span>
              <span className="text-xs text-emerald-700">
                {Math.min(100, Math.round((subtotal / 75) * 100))}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${Math.min(100, (subtotal / 75) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
            <span className="inline-flex items-center gap-2">
              <TruckIcon className="h-4 w-4" />
              Nice — you&apos;ve unlocked free shipping.
            </span>
          </div>
        )}

        <ul className="flex flex-col divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {rows.map(({ line, product, unit, subtotal }) => (
            <li key={product.id} className="flex gap-4 p-5">
              <Link
                href={`/product/${product.slug}`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-stone-100"
              >
                <Image src={product.images[0]} alt={product.name} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-base font-medium text-stone-900 hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs capitalize text-stone-500">
                      {product.category.replace("-", " & ")}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">{formatMoney(unit, currency)} each</p>
                  </div>
                  <div className="text-base font-semibold">{formatMoney(subtotal, currency)}</div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="inline-flex items-center rounded-md border border-stone-300">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, line.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="h-8 w-8 text-stone-700 hover:bg-stone-100"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-medium">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, line.quantity + 1)}
                      aria-label="Increase quantity"
                      className="h-8 w-8 text-stone-700 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="text-xs text-stone-500 underline-offset-2 hover:text-stone-900 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link href="/" className="text-stone-600 hover:text-stone-900">
            ← Continue shopping
          </Link>
        </div>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">Order summary</h2>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Promo code
          </label>
          <div className="flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="WELCOME10"
              className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setPromoApplied(promo.trim().length > 0)}
              className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
            >
              Apply
            </button>
          </div>
          {promoApplied ? (
            <p className="text-xs text-emerald-700">Promo applied — 10% off subtotal</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between text-stone-700">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </div>
          {promoApplied ? (
            <div className="flex justify-between text-emerald-700">
              <span>Promo (10%)</span>
              <span>− {formatMoney(discount, currency)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-stone-700">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatMoney(shipping, currency)}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-500">
            <span>Estimated tax</span>
            <span>Calculated at checkout</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatMoney(total, currency)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-2 inline-flex items-center justify-center rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Checkout securely
        </Link>
        <ul className="flex flex-col gap-2 pt-2 text-xs text-stone-500">
          <li className="inline-flex items-center gap-2">
            <ShieldIcon className="h-3.5 w-3.5" />
            Encrypted checkout with 256-bit SSL
          </li>
          <li className="inline-flex items-center gap-2">
            <RefreshIcon className="h-3.5 w-3.5" />
            Free returns within 30 days
          </li>
        </ul>
      </aside>
    </div>
  );
}
