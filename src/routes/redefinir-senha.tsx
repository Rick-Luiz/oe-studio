import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Criar nova senha — OE Studio" },
      { name: "description", content: "Crie uma nova senha para sua conta OE Studio." },
      { property: "og:title", content: "Criar nova senha — OE Studio" },
      { property: "og:description", content: "Recupere o acesso à sua conta OE Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedefinirSenha,
});

function RedefinirSenha() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: d }) => {
      if (d.session && isRecovery) setReady(true);
    });
    if (isRecovery) setReady(true);
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError("Não foi possível salvar a nova senha. Peça um novo link e tente de novo.");
    navigate({ to: "/minha-conta" });
  }

  return (
    <section className="container-oe flex justify-center py-16 md:py-24">
      <div className="card-oe w-full max-w-md p-8 md:p-10">
        <p className="eyebrow">Minha conta</p>
        <h1 className="mt-3 text-3xl">Criar nova senha</h1>
        {!ready ? (
          <p className="mt-6 text-sm text-muted-foreground">Abra esta página pelo link que enviamos para o seu e-mail.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input id="new-password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="btn-oe h-auto w-full">{busy ? "Salvando…" : "Salvar nova senha"}</Button>
          </form>
        )}
      </div>
    </section>
  );
}
