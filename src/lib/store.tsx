import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "./products";

export type CartLine = {
  slug: string;
  flavor: string;
  size: string;
  qty: number;
  unitPrice: number;
};

type StoreValue = {
  lines: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  coupon: string | null;
  setCartOpen: (v: boolean) => void;
  addLine: (line: CartLine) => void;
  setQty: (index: number, qty: number) => void;
  removeLine: (index: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  count: number;
  productOf: (slug: string) => Product | undefined;
};

const StoreContext = createContext<StoreValue | null>(null);

const COUPONS: Record<string, number> = { BEAST10: 0.1, FORGE15: 0.15, KKS20: 0.2 };
const KEY = "kks-store-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setLines(parsed.lines ?? []);
        setWishlist(parsed.wishlist ?? []);
        setCoupon(parsed.coupon ?? null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ lines, wishlist, coupon }));
    } catch {
      /* ignore */
    }
  }, [lines, wishlist, coupon]);

  const addLine = useCallback((line: CartLine) => {
    setLines((prev) => {
      const i = prev.findIndex(
        (l) => l.slug === line.slug && l.flavor === line.flavor && l.size === line.size,
      );
      const existing = prev[i];
      if (existing) {
        const next = [...prev];
        next[i] = { ...existing, qty: existing.qty + line.qty };
        return next;
      }
      return [...prev, line];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((index: number, qty: number) => {
    setLines((prev) =>
      prev
        .map((l, i) => (i === index ? { ...l, qty: Math.max(0, qty) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeLine = useCallback(
    (index: number) => setLines((prev) => prev.filter((_, i) => i !== index)),
    [],
  );

  const clearCart = useCallback(() => {
    setLines([]);
    setCoupon(null);
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const key = code.trim().toUpperCase();
    if (!key) return { ok: false, message: "Enter a coupon code." };
    if (!COUPONS[key]) return { ok: false, message: "That code isn't valid." };
    setCoupon(key);
    return { ok: true, message: `${key} applied — ${COUPONS[key] * 100}% off.` };
  }, []);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0),
    [lines],
  );
  const discount = coupon ? Math.round(subtotal * (COUPONS[coupon] ?? 0)) : 0;
  const shipping = subtotal === 0 || subtotal - discount >= 1499 ? 0 : 79;
  const total = Math.max(0, subtotal - discount + shipping);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const value: StoreValue = {
    lines,
    wishlist,
    cartOpen,
    coupon,
    setCartOpen,
    addLine,
    setQty,
    removeLine,
    clearCart,
    toggleWishlist,
    applyCoupon,
    subtotal,
    discount,
    shipping,
    total,
    count,
    productOf: (slug) => products.find((p) => p.slug === slug),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
