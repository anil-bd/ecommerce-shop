import Link from "next/link";
import { CartContents } from "@/components/CartContents";

export const metadata = { title: "Cart — Alto & Oak" };

export default function CartPage() {
  return (
    <div className="flex flex-col gap-8">
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <span className="text-stone-900">Cart</span>
      </nav>
      <div className="flex items-end justify-between">
        <h1 className="font-serif text-4xl text-stone-900">Your cart</h1>
      </div>
      <CartContents />
    </div>
  );
}
