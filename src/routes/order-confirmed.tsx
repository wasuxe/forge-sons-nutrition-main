import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Kumar & Kumar Sports" },
      {
        name: "description",
        content: "Your Kumar & Kumar Sports order is confirmed and dispatching within 24 hours.",
      },
      { property: "og:title", content: "Order Confirmed — Kumar & Kumar Sports" },
      { property: "og:description", content: "Thanks for fuelling with Kumar & Kumar Sports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const id = "KKS-" + String(Math.floor(100000 + Math.random() * 899999));
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
      <h1 className="display-xl mt-6 text-4xl sm:text-6xl">Order confirmed</h1>
      <p className="mt-4 text-muted-foreground">
        Order <span className="text-foreground">{id}</span> is locked in. Dispatch within 24
        hours, tracking lands in your inbox.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/shop"
          className="rounded-sm bg-primary px-6 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase"
        >
          Keep shopping
        </Link>
        <Link
          to="/"
          className="rounded-sm border border-border px-6 py-3 text-xs font-bold tracking-widest uppercase hover:border-primary hover:text-primary"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
