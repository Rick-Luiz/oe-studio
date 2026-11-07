import { Link } from "@tanstack/react-router";
import { brand, whatsappLink } from "@/config/brand";
import { categories } from "@/data/products";

export function SiteFooter() {
  const channels = [
    { label: "Shopee", href: brand.shopee },
    { label: "TikTok Shop", href: brand.tiktokShop },
    { label: "Instagram", href: brand.instagram },
    { label: "WhatsApp", href: whatsappLink() },
  ].filter((c) => c.href);

  return (
    <footer className="mt-32 bg-ink text-ink-foreground">
      <div className="container-oe grid gap-14 py-20 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-4xl">OE Studio</p>
          <p className="mt-4 max-w-sm text-sm opacity-70">
            Objetos autorais criados e fabricados por nós, camada por camada, com impressão 3D.
          </p>
        </div>
        <div>
          <p className="eyebrow opacity-80">Explorar</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/produtos" search={{}} className="opacity-80 hover:opacity-100">Todos os produtos</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/produtos" search={{ categoria: c.slug }} className="opacity-80 hover:opacity-100">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow opacity-80">Estúdio</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/sobre" className="opacity-80 hover:opacity-100">Sobre</Link></li>
            <li><Link to="/contato" className="opacity-80 hover:opacity-100">Contato</Link></li>
            {channels.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100">{c.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-oe border-t border-ink-foreground/15 py-6 text-xs opacity-60">
        © {new Date().getFullYear()} OE Studio. Fabricado no Brasil.
      </div>
    </footer>
  );
}
