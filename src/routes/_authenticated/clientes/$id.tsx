import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Package as PackageIcon,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { fetchServices, formatPrice, servicesQueryKey } from "@/lib/services";
import {
  clientDetailQueryKey,
  clientsQueryKey,
  commonContraindications,
  commonOils,
  createPackage,
  createPayment,
  daysSince,
  deleteClient,
  deletePackage,
  fetchAnamnesis,
  fetchClient,
  fetchPackages,
  fetchPayments,
  fetchSessions,
  formatDate,
  paymentMethods,
  pressureLabels,
  registerSession,
  reminderMessage,
  returnMessage,
  saveAnamnesis,
  updateClient,
  whatsappLink,
  type Anamnesis,
} from "@/lib/clients";

export const Route = createFileRoute("/_authenticated/clientes/$id")({
  head: () => ({
    meta: [
      { title: "Ficha do cliente — Painel Carleane Pantoja" },
      {
        name: "description",
        content:
          "Anamnese digital, pacotes de sessões, pagamentos e histórico de atendimentos.",
      },
      { property: "og:title", content: "Ficha do cliente — Painel Carleane Pantoja" },
      {
        property: "og:description",
        content: "Anamnese, pacotes e histórico de atendimentos do paciente.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientDetailPage,
});

type Tab = "resumo" | "anamnese" | "pacotes" | "historico";

const tabs: Array<{ value: Tab; label: string }> = [
  { value: "resumo", label: "Resumo" },
  { value: "anamnese", label: "Anamnese" },
  { value: "pacotes", label: "Pacotes" },
  { value: "historico", label: "Histórico" },
];

const emptyAnamnesis = {
  pain_history: "",
  injuries: "",
  surgeries: "",
  allergies: "",
  medications: "",
  objectives: "",
  pressure_preference: "medium",
  contraindications: [] as string[],
  preferred_oils: [] as string[],
  avoid_areas: [] as string[],
};

function ClientDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("resumo");

  const { data: client, isLoading } = useQuery({
    queryKey: clientDetailQueryKey(id),
    queryFn: () => fetchClient(id),
  });
  const { data: anamnesis } = useQuery({
    queryKey: ["anamnesis", id],
    queryFn: () => fetchAnamnesis(id),
  });
  const { data: packages = [] } = useQuery({
    queryKey: ["packages", id],
    queryFn: () => fetchPackages(id),
  });
  const { data: payments = [] } = useQuery({
    queryKey: ["payments", id],
    queryFn: () => fetchPayments(id),
  });
  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", id],
    queryFn: () => fetchSessions(id),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function toggleStatus() {
    if (!client) return;
    await updateClient(id, {
      status: client.status === "active" ? "inactive" : "active",
    });
    await queryClient.invalidateQueries({ queryKey: clientDetailQueryKey(id) });
    await queryClient.invalidateQueries({ queryKey: clientsQueryKey });
  }

  async function handleDelete() {
    if (!window.confirm("Excluir este cliente e todo o histórico?")) return;
    await deleteClient(id);
    await queryClient.invalidateQueries({ queryKey: clientsQueryKey });
    toast.success("Cliente excluída.");
    navigate({ to: "/clientes" });
  }

  if (isLoading || !client) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar onSignOut={handleSignOut} />
        <p className="p-8 text-sm text-muted-foreground">Carregando ficha…</p>
      </div>
    );
  }

  const activePackage = packages.find(
    (p) => p.status === "active" && p.used_sessions < p.total_sessions,
  );
  const idleDays = daysSince(client.last_visit_at);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar onSignOut={handleSignOut} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-border/60 bg-background/85 px-4 py-4 backdrop-blur md:px-8">
          <Link
            to="/clientes"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Voltar para
            clientes
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-serif text-2xl text-foreground md:text-3xl">
                {client.full_name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {client.phone} · aniversário {formatDate(client.birth_date)} ·{" "}
                {sessions.length} sessão(ões)
              </p>
            </div>
            <button
              onClick={toggleStatus}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                client.status === "active"
                  ? "bg-accent/25 text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {client.status === "active" ? "Ativo" : "Inativo"}
            </button>
            <a
              href={whatsappLink(client.phone, reminderMessage(client.full_name))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Lembrete
            </a>
            <a
              href={whatsappLink(client.phone, returnMessage(client.full_name))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              Retorno 30 dias
            </a>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-2 text-xs text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Excluir
            </button>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item.value}
                onClick={() => setTab(item.value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  tab === item.value
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="px-4 py-8 md:px-8">
          {tab === "resumo" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Sessões realizadas" value={String(sessions.length)} />
              <StatCard
                label="Pacote ativo"
                value={
                  activePackage
                    ? `${activePackage.used_sessions}/${activePackage.total_sessions}`
                    : "Nenhum"
                }
                hint={activePackage?.service_name}
              />
              <StatCard
                label="Última visita"
                value={formatDate(client.last_visit_at)}
                hint={idleDays !== null ? `há ${idleDays} dia(s)` : undefined}
              />
              <StatCard
                label="Pressão preferida"
                value={
                  anamnesis?.pressure_preference
                    ? (pressureLabels[anamnesis.pressure_preference] ??
                      anamnesis.pressure_preference)
                    : "—"
                }
              />
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:col-span-2 xl:col-span-4">
                <p className="text-xs uppercase tracking-wider text-primary">
                  Alertas de contraindicação
                </p>
                {anamnesis && anamnesis.contraindications.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {anamnesis.contraindications.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-destructive/12 px-3 py-1 text-xs text-destructive"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Nenhuma contraindicação registrada.
                  </p>
                )}
                {anamnesis && anamnesis.avoid_areas.length > 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Evitar: {anamnesis.avoid_areas.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "anamnese" && (
            <AnamnesisForm clientId={id} current={anamnesis ?? null} />
          )}

          {tab === "pacotes" && (
            <PackagesTab
              clientId={id}
              packages={packages}
              payments={payments}
            />
          )}

          {tab === "historico" && (
            <div className="space-y-3">
              <SessionForm clientId={id} packages={packages} />
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum atendimento registrado ainda.
                </p>
              ) : (
                sessions.map((session) => (
                  <article
                    key={session.id}
                    className="rounded-2xl border border-border/70 bg-card p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <CheckCircle2
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-foreground">
                        {session.service_name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(session.performed_at)}
                      </span>
                      {session.pressure_used && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          pressão{" "}
                          {pressureLabels[session.pressure_used] ??
                            session.pressure_used}
                        </span>
                      )}
                    </div>
                    {session.session_notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {session.session_notes}
                      </p>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AnamnesisForm({
  clientId,
  current,
}: {
  clientId: string;
  current: Anamnesis | null;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyAnamnesis);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!current) return;
    setForm({
      pain_history: current.pain_history ?? "",
      injuries: current.injuries ?? "",
      surgeries: current.surgeries ?? "",
      allergies: current.allergies ?? "",
      medications: current.medications ?? "",
      objectives: current.objectives ?? "",
      pressure_preference: current.pressure_preference ?? "medium",
      contraindications: current.contraindications ?? [],
      preferred_oils: current.preferred_oils ?? [],
      avoid_areas: current.avoid_areas ?? [],
    });
  }, [current]);

  function toggleChip(field: "contraindications" | "preferred_oils", value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await saveAnamnesis({
        client_id: clientId,
        pain_history: form.pain_history || null,
        injuries: form.injuries || null,
        surgeries: form.surgeries || null,
        allergies: form.allergies || null,
        medications: form.medications || null,
        objectives: form.objectives || null,
        pressure_preference: form.pressure_preference,
        contraindications: form.contraindications,
        preferred_oils: form.preferred_oils,
        avoid_areas: form.avoid_areas,
        signed_at: new Date().toISOString(),
      });
      await queryClient.invalidateQueries({ queryKey: ["anamnesis", clientId] });
      toast.success("Anamnese salva.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="grid gap-4 lg:grid-cols-2">
      <TextArea
        label="Histórico de dores"
        value={form.pain_history}
        onChange={(v) => setForm({ ...form, pain_history: v })}
      />
      <TextArea
        label="Lesões"
        value={form.injuries}
        onChange={(v) => setForm({ ...form, injuries: v })}
      />
      <TextArea
        label="Cirurgias"
        value={form.surgeries}
        onChange={(v) => setForm({ ...form, surgeries: v })}
      />
      <TextArea
        label="Alergias"
        value={form.allergies}
        onChange={(v) => setForm({ ...form, allergies: v })}
      />
      <TextArea
        label="Medicamentos em uso"
        value={form.medications}
        onChange={(v) => setForm({ ...form, medications: v })}
      />
      <TextArea
        label="Objetivos do tratamento"
        value={form.objectives}
        onChange={(v) => setForm({ ...form, objectives: v })}
      />

      <fieldset className="rounded-2xl border border-border/70 bg-card p-5">
        <legend className="px-1 text-xs uppercase tracking-wider text-muted-foreground">
          Contraindicações
        </legend>
        <div className="flex flex-wrap gap-2">
          {commonContraindications.map((item) => (
            <Chip
              key={item}
              label={item}
              active={form.contraindications.includes(item)}
              onClick={() => toggleChip("contraindications", item)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-border/70 bg-card p-5">
        <legend className="px-1 text-xs uppercase tracking-wider text-muted-foreground">
          Óleos preferidos
        </legend>
        <div className="flex flex-wrap gap-2">
          {commonOils.map((item) => (
            <Chip
              key={item}
              label={item}
              active={form.preferred_oils.includes(item)}
              onClick={() => toggleChip("preferred_oils", item)}
            />
          ))}
        </div>
      </fieldset>

      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Pressão preferida
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(pressureLabels).map(([value, label]) => (
            <Chip
              key={value}
              label={label}
              active={form.pressure_preference === value}
              onClick={() => setForm({ ...form, pressure_preference: value })}
            />
          ))}
        </div>
      </div>

      <label className="block rounded-2xl border border-border/70 bg-card p-5 text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Áreas a evitar (separadas por vírgula)
        </span>
        <input
          value={form.avoid_areas.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              avoid_areas: e.target.value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean),
            })
          }
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
        />
      </label>

      <div className="lg:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar anamnese"}
        </button>
        {current?.signed_at && (
          <span className="ml-3 text-xs text-muted-foreground">
            Atualizada em {formatDate(current.signed_at)}
          </span>
        )}
      </div>
    </form>
  );
}

function PackagesTab({
  clientId,
  packages,
  payments,
}: {
  clientId: string;
  packages: Array<{
    id: string;
    service_name: string;
    total_sessions: number;
    used_sessions: number;
    total_price: number;
    status: string;
    purchased_at: string;
  }>;
  payments: Array<{
    id: string;
    package_id: string;
    amount: number;
    method: string;
    paid_at: string;
  }>;
}) {
  const queryClient = useQueryClient();
  const { data: services = [] } = useQuery({
    queryKey: servicesQueryKey,
    queryFn: fetchServices,
  });
  const [form, setForm] = useState({
    service_id: "",
    total_sessions: "5",
    total_price: "",
  });
  const [payment, setPayment] = useState({
    packageId: "",
    amount: "",
    method: paymentMethods[0],
  });

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["packages", clientId] });
    await queryClient.invalidateQueries({ queryKey: ["payments", clientId] });
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const service = services.find((s) => s.id === form.service_id);
    if (!service) {
      toast.error("Escolha um tratamento.");
      return;
    }
    try {
      await createPackage({
        client_id: clientId,
        service_id: service.id,
        service_name: service.name,
        total_sessions: Number(form.total_sessions) || 1,
        total_price:
          Number(form.total_price.replace(",", ".")) ||
          service.price * (Number(form.total_sessions) || 1),
        expires_at: null,
      });
      await refresh();
      setForm({ service_id: "", total_sessions: "5", total_price: "" });
      toast.success("Pacote criado.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível criar.",
      );
    }
  }

  async function handlePayment(packageId: string) {
    const amount = Number(payment.amount.replace(",", "."));
    if (!amount) {
      toast.error("Informe o valor do pagamento.");
      return;
    }
    await createPayment({
      package_id: packageId,
      amount,
      method: payment.method,
      notes: null,
    });
    setPayment({ packageId: "", amount: "", method: paymentMethods[0] });
    await refresh();
    toast.success("Pagamento registrado.");
  }

  async function handleUseSession(pkg: { id: string; service_name: string }) {
    await registerSession({
      client_id: clientId,
      package_id: pkg.id,
      service_name: pkg.service_name,
      session_notes: null,
      pressure_used: null,
    });
    await refresh();
    await queryClient.invalidateQueries({ queryKey: ["sessions", clientId] });
    await queryClient.invalidateQueries({ queryKey: clientDetailQueryKey(clientId) });
    toast.success("Sessão descontada do pacote.");
  }

  async function handleRemove(id: string) {
    if (!window.confirm("Excluir este pacote?")) return;
    await deletePackage(id);
    await refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="grid gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:grid-cols-4"
      >
        <div className="sm:col-span-4">
          <h2 className="font-serif text-lg text-foreground">Novo pacote</h2>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
            Tratamento
          </span>
          <select
            value={form.service_id}
            onChange={(e) => setForm({ ...form, service_id: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="">Selecione…</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
            Total de sessões
          </span>
          <input
            type="number"
            min={1}
            value={form.total_sessions}
            onChange={(e) => setForm({ ...form, total_sessions: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
            Valor total (R$)
          </span>
          <input
            value={form.total_price}
            onChange={(e) => setForm({ ...form, total_price: e.target.value })}
            placeholder="opcional"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Criar pacote
          </button>
        </div>
      </form>

      {packages.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum pacote cadastrado para esta cliente.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {packages.map((pkg) => {
            const pkgPayments = payments.filter((p) => p.package_id === pkg.id);
            const paid = pkgPayments.reduce((sum, p) => sum + p.amount, 0);
            return (
              <article
                key={pkg.id}
                className="rounded-2xl border border-border/70 bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <PackageIcon
                    className="mt-0.5 h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">
                      {pkg.service_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      comprado em {formatDate(pkg.purchased_at)} ·{" "}
                      {pkg.status === "completed" ? "concluído" : "ativo"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(pkg.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Excluir pacote"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <p className="mt-4 font-serif text-xl text-foreground">
                  Sessão {pkg.used_sessions}/{pkg.total_sessions}
                </p>
                <div className="mt-2 flex gap-1.5">
                  {Array.from({ length: pkg.total_sessions }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 flex-1 rounded-full ${
                        index < pkg.used_sessions ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {formatPrice(paid)} pago de {formatPrice(pkg.total_price)}
                </p>
                {pkgPayments.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {pkgPayments.map((p) => (
                      <li key={p.id}>
                        {formatDate(p.paid_at)} · {formatPrice(p.amount)} ·{" "}
                        {p.method}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUseSession(pkg)}
                    disabled={pkg.used_sessions >= pkg.total_sessions}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    Usar sessão
                  </button>
                  {payment.packageId === pkg.id ? (
                    <>
                      <input
                        value={payment.amount}
                        onChange={(e) =>
                          setPayment({ ...payment, amount: e.target.value })
                        }
                        placeholder="Valor"
                        className="w-24 rounded-full border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
                      />
                      <select
                        value={payment.method}
                        onChange={(e) =>
                          setPayment({ ...payment, method: e.target.value })
                        }
                        className="rounded-full border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
                      >
                        {paymentMethods.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handlePayment(pkg.id)}
                        className="rounded-full border border-primary/40 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10"
                      >
                        Salvar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        setPayment({
                          packageId: pkg.id,
                          amount: "",
                          method: paymentMethods[0],
                        })
                      }
                      className="rounded-full border border-primary/40 px-4 py-2 text-xs text-primary transition-colors hover:bg-primary/10"
                    >
                      Registrar pagamento
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SessionForm({
  clientId,
  packages,
}: {
  clientId: string;
  packages: Array<{
    id: string;
    service_name: string;
    total_sessions: number;
    used_sessions: number;
  }>;
}) {
  const queryClient = useQueryClient();
  const { data: services = [] } = useQuery({
    queryKey: servicesQueryKey,
    queryFn: fetchServices,
  });
  const [form, setForm] = useState({
    service_name: "",
    package_id: "",
    notes: "",
    pressure: "medium",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.service_name) {
      toast.error("Escolha o tratamento realizado.");
      return;
    }
    try {
      await registerSession({
        client_id: clientId,
        package_id: form.package_id || null,
        service_name: form.service_name,
        session_notes: form.notes || null,
        pressure_used: form.pressure,
      });
      await queryClient.invalidateQueries({ queryKey: ["sessions", clientId] });
      await queryClient.invalidateQueries({ queryKey: ["packages", clientId] });
      await queryClient.invalidateQueries({
        queryKey: clientDetailQueryKey(clientId),
      });
      setForm({ service_name: "", package_id: "", notes: "", pressure: "medium" });
      toast.success("Atendimento registrado.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível registrar.",
      );
    }
  }

  const openPackages = packages.filter(
    (p) => p.used_sessions < p.total_sessions,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:grid-cols-4"
    >
      <div className="sm:col-span-4">
        <h2 className="font-serif text-lg text-foreground">
          Registrar atendimento
        </h2>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Tratamento
        </span>
        <select
          value={form.service_name}
          onChange={(e) => setForm({ ...form, service_name: e.target.value })}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Selecione…</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Pacote (opcional)
        </span>
        <select
          value={form.package_id}
          onChange={(e) => setForm({ ...form, package_id: e.target.value })}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Sessão avulsa</option>
          {openPackages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.service_name} ({pkg.used_sessions}/{pkg.total_sessions})
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Pressão usada
        </span>
        <select
          value={form.pressure}
          onChange={(e) => setForm({ ...form, pressure: e.target.value })}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {Object.entries(pressureLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
          Notas da sessão
        </span>
        <input
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <div className="sm:col-span-4">
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Salvar atendimento
        </button>
      </div>
    </form>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-border/70 bg-card p-5 text-sm">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
      />
    </label>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-primary bg-primary/12 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40"
      }`}
    >
      {label}
    </button>
  );
}
