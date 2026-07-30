import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Defina uma nova senha para acessar o painel administrativo do site.",
      },
      { property: "og:title", content: "Redefinir senha — Carleane Pantoja" },
      { property: "og:description", content: "Defina uma nova senha de acesso." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter ao menos 8 caracteres")
  .max(72);

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a senha.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 md:px-6">
      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-serif text-3xl text-foreground">
          Definir nova senha
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {ready
            ? "Escolha uma nova senha para a sua conta."
            : "Abra esta página pelo link enviado no seu e-mail para redefinir a senha."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-sm text-foreground"
            >
              Nova senha
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm text-foreground"
            >
              Confirmar senha
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              maxLength={72}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !ready}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </section>
  );
}
