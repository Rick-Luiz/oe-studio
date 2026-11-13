import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { addToCart, cartCount, cartTotal, orderMessage, parseCart, paymentLines, setQty } from "@/lib/cart-logic";

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
    products.push({ ...products[0]!, slug: "sem-preco", price: undefined, colors: ["oliva"] });
    try { expect(cartTotal(addToCart([], "sem-preco", "oliva"))).toBeNull(); } finally { products.pop(); }
  });
  it("mensagem do pedido lista produto, quantidade e cor", () => {
    const c = addToCart(addToCart([], "vaso-organico", "oliva"), "vaso-organico", "oliva");
    expect(orderMessage(c)).toContain("2x Vaso Orgânico — cor Verde-oliva");
  });
  it("ignora carrinho salvo inválido", () => {
    expect(parseCart("{bad")).toEqual([]);
    expect(parseCart(JSON.stringify([{ slug: "nao-existe", color: null, qty: 1 }]))).toEqual([]);
  });
  it("pagamento online bloqueado quando falta preço ou o carrinho está vazio", () => {
    expect(paymentLines([])).toBeNull();
    products.push({ ...products[0]!, slug: "sem-preco", price: undefined, colors: ["oliva"] });
    try { expect(paymentLines(addToCart([], "sem-preco", "oliva"))).toBeNull(); } finally { products.pop(); }
  });
  it("pagamento online usa o preço do catálogo e a cor escolhida", () => {
    products.push({ ...products[0]!, slug: "teste-pago", name: "Peça Paga", price: 50, colors: ["oliva"] });
    try {
      const lines = paymentLines(addToCart([], "teste-pago", "oliva", 2));
      expect(lines).toEqual([{ id: "teste-pago-oliva", title: "Peça Paga — Verde-oliva", quantity: 2, unit_price: 50, currency_id: "BRL" }]);
    } finally {
      products.pop();
    }
  });
});
