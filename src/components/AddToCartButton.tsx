"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/lib/cart";
import clsx from "clsx";

type Props = {
  productId: string;
  className?: string;
};

export function AddToCartButton({ productId, className }: Props) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          add(productId, 1);
          setAdded(true);
          setTimeout(() => setAdded(false), 1200);
        });
      }}
      className={clsx(
        "inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700",
        className,
      )}
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
