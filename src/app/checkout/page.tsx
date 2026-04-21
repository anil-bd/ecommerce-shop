import Link from "next/link";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Checkout — Alto & Oak" };

export default function CheckoutPage() {
  return (
    <div className="flex flex-col gap-8">
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-stone-900">Cart</Link>
        <span>/</span>
        <span className="text-stone-900">Checkout</span>
      </nav>
      <h1 className="font-serif text-4xl text-stone-900">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
