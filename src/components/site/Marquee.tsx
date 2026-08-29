import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  accent = false,
}: {
  items: string[];
  className?: string;
  accent?: boolean;
}) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-border py-2.5",
        accent ? "bg-primary text-primary-foreground" : "bg-surface",
        className,
      )}
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {row.concat(row).map((item, i) => (
          <span key={i} className="label-caps flex items-center gap-10">
            {item}
            <span aria-hidden="true" className="opacity-50">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
