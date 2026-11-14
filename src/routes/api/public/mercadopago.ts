import { createFileRoute } from "@tanstack/react-router";

// Aviso automático do Mercado Pago. Não confiamos no conteúdo do aviso:
// o status é sempre consultado de novo no próprio Mercado Pago antes de atualizar o pedido.
export const Route = createFileRoute("/api/public/mercadopago")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        let type = url.searchParams.get("type") ?? url.searchParams.get("topic");
        let id = url.searchParams.get("data.id") ?? url.searchParams.get("id");
        try {
          const body = (await request.json()) as { type?: string; data?: { id?: string | number } };
          type = body.type ?? type;
          id = body.data?.id != null ? String(body.data.id) : id;
        } catch {
          // aviso sem corpo: usa a URL
        }
        if (type === "payment" && id) {
          const { syncPayment } = await import("@/lib/payments.server");
          await syncPayment(id);
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
