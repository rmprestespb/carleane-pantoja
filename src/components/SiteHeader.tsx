import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Flower2 } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";
import { cn } from "../lib/utils";

const nav = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/sobre", label: "Sobre & Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Flower2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg text-foreground">
              Carleane Pantoja
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Massoterapeuta
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className={cn(
                "text-sm text-muted-foreground transition-colors hover:text-primary",
              )}
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton size="md">Agendar sessão</WhatsAppButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-foreground md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                activeProps={{ className: "text-primary bg-muted" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <WhatsAppButton className="w-full">Agendar sessão</WhatsAppButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
