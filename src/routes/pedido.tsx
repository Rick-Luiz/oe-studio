import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/config/brand";

type Status = "aprovado" | "pendente" | "recusado";
const STATUSES: Status[] = ["aprovado", "pendente", "recusado"];

export const Route = createFileRoute("/pedido")({
  validateSearch: (s: Record<string, unknown>): { status?: Status; payment_id?: string } => ({
    status: STATUSES.includes(s["status"] as Status) ? (s["status"] as Status) : undefined,
    payment_id: typeof s["payment_id"] === "string" || typeof s["payment_id"] === "number" ? String(s["payment_id"]).slice(0, 40) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Seu pedido — OE Studio" },
      { name: "description", content: "Acompanhe o status do pagamento do seu pedido na OE Studio." },
      { property: "og:title", content: "Seu pedido — OE Studio" },
      { property: "og:description", content: "Status do pagamento do seu pedido na OE Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PedidoPage,
});

const COPY: Record<Status, { title: string; text: string }> = {
  aprovado: { title: "Pagamento aprovado!", text: "Obrigado pela compra. Envie seus dados de entrega pelo WhatsApp para combinarmos o frete e o prazo." },
  pendente: { title: "Pagamento em análise", text: "Assim que o pagamento for confirmado, começamos a produzir sua peça. Se pagou com Pix ou boleto, isso pode levar alguns minutos." },
  recusado: { title: "Pagamento não concluído", text: "Nenhum valor foi cobrado. Você pode tentar novamente pelo carrinho ou finalizar o pedido pelo WhatsApp." },
};

function PedidoPage() {
  const { status = "pendente", payment_id } = Route.useSearch();
  const { clear } = useCart();
  useEffect(() => {
    if (status === "aprovado") clear();
  }, [status, clear]);
  const copy = COPY[status];
  const wa = whatsappLink(
    `Olá, OE Studio! Fiz um pedido pelo site${payment_id ? ` (pagamento nº ${payment_id})` : ""}. Seguem meus dados de entrega:`,
  );

  return (
    <section className="container-oe flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">Seu pedido</p>
      <h1 className="mt-4 text-4xl lg:text-5xl">{copy.title}</h1>
      <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{copy.text}</p>
      {payment_id && <p className="mt-4 text-sm text-muted-foreground">Nº do pagamento: {payment_id}</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        {wa && status !== "recusado" && (
          <a href={wa} target="_blank" rel="noreferrer" className="btn-oe">Enviar dados de entrega</a>
        )}
        <Link to="/produtos" search={{}} className="btn-oe-outline">Continuar comprando</Link>
      </div>
    </section>
  );
}
