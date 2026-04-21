import { TruckIcon, RefreshIcon, ShieldIcon, LeafIcon } from "./Icons";

const PROPS = [
  { icon: TruckIcon, title: "Free shipping over $75", sub: "2-3 day ground in the US" },
  { icon: RefreshIcon, title: "30-day returns", sub: "Free return label included" },
  { icon: ShieldIcon, title: "Secure checkout", sub: "256-bit SSL, never stored" },
  { icon: LeafIcon, title: "Responsibly sourced", sub: "Verified makers, plain trade" },
];

export function ValueProps() {
  return (
    <section className="grid grid-cols-2 gap-4 rounded-xl border border-stone-200 bg-white p-6 md:grid-cols-4">
      {PROPS.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex items-start gap-3">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-stone-700" />
          <div>
            <p className="text-sm font-medium text-stone-900">{title}</p>
            <p className="text-xs text-stone-500">{sub}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
