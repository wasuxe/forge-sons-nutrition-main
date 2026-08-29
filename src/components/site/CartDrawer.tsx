import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, Truck, Tag } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const {
    lines,
    cartOpen,
    setCartOpen,
    setQty,
    removeLine,
    productOf,
    subtotal,
    discount,
    shipping,
    total,
    applyCoupon,
    coupon,
  } = useStore();
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70]",
        cartOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!cartOpen}
    >
      <div
        onClick={() => setCartOpen(false)}
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          cartOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-border bg-surface transition-transform duration-400 ease-out",
          cartOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg">Your Stack</h2>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-sm border border-border transition-colors hover:border-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="font-display text-2xl">Cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Nothing in here yet. Go build something worth training for.
            </p>
            <Link
              to="/shop"
              onClick={() => setCartOpen(false)}
              className="mt-2 rounded-sm bg-primary px-5 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((line, i) => {
                const p = productOf(line.slug);
                return (
                  <div
                    key={`${line.slug}-${line.flavor}-${line.size}`}
                    className="flex gap-3 rounded-md border border-border bg-card p-3"
                  >
                    <img
                      src={p?.image}
                      alt={p?.name ?? ""}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-sm object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{p?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {line.flavor} · {line.size}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-sm border border-border">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQty(i, line.qty - 1)}
                            className="px-2 py-1 hover:text-primary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-4 text-center text-sm">{line.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQty(i, line.qty + 1)}
                            className="px-2 py-1 hover:text-primary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-display font-bold">
                          {formatINR(line.unitPrice * line.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      aria-label="Remove item"
                      onClick={() => removeLine(i)}
                      className="self-start text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}

              <div className="space-y-2 rounded-md border border-border bg-card p-3">
                <label className="label-caps flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" /> Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="BEAST10"
                    className="min-w-0 flex-1 rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => {
                      const r = applyCoupon(code);
                      r.ok ? toast.success(r.message) : toast.error(r.message);
                    }}
                    className="rounded-sm bg-secondary px-3 py-2 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-primary-foreground"
                  >
                    Apply
                  </button>
                </div>
                {coupon && <p className="text-xs text-primary">{coupon} applied</p>}
              </div>

              <div className="space-y-2 rounded-md border border-border bg-card p-3">
                <label className="label-caps flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" /> Delivery estimate
                </label>
                <div className="flex gap-2">
                  <input
                    value={pin}
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN code"
                    className="min-w-0 flex-1 rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={() =>
                      setEta(
                        pin.length === 6
                          ? `Arrives in ${2 + (Number(pin[5]) % 3)}–${4 + (Number(pin[5]) % 3)} days`
                          : "Enter a valid 6-digit PIN code",
                      )
                    }
                    className="rounded-sm bg-secondary px-3 py-2 text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-primary-foreground"
                  >
                    Check
                  </button>
                </div>
                {eta && <p className="text-xs text-muted-foreground">{eta}</p>}
              </div>
            </div>

            <footer className="space-y-2 border-t border-border px-5 py-4">
              <Row label="Subtotal" value={formatINR(subtotal)} />
              {discount > 0 && (
                <Row label="Discount" value={`− ${formatINR(discount)}`} accent />
              )}
              <Row label="Shipping" value={shipping === 0 ? "FREE" : formatINR(shipping)} />
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="label-caps">Total</span>
                <span className="font-display text-2xl font-black">{formatINR(total)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="mt-1 block rounded-sm bg-primary py-3.5 text-center text-sm font-bold tracking-widest text-primary-foreground uppercase transition-transform hover:scale-[1.01]"
              >
                Checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-primary" : ""}>{value}</span>
    </div>
  );
}
