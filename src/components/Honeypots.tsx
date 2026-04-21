import { BUILD_CLASS_SUFFIX, honeypotDigits, rndInt, hashedClass } from "@/lib/obfuscate";

type HoneypotsProps = {
  scope: string;
};

export function Honeypots({ scope }: HoneypotsProps) {
  const count = rndInt("hp-count::" + scope, 2, 4);
  const decoyCls = `pcd-${BUILD_CLASS_SUFFIX}`;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const key = `${scope}::hp${i}`;
        const fakePrice = honeypotDigits(key, 6);
        const fakeName = hashedClass("hp-name::" + key);
        return (
          <div key={i} aria-hidden="true" className={decoyCls}>
            <span data-product-name={fakeName}>product</span>
            <span data-price={`$${fakePrice.slice(0, 3)}.${fakePrice.slice(3, 5)}`}>
              ${fakePrice.slice(0, 3)}.{fakePrice.slice(3, 5)}
            </span>
            <span>sku-{fakePrice}</span>
          </div>
        );
      })}
    </>
  );
}
