import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";

type SearchParams = { categoria?: string | undefined };

export const Route = createFileRoute("/produtos")({
  validateSearch: (s: Record<string, unknown>): SearchParams => {
    const c = s["categoria"];
    return typeof c === "string" ? { categoria: c } : {};
  },
  head: () => ({
    meta: [
      { title: "Produtos — OE Studio" },
      { name: "description", content: "Catálogo de objetos em impressão 3D: decoração, organização, acessórios e personalizados." },
      { property: "og:title", content: "Produtos — OE Studio" },
      { property: "og:description", content: "Explore o catálogo completo da OE Studio." },
    ],
  }),
  component: Produtos,
});

function Produtos() {
  const { categoria } = Route.useSearch();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!categoria || p.category === categoria) &&
        (!term || `${p.name} ${p.shortDescription} ${p.description}`.toLowerCase().includes(term)),
    );
  }, [categoria, q]);

  const pill = (active: boolean) =>
    `rounded-full border px-5 py-2 text-sm transition-colors ${active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`;

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
