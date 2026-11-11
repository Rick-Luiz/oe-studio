import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { categoryName, formatPrice, getProduct, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { whatsappLink } from "@/config/brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — OE Studio` },
          { name: "description", content: loaderData.product.shortDescription },
          { property: "og:title", content: `${loaderData.product.name} — OE Studio` },
          { property: "og:description", content: loaderData.product.shortDescription },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Produto não encontrado — OE Studio" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const wa = whatsappLink(`Olá, OE Studio! Tenho interesse no produto ${product.name}.`);

  return (
    <>
      <section className="container-oe pt-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/produtos" search={{}} className="hover:text-foreground">Produtos</Link>
          {" / "}
          <Link to="/produtos" search={{ categoria: product.category }} className="hover:text-foreground">
            {categoryName(product.category)}
          </Link>
        </nav>
        <div className="mt-8 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-muted">
              <img src={product.images[active]} alt={product.name} width={1008} height={1264} className="h-full w-full object-cover animate-fade-up" key={active} />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <Button variant="ghost" key={img} aria-label={`Ver foto ${i + 1} de ${product.name}`} aria-pressed={i === active} onClick={() => setActive(i)} className={`h-20 w-16 overflow-hidden rounded-sm border p-0 ${i === active ? "border-foreground" : "border-transparent opacity-60"}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-5 md:pt-6">
            <p className="eyebrow">{categoryName(product.category)}</p>
            <h1 className="mt-4 break-words text-4xl leading-tight lg:text-5xl">{product.name}</h1>
            {product.price != null && <p className="mt-5 text-xl">{formatPrice(product.price)}</p>}
            <p className="mt-8 leading-relaxed text-muted-foreground">{product.description}</p>

            {product.details.length > 0 && (
              <dl className="mt-10 border-t border-border">
                {product.details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-6 border-b border-border py-4 text-sm">
                    <dt className="text-muted-foreground">{d.label}</dt>
                    <dd className="text-right">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10 flex flex-col gap-3">
              {product.shopeeUrl && (
                <a href={product.shopeeUrl} target="_blank" rel="noreferrer" className="btn-oe">Comprar na Shopee</a>
              )}
              {product.tiktokUrl && (
                <a href={product.tiktokUrl} target="_blank" rel="noreferrer" className="btn-oe-outline">Comprar na TikTok Shop</a>
              )}
              {!product.shopeeUrl && !product.tiktokUrl && (
                <>
                  <p className="text-sm text-muted-foreground">Em breve nos marketplaces.</p>
                  {wa && <a href={wa} target="_blank" rel="noreferrer" className="btn-oe-outline">Perguntar no WhatsApp</a>}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-oe mt-32">
          <h2 className="text-4xl">Você também pode gostar</h2>
          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
