import { useRef } from "react";
import { Bold, Italic, Link2 } from "lucide-react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export function RichTextEditor({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function wrap(before: string, after: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "texto";
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function insertLink() {
    const url = window.prompt("Endereço do link (https://…)");
    if (!url) return;
    wrap("[", `](${url})`);
  }

  const toolButton =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-foreground">
        {label}
      </label>
      <div className="rounded-2xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/25">
        <div className="flex items-center gap-1.5 border-b border-border/60 px-2.5 py-2">
          <button type="button" onClick={() => wrap("**", "**")} className={toolButton} aria-label="Negrito">
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => wrap("_", "_")} className={toolButton} aria-label="Itálico">
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={insertLink} className={toolButton} aria-label="Inserir link">
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <span className="ml-auto text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
            {value.length}/1500
          </span>
        </div>
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          maxLength={1500}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y rounded-b-2xl bg-transparent px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none"
        />
      </div>
    </div>
  );
}
