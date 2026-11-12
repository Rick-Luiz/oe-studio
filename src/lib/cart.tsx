import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ColorKey } from "@/data/products";
import { addToCart, cartCount, parseCart, setQty, type CartItem } from "@/lib/cart-logic";

const KEY = "oe-cart";

type CartCtx = {
  items: CartItem[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, color: ColorKey | null) => void;
  update: (slug: string, color: ColorKey | null, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(parseCart(window.localStorage.getItem(KEY)));
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) window.localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = useCallback((slug: string, color: ColorKey | null) => {
    setItems((cur) => addToCart(cur, slug, color));
    setOpen(true);
  }, []);
  const update = useCallback((slug: string, color: ColorKey | null, qty: number) => {
    setItems((cur) => setQty(cur, slug, color, qty));
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: cartCount(items), open, setOpen, add, update, clear }),
    [items, open, add, update, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
