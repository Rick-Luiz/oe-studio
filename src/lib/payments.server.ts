// Só roda no servidor. Consulta o pagamento direto no Mercado Pago e atualiza o pedido.
const STATUS: Record<string, string> = {
  approved: "pago",
  pending: "em_analise",
  in_process: "em_analise",
  authorized: "em_analise",
  in_mediation: "em_analise",
  rejected: "recusado",
  cancelled: "cancelado",
  refunded: "reembolsado",
  charged_back: "reembolsado",
};

export async function syncPayment(paymentId: string) {
  const token = process.env["MERCADOPAGO_ACCESS_TOKEN"];
  if (!token || !/^\d{1,30}$/.test(paymentId)) return null;
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const p = (await res.json()) as { id: number; status?: string; external_reference?: string; transaction_amount?: number };
  const orderId = p.external_reference;
  if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) return null;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order } = await supabaseAdmin.from("orders").select("id, total, user_id").eq("id", orderId).maybeSingle();
  if (!order) return null;

  let status = STATUS[p.status ?? ""] ?? "em_analise";
  // Nunca marca como pago se o valor recebido não bate com o total do pedido.
  if (status === "pago" && Math.abs(Number(order.total) - Number(p.transaction_amount)) > 0.01) status = "em_analise";

  await supabaseAdmin
    .from("orders")
    .update({ status, mp_payment_id: String(p.id), updated_at: new Date().toISOString() })
    .eq("id", orderId);
  return { orderId, userId: order.user_id, status };
}
