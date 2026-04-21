"use client";

import { useState } from "react";
import clsx from "clsx";
import type { VariantGroup } from "@/lib/variants";

type Props = {
  groups: VariantGroup[];
};

export function VariantPicker({ groups }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      groups.map((g) => [g.kind, g.variants.find((v) => v.available)?.id ?? g.variants[0].id]),
    ),
  );

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.kind} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-900">
              {group.label}
              <span className="ml-2 text-stone-500">
                {group.variants.find((v) => v.id === selected[group.kind])?.label}
              </span>
            </span>
            {group.kind === "size" ? (
              <button type="button" className="text-xs text-stone-500 underline hover:text-stone-900">
                Size guide
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.variants.map((v) => {
              const active = selected[group.kind] === v.id;
              if (group.kind === "color" || group.kind === "finish") {
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-label={v.label}
                    aria-pressed={active}
                    onClick={() => v.available && setSelected((s) => ({ ...s, [group.kind]: v.id }))}
                    disabled={!v.available}
                    title={v.label}
                    className={clsx(
                      "relative h-9 w-9 overflow-hidden rounded-full border-2 transition",
                      active ? "border-stone-900" : "border-stone-200 hover:border-stone-400",
                      !v.available && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <span
                      className="absolute inset-1 rounded-full"
                      style={{ background: v.swatch ?? "#e5e5e5" }}
                    />
                  </button>
                );
              }
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => v.available && setSelected((s) => ({ ...s, [group.kind]: v.id }))}
                  disabled={!v.available}
                  className={clsx(
                    "min-w-[3rem] rounded-md border px-3 py-2 text-sm transition",
                    active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-900 hover:border-stone-400",
                    !v.available && "cursor-not-allowed text-stone-400 line-through hover:border-stone-200",
                  )}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
