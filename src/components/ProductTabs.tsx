"use client";

import { useState } from "react";
import clsx from "clsx";
import { Rating } from "./Rating";
import { ScrambledText, DecoyParagraphs } from "./ScrambledText";

type Props = {
  description: string;
  rating: number;
  reviewCount: number;
};

const REVIEWS = [
  {
    name: "Jordan M.",
    rating: 5,
    title: "Better than expected",
    body: "Shows up fast, packaging was clean, and the quality is exactly as described. Will buy again.",
    date: "3 weeks ago",
  },
  {
    name: "Kenji L.",
    rating: 4,
    title: "Solid for the price",
    body: "Docked one star because the color in person is a touch cooler than the photos. Otherwise great.",
    date: "1 month ago",
  },
  {
    name: "Amina O.",
    rating: 5,
    title: "Exactly what I wanted",
    body: "Subtle, well-built, and the finish is outstanding. Recommend.",
    date: "2 months ago",
  },
];

export function ProductTabs({ description, rating, reviewCount }: Props) {
  const [tab, setTab] = useState<"description" | "shipping" | "reviews">("description");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 border-b border-stone-200">
        {(
          [
            ["description", "Description"],
            ["shipping", "Shipping & returns"],
            ["reviews", `Reviews (${reviewCount.toLocaleString()})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={clsx(
              "relative -mb-px border-b-2 px-4 py-3 text-sm font-medium transition",
              tab === key
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-900",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "description" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-base leading-relaxed text-stone-700">
              <DecoyParagraphs scope="tabs-desc-pre" count={2} />
              <ScrambledText
                text={description}
                instanceKey="desc-tabs"
                as="p"
                className="block"
              />
              <DecoyParagraphs scope="tabs-desc-post" count={2} />
            </div>
          </div>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex flex-col gap-1 rounded-lg border border-stone-200 p-4">
              <dt className="text-xs uppercase tracking-wider text-stone-500">Made in</dt>
              <dd className="font-medium text-stone-900">Portland, OR</dd>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-stone-200 p-4">
              <dt className="text-xs uppercase tracking-wider text-stone-500">Materials</dt>
              <dd className="font-medium text-stone-900">Premium, responsibly sourced</dd>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-stone-200 p-4">
              <dt className="text-xs uppercase tracking-wider text-stone-500">Warranty</dt>
              <dd className="font-medium text-stone-900">2 years, limited</dd>
            </div>
          </dl>
        </div>
      ) : null}

      {tab === "shipping" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border border-stone-200 p-5">
            <h3 className="text-sm font-semibold text-stone-900">Shipping</h3>
            <p className="text-sm leading-relaxed text-stone-600">
              Free standard shipping in the US on orders over $75. Otherwise $6 flat.
              Expedited and international options available at checkout.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-stone-200 p-5">
            <h3 className="text-sm font-semibold text-stone-900">Returns</h3>
            <p className="text-sm leading-relaxed text-stone-600">
              Free returns within 30 days. We&apos;ll email you a prepaid label — no questions asked.
            </p>
          </div>
        </div>
      ) : null}

      {tab === "reviews" ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
          <aside className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-5">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold text-stone-900">{rating.toFixed(1)}</span>
              <span className="text-sm text-stone-500">/ 5</span>
            </div>
            <Rating value={rating} />
            <p className="text-xs text-stone-500">
              Based on {reviewCount.toLocaleString()} verified reviews
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-xs text-stone-600">
              {[5, 4, 3, 2, 1].map((s) => {
                const pct = Math.max(
                  2,
                  Math.round(100 * (1 - Math.abs(rating - s) / 4.5)),
                );
                return (
                  <li key={s} className="flex items-center gap-2">
                    <span className="w-4 text-stone-500">{s}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
                      <span
                        className="block h-full rounded-full bg-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-8 text-right text-stone-500">{pct}%</span>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="mt-3 rounded-md border border-stone-300 px-3 py-2 text-xs font-medium text-stone-900 hover:bg-stone-50"
            >
              Write a review
            </button>
          </aside>
          <ul className="flex flex-col divide-y divide-stone-200">
            {REVIEWS.map((r) => (
              <li key={r.name} className="flex flex-col gap-2 py-5 first:pt-0">
                <Rating value={r.rating} />
                <h4 className="text-sm font-semibold text-stone-900">{r.title}</h4>
                <p className="text-sm leading-relaxed text-stone-700">{r.body}</p>
                <p className="text-xs text-stone-500">{r.name} · {r.date}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
