import { colors, displayPrice, formatPrice, getProduct, type ColorKey } from "@/data/products";

export type CartItem = { slug: string; color: ColorKey | null; qty: number };

export const MAX_QTY = 20;
const sameLine = (a: CartItem, slug: string, color: ColorKey | null) => a.slug === slug && a.color === color;

export function addToCart(items: CartItem[], slug: string, color: ColorKey | null, qty = 1): CartItem[] {
  const product = getProduct(slug);
  if (!product) return items;
  // Só aceita cores cadastradas para o produto.
  if (color && !product.colors.includes(color)) return items;
  if (!color && product.colors.length > 0) return items;
  const found = items.find((i) => sameLine(i, slug, color));
  if (found) return setQty(items, slug, color, found.qty + qty);
  return [...items, { slug, color, qty: Math.min(Math.max(1, qty), MAX_QTY) }];
}

export function setQty(items: CartItem[], slug: string, color: ColorKey | null, qty: number): CartItem[] {
  if (qty <= 0) return items.filter((i) => !sameLine(i, slug, color));
  return items.map((i) => (sameLine(i, slug, color) ? { ...i, qty: Math.min(qty, MAX_QTY) } : i));
}

export const cartCount = (items: CartItem[]) => items.reduce((s, i) => s + i.qty, 0);

/** Total em reais, ou null se algum item ainda não tiver preço definido. */
export function cartTotal(items: CartItem[]): number | null {
  let total = 0;
  for (const i of items) {
    const p = getProduct(i.slug);
    if (!p || !displayPrice(p) || p.price == null) return null;
    total += p.price * i.qty;
  }
  return total;
}

/** Mensagem do pedido enviada pelo WhatsApp. */
export function orderMessage(items: CartItem[]): string {
  const lines = items.map((i) => {
    const p = getProduct(i.slug);
    const color = i.color ? ` — cor ${colors[i.color].name}` : "";
    const price = p && displayPrice(p) && p.price != null ? ` (${formatPrice(p.price * i.qty)})` : "";
    return `• ${i.qty}x ${p?.name ?? i.slug}${color}${price}`;
  });
  const total = cartTotal(items);
  return [
    "Olá, OE Studio! Quero fazer este pedido:",
    ...lines,
    total != null ? `Total: ${formatPrice(total)}` : "Pode me informar o valor total e o frete?",
  ].join("\n");
}

/** Lê o carrinho salvo, descartando itens inválidos ou de produtos removidos. */
export function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.reduce<CartItem[]>((acc, i) => {
      if (i && typeof i.slug === "string" && Number.isInteger(i.qty)) {
        return addToCart(acc, i.slug, i.color ?? null, i.qty);
      }
      return acc;
    }, []);
  } catch {
    return [];
  }
}

/** Item no formato do Mercado Pago (preço sempre vem do catálogo, nunca do navegador). */
export type PaymentLine = { id: string; title: string; quantity: number; unit_price: number; currency_id: "BRL" };

/** Itens para pagamento online, ou null se o carrinho estiver vazio ou algum item não tiver preço. */
export function paymentLines(items: CartItem[]): PaymentLine[] | null {
  if (items.length === 0 || cartTotal(items) == null) return null;
  return items.map((i) => {
    const p = getProduct(i.slug)!;
    return {
      id: i.color ? `${p.slug}-${i.color}` : p.slug,
      title: i.color ? `${p.name} — ${colors[i.color].name}` : p.name,
      quantity: i.qty,
      unit_price: p.price!,
      currency_id: "BRL",
    };
  });
}
