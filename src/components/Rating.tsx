import clsx from "clsx";
import { StarIcon } from "./Icons";

type Props = {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
};

export function Rating({ value, count, size = "sm", showValue, className }: Props) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const starSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div
      className={clsx("inline-flex items-center gap-1.5 text-amber-500", className)}
      aria-label={`Rated ${value.toFixed(1)} out of 5${count != null ? `, ${count} reviews` : ""}`}
    >
      <span className="inline-flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <StarIcon
              key={i}
              className={clsx(starSize, !filled && "text-stone-300")}
              filled={filled}
            />
          );
        })}
      </span>
      {showValue ? (
        <span className="text-stone-700 text-xs font-medium">{value.toFixed(1)}</span>
      ) : null}
      {count != null ? (
        <span className="text-stone-500 text-xs">({count.toLocaleString()})</span>
      ) : null}
    </div>
  );
}
