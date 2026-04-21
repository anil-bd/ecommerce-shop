export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  currentPrice: number;
  previousPrice: number | null;
  currency: string;
  discountPercent: number;
  images: string[];
};

export type DomSeed = {
  seed: string;
  generatedAt: string;
  buildId: string;
  strategyVersion: number;
};

export type CartLine = {
  productId: string;
  quantity: number;
};
