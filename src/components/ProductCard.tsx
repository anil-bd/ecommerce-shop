import type { Product } from "@/types";
import { ProductCardLayouts } from "./CardLayouts";

export function ProductCard({ product }: { product: Product }) {
  return <ProductCardLayouts product={product} />;
}
