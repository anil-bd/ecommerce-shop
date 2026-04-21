"use client";

import { useState } from "react";
import clsx from "clsx";

type Section = { title: string; options: string[] };

const SECTIONS_BY_CATEGORY: Record<string, Section[]> = {
  electronics: [
    { title: "Brand", options: ["Aurora", "Pulse", "Clack", "Echo", "Lumen", "Hub", "Mute"] },
    { title: "Feature", options: ["Wireless", "Noise-canceling", "4K", "USB-C", "Mechanical"] },
    { title: "Price", options: ["Under $75", "$75–$150", "$150–$250", "Over $250"] },
  ],
  apparel: [
    { title: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { title: "Color", options: ["Black", "Stone", "Navy", "Olive", "Rust", "Cream"] },
    { title: "Material", options: ["Cotton", "Fleece", "Denim", "Wool", "Canvas"] },
    { title: "Price", options: ["Under $50", "$50–$100", "Over $100"] },
  ],
  "home-kitchen": [
    { title: "Use", options: ["Coffee & tea", "Cooking", "Dining", "Lighting", "Living room"] },
    { title: "Material", options: ["Stoneware", "Cast iron", "Bamboo", "Linen", "Metal"] },
    { title: "Price", options: ["Under $40", "$40–$80", "Over $80"] },
  ],
};

type Props = {
  categorySlug: string;
};

export function CategoryFilters({ categorySlug }: Props) {
  const sections = SECTIONS_BY_CATEGORY[categorySlug] ?? [];
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const toggle = (section: string, opt: string) => {
    setSelected((s) => {
      const next = new Set(s[section] ?? []);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return { ...s, [section]: next };
    });
  };

  const activeCount = Object.values(selected).reduce((sum, set) => sum + set.size, 0);

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
          Filters {activeCount ? `· ${activeCount}` : ""}
        </h3>
        {activeCount ? (
          <button
            type="button"
            onClick={() => setSelected({})}
            className="text-xs text-stone-500 underline hover:text-stone-900"
          >
            Clear
          </button>
        ) : null}
      </div>
      {sections.map((sec) => (
        <details key={sec.title} open className="group border-t border-stone-200 pt-4">
          <summary className="flex cursor-pointer items-center justify-between list-none text-sm font-medium text-stone-900">
            {sec.title}
            <span className="text-stone-400 transition group-open:rotate-180">▾</span>
          </summary>
          <ul className="mt-3 flex flex-col gap-2">
            {sec.options.map((opt) => {
              const active = selected[sec.title]?.has(opt) ?? false;
              return (
                <li key={opt}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700 hover:text-stone-900">
                    <span
                      className={clsx(
                        "inline-flex h-4 w-4 items-center justify-center rounded border transition",
                        active
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-300 bg-white",
                      )}
                    >
                      {active ? <span className="text-[10px] leading-none">✓</span> : null}
                    </span>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(sec.title, opt)}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </aside>
  );
}
