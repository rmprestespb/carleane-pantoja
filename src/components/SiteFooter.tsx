import { Link } from "@tanstack/react-router";
import { Flower2, Instagram, MessageCircle, MapPin } from "lucide-react";
import {
  CLINIC_ADDRESS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "../lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Flower2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-lg text-foreground">
              Carleane Pantoja
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            O poder do toque que transforma. Cuidado completo para o seu corpo
            e sua mente.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="text-foreground/80 hover:text-primary">
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/servicos"
                className="text-foreground/80 hover:text-primary"
              >
                Tabela de Preços
              </Link>
            </li>
            <li>
              <Link
                to="/sobre"
                className="text-foreground/80 hover:text-primary"
              >
                Sobre & Contato
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/80 hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp {WHATSAPP_NUMBER}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/80 hover:text-primary"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li className="flex items-start gap-2 text-foreground/80">
              <MapPin className="mt-0.5 h-4 w-4" aria-hidden="true" />
              <span>{CLINIC_ADDRESS}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center text-xs text-muted-foreground md:flex-row md:justify-between md:px-6">
          <span>
            © {new Date().getFullYear()} Carleane Pantoja Massoterapeuta. Todos
            os direitos reservados.
          </span>
          <Link to="/auth" className="hover:text-primary">
            Acesso restrito
          </Link>
        </div>
      </div>
    </footer>
  );
}
