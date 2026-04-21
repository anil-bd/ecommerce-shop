import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Honeypots } from "@/components/Honeypots";
import { CategoryToolbar } from "@/components/CategoryToolbar";
import { CategoryFilters } from "@/components/CategoryFilters";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not found" };
  return {
    title: `${category.name} — Alto & Oak`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const productsInCategory = getProductsByCategory(slug);

  return (
    <div className="flex flex-col gap-10">
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <span className="text-stone-900">{category.name}</span>
      </nav>

      <section className="relative overflow-hidden rounded-2xl bg-stone-100">
        <div className="absolute inset-0">
          <Image
            src={`https://picsum.photos/seed/cat-header-${category.slug}/1600/480`}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-3 px-8 py-12 text-white md:px-12 md:py-16">
          <span className="text-xs uppercase tracking-[0.25em] text-white/70">
            {productsInCategory.length} products
          </span>
          <h1 className="font-serif text-4xl md:text-5xl">{category.name}</h1>
          <p className="max-w-xl text-sm text-white/80 md:text-base">{category.description}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <CategoryFilters categorySlug={slug} />

        <div className="flex flex-col gap-6">
          <CategoryToolbar count={productsInCategory.length} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {productsInCategory.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <Honeypots scope={`category::${slug}`} />
    </div>
  );
}
