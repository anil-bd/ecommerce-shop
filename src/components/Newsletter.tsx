"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="rounded-xl bg-stone-900 px-8 py-12 text-stone-100 md:px-12">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-3xl leading-tight">First pick of new arrivals.</h2>
          <p className="text-sm text-stone-300">
            One short email a month. New makers, restocked favorites, and the occasional field note — no spam, ever.
          </p>
        </div>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          {done ? (
            <p className="rounded-md bg-emerald-700/30 px-4 py-3 text-sm text-emerald-100">
              Thanks — you&apos;re on the list.
            </p>
          ) : (
            <>
              <label className="sr-only" htmlFor="newsletter-email">Email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-md border border-stone-700 bg-stone-800 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-200"
              >
                Subscribe
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
