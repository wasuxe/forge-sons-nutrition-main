import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Kumar & Kumar Sports" },
      {
        name: "description",
        content: "Complete your Kumar & Kumar Sports order with fast dispatch across India.",
      },
      { property: "og:title", content: "Secure Checkout — Kumar & Kumar Sports" },
      { property: "og:description", content: "Fast, secure checkout for your performance stack." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const FIELDS = [
  { id: "name", label: "Full name", type: "text", auto: "name" },
  { id: "email", label: "Email", type: "email", auto: "email" },
  { id: "phone", label: "Phone", type: "tel", auto: "tel" },
  { id: "address", label: "Address", type: "text", auto: "street-address" },
  { id: "city", label: "City", type: "text", auto: "address-level2" },
  { id: "pin", label: "PIN code", type: "text", auto: "postal-code" },
];

function CheckoutPage() {
  const { lines, productOf, subtotal, discount, shipping, total, clearCart } = useStore();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="display-xl text-4xl">Your cart is empty</h1>
        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-sm bg-primary px-6 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase"
        >
          Shop the range
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <span className="label-caps text-primary">Checkout</span>
      <h1 className="display-xl mt-3 text-4xl sm:text-6xl">Lock in your stack</h1>

      <form
        className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]"
        onSubmit={(e) => {
          e.preventDefault();
          setPlacing(true);
          clearCart();
          navigate({ to: "/order-confirmed" });
        }}
      >
        <div className="grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.id} className={f.id === "address" ? "sm:col-span-2" : undefined}>
              <span className="label-caps text-muted-foreground">{f.label}</span>
              <input
                required
                type={f.type}
                autoComplete={f.auto}
                className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
              />
            </label>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  {productOf(l.slug)?.name ?? l.slug} · {l.flavor} · {l.size} × {l.qty}
                </span>
                <span>{formatINR(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary">
                <dt>Discount</dt>
                <dd>−{formatINR(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-display text-xl font-black">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={placing}
            className="acid-glow mt-6 w-full rounded-sm bg-primary px-6 py-4 text-xs font-bold tracking-widest text-primary-foreground uppercase disabled:opacity-60"
          >
            {placing ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
