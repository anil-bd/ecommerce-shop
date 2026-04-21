import Link from "next/link";
import { categories } from "@/lib/data";
import { CartCount } from "./CartCount";
import { SearchInput } from "./SearchInput";
import { AnnouncementBar } from "./AnnouncementBar";
import { BagIcon, HeartIcon, UserIcon } from "./Icons";

export function Nav() {
  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-baseline gap-1">
              <span className="font-serif text-2xl leading-none tracking-tight text-stone-900">
                Alto
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-stone-500">& Oak</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-stone-700 lg:flex">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="transition hover:text-stone-900"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/" className="transition hover:text-stone-900">
                Journal
              </Link>
            </nav>
          </div>

          <div className="md:mx-auto md:max-w-lg md:flex-1">
            <SearchInput className="relative w-full" />
          </div>

          <div className="flex items-center justify-end gap-1 text-stone-700">
            <Link
              href="/"
              aria-label="Account"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-stone-100"
            >
              <UserIcon />
            </Link>
            <Link
              href="/"
              aria-label="Wishlist"
              className="hidden h-9 w-9 items-center justify-center rounded-full transition hover:bg-stone-100 sm:inline-flex"
            >
              <HeartIcon />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative inline-flex h-9 items-center gap-1 rounded-full px-3 transition hover:bg-stone-100"
            >
              <BagIcon />
              <CartCount />
            </Link>
          </div>
        </div>

        <nav className="flex items-center gap-4 overflow-x-auto border-t border-stone-100 px-4 py-2 text-xs text-stone-600 lg:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap transition hover:text-stone-900"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
