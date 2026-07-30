import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Área Administrativa — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Acesso restrito ao painel administrativo da tabela de preços de Carleane Pantoja Massoterapeuta.",
      },
      { property: "og:title", content: "Área Administrativa — Carleane Pantoja" },
      {
        property: "og:description",
        content: "Acesso restrito ao painel administrativo.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres").max(72),
});

const emailSchema = z
  .string()
  .trim()
  .email("Informe um e-mail válido")
  .max(255);

type Mode = "login" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const parsed = emailSchema.safeParse(email);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(
          parsed.data,
          { redirectTo: `${window.location.origin}/reset-password` },
        );
        if (error) throw error;
        toast.success("Link de redefinição enviado para o seu e-mail.");
        setMode("login");
        return;
      }

      const parsed = credentialsSchema.safeParse({ email, password });
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail se for solicitado.");
        navigate({ to: "/admin", replace: true });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) throw error;
      toast.success("Bem-vinda de volta!");
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível continuar.";
      toast.error(
        message === "Invalid login credentials"
          ? "Usuário ou senha incorretos."
          : message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 md:px-6">
      <Link
        to="/servicos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar à tabela de
        preços
      </Link>

      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-serif text-3xl text-foreground">
          {mode === "forgot" ? "Redefinir senha" : "Área administrativa"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {mode === "forgot"
            ? "Informe o seu e-mail cadastrado para receber o link de redefinição de senha."
            : mode === "signup"
              ? "Crie a conta de administradora do site."
              : "Entre com o seu e-mail e senha para gerenciar a tabela de preços."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-foreground"
            >
              E-mail
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm text-foreground"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                required
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading
              ? "Aguarde…"
              : mode === "forgot"
                ? "Enviar link"
                : mode === "signup"
                  ? "Criar conta"
                  : "Entrar"}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-2 text-center text-sm">
          {mode === "login" && (
            <>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Primeiro acesso? Criar conta de administradora
              </button>
            </>
          )}
          {mode !== "login" && (
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
