import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check, Copy, Gift, X } from "lucide-react";
import { DESCONTO, descontoAtivo, mensagemDesconto } from "../lib/desconto";
import { WHATSAPP_URL } from "../lib/site";

const CHAVE = "carleane-desconto-visto";

function jaViu(): boolean {
  try {
    const t = Number(localStorage.getItem(CHAVE));
    return !!t && Date.now() - t < DESCONTO.VOLTAR_EM_HORAS * 3600_000;
  } catch {
    return false;
  }
}
function marcarVisto() {
  try {
    localStorage.setItem(CHAVE, String(Date.now()));
  } catch {
    /* sem armazenamento: o card só volta a aparecer na próxima visita */
  }
}

/** Card de desconto: aparece uma vez ao entrar no site, com o código revelado por um clique. */
export function DescontoCard() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const painel = /^\/(admin|agendamentos|clientes|auth|reset-password)(\/|$)/.test(pathname);
  const [aberto, setAberto] = useState(false);
  const [revelado, setRevelado] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (painel || !descontoAtivo() || jaViu()) return;
    const t = setTimeout(() => setAberto(true), 2500);
    return () => clearTimeout(t);
  }, [painel]);

  useEffect(() => {
    if (!aberto) return;
    botao.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  function fechar() {
    marcarVisto();
    setAberto(false);
  }
  async function copiar() {
    try {
      await navigator.clipboard.writeText(DESCONTO.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* o código continua visível para copiar à mão */
    }
  }

  if (!aberto || painel) return null;
  const whats = WHATSAPP_URL.split("?")[0] + "?text=" + encodeURIComponent(mensagemDesconto());

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && fechar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="desconto-titulo"
        className="desconto-pop relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-card p-8 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Gift className="h-7 w-7" />
        </span>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-primary-deep">
          {DESCONTO.etiqueta}
        </p>
        <h2 id="desconto-titulo" className="mt-2 font-serif text-5xl text-foreground">
          {DESCONTO.destaque}
        </h2>
        <p className="mt-2 text-base text-muted-foreground">{DESCONTO.descricao}</p>

        {!revelado ? (
          <button
            ref={botao}
            type="button"
            onClick={() => setRevelado(true)}
            className="natal-cta mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Gift className="h-5 w-5" /> Pegar meu desconto
          </button>
        ) : (
          <div className="desconto-pop mt-7">
            <p className="text-sm text-muted-foreground">Seu código:</p>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-primary-deep/60 bg-accent px-5 py-4">
              <strong className="font-mono text-2xl tracking-[0.2em] text-foreground">{DESCONTO.codigo}</strong>
              <button
                ref={botao}
                type="button"
                onClick={copiar}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiado ? "Copiado" : "Copiar"}
              </button>
            </div>
            <a
              href={whats}
              target="_blank"
              rel="noopener noreferrer"
              onClick={marcarVisto}
              className="natal-cta mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Usar no WhatsApp
            </a>
          </div>
        )}
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{DESCONTO.regra}</p>
      </div>
    </div>
  );
}
