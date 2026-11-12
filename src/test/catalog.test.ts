import { describe, expect, it } from "vitest";
import {
  buyLinks,
  categories,
  colors,
  displayPrice,
  matchesSearch,
  productColors,
  productSpecs,
  products,
  type Product,
} from "@/data/products";

const base: Product = {
  slug: "teste",
  name: "Peça Teste",
  shortDescription: "Curta",
  description: "Longa",
  category: "decoracao",
  material: "PETG",
  dimensions: "10 × 10 × 10 cm",
  colors: ["areia"],
  images: ["/x.jpg"],
};

describe("Preço", () => {
  it("fica oculto quando não está definido", () => {
    expect(displayPrice(base)).toBeNull();
    expect(displayPrice({ price: 0 })).toBeNull();
  });
  it("aparece em reais quando definido", () => {
    expect(displayPrice({ price: 49.9 })).toMatch(/R\$\s?49,90/);
  });
});

describe("Botões de compra", () => {
  it("não aparecem sem links cadastrados", () => {
    expect(buyLinks({ shopeeUrl: "" })).toEqual([]);
  });
  it("mostram apenas o marketplace cadastrado, apontando para o anúncio do produto", () => {
    const links = buyLinks({ tiktokUrl: "https://shop.tiktok.com/view/product/123" });
    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({ channel: "tiktok", href: "https://shop.tiktok.com/view/product/123" });
  });
  it("ignoram links inválidos", () => {
    expect(buyLinks({ shopeeUrl: "em breve" })).toEqual([]);
  });
});

describe("Cores", () => {
  it("só exibe cores cadastradas, sem repetir", () => {
    const list = productColors({ colors: ["areia", "areia", "inexistente" as never] });
    expect(list.map((c) => c.key)).toEqual(["areia"]);
  });
  it("todos os produtos usam apenas cores cadastradas", () => {
    for (const p of products) for (const c of p.colors) expect(colors).toHaveProperty(c);
  });
});

describe("Catálogo", () => {
  it("cada produto tem endereço único e categoria existente", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const cats = categories.map((c) => c.slug) as string[];
    for (const p of products) expect(cats).toContain(p.category);
  });
  it("ficha técnica omite o peso quando não informado", () => {
    expect(productSpecs(base).map((s) => s.label)).toEqual(["Material", "Dimensões"]);
    expect(productSpecs({ ...base, weight: "80 g" }).map((s) => s.label)).toContain("Peso aproximado");
  });
  it("busca encontra por cor e material, ignorando acentos", () => {
    expect(matchesSearch(base, "areia")).toBe(true);
    expect(matchesSearch(base, "petg")).toBe(true);
    expect(matchesSearch(base, "decoracao")).toBe(true);
    expect(matchesSearch(base, "grafite")).toBe(false);
  });
});
