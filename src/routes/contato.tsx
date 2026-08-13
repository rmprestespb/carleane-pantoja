import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Instagram, MapPin } from "lucide-react";
import { WhatsAppButton } from "../components/WhatsAppButton";
import {
  CLINIC_ADDRESS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "../lib/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Entre em contato com Carleane Pantoja em Boa Vista/RR. WhatsApp, Instagram e endereço da clínica Fisiocenter.",
      },
      {
        property: "og:title",
        content: "Contato — Carleane Pantoja Massoterapeuta",
      },
      {
        property: "og:description",
        content:
          "Agende sua sessão de massoterapia pelo WhatsApp ou Instagram. Atendimento na clínica Fisiocenter em Boa Vista, RR.",
      },
      { property: "og:url", content: "/contato" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">
          Contato
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-foreground md:text-6xl">
          Vamos cuidar de você
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Escolha o canal que preferir e agende seu momento de cuidado.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/60 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            WhatsApp
          </span>
          <span className="text-lg font-medium text-foreground">
            {WHATSAPP_NUMBER}
          </span>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/60 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <Instagram className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Instagram
          </span>
          <span className="text-lg font-medium text-foreground">
            {INSTAGRAM_HANDLE}
          </span>
        </a>

        <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/60 p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <MapPin className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Onde atendo
          </span>
          <span className="text-lg font-medium text-foreground">
            {CLINIC_ADDRESS}
          </span>
        </div>
      </div>

      <div className="mt-12 text-center">
        <WhatsAppButton size="lg" className="uppercase tracking-[0.15em]">
          Agendar via WhatsApp
        </WhatsAppButton>
      </div>
    </section>
  );
}
