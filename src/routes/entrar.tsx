import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/site/GoogleButton";
import { safeRedirect, useAuth } from "@/lib/auth";

type Mode = "entrar" | "criar" | "esqueci";
const AFTER_KEY = "oe-after-login";

export const Route = createFileRoute("/entrar")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined } =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — OE Studio" },
      { name: "description", content: "Acesse sua conta OE Studio para comprar, salvar endereços e acompanhar seus pedidos." },
      { property: "og:title", content: "Entrar ou criar conta — OE Studio" },
      { property: "og:description", content: "Sua conta OE Studio: compras, endereços e pedidos em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EntrarPage,
});

function EntrarPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("entrar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Já logado (inclusive voltando do Google): segue para onde o cliente queria ir.
  useEffect(() => {
    if (loading || !session) return;
    const stored = window.sessionStorage.getItem(AFTER_KEY);
    window.sessionStorage.removeItem(AFTER_KEY);
    navigate({ to: safeRedirect(redirect ?? stored), replace: true });
  }, [session, loading, redirect, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "entrar") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) setError(err.message.includes("Invalid") ? "E-mail ou senha incorretos." : "Não foi possível entrar. Confirme seu e-mail e tente de novo.");
      } else if (mode === "criar") {
        if (password.length < 8) {
          setError("A senha precisa ter pelo menos 8 caracteres.");
        } else {
          const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/entrar` },
          });
          if (err) setError("Não foi possível criar a conta. Verifique o e-mail ou tente outra senha.");
          else setNotice("Conta criada! Enviamos um link para o seu e-mail. Clique nele para confirmar e depois entre aqui.");
        }
      } else {
        await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir-senha` });
        setNotice("Se este e-mail tiver conta, você vai receber um link para criar uma nova senha.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError("");
    if (redirect) window.sessionStorage.setItem(AFTER_KEY, safeRedirect(redirect));
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/entrar` });
    if (result.error) setError("Não foi possível entrar com o Google. Tente novamente.");
  }

  const titles: Record<Mode, string> = { entrar: "Entrar na sua conta", criar: "Criar sua conta", esqueci: "Recuperar senha" };

  return (
    <section className="container-oe flex justify-center py-16 md:py-24">
      <div className="card-oe w-full max-w-md p-8 md:p-10">
        <p className="eyebrow">Minha conta</p>
        <h1 className="mt-3 text-3xl">{titles[mode]}</h1>
        {redirect?.includes("finalizar-compra") && mode !== "esqueci" && (
          <p className="mt-3 text-sm text-muted-foreground">Entre ou crie sua conta para concluir a compra. Seu carrinho continua salvo.</p>
        )}

        {mode !== "esqueci" && (
          <>
            <div className="mt-8"><GoogleButton onClick={google} /></div>
            <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />ou com e-mail<span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={submit} className={`space-y-4 ${mode === "esqueci" ? "mt-8" : ""}`}>
          {mode === "criar" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
          </div>
          {mode !== "esqueci" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                {mode === "entrar" && (
                  <Button type="button" variant="link" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => setMode("esqueci")}>Esqueci minha senha</Button>
                )}
              </div>
              <Input id="password" type="password" required autoComplete={mode === "criar" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
            </div>
          )}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {notice && <p role="status" className="rounded-lg bg-secondary p-3 text-sm">{notice}</p>}
          <Button type="submit" disabled={busy} className="btn-oe h-auto w-full">
            {busy ? "Aguarde…" : mode === "entrar" ? "Entrar" : mode === "criar" ? "Criar conta" : "Enviar link"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {mode === "entrar" ? "Ainda não tem conta? " : "Já tem conta? "}
          <Button type="button" variant="link" className="h-auto p-0 text-primary" onClick={() => { setMode(mode === "entrar" ? "criar" : "entrar"); setError(""); setNotice(""); }}>
            {mode === "entrar" ? "Criar conta" : "Entrar"}
          </Button>
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ao continuar, você concorda em receber informações sobre seus pedidos. <Link to="/contato" className="underline">Dúvidas?</Link>
        </p>
      </div>
    </section>
  );
}
