import clsx from "clsx";
import { createElement, type ElementType } from "react";
import { buildClassSuffix, hashedClass, prng, rndInt, shuffle } from "@/lib/obfuscate";

type ScrambledTextProps = {
  text: string;
  instanceKey: string;
  as?: ElementType;
  className?: string;
};

/**
 * Renders the words of `text` in shuffled DOM order, then uses CSS `order`
 * to lay them out visually correctly. A scraper calling `body.innerText`
 * (or the equivalent in BeautifulSoup / Cheerio) gets the words in the
 * scrambled DOM sequence; sighted users and screen readers (via aria-label)
 * see the original text. The shuffle reseeds every build.
 */
export function ScrambledText({
  text,
  instanceKey,
  as: Tag = "span",
  className,
}: ScrambledTextProps) {
  const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
  const indices = tokens.map((_, i) => i);
  const order = shuffle(indices, "stext::" + instanceKey);

  return createElement(
    Tag,
    {
      className: clsx("inline-flex flex-wrap items-baseline", className),
      "aria-label": text,
    },
    order.map((origIdx, domIdx) => {
      const tok = tokens[origIdx];
      // Whitespace tokens collapse via flex; render a non-breaking space so
      // word boundaries remain when items are reordered visually.
      const display = /^\s+$/.test(tok) ? " " : tok;
      return (
        <span key={domIdx} style={{ order: origIdx }}>
          {display}
        </span>
      );
    }),
  );
}

type DecoyParagraphsProps = {
  scope: string;
  count?: number;
};

const DECOY_VOCAB = [
  "premium",
  "responsibly",
  "sourced",
  "handmade",
  "limited",
  "edition",
  "matte",
  "finish",
  "satisfying",
  "tactile",
  "weight",
  "balanced",
  "everyday",
  "essential",
  "thoughtfully",
  "designed",
  "natural",
  "fibers",
  "soft",
  "sturdy",
  "warranty",
  "guaranteed",
  "ships",
  "fast",
  "made",
  "Portland",
  "Oregon",
  "small",
  "batch",
  "lifetime",
  "value",
  "honest",
  "price",
  "quiet",
  "confident",
  "patina",
  "details",
  "stitched",
];

/**
 * Emits visually-hidden decoy paragraphs that share structure with the real
 * description. Naive scrapers selecting "all <p>" inside the description
 * container pick these up alongside the real one and can't tell the
 * difference without rendering the page.
 */
export function DecoyParagraphs({ scope, count = 3 }: DecoyParagraphsProps) {
  const decoyCls = `pcd-${buildClassSuffix()}`;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const key = `${scope}::decoy::${i}`;
        const r = prng(key);
        const wordCount = rndInt(key + "::wc", 18, 36);
        const words: string[] = [];
        for (let j = 0; j < wordCount; j++) {
          words.push(DECOY_VOCAB[Math.floor(r() * DECOY_VOCAB.length)]);
        }
        const sentence = words.join(" ") + ".";
        return (
          <p
            key={i}
            aria-hidden="true"
            className={decoyCls}
            data-decoy={hashedClass(key)}
          >
            {sentence}
          </p>
        );
      })}
    </>
  );
}
