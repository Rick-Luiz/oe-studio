import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { colors, displayPrice, formatPrice, getProduct, imageForColor } from "@/data/products";
import { cartTotal, MAX_QTY, orderMessage } from "@/lib/cart-logic";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/config/brand";
import { createPayment } from "@/lib/checkout.functions";

const PAY_ERRORS = {
  not_configured: "O pagamento no site ainda está sendo ativado. Por enquanto, finalize pelo WhatsApp.",
  no_price: "Algum produto do carrinho ainda não tem preço. Finalize pelo WhatsApp.",
  provider: "Não foi possível abrir o pagamento agora. Tente de novo ou finalize pelo WhatsApp.",
} as const;

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <Button variant="ghost" size="icon" className="relative" aria-label={`Abrir carrinho (${count} itens)`} onClick={() => setOpen(true)}>
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] text-primary-foreground">
          {count}
        </span>
      )}
    </Button>
  );
}

export function CartDrawer() {
  const { items, count, open, setOpen, update, clear } = useCart();
  const total = cartTotal(items);
  const wa = items.length ? whatsappLink(orderMessage(items)) : "";
  const pay = useServerFn(createPayment);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  async function payOnline() {
    setPaying(true);
    setPayError("");
    try {
      const r = await pay({ data: { items } });
      if (r.ok) {
        window.location.href = r.url;
        return;
      }
      setPayError(PAY_ERRORS[r.error]);
    } catch {
      setPayError(PAY_ERRORS.provider);
    }
    setPaying(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl font-normal">Carrinho</SheetTitle>
          <SheetDescription>{count === 0 ? "Seu carrinho está vazio." : `${count} ${count === 1 ? "item" : "itens"}`}</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <Link to="/produtos" search={{}} className="btn-oe-outline" onClick={() => setOpen(false)}>Ver produtos</Link>
          </div>
        ) : (
          <>
            <ul className="-mx-6 flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((i) => {
                const p = getProduct(i.slug);
                if (!p) return null;
                const price = displayPrice(p);
                return (
                  <li key={`${i.slug}-${i.color}`} className="flex gap-4 py-5">
                    <img src={imageForColor(p, i.color)} alt={p.name} className="h-24 w-20 shrink-0 rounded-sm object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="font-display text-lg leading-tight">{p.name}</p>
                      {i.color && (
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="h-3 w-3 rounded-full border border-foreground/15" style={{ backgroundColor: colors[i.color].swatch }} />
                          {colors[i.color].name}
                        </p>
                      )}
                      {price && <p className="mt-1 text-sm">{price}</p>}
                      <div className="mt-auto flex items-center gap-1 pt-3">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" aria-label={`Diminuir ${p.name}`} onClick={() => update(i.slug, i.color, i.qty - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm" aria-label="Quantidade">{i.qty}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" aria-label={`Aumentar ${p.name}`} disabled={i.qty >= MAX_QTY} onClick={() => update(i.slug, i.color, i.qty + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" aria-label={`Remover ${p.name}`} onClick={() => update(i.slug, i.color, 0)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-4 border-t border-border pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg">{total != null ? formatPrice(total) : "A combinar"}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {total != null
                  ? "Pague aqui com Pix, cartão (até 12x) ou boleto pelo Mercado Pago. Frete e prazo são combinados pelo WhatsApp."
                  : "O pagamento no site fica disponível para produtos com preço. Pelo WhatsApp combinamos valor, frete e prazo."}
              </p>
              {total != null && (
                <Button className="btn-oe h-auto w-full" disabled={paying} onClick={payOnline}>
                  {paying ? "Abrindo pagamento…" : "Pagar agora · Pix ou cartão"}
                </Button>
              )}
              {payError && <p role="alert" className="text-xs text-destructive">{payError}</p>}
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className={`${total != null ? "btn-oe-outline" : "btn-oe"} w-full`}>Finalizar pedido no WhatsApp</a>
              )}
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={clear}>Esvaziar carrinho</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
