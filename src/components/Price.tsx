import clsx from "clsx";
import {
  BUILD_CLASS_SUFFIX,
  hashedClass,
  honeypotDigits,
  inlineTag,
  noiseAttrs,
  obfuscatedAriaPrice,
  shuffle,
} from "@/lib/obfuscate";
import { formatMoney } from "@/lib/format";
import { createElement } from "react";

type PriceProps = {
  amount: number;
  currency: string;
  label?: string;
  strike?: boolean;
  className?: string;
  instanceKey: string;
};

export function Price({
  amount,
  currency,
  label,
  strike,
  className,
  instanceKey,
}: PriceProps) {
  const formatted = formatMoney(amount, currency);
  const chars = Array.from(formatted);
  const permKey = `price::${instanceKey}::${formatted}`;

  const positions = chars.map((_, i) => i);
  const shuffled = shuffle(positions, permKey);

  const decoy = honeypotDigits(permKey, 10);
  const outerCls = hashedClass("price-outer::" + instanceKey);
  const charCls = `pc-${BUILD_CLASS_SUFFIX}`;
  const decoyCls = `pcd-${BUILD_CLASS_SUFFIX}`;
  const wrapperTag = inlineTag("price-wrap::" + instanceKey);
  const attrs = noiseAttrs("price::" + instanceKey, 2);

  return createElement(
    wrapperTag,
    {
      className: clsx(
        "inline-flex items-baseline tabular-nums",
        strike && "text-neutral-400 line-through decoration-neutral-400",
        outerCls,
        className,
      ),
      "aria-label": obfuscatedAriaPrice(amount, currency, label),
      ...attrs,
    },
    <>
      {shuffled.map((origIdx, domIdx) => {
        const ch = chars[origIdx];
        return (
          <span
            key={domIdx}
            style={{ order: origIdx }}
            className={charCls}
            aria-hidden="true"
          >
            {ch}
          </span>
        );
      })}
      <span
        className={decoyCls}
        aria-hidden="true"
        style={{ order: chars.length + 10 }}
      >
        {decoy}
      </span>
    </>,
  );
}
