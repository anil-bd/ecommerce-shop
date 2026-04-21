"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/data";
import { SearchIcon } from "./Icons";

type Props = {
  className?: string;
};

export function SearchInput({ className }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getProducts()
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.includes(q),
      )
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onClick = () => setOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      className={className ?? "relative w-full max-w-md"}
      onClick={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) {
            router.push(`/product/${results[0].slug}`);
            setOpen(false);
            setQuery("");
          }
        }}
      >
        <label className="relative block">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            placeholder="Search headphones, hoodies, mugs…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="w-full rounded-full border border-stone-200 bg-stone-50 py-2 pl-9 pr-4 text-sm text-stone-900 placeholder:text-stone-500 focus:border-stone-400 focus:bg-white focus:outline-none"
          />
        </label>
      </form>
      {open && query && results.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-lg border border-stone-200 bg-white shadow-lg">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="flex items-center gap-3 border-b border-stone-100 p-3 last:border-0 hover:bg-stone-50"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-stone-100">
                <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-stone-900">{p.name}</p>
                <p className="text-xs capitalize text-stone-500">{p.category.replace("-", " & ")}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
      {open && query && results.length === 0 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-500 shadow-lg">
          No matches for &ldquo;{query}&rdquo;.
        </div>
      ) : null}
    </div>
  );
}
