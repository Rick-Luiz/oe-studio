import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { categoryName, displayPrice, productColors, type Product } from "@/data/products";
import { ColorDots } from "@/components/site/ProductColors";
import { ExampleBadge } from "@/components/site/ExampleBadge";

export function ProductCard({ product }: { product: Product }) {
  const price = displayPrice(product);
  return (
    <Link to="/produto/$slug" params={{ slug: product.slug }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={1008}
          height={1264}
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
        {product.example && <ExampleBadge className="absolute left-3 top-3" />}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{categoryName(product.category)}</p>
          <h3 className="mt-2 text-2xl">{product.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {price && <p className="text-sm">{price}</p>}
            <ColorDots colors={productColors(product)} />
          </div>
        </div>
        <ArrowUpRight className="mt-6 h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <span className="mt-4 inline-block text-sm link-underline">Ver produto</span>
    </Link>
  );
}
