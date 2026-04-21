"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/data";
import { discountedPrice, formatMoney } from "@/lib/format";
import { ShieldIcon } from "./Icons";

type FormState = {
  email: string;
  marketing: boolean;
  name: string;
  address1: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  cardNumber: string;
  cardName: string;
  cardExp: string;
  cardCvc: string;
};

const initial: FormState = {
  email: "",
  marketing: true,
  name: "",
  address1: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
  cardNumber: "",
  cardName: "",
  cardExp: "",
  cardCvc: "",
};

export function CheckoutForm() {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  const summary = useMemo(() => {
    const rows = lines
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        const unit = discountedPrice(product.currentPrice, product.discountPercent);
        return { product, quantity: line.quantity, unit, subtotal: unit * line.quantity };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
    const subtotal = rows.reduce((s, r) => s + r.subtotal, 0);
    const shipping = subtotal > 75 ? 0 : 6;
    const tax = Math.round(subtotal * 8.75) / 100;
    const total = subtotal + shipping + tax;
    const currency = rows[0]?.product.currency ?? "USD";
    return { rows, subtotal, shipping, tax, total, currency };
  }, [lines]);

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-white p-16 text-center">
        <h2 className="text-xl font-semibold">Nothing to check out</h2>
        <p className="text-sm text-stone-500">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const update =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [key]: (e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value) as FormState[K],
      }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const orderId = `A&O-${Date.now().toString(36).toUpperCase()}`;
    setTimeout(() => {
      clear();
      router.push(`/checkout/success?id=${orderId}`);
    }, 700);
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-10">
        <Section title="Contact" step={1}>
          <Field label="Email" value={form.email} onChange={update("email")} type="email" autoComplete="email" required />
          <label className="mt-2 flex items-center gap-2 text-xs text-stone-600">
            <input
              type="checkbox"
              checked={form.marketing}
              onChange={update("marketing")}
              className="h-3.5 w-3.5 rounded border-stone-300"
            />
            Email me with news and offers
          </label>
        </Section>

        <Section title="Shipping address" step={2}>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Full name" value={form.name} onChange={update("name")} autoComplete="name" required />
            <Field label="Address" value={form.address1} onChange={update("address1")} autoComplete="street-address" required />
            <Field label="Apartment, suite, etc. (optional)" value={form.apartment} onChange={update("apartment")} />
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" value={form.city} onChange={update("city")} autoComplete="address-level2" required />
              <Field label="State" value={form.state} onChange={update("state")} autoComplete="address-level1" required />
              <Field label="Zip" value={form.zip} onChange={update("zip")} autoComplete="postal-code" required />
            </div>
            <Field label="Country" value={form.country} onChange={update("country")} autoComplete="country-name" required />
            <Field label="Phone" value={form.phone} onChange={update("phone")} type="tel" autoComplete="tel" />
          </div>
        </Section>

        <Section title="Payment" step={3} note="All transactions are secure and encrypted.">
          <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Demo only — no real payment is processed. Any numbers will do.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Card number" value={form.cardNumber} onChange={update("cardNumber")} inputMode="numeric" placeholder="1234 1234 1234 1234" required />
            <Field label="Name on card" value={form.cardName} onChange={update("cardName")} autoComplete="cc-name" required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiration (MM/YY)" value={form.cardExp} onChange={update("cardExp")} placeholder="04/29" required />
              <Field label="CVC" value={form.cardCvc} onChange={update("cardCvc")} inputMode="numeric" placeholder="123" required />
            </div>
          </div>
        </Section>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-md bg-stone-900 px-6 text-base font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order · ${formatMoney(summary.total, summary.currency)}`}
          </button>
          <p className="flex items-center justify-center gap-2 text-xs text-stone-500">
            <ShieldIcon className="h-3.5 w-3.5" />
            Encrypted · Your info is never stored
          </p>
        </div>
      </div>

      <aside className="flex h-fit flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 lg:sticky lg:top-32">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          Order summary
        </h2>

        <ul className="flex flex-col divide-y divide-stone-100">
          {summary.rows.map(({ product, quantity, subtotal }) => (
            <li key={product.id} className="flex gap-3 py-3 first:pt-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-stone-100">
                <Image src={product.images[0]} alt={product.name} fill sizes="64px" className="object-cover" />
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-semibold text-white">
                  {quantity}
                </span>
              </div>
              <div className="flex flex-1 items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium text-stone-900">{product.name}</p>
                  <p className="text-xs capitalize text-stone-500">
                    {product.category.replace("-", " & ")}
                  </p>
                </div>
                <div className="whitespace-nowrap text-stone-900">
                  {formatMoney(subtotal, summary.currency)}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-1 border-t border-stone-200 pt-4 text-sm text-stone-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(summary.subtotal, summary.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{summary.shipping === 0 ? "Free" : formatMoney(summary.shipping, summary.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (est.)</span>
            <span>{formatMoney(summary.tax, summary.currency)}</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-stone-200 pt-4 text-base font-semibold">
          <span>Total</span>
          <span className="text-lg">{formatMoney(summary.total, summary.currency)}</span>
        </div>
      </aside>
    </form>
  );
}

function Section({
  title,
  step,
  note,
  children,
}: {
  title: string;
  step: number;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold text-stone-900">{title}</h2>
          {note ? <p className="text-xs text-stone-500">{note}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-stone-700">{label}</span>
      <input
        {...props}
        className="rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-stone-900"
      />
    </label>
  );
}
