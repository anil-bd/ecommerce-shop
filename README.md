# Alto & Oak

A Next.js demo storefront that mutates its own DOM every day to defeat
scrapers. Built for a Bright Data scraping-resistance demo.

- **Live:** https://ecommerce-shop-brd.vercel.app
- **Build info (current rotation):** https://ecommerce-shop-brd.vercel.app/build-info
- **Repo:** https://github.com/anil-bd/ecommerce-shop

## What it is

A small ecommerce site (20 products across 3 categories) with a daily
DOM rotation that breaks selector-based scrapers. Every rotation changes
class names, element tags, wrapper depth, attribute names and values,
price digit permutations, image URLs, *which sections appear on each
page*, and *the order those sections appear in*.

## What rotates each build

Driven by `data/rotation-nonce.json` and today's UTC date (3am UTC day
boundary). A "build" is uniquely identified by `build-YYYY-MM-DD-nNN-xxxxxx`.

- **Hashed class names** — every `c-xxxxxx` suffix is fresh
- **Polymorphic tags** — headings, wrappers, inline elements rotate
  between `<h1>/<h2>/<h3>/<p>/<div>`, `<div>/<section>/<article>/<aside>/<main>`,
  `<span>/<b>/<i>/<em>/<u>` etc.
- **Wrapper depth** — components are wrapped in 0–3 extra random
  elements per build, so structural XPath doesn't survive
- **Noise `data-*` attributes** — `data-bucket-xxx`, `data-cell-xxx` etc.
  with fresh name suffixes and fresh values
- **Section presence** — five optional product-detail sections (FAQ,
  Trending, Comparison, Care guide, Maker note) are each independently
  coin-flipped per build (~55% show rate)
- **Section order** — the visible sections are shuffled into a different
  order each build
- **Home page sections** — Value props, Categories, Featured, Makers
  banner, New arrivals, Testimonials, Newsletter are coin-flipped and
  shuffled the same way
- **Price digit permutation** — every `<Price>` shuffles its digit
  `<span>`s into a different DOM order, reassembled visually via CSS
  `order`
- **aria-label phrasing** — rotates between several natural-language
  formats so `"$NN.NN"` doesn't appear even in aria
- **Word order in product names and descriptions** — DOM order shuffled,
  visual order preserved via CSS `order`; aria-label keeps the real text
- **Honeypot decoys** — visually-hidden fake product and price nodes,
  fresh values per build
- **Image URLs** — `?v=N` cache-buster appended; bumps every rotation
- **Per-product visible "values"** — a per-product promo line and buyer
  nudge picked from a small bank, rotates per build

## What does *not* rotate

- The page is always a recognizable ecommerce site (Hero stays first,
  Honeypots stay last on the home page; gallery/info block stays first
  on product pages)
- URL paths and product slugs
- The `<title>` tag (kept stable for SEO and browser tabs)
- Product names contain the same words across builds — only their DOM
  order shuffles
- Tailwind utility classes (`text-3xl`, `font-semibold`, ...) — these
  are visual styling, not semantic selectors

## How rotation works

The rotation has two triggers:

1. **Cron**: every day at 03:00 UTC via the workflow
   `.github/workflows/daily-rebuild.yml`
2. **Manual**: `workflow_dispatch` from the Actions tab, or `gh workflow
   run daily-rebuild.yml -R anil-bd/ecommerce-shop`

What the workflow does:

```
node scripts/bump-nonce.mjs       # increments data/rotation-nonce.json
node scripts/rotate-seed.mjs      # legacy, harmless
git commit + push                 # commits both data files to main
Vercel auto-deploys on push       # live site reflects new build within ~60s
```

The nonce is read by `src/lib/data.ts` at module load and mixed into
every PRNG call via the seed. All DOM randomization functions
(`hashedClass`, `polyTag`, `noiseAttrs`, `shuffle`, `prng`, etc.) read
the seed, so bumping the nonce reseeds *every* obfuscation primitive
without any code change.

## Trying the test

```bash
# Install scraper deps
pip install requests beautifulsoup4

# Snapshot 1
python scrapers/fragile_scraper.py > /tmp/before.txt

# Trigger a rotation
gh workflow run daily-rebuild.yml -R anil-bd/ecommerce-shop

# Wait ~60s for Vercel to deploy

# Snapshot 2
python scrapers/fragile_scraper.py > /tmp/after.txt

# Diff
diff /tmp/before.txt /tmp/after.txt
```

You'll see `build_id` change, `sample_hashed_class_today` change,
`sample_noise_attr_today` change, `first_image_src` change, and often
`first_h1_text`/`first_h2_text` change too because section order
shuffled.

For a quick at-a-glance view of the current rotation state without
running anything, open https://ecommerce-shop-brd.vercel.app/build-info.

## What survives the rotation

- **Headless browser scrapers** (Selenium, Playwright, Puppeteer) can
  render the page and read names/descriptions visually. Defeating those
  requires bot detection at the edge — out of scope for this demo.
- **Free-text full-page search** can still find product names because
  the words are present, just in shuffled DOM order.
- The `<title>` tag (intentionally kept stable).

This is a DOM-obfuscation demo, not a bot-protection platform.

## Architecture

- **Next.js 16** App Router, TypeScript, Tailwind v4
- All pages use ISR (`export const revalidate = 300`) so Vercel
  regenerates static HTML at most every 5 min, picking up rotation
  commits promptly
- `src/lib/data.ts` — memoized-by-date module exporting `getDomSeed()`,
  `getProducts()` etc.
- `src/lib/obfuscate.ts` — primitives (`hashedClass`, `polyTag`,
  `shuffle`, `noiseAttrs`, `honeypotDigits`, `obfuscatedAriaPrice`,
  `buildClassSuffix`, `priceStrategy`)
- `src/lib/pricing.ts` — date-and-nonce-derived prices, ±15% bounded
- `src/lib/promos.ts` — per-build promo/nudge strings
- `src/components/Price.tsx` — CSS-`order` digit shuffle
- `src/components/ScrambledText.tsx` — same trick for names and
  descriptions, with `DecoyParagraphs` for invisible paragraph noise
- `src/components/Honeypots.tsx` — invisible decoy product cards
- `src/components/DecoySections.tsx` — five optional product-detail
  sections that appear/disappear per build
- `src/components/CardLayouts.tsx` / `DetailLayouts.tsx` — multiple
  layout variants per card and per product-detail header, picked per
  build by `src/lib/layouts.ts`

## Local development

```bash
npm install
npm run dev          # http://localhost:3000

npm run build        # production build
npm run bump-nonce   # increment data/rotation-nonce.json locally
```
