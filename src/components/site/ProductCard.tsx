import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { categoryName, formatPrice, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to="/produto/$slug" params={{ slug: product.slug }} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-sm bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={1008}
          height={1264}
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{categoryName(product.category)}</p>
          <h3 className="mt-2 text-2xl">{product.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          {product.price != null && <p className="mt-3 text-sm">{formatPrice(product.price)}</p>}
        </div>
        <ArrowUpRight className="mt-6 h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <span className="mt-4 inline-block text-sm link-underline">Ver produto</span>
    </Link>
  );
}
