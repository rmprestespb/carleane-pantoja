import { useState } from "react";
import { PencilLine, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";
import { ServicePhotoField } from "./ServicePhotoField";
import {
  deleteService,
  updateService,
  formatPrice,
  type Service,
} from "@/lib/services";

type Props = {
  service: Service;
  onSaved: () => Promise<void> | void;
};

export function ServiceAdminCard({ service, onSaved }: Props) {
  const [name, setName] = useState(service.name);
  const [detail, setDetail] = useState(service.detail ?? "");
  const [price, setPrice] = useState(String(service.price));
  const [imageUrl, setImageUrl] = useState(service.image_url ?? "");
  const [visible, setVisible] = useState(service.is_visible);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = name.trim();
    const parsed = Number(price.replace(",", "."));
    if (!trimmed) return toast.error("Informe o nome do serviço.");
    if (!Number.isFinite(parsed) || parsed < 0)
      return toast.error("Informe um preço válido.");

    setSaving(true);
    try {
      await updateService(service.id, {
        name: trimmed.slice(0, 120),
        detail: detail.trim().slice(0, 1500) || null,
        price: parsed,
        image_url: imageUrl.trim() || null,
        is_visible: visible,
      });
      await onSaved();
      toast.success("Alterações salvas!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Excluir o serviço "${service.name}"?`)) return;
    try {
      await deleteService(service.id);
      await onSaved();
      toast.success("Serviço excluído.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível excluir.",
      );
    }
  }

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-[0_18px_50px_-40px_var(--primary)]">
      <header className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <label htmlFor={`name-${service.id}`} className="sr-only">
            Nome do serviço
          </label>
          <input
            id={`name-${service.id}`}
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-transparent bg-transparent px-1 py-0.5 font-serif text-xl text-foreground outline-none transition hover:border-border focus:border-primary focus:bg-background"
          />
        </div>
        <PencilLine className="mt-1.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      </header>

      <ServicePhotoField value={imageUrl} onChange={setImageUrl} />

      <RichTextEditor
        id={`detail-${service.id}`}
        label="Descrição para “Saiba mais” (texto do modal)"
        value={detail}
        onChange={setDetail}
        placeholder="Toque suave e ritmado com óleos aromáticos para relaxamento profundo…"
        rows={5}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label
            htmlFor={`price-${service.id}`}
            className="mb-1.5 block text-sm text-foreground"
          >
            Preço (R$)
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 focus-within:border-primary">
            <input
              id={`price-${service.id}`}
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-24 bg-transparent font-serif text-lg text-foreground outline-none"
            />
            <PencilLine className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Atual: {formatPrice(service.price)}
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
          <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Visível no site
          </span>
          <span className="relative inline-flex">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
            <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
          </span>
        </label>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          Salvar alterações
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3.5 py-2.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Excluir
        </button>
      </div>
    </article>
  );
}
