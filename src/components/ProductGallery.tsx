"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

type Props = {
  images: string[];
  alt: string;
  galleryClass?: string;
  thumbClass?: string;
};

export function ProductGallery({ images, alt, galleryClass, thumbClass }: Props) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return (
    <div className="flex flex-col gap-4">
      <div
        className={clsx(
          "relative aspect-square overflow-hidden rounded-lg bg-neutral-50",
          galleryClass,
        )}
      >
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-md border bg-neutral-50 transition",
                active === i
                  ? "border-neutral-900"
                  : "border-neutral-200 hover:border-neutral-400",
                thumbClass,
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
