import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Kumar & Kumar Sports" },
      {
        name: "description",
        content: "Saved protein, creatine and performance supplements from Kumar & Kumar Sports.",
      },
      { property: "og:title", content: "Your Wishlist — Kumar & Kumar Sports" },
      { property: "og:description", content: "Everything you saved for your next stack." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, productOf } = useStore();
  const items = wishlist.map(productOf).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <span className="label-caps text-primary">Saved</span>
      <h1 className="display-xl mt-3 text-4xl sm:text-6xl">Your wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Nothing saved yet.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-sm bg-primary px-6 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase"
          >
            Browse the range
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p!.slug} product={p!} />
          ))}
        </div>
      )}
    </div>
  );
}
