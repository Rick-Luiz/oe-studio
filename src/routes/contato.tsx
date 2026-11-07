import { createFileRoute } from "@tanstack/react-router";
import { brand, whatsappLink } from "@/config/brand";
import { ChannelsSection } from "@/components/site/ChannelsSection";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — OE Studio" },
      { name: "description", content: "Fale com a OE Studio sobre produtos e peças personalizadas em impressão 3D." },
      { property: "og:title", content: "Contato — OE Studio" },
      { property: "og:description", content: "Converse com a OE Studio sobre produtos e personalizados." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const wa = whatsappLink();
  return (
    <>
      <section className="container-oe pt-16">
        <p className="eyebrow">Contato</p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-[1.05] md:text-7xl">Vamos conversar.</h1>
        <p className="mt-8 max-w-xl text-muted-foreground">
          Dúvidas sobre um produto ou uma ideia de peça personalizada? Fale com a gente — avaliamos cada pedido conforme a viabilidade de fabricação.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {wa && <a href={wa} target="_blank" rel="noreferrer" className="btn-oe">Conversar no WhatsApp</a>}
          {brand.email && <a href={`mailto:${brand.email}`} className="btn-oe-outline">{brand.email}</a>}
          {!wa && !brand.email && (
            <p className="text-sm text-muted-foreground">Canais de contato em breve.</p>
          )}
        </div>
      </section>
      <ChannelsSection />
    </>
  );
}
