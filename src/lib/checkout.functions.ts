import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { addToCart, cartTotal, paymentLines, type CartItem } from "@/lib/cart-logic";
import { addressSchema, customerSchema } from "@/lib/address";
import type { ColorKey } from "@/data/products";
import type { Json } from "@/integrations/supabase/types";

const input = z.object({
  items: z
    .array(z.object({ slug: z.string().max(120), color: z.string().max(40).nullable(), qty: z.number().int().min(1).max(20) }))
    .min(1)
    .max(50),
  address: addressSchema,
  customer: customerSchema,
});

export type PaymentResult =
  | { ok: true; url: string; orderId: string }
  | { ok: false; error: "not_configured" | "no_price" | "provider" };

/** Cria o pedido do cliente logado e abre o pagamento no Mercado Pago (Pix, cartão, boleto). */
export const createCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data, context }): Promise<PaymentResult> => {
    const token = process.env["MERCADOPAGO_ACCESS_TOKEN"];
    if (!token) return { ok: false, error: "not_configured" };

    // Revalida tudo pelo catálogo: produto, cor e preço nunca vêm do navegador.
    const items = data.items.reduce<CartItem[]>((acc, i) => addToCart(acc, i.slug, i.color as ColorKey | null, i.qty), []);
    const lines = paymentLines(items);
    const total = cartTotal(items);
    if (!lines || total == null) return { ok: false, error: "no_price" };

    const email = typeof context.claims.email === "string" ? context.claims.email : "";
    await context.supabase
      .from("profiles")
      .update({ full_name: data.customer.fullName, phone: data.customer.phone, updated_at: new Date().toISOString() })
      .eq("id", context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: context.userId,
        items: lines as unknown as Json,
        total,
        shipping_address: data.address as unknown as Json,
        customer: { ...data.customer, email } as unknown as Json,
      })
      .select("id")
      .single();
    if (error || !order) {
      console.error("Pedido:", error);
      return { ok: false, error: "provider" };
    }

    const origin = new URL(getRequest().url).origin;
    const isHttps = origin.startsWith("https://");
    const back = (s: string) => `${origin}/pedido?resultado=${s}&pedido=${order.id}`;
    const [first, ...rest] = data.customer.fullName.split(" ");
    try {
      const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          external_reference: order.id,
          payer: {
            name: first,
            surname: rest.join(" "),
            email: email || undefined,
            phone: { area_code: data.customer.phone.slice(0, 2), number: data.customer.phone.slice(2) },
            address: { zip_code: data.address.cep, street_name: data.address.street, street_number: data.address.number },
          },
          back_urls: { success: back("aprovado"), pending: back("pendente"), failure: back("recusado") },
          ...(isHttps ? { auto_return: "approved", notification_url: `${origin}/api/public/mercadopago` } : {}),
          statement_descriptor: "OE STUDIO",
          payment_methods: { installments: 12 },
        }),
      });
      if (!res.ok) {
        console.error("Mercado Pago:", res.status, await res.text());
        return { ok: false, error: "provider" };
      }
      const pref = (await res.json()) as { id?: string; init_point?: string };
      if (!pref.init_point) return { ok: false, error: "provider" };
      await supabaseAdmin.from("orders").update({ mp_preference_id: pref.id ?? null }).eq("id", order.id);
      return { ok: true, url: pref.init_point, orderId: order.id };
    } catch (e) {
      console.error("Mercado Pago:", e);
      return { ok: false, error: "provider" };
    }
  });

/** Confirma o pagamento ao voltar do Mercado Pago (consulta o status direto no Mercado Pago). */
export const confirmPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ paymentId: z.string().regex(/^\d{1,30}$/) }).parse(d))
  .handler(async ({ data, context }) => {
    const { syncPayment } = await import("@/lib/payments.server");
    const r = await syncPayment(data.paymentId);
    if (!r || r.userId !== context.userId) return { ok: false as const };
    return { ok: true as const, status: r.status, orderId: r.orderId };
  });
