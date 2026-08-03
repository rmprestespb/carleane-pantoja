import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  clientsQueryKey,
  createClient,
  fetchClients,
  formatDate,
  type ClientStatus,
} from "@/lib/clients";

export const Route = createFileRoute("/_authenticated/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — Painel Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "CRM de pacientes com busca, filtros por situação e histórico de sessões.",
      },
      { property: "og:title", content: "Clientes — Painel Carleane Pantoja" },
      {
        property: "og:description",
        content: "CRM de pacientes, anamnese e pacotes de sessões.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientesPage,
});

const filters: Array<{ value: "all" | ClientStatus; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "inactive", label: "Inativos" },
];

function ClientesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ClientStatus>("all");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: clientsQueryKey,
    queryFn: fetchClients,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesStatus = status === "all" || client.status === status;
      const matchesTerm =
        !term ||
        client.full_name.toLowerCase().includes(term) ||
        client.phone.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [clients, search, status]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast.error("Informe nome e WhatsApp.");
      return;
    }
    setSaving(true);
    try {
      const id = await createClient({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        birth_date: null,
        notes: null,
      });
      await queryClient.invalidateQueries({ queryKey: clientsQueryKey });
      setForm({ full_name: "", phone: "", email: "" });
      setCreating(false);
      toast.success("Cliente cadastrada. Preencha a anamnese.");
      navigate({ to: "/clientes/$id", params: { id } });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
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
                Clientes
              </h1>
            </div>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="client-search" className="sr-only">
                Buscar clientes
              </label>
              <input
                id="client-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome ou telefone…"
                className="w-56 rounded-full border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </div>
            <button
              onClick={() => setCreating((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> Novo cliente
            </button>
          </div>
        </header>

        <main className="px-4 py-8 md:px-8">
          {creating && (
            <form
              onSubmit={handleCreate}
              className="mb-6 grid gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:grid-cols-3"
            >
              <div className="sm:col-span-3">
                <h2 className="font-serif text-lg text-foreground">
                  Cadastrar cliente
                </h2>
              </div>
              <Field
                label="Nome completo"
                value={form.full_name}
                onChange={(v) => setForm({ ...form, full_name: v })}
              />
              <Field
                label="WhatsApp"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="(46) 99999-0000"
              />
              <Field
                label="E-mail (opcional)"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? "Salvando…" : "Salvar e abrir ficha"}
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setStatus(item.value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  status === item.value
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p className="mt-8 text-sm text-muted-foreground">Carregando…</p>
          ) : filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border/70 p-10 text-center">
              <Users
                className="mx-auto h-6 w-6 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Nenhum cliente encontrado.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">WhatsApp</th>
                    <th className="hidden px-4 py-3 sm:table-cell">
                      Última visita
                    </th>
                    <th className="px-4 py-3">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr
                      key={client.id}
                      className="border-t border-border/60 transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to="/clientes/$id"
                          params={{ id: client.id }}
                          className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                          {client.full_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {client.phone}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {formatDate(client.last_visit_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            client.status === "active"
                              ? "bg-accent/25 text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {client.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
      />
    </label>
  );
}
