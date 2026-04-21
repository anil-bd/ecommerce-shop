export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function discountedPrice(currentPrice: number, discountPercent: number): number {
  if (!discountPercent) return currentPrice;
  return Math.round(currentPrice * (100 - discountPercent)) / 100;
}

export function priceDeltaPercent(current: number, previous: number | null): number | null {
  if (previous == null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}
