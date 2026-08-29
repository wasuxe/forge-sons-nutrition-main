import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart, Menu, X, Home, Grid3x3 } from "lucide-react";
import { Wordmark } from "./Logo";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Shop All", to: "/shop" as const },
  { label: "Protein", to: "/shop" as const, search: { category: "Protein" } },
  { label: "Performance", to: "/shop" as const, search: { category: "Performance" } },
  { label: "Accessories", to: "/shop" as const, search: { category: "Accessories" } },
];

export function Header() {
  const { count, setCartOpen, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suggestions = useMemo(() => {
    if (q.trim().length < 2) return [];
    const s = q.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s))
      .slice(0, 5);
  }, [q]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-60 transition-all duration-300",
          scrolled ? "glass border-b border-border" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <button
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="shrink-0">
            <Wordmark />
          </Link>

          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search as never}
                className="label-caps text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative ml-auto hidden w-64 lg:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && q.trim()) {
                  navigate({ to: "/shop", search: { q: q.trim() } as never });
                  setQ("");
                }
              }}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full rounded-sm border border-input bg-background/60 py-2 pr-3 pl-9 text-sm outline-none focus:border-primary"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full right-0 left-0 mt-2 overflow-hidden rounded-md border border-border bg-popover">
                {suggestions.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setQ("")}
                      className="block px-3 py-2 text-sm hover:bg-secondary"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1 lg:ml-3">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-sm transition-colors hover:text-primary"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <Dot n={wishlist.length} />}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative grid h-10 w-10 place-items-center rounded-sm transition-colors hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <Dot n={count} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <div
        className={cn(
          "fixed inset-0 z-[80] md:hidden",
          menu ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setMenu(false)}
          className={cn(
            "absolute inset-0 bg-background/85 backdrop-blur transition-opacity",
            menu ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-72 border-r border-border bg-surface p-5 transition-transform duration-300 ease-out",
            menu ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Wordmark />
            <button onClick={() => setMenu(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search as never}
                onClick={() => setMenu(false)}
                className="rounded-sm px-3 py-3 font-display text-lg uppercase hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setMenu(false)}
              className="rounded-sm px-3 py-3 font-display text-lg uppercase hover:bg-secondary"
            >
              Wishlist
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

function Dot({ n }: { n: number }) {
  return (
    <span className="absolute top-1 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
      {n}
    </span>
  );
}

export function MobileTabBar() {
  const { count, setCartOpen, wishlist } = useStore();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-60 grid grid-cols-4 border-t border-border bg-surface/95 backdrop-blur md:hidden">
      <Link to="/" className="flex flex-col items-center gap-1 py-2.5 text-[0.6rem] tracking-widest uppercase">
        <Home className="h-5 w-5" />
        Home
      </Link>
      <Link
        to="/shop"
        className="flex flex-col items-center gap-1 py-2.5 text-[0.6rem] tracking-widest uppercase"
      >
        <Grid3x3 className="h-5 w-5" />
        Shop
      </Link>
      <Link
        to="/wishlist"
        className="relative flex flex-col items-center gap-1 py-2.5 text-[0.6rem] tracking-widest uppercase"
      >
        <Heart className="h-5 w-5" />
        {wishlist.length > 0 && <Dot n={wishlist.length} />}
        Saved
      </Link>
      <button
        onClick={() => setCartOpen(true)}
        className="relative flex flex-col items-center gap-1 py-2.5 text-[0.6rem] tracking-widest uppercase"
      >
        <ShoppingBag className="h-5 w-5" />
        {count > 0 && <Dot n={count} />}
        Cart
      </button>
    </nav>
  );
}
