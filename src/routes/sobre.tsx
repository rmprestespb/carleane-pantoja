import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Instagram, MapPin, Heart } from "lucide-react";
import aboutImg from "../assets/about-spa.jpg";
import { WhatsAppButton } from "../components/WhatsAppButton";
import {
  CLINIC_ADDRESS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "../lib/site";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre & Contato — Carleane Pantoja (Cacau) Massoterapeuta" },
      {
        name: "description",
        content:
          "Conheça Carleane Pantoja (Cacau), massoterapeuta e analista de RH em Boa Vista/RR. Agende sua sessão pelo WhatsApp.",
      },
      {
        property: "og:title",
        content: "Sobre & Contato — Carleane Pantoja (Cacau) Massoterapeuta",
      },
      {
        property: "og:description",
        content:
          "Um momento só seu, para renovar corpo e mente. Atendimentos na clínica Fisiocenter em Boa Vista/RR.",
      },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <>
      {/* About */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:px-6 md:pt-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/25 via-primary/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-[0_30px_80px_-30px_rgba(120,60,60,0.35)]">
              <img
                src={aboutImg}
                alt="Ambiente aconchegante de atendimento em massoterapia com toalhas, velas e orquídea"
                width={1200}
                height={1400}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="text-xs uppercase tracking-[0.25em] text-primary">
              Sobre mim
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
              Conheça{" "}
              <span className="italic text-primary">Carleane Pantoja</span>{" "}
              <span className="whitespace-nowrap">(Cacau)</span>
            </h1>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Sou massoterapeuta e analista de RH, apaixonada por cuidar de
                pessoas. Acredito no toque como uma linguagem de acolhimento —
                capaz de aliviar dores, silenciar a mente e devolver o corpo
                para você.
              </p>
              <p>
                Meu trabalho une técnica e sensibilidade para alinhar saúde
                física e mental, criando espaço para você respirar, descansar e
                se reconectar com o próprio bem-estar.
              </p>
            </div>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-accent/25 px-5 py-2.5 text-sm text-foreground">
              <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
              Atendimento humanizado e personalizado
            </div>
          </div>
        </div>
      </section>

      {/* Booking / contact */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card p-8 md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-primary">
              Agendamento
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              “Um momento só seu, para renovar corpo e mente.”
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Fale comigo pelo WhatsApp e escolha o melhor horário na agenda.
            </p>

            <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  WhatsApp
                </span>
                <span className="font-medium text-foreground">
                  {WHATSAPP_NUMBER}
                </span>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Instagram
                </span>
                <span className="font-medium text-foreground">
                  {INSTAGRAM_HANDLE}
                </span>
              </a>

              <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/70 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Onde atendo
                </span>
                <span className="font-medium text-foreground">
                  {CLINIC_ADDRESS}
                </span>
              </div>
            </div>

            <div className="mt-10">
              <WhatsAppButton size="lg" className="uppercase tracking-[0.15em]">
                Falar no WhatsApp e agendar
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
