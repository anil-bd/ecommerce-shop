"use client";

import { useEffect, useState } from "react";
import { useCart, totalItemCount } from "@/lib/cart";

export function CartCount() {
  const lines = useCart((s) => s.lines);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const count = totalItemCount(lines);
  if (!count) return null;
  return (
    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[10px] font-medium text-white">
      {count}
    </span>
  );
}
