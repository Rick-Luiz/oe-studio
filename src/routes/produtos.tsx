import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, isCategory, matchesSearch, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";

type SearchParams = { categoria?: string | undefined };

export const Route = createFileRoute("/produtos")({
  validateSearch: (s: Record<string, unknown>): SearchParams => {
    const c = s["categoria"];
    return typeof c === "string" && isCategory(c) ? { categoria: c } : {};
  },
  head: () => ({
    meta: [
      { title: "Produtos — OE Studio" },
      { name: "description", content: "Catálogo de objetos em impressão 3D: decoração, organização, acessórios e personalizados." },
      { property: "og:title", content: "Produtos — OE Studio" },
      { property: "og:description", content: "Explore o catálogo completo da OE Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Produtos,
});

function Produtos() {
  const { categoria } = Route.useSearch();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return products.filter((p) => (!categoria || p.category === categoria) && matchesSearch(p, q));
  }, [categoria, q]);

  const pill = (active: boolean) =>
    `rounded-sm border px-4 py-2 font-mono text-xs uppercase transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary hover:text-primary"}`;

  return (
    <section className="container-oe pt-16">
      <p className="eyebrow">Catálogo</p>
      <h1 className="mt-4 text-5xl md:text-6xl">Produtos</h1>

      <div className="mt-12 flex flex-col gap-6 border-y border-border py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link to="/produtos" search={{}} className={pill(!categoria)}>Todos</Link>
          {categories.map((c) => (
            <Link key={c.slug} to="/produtos" search={{ categoria: c.slug }} className={pill(categoria === c.slug)}>
              {c.name}
            </Link>
          ))}
        </div>
        <label className="flex items-center gap-3 border-b border-foreground/40 pb-2 lg:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Buscar produtos</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produtos"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </section>
  );
}
