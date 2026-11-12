import { describe, expect, it } from "vitest";
import { addToCart, cartCount, cartTotal, orderMessage, parseCart, setQty } from "@/lib/cart-logic";

describe("Carrinho", () => {
  it("soma quantidades do mesmo produto e cor", () => {
    let c = addToCart([], "vaso-organico", "oliva");
    c = addToCart(c, "vaso-organico", "oliva");
    c = addToCart(c, "vaso-organico", "areia");
    expect(c).toHaveLength(2);
    expect(cartCount(c)).toBe(3);
  });
  it("recusa cor não cadastrada ou falta de cor", () => {
    expect(addToCart([], "vaso-organico", "preto")).toEqual([]);
    expect(addToCart([], "vaso-organico", null)).toEqual([]);
  });
  it("remove o item com quantidade zero", () => {
    const c = addToCart([], "vaso-organico", "oliva");
    expect(setQty(c, "vaso-organico", "oliva", 0)).toEqual([]);
  });
  it("total fica a combinar quando falta preço", () => {
    expect(cartTotal(addToCart([], "vaso-organico", "oliva"))).toBeNull();
  });
  it("mensagem do pedido lista produto, quantidade e cor", () => {
    const c = addToCart(addToCart([], "vaso-organico", "oliva"), "vaso-organico", "oliva");
    expect(orderMessage(c)).toContain("2x Vaso Orgânico — cor Verde-oliva");
  });
  it("ignora carrinho salvo inválido", () => {
    expect(parseCart("{bad")).toEqual([]);
    expect(parseCart(JSON.stringify([{ slug: "nao-existe", color: null, qty: 1 }]))).toEqual([]);
  });
});
