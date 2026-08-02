import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  LogOut,
  Phone,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  appointmentsQueryKey,
  deleteAppointment,
  fetchAppointments,
  formatDateTime,
  statusLabels,
  updateAppointmentStatus,
  type AppointmentStatus,
} from "@/lib/appointments";

export const Route = createFileRoute("/_authenticated/agendamentos")({
  head: () => ({
    meta: [
      { title: "Agendamentos — Painel Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Acompanhe, confirme e organize os pedidos de agendamento recebidos pelo site.",
      },
      { property: "og:title", content: "Agendamentos — Painel Carleane Pantoja" },
      {
        property: "og:description",
        content: "Acompanhe e confirme os pedidos de agendamento do site.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgendamentosPage,
});

const filters: Array<{ value: "all" | AppointmentStatus; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendentes" },
  { value: "confirmed", label: "Confirmados" },
  { value: "done", label: "Realizados" },
  { value: "cancelled", label: "Cancelados" },
];

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-primary/15 text-primary",
  confirmed: "bg-accent/25 text-accent-foreground",
  done: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/12 text-destructive",
};

function AgendamentosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | AppointmentStatus>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

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

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: appointmentsQueryKey,
    queryFn: fetchAppointments,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return appointments.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesTerm =
        !term ||
        item.client_name.toLowerCase().includes(term) ||
        item.client_phone.toLowerCase().includes(term) ||
        item.service_name.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [appointments, search, status]);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: appointmentsQueryKey });
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function changeStatus(id: string, next: AppointmentStatus) {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, next);
      await refresh();
      toast.success(`Agendamento marcado como ${statusLabels[next].toLowerCase()}.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível atualizar.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este agendamento?")) return;
    setBusyId(id);
    try {
      await deleteAppointment(id);
      await refresh();
      toast.success("Agendamento excluído.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível excluir.",
      );
    } finally {
      setBusyId(null);
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
          Sua conta não tem permissão de administradora para ver os agendamentos.
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

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

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
                Agendamentos
              </h1>
            </div>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="appointment-search" className="sr-only">
                Filtrar agendamentos
              </label>
              <input
                id="appointment-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome, telefone ou serviço…"
                className="w-60 rounded-full border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </div>
          </div>
        </header>

        <main className="px-4 py-8 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {pendingCount} pedido(s) pendente(s) de confirmação.
            </p>
            <Link
              to="/agendar"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Ver formulário público
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setStatus(item.value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  status === item.value
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-input text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <p className="py-16 text-center text-muted-foreground">Carregando…</p>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              Nenhum agendamento encontrado.
            </p>
          )}

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-serif text-xl text-foreground">
                      {item.client_name}
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      <a
                        href={`https://wa.me/55${item.client_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-4 hover:text-primary hover:underline"
                      >
                        {item.client_phone}
                      </a>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                  >
                    {statusLabels[item.status]}
                  </span>
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                  {formatDateTime(item.preferred_at)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tratamento: <span className="text-foreground">{item.service_name}</span>
                </p>
                {item.notes && (
                  <p className="mt-3 rounded-xl bg-muted/60 p-3 text-sm leading-relaxed text-muted-foreground">
                    {item.notes}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {(["confirmed", "done", "cancelled"] as AppointmentStatus[])
                    .filter((next) => next !== item.status)
                    .map((next) => (
                      <button
                        key={next}
                        disabled={busyId === item.id}
                        onClick={() => changeStatus(item.id, next)}
                        className="rounded-full border border-input px-4 py-1.5 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                      >
                        {statusLabels[next]}
                      </button>
                    ))}
                  <button
                    disabled={busyId === item.id}
                    onClick={() => remove(item.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
