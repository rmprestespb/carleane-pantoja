import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { uploadServicePhoto } from "@/lib/services";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ServicePhotoField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadServicePhoto(file);
      onChange(url);
      toast.success("Foto carregada!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível enviar a foto.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Carregar foto do serviço"
        className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-dashed border-primary/45 bg-primary/5"
      >
        {value ? (
          <img
            src={value}
            alt="Pré-visualização da foto do serviço"
            className="h-full w-full object-cover blur-[0.3px] transition group-hover:opacity-70"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-primary/60">
            <ImagePlus className="h-7 w-7" aria-hidden="true" />
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/25 opacity-0 transition group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-background" />
          ) : (
            <span className="text-2xl leading-none text-background">+</span>
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">Foto do serviço</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Carregar foto do serviço (ex: close de mãos com óleos).
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            {uploading ? "Enviando…" : "Upload de foto"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Remover
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
