"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "./Icons";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
  { id: "rating", label: "Highest rated" },
  { id: "new", label: "Newest" },
];

type Props = {
  count: number;
  onSortChange?: (id: string) => void;
  onGridChange?: (cols: 2 | 4) => void;
};

export function CategoryToolbar({ count, onSortChange, onGridChange }: Props) {
  const [sort, setSort] = useState("featured");
  const [cols, setCols] = useState<2 | 4>(4);

  return (
    <div className="flex items-center justify-between gap-4 border-y border-stone-200 py-3">
      <span className="text-sm text-stone-600">{count} products</span>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1 rounded-md border border-stone-200 p-1 md:flex">
          {([2, 4] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCols(c);
                onGridChange?.(c);
              }}
              className={clsx(
                "flex h-7 w-7 items-center justify-center rounded transition",
                cols === c ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100",
              )}
              aria-label={`${c} columns`}
            >
              <span className={c === 2 ? "text-[10px]" : "text-[10px]"}>{c}×</span>
            </button>
          ))}
        </div>
        <label className="relative inline-flex items-center gap-2 text-sm">
          <span className="hidden text-stone-500 md:inline">Sort</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                onSortChange?.(e.target.value);
              }}
              className="appearance-none rounded-md border border-stone-200 bg-white py-2 pl-3 pr-9 text-sm text-stone-900 hover:border-stone-400 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          </div>
        </label>
      </div>
    </div>
  );
}
