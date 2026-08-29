import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Heart, Truck, ShieldCheck, FlaskConical, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getProduct, products, formatINR } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — Kumar & Kumar Sports" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} — Kumar & Kumar Sports`;
    return {
      meta: [
        { title },
        { name: "description", content: p.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: p.blurb },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-lg px-4 py-32 text-center">
      <h1 className="display-xl text-4xl">Product not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This item may have been retired.</p>
      <Link
        to="/shop"
        className="mt-6 inline-block rounded-sm bg-primary px-5 py-2.5 text-xs font-bold tracking-widest text-primary-foreground uppercase"
      >
        Back to shop
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addLine, toggleWishlist, wishlist } = useStore();
  const [flavor, setFlavor] = useState(product.flavors[0]!);
  const [size, setSize] = useState(product.sizes[0]!);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"benefits" | "ingredients" | "how" | "nutrition">("benefits");

  const unitPrice = Math.round(product.price * size.multiplier);
  const mrp = Math.round(product.mrp * size.multiplier);
  const off = Math.round(((mrp - unitPrice) / mrp) * 100);
  const wished = wishlist.includes(product.slug);
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 4);

  const add = () => {
    addLine({ slug: product.slug, flavor, size: size.label, qty, unitPrice });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 md:pb-8">
      <nav className="label-caps text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link> /{" "}
        <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface-2">
          <div
            className="absolute inset-10 rounded-full blur-3xl"
            style={{ background: "var(--gradient-acid)", opacity: 0.15 }}
            aria-hidden="true"
          />
          <img
            src={product.image}
            alt={product.name}
            width={900}
            height={900}
            className="relative aspect-square w-full object-contain p-6"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 rounded-sm bg-primary px-2.5 py-1 text-[0.6rem] font-bold tracking-widest text-primary-foreground uppercase">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <span className="label-caps text-primary">{product.category}</span>
          <h1 className="display-xl mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold text-foreground">{product.rating}</span>
            <span>({product.reviews.toLocaleString("en-IN")} reviews)</span>
          </div>
          <p className="mt-4 text-muted-foreground">{product.blurb}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-4xl font-black">{formatINR(unitPrice)}</span>
            <span className="pb-1 text-sm text-muted-foreground line-through">{formatINR(mrp)}</span>
            <span className="mb-1 rounded-sm bg-primary/15 px-2 py-1 text-[0.65rem] font-bold tracking-widest text-primary uppercase">
              {off}% off
            </span>
          </div>

          <Selector
            label="Flavour"
            options={product.flavors}
            value={flavor}
            onChange={setFlavor}
          />
          <Selector
            label="Size"
            options={product.sizes.map((s) => s.label)}
            value={size.label}
            onChange={(l) => setSize(product.sizes.find((s) => s.label === l)!)}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-sm border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-12 w-12 place-items-center hover:text-primary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="grid h-12 w-12 place-items-center hover:text-primary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={add}
              className="acid-glow h-12 flex-1 rounded-sm bg-primary px-6 text-xs font-bold tracking-widest text-primary-foreground uppercase"
            >
              Add to cart — {formatINR(unitPrice * qty)}
            </button>
            <button
              onClick={() => {
                toggleWishlist(product.slug);
                toast(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
              aria-label="Toggle wishlist"
              className="grid h-12 w-12 place-items-center rounded-sm border border-border hover:border-primary"
            >
              <Heart className={cn("h-5 w-5", wished && "fill-primary text-primary")} />
            </button>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: Truck, t: "Free over ₹1,499" },
              { Icon: FlaskConical, t: "Lab tested" },
              { Icon: ShieldCheck, t: "100% authentic" },
            ].map(({ Icon, t }) => (
              <li key={t} className="flex items-center gap-2 rounded-sm border border-border px-3 py-2.5 text-xs">
                <Icon className="h-4 w-4 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* TABS */}
      <section className="mt-14">
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border">
          {([
            ["benefits", "Benefits"],
            ["ingredients", "Ingredients"],
            ["how", "How to use"],
            ["nutrition", "Nutrition"],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "border-b-2 px-4 py-3 text-xs font-bold tracking-widest uppercase transition-colors",
                tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="py-6 text-sm text-muted-foreground">
          {tab === "benefits" && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-2 rounded-sm border border-border bg-card p-4">
                  <Star className="mt-0.5 h-4 w-4 shrink-0 fill-primary text-primary" />
                  <span className="text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "ingredients" && <p className="max-w-3xl">{product.ingredients}</p>}
          {tab === "how" && <p className="max-w-3xl">{product.howToUse}</p>}
          {tab === "nutrition" && (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Protein", `${product.nutrition.protein} g`],
                ["Calories", `${product.nutrition.calories} kcal`],
                ["Servings", `${product.nutrition.servings}`],
                ["BCAA", `${product.nutrition.bcaa} g`],
                ["EAA", `${product.nutrition.eaa} g`],
                ["Sugar", `${product.nutrition.sugar} g`],
                ["Fat", `${product.nutrition.fat} g`],
                ["Carbs", `${product.nutrition.carbs} g`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-sm border border-border bg-card p-4">
                  <dt className="label-caps text-muted-foreground">{k}</dt>
                  <dd className="mt-1 font-display text-xl font-black text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="display-xl text-3xl sm:text-4xl">Stack it with</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile add to cart */}
      <div className="fixed inset-x-0 bottom-14 z-50 flex items-center gap-3 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur md:hidden">
        <div>
          <p className="font-display text-lg font-black leading-none">{formatINR(unitPrice * qty)}</p>
          <p className="text-[0.65rem] text-muted-foreground">{size.label} · {flavor}</p>
        </div>
        <button
          onClick={add}
          className="ml-auto rounded-sm bg-primary px-6 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

function Selector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="label-caps text-muted-foreground">{label}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={cn(
              "rounded-sm border px-4 py-2.5 text-xs transition-colors",
              value === o
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
