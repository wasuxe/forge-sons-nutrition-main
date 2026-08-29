import React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatINR, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const cardRef = React.useRef<HTMLElement | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  function handleMove(e: React.MouseEvent) {
    const el = cardRef.current;
    const img = imgRef.current;
    if (!el || !img) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateY = x * 10; // degrees
    const rotateX = -y * 6;
    const translateZ = 16;

    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    img.style.transform = `translateZ(${translateZ}px) scale(1.06)`;
  }

  function handleLeave() {
    const el = cardRef.current;
    const img = imgRef.current;
    if (!el || !img) return;
    el.style.transform = "none";
    img.style.transform = "none";
  }
  const { addLine, toggleWishlist, wishlist } = useStore();
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wished = wishlist.includes(product.slug);

  return (
    <article
      ref={cardRef as any}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 perspective-800 card-3d card-shadow-deep",
        className,
      )}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-surface-2"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={600}
          height={600}
          ref={imgRef as any}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 preserve-3d"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 to-transparent opacity-70" />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-sm bg-primary px-2 py-1 text-[0.6rem] font-bold tracking-widest text-primary-foreground uppercase">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-sm bg-background/80 px-2 py-1 text-[0.6rem] font-bold tracking-widest text-primary uppercase">
          {off}% off
        </span>
      </Link>

      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => {
          toggleWishlist(product.slug);
          toast(wished ? "Removed from wishlist" : "Saved to wishlist");
        }}
        className="absolute top-12 right-3 grid h-9 w-9 place-items-center rounded-sm border border-border bg-background/70 backdrop-blur transition-colors hover:border-primary"
      >
        <Heart
          className={cn("h-4 w-4", wished ? "fill-primary text-primary" : "text-foreground")}
        />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="font-semibold text-foreground">{product.rating}</span>
          <span>({product.reviews.toLocaleString("en-IN")})</span>
        </div>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="text-base leading-tight">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">{product.flavors[0]}</p>
        <div className="mt-auto flex items-end gap-2 pt-2">
          <span className="font-display text-xl font-black">{formatINR(product.price)}</span>
          <span className="pb-0.5 text-xs text-muted-foreground line-through">
            {formatINR(product.mrp)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            addLine({
              slug: product.slug,
              flavor: product.flavors[0] ?? "Default",
              size: product.sizes[0]?.label ?? "Standard",
              qty: 1,
              unitPrice: product.price,
            });
            toast.success(`${product.name} added to cart`);
          }}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-sm bg-secondary px-3 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add to cart
        </button>
      </div>
    </article>
  );
}
