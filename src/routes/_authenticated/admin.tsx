import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, Search, ShieldAlert, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ServiceAdminCard } from "@/components/admin/ServiceAdminCard";
import { ServicePhotoField } from "@/components/admin/ServicePhotoField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { createService, fetchServices, servicesQueryKey } from "@/lib/services";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel do Administrador — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Gerencie fotos, descrições, preços e visibilidade dos serviços exibidos no site.",
      },
      { property: "og:title", content: "Painel do Administrador — Carleane Pantoja" },
      {
        property: "og:description",
        content: "Gerencie os serviços e preços do site.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const emptyForm = { name: "", detail: "", price: "", image_url: "" };

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setIsAdmin(Boolean(role));
    });
    return () => {
      active = false;
    };
  }, []);

  const { data: services = [], isLoading } = useQuery({
    queryKey: servicesQueryKey,
    queryFn: fetchServices,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = term
      ? services.filter(
          (s) =>
            s.name.toLowerCase().includes(term) ||
            (s.detail ?? "").toLowerCase().includes(term),
        )
      : services;
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [services, search]);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: servicesQueryKey });
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const name = form.name.trim();
    const price = Number(form.price.replace(",", "."));
    if (!name) return toast.error("Informe o nome do serviço.");
    if (!Number.isFinite(price) || price < 0)
      return toast.error("Informe um preço válido.");
    setSaving(true);
    try {
      await createService({
        name: name.slice(0, 120),
        detail: form.detail.trim().slice(0, 1500) || null,
        price,
        image_url: form.image_url.trim() || null,
        is_visible: true,
      });
      setForm(emptyForm);
      setShowNew(false);
      await refresh();
      toast.success("Serviço adicionado!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (isAdmin === false) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center md:px-6">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-serif text-3xl text-foreground">
          Acesso não autorizado
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sua conta não tem permissão de administradora para gerenciar os
          serviços.
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-input px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> Sair do painel
        </button>
      </section>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar onSignOut={handleSignOut} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/85 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-8">
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-primary">
                Área restrita
              </p>
              <h1 className="truncate font-serif text-2xl text-foreground md:text-3xl">
                Painel do Administrador — Carleane Pantoja (Massoterapeuta)
              </h1>
            </div>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="admin-search" className="sr-only">
                Filtrar serviços
              </label>
              <input
                id="admin-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar serviços…"
                className="w-52 rounded-full border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </div>
            <button
              onClick={() => setShowNew((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {showNew ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {showNew ? "Fechar" : "Adicionar novo serviço"}
            </button>
          </div>
        </header>

        <main className="px-4 py-8 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filtered.length} serviço(s) — organizados por ordem alfabética.
            </p>
            <Link
              to="/servicos"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Ver tabela pública
            </Link>
          </div>

          {showNew && (
            <form
              onSubmit={handleCreate}
              className="mt-6 grid gap-4 rounded-3xl border border-primary/30 bg-card p-6"
            >
              <h2 className="font-serif text-2xl text-foreground">
                Novo serviço
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="new-name" className="mb-1.5 block text-sm text-foreground">
                    Nome do serviço *
                  </label>
                  <input
                    id="new-name"
                    value={form.name}
                    maxLength={120}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
                  />
                </div>
                <div>
                  <label htmlFor="new-price" className="mb-1.5 block text-sm text-foreground">
                    Preço (R$) *
                  </label>
                  <input
                    id="new-price"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
                  />
                </div>
              </div>
              <ServicePhotoField
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
              />
              <RichTextEditor
                id="new-detail"
                label="Descrição para “Saiba mais” (texto do modal)"
                value={form.detail}
                onChange={(detail) => setForm({ ...form, detail })}
                placeholder="Toque suave e ritmado com óleos aromáticos para relaxamento profundo…"
              />
              <button
                type="submit"
                disabled={saving}
                className="justify-self-start rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? "Salvando…" : "Adicionar serviço"}
              </button>
            </form>
          )}

          {isLoading && (
            <p className="py-16 text-center text-muted-foreground">Carregando…</p>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              Nenhum serviço encontrado.
            </p>
          )}

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((service) => (
              <ServiceAdminCard
                key={service.id}
                service={service}
                onSaved={refresh}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
