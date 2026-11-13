import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { addToCart, paymentLines, type CartItem } from "@/lib/cart-logic";
import type { ColorKey } from "@/data/products";

const input = z.object({
  items: z
    .array(z.object({ slug: z.string().max(120), color: z.string().max(40).nullable(), qty: z.number().int().min(1).max(20) }))
    .min(1)
    .max(50),
});

export type PaymentResult = { ok: true; url: string } | { ok: false; error: "not_configured" | "no_price" | "provider" };

/** Cria o pagamento no Mercado Pago (Pix, cartão, boleto) e devolve o link do checkout. */
export const createPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }): Promise<PaymentResult> => {
    const token = process.env["MERCADOPAGO_ACCESS_TOKEN"];
    if (!token) return { ok: false, error: "not_configured" };

    // Revalida tudo pelo catálogo: produto, cor e preço nunca vêm do navegador.
    const items = data.items.reduce<CartItem[]>((acc, i) => addToCart(acc, i.slug, i.color as ColorKey | null, i.qty), []);
    const lines = paymentLines(items);
    if (!lines) return { ok: false, error: "no_price" };

    const origin = new URL(getRequest().url).origin;
    const back = (s: string) => `${origin}/pedido?status=${s}`;
    try {
      const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          back_urls: { success: back("aprovado"), pending: back("pendente"), failure: back("recusado") },
          ...(origin.startsWith("https://") ? { auto_return: "approved" } : {}),
          statement_descriptor: "OE STUDIO",
          payment_methods: { installments: 12 },
        }),
      });
      if (!res.ok) {
        console.error("Mercado Pago:", res.status, await res.text());
        return { ok: false, error: "provider" };
      }
      const pref = (await res.json()) as { init_point?: string };
      if (!pref.init_point) return { ok: false, error: "provider" };
      return { ok: true, url: pref.init_point };
    } catch (e) {
      console.error("Mercado Pago:", e);
      return { ok: false, error: "provider" };
    }
  });
