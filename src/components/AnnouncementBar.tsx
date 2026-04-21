import { TruckIcon, RefreshIcon, ShieldIcon } from "./Icons";

const ITEMS = [
  { icon: TruckIcon, text: "Free shipping on orders over $75" },
  { icon: RefreshIcon, text: "Free 30-day returns" },
  { icon: ShieldIcon, text: "Secure checkout — always" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-stone-900 text-stone-100">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-8 px-4 py-2 text-xs">
        {ITEMS.map(({ icon: Icon, text }, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-2 ${i === 0 ? "" : "hidden md:inline-flex"}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
