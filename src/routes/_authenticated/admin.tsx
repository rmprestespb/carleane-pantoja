import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, PencilLine, Trash2, Check, X, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  createService,
  deleteService,
  fetchServices,
  formatPrice,
  servicesQueryKey,
  updateService,
  type Service,
} from "@/lib/services";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel do Administrador — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Gerencie os serviços e preços exibidos na tabela de preços do site.",
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
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

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

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function parsePrice(value: string) {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const name = form.name.trim();
    const price = parsePrice(form.price);
    if (!name) return toast.error("Informe o nome do serviço.");
    if (price === null) return toast.error("Informe um preço válido.");
    setSaving(true);
    try {
      await createService({
        name: name.slice(0, 120),
        detail: form.detail.trim().slice(0, 300) || null,
        price,
        image_url: form.image_url.trim().slice(0, 500) || null,
      });
      setForm(emptyForm);
      await queryClient.invalidateQueries({ queryKey: servicesQueryKey });
      toast.success("Serviço adicionado!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(service: Service) {
    setEditingId(service.id);
    setEditForm({
      name: service.name,
      detail: service.detail ?? "",
      price: String(service.price),
      image_url: service.image_url ?? "",
    });
  }

  async function handleUpdate(id: string) {
    const name = editForm.name.trim();
    const price = parsePrice(editForm.price);
    if (!name) return toast.error("Informe o nome do serviço.");
    if (price === null) return toast.error("Informe um preço válido.");
    try {
      await updateService(id, {
        name: name.slice(0, 120),
        detail: editForm.detail.trim().slice(0, 300) || null,
        price,
        image_url: editForm.image_url.trim().slice(0, 500) || null,
      });
      setEditingId(null);
      await queryClient.invalidateQueries({ queryKey: servicesQueryKey });
      toast.success("Serviço atualizado!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível atualizar.",
      );
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Remover o serviço "${name}"?`)) return;
    try {
      await deleteService(id);
      await queryClient.invalidateQueries({ queryKey: servicesQueryKey });
      toast.success("Serviço removido.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível remover.",
      );
    }
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

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
          Sua conta não tem permissão de administradora para gerenciar a tabela
          de preços.
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
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary">
            Área restrita
          </p>
          <h1 className="mt-2 font-serif text-4xl text-foreground md:text-5xl">
            Painel do Administrador
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/servicos"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Ver tabela pública
          </Link>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sair do painel
          </button>
        </div>
      </div>

      {/* Adicionar */}
      <div className="mt-10 rounded-3xl border border-border/60 bg-card p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-serif text-2xl text-foreground">
          <Plus className="h-5 w-5 text-primary" aria-hidden="true" /> Adicionar
          novo serviço
        </h2>
        <form
          onSubmit={handleCreate}
          className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1.4fr_0.8fr_1.4fr_auto] md:items-end"
        >
          <div>
            <label htmlFor="s-name" className="mb-1.5 block text-sm text-foreground">
              Serviço *
            </label>
            <input
              id="s-name"
              value={form.name}
              maxLength={120}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="s-detail" className="mb-1.5 block text-sm text-foreground">
              Detalhe
            </label>
            <input
              id="s-detail"
              value={form.detail}
              maxLength={300}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="s-price" className="mb-1.5 block text-sm text-foreground">
              Preço (R$) *
            </label>
            <input
              id="s-price"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="s-image" className="mb-1.5 block text-sm text-foreground">
              URL da imagem
            </label>
            <input
              id="s-image"
              value={form.image_url}
              maxLength={500}
              placeholder="https://…"
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-[42px] rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Adicionar"}
          </button>
        </form>
      </div>

      {/* Editar / remover */}
      <div className="mt-8 rounded-3xl border border-border/60 bg-card p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-serif text-2xl text-foreground">
          <PencilLine className="h-5 w-5 text-primary" aria-hidden="true" />{" "}
          Editar / remover serviços
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Foto</th>
                <th className="py-3 pr-4 font-medium">Serviço</th>
                <th className="py-3 pr-4 font-medium">Detalhes</th>
                <th className="py-3 pr-4 font-medium">Preço (R$)</th>
                <th className="py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Carregando…
                  </td>
                </tr>
              )}
              {!isLoading && services.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Nenhum serviço cadastrado ainda.
                  </td>
                </tr>
              )}
              {services.map((service) =>
                editingId === service.id ? (
                  <tr key={service.id} className="border-b border-border/40 align-middle">
                    <td className="py-3 pr-4">
                      <input
                        value={editForm.image_url}
                        onChange={(e) =>
                          setEditForm({ ...editForm, image_url: e.target.value })
                        }
                        placeholder="https://…"
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        value={editForm.detail}
                        onChange={(e) =>
                          setEditForm({ ...editForm, detail: e.target.value })
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        inputMode="decimal"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        className={inputClass}
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(service.id)}
                          aria-label="Salvar alterações"
                          className="rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          aria-label="Cancelar edição"
                          className="rounded-full border border-input p-2 text-foreground transition-colors hover:bg-muted"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={service.id} className="border-b border-border/40 align-middle">
                    <td className="py-3 pr-4">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          loading="lazy"
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-foreground">{service.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {service.detail || "—"}
                    </td>
                    <td className="py-3 pr-4 text-foreground">
                      {formatPrice(service.price)}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(service)}
                          aria-label={`Editar ${service.name}`}
                          className="rounded-full border border-input p-2 text-foreground transition-colors hover:bg-muted"
                        >
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.name)}
                          aria-label={`Remover ${service.name}`}
                          className="rounded-full border border-destructive/40 p-2 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
