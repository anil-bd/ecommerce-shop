import { Rating } from "./Rating";

const TESTIMONIALS = [
  {
    quote: "The hoodie is absurdly good. Heavy, boxy, the drawcords don't fray. Buying a second.",
    name: "Maya R.",
    city: "Brooklyn, NY",
    rating: 5,
  },
  {
    quote: "Price ticked up a couple dollars between when I looked and when I bought. Still the best desk lamp I've owned.",
    name: "Tom S.",
    city: "Oakland, CA",
    rating: 5,
  },
  {
    quote: "Honest catalog. No gimmicks. Ordered the skillet, got it in two days, it's already my favorite.",
    name: "Priya K.",
    city: "Austin, TX",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-3xl text-stone-900">What people are saying</h2>
        <a href="#" className="text-sm text-stone-500 hover:text-stone-900">Read all reviews →</a>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6"
          >
            <Rating value={t.rating} />
            <blockquote className="text-sm leading-relaxed text-stone-700">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto text-xs text-stone-500">
              <span className="font-medium text-stone-900">{t.name}</span> · {t.city}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
