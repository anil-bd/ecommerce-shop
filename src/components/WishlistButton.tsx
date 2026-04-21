"use client";

import { useState } from "react";
import clsx from "clsx";
import { HeartIcon } from "./Icons";

type Props = {
  className?: string;
  label?: string;
};

export function WishlistButton({ className, label = "Save to wishlist" }: Props) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved((s) => !s);
      }}
      className={clsx(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-stone-400",
        saved && "border-rose-300 bg-rose-50 text-rose-600",
        className,
      )}
    >
      <HeartIcon
        className={clsx("h-4 w-4", saved && "fill-rose-500 stroke-rose-500")}
      />
    </button>
  );
}
