import { brand } from "@/config/brand";

export function ChannelsSection() {
  const items = [
    { label: "Comprar pela Shopee", text: "Nossa vitrine oficial na Shopee.", href: brand.shopee },
    { label: "Conhecer nossa TikTok Shop", text: "Produtos e bastidores em vídeo.", href: brand.tiktokShop },
    { label: "Seguir no Instagram", text: "Novidades, processos e lançamentos.", href: brand.instagram },
  ];
  return (
    <section className="container-oe mt-32">
      <p className="eyebrow">Onde encontrar</p>
      <h2 className="mt-4 max-w-2xl text-4xl md:text-5xl">Acompanhe a OE Studio e compre nos nossos canais.</h2>
      <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
        {items.map((i) => {
          const inner = (
            <>
              <p className="font-display text-2xl">{i.label}</p>
              <p className="mt-3 text-sm text-muted-foreground">{i.text}</p>
              <p className="mt-10 text-xs eyebrow">{i.href ? "Acessar →" : "Em breve"}</p>
            </>
          );
          return i.href ? (
            <a key={i.label} href={i.href} target="_blank" rel="noreferrer" className="bg-card p-10 transition-colors hover:bg-secondary">
              {inner}
            </a>
          ) : (
            <div key={i.label} className="bg-card p-10">{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
