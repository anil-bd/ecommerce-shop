import Link from "next/link";
import { CheckIcon, TruckIcon } from "@/components/Icons";

export const metadata = { title: "Order placed — Alto & Oak" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const orderId = id ?? "A&O-UNKNOWN";

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-12 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
        <CheckIcon className="h-8 w-8" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-serif text-4xl text-stone-900">Thanks for your order</h1>
        <p className="max-w-md text-base text-stone-600">
          We&apos;ve received it and started packing. A confirmation is on the way to your inbox.
        </p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 font-mono text-xs text-white">
          Order {orderId}
        </div>
      </div>

      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { step: "Confirmed", note: "Just now", done: true },
          { step: "Packed", note: "Within 24h", done: false },
          { step: "Shipped", note: "2-3 business days", done: false },
        ].map((s) => (
          <div
            key={s.step}
            className="flex flex-col items-start gap-1 rounded-lg border border-stone-200 bg-white p-4 text-left"
          >
            <span className="text-xs uppercase tracking-wider text-stone-500">{s.step}</span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-stone-900">
              {s.done ? (
                <CheckIcon className="h-4 w-4 text-emerald-600" />
              ) : (
                <TruckIcon className="h-4 w-4 text-stone-400" />
              )}
              {s.note}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-stone-500">
        This is a demo storefront — no real payment was processed or shipment created.
      </p>

      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Continue shopping
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 hover:bg-stone-50"
        >
          View order status
        </Link>
      </div>
    </div>
  );
}
