import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories, goals } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Motion";
import { cn } from "@/lib/utils";

type ShopSearch = {
  q?: string | undefined;
  category?: string | undefined;
  goal?: string | undefined;
  sort?: "popular" | "price-asc" | "price-desc" | "rating" | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const sort = search["sort"];
    return {
      q: typeof search["q"] === "string" ? search["q"] : undefined,
      category: typeof search["category"] === "string" ? search["category"] : undefined,
      goal: typeof search["goal"] === "string" ? search["goal"] : undefined,
      sort:
        sort === "price-asc" || sort === "price-desc" || sort === "rating" || sort === "popular"
          ? sort
          : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop All Supplements — Kumar & Kumar Sports" },
      {
        name: "description",
        content:
          "Browse whey protein, isolate, mass gainer, creatine, pre-workout, bars and accessories. Filter by goal, category and price.",
      },
      { property: "og:title", content: "Shop Performance Nutrition — Kumar & Kumar Sports" },
      {
        property: "og:description",
        content: "Lab-tested protein and performance supplements, filterable by your training goal.",
      },
    ],
  }),
  component: Shop,
});

const SORTS: { value: NonNullable<ShopSearch["sort"]>; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "rating", label: "Top rated" },
];

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const set = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const list = useMemo(() => {
    const q = search.q?.toLowerCase().trim();
    let out = products.filter((p) => {
      if (search.category && p.category !== search.category) return false;
      if (search.goal && !p.goals.includes(search.goal)) return false;
      if (q && !(p.name.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q)))
        return false;
      return true;
    });
    const sort = search.sort ?? "popular";
    out = [...out].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.popularity - a.popularity;
    });
    return out;
  }, [search]);

  const active = Boolean(search.q || search.category || search.goal);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="label-caps text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / <span className="text-foreground">Shop</span>
      </nav>
      <h1 className="display-xl mt-4 text-5xl sm:text-6xl">
        {search.goal ?? search.category ?? "All Products"}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        {list.length} product{list.length === 1 ? "" : "s"} — every label published in full.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 text-primary">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="label-caps">Filters</span>
            {active && (
              <button
                onClick={() => navigate({ search: {} })}
                className="ml-auto inline-flex items-center gap-1 text-[0.65rem] tracking-widest text-muted-foreground uppercase hover:text-foreground"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          <div>
            <h2 className="label-caps text-muted-foreground">Category</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  on={search.category === c}
                  onClick={() => set({ category: search.category === c ? undefined : c })}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="label-caps text-muted-foreground">Goal</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {goals.map((g) => (
                <Chip
                  key={g.name}
                  label={g.name}
                  on={search.goal === g.name}
                  onClick={() => set({ goal: search.goal === g.name ? undefined : g.name })}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="label-caps text-muted-foreground">Sort</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {SORTS.map((s) => (
                <Chip
                  key={s.value}
                  label={s.label}
                  on={(search.sort ?? "popular") === s.value}
                  onClick={() => set({ sort: s.value })}
                />
              ))}
            </div>
          </div>
        </aside>

        {list.length === 0 ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-border py-24 text-center">
            <div>
              <p className="font-display text-2xl uppercase">Nothing matches</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try clearing a filter or searching something broader.
              </p>
              <button
                onClick={() => navigate({ search: {} })}
                className="mt-5 rounded-sm bg-primary px-5 py-2.5 text-xs font-bold tracking-widest text-primary-foreground uppercase"
              >
                Reset filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 6) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "rounded-sm border px-3 py-1.5 text-xs transition-colors",
        on
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
