import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Droplets,
  Flame,
  Circle,
  Syringe,
  Ribbon,
  Star,
} from "lucide-react";
import { WhatsAppButton } from "../components/WhatsAppButton";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços & Tratamentos — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Massagem relaxante, drenagem linfática, pedras quentes, ventosaterapia, dry needling e kinesio. Escolha o cuidado ideal para o seu momento.",
      },
      {
        property: "og:title",
        content: "Serviços & Tratamentos — Carleane Pantoja Massoterapeuta",
      },
      {
        property: "og:description",
        content:
          "Tratamentos personalizados de massoterapia em Boa Vista/RR com Carleane Pantoja.",
      },
      { property: "og:url", content: "/servicos" },
    ],
    links: [{ rel: "canonical", href: "/servicos" }],
  }),
  component: ServicosPage,
});

const services = [
  {
    icon: Sparkles,
    title: "Massagem Relaxante & Terapêutica",
    text: "Alívio de tensões, redução do estresse e restauração do equilíbrio corpo–mente.",
  },
  {
    icon: Droplets,
    title: "Drenagem Linfática",
    text: "Estímulo à circulação, redução de inchaço e retenção de líquidos, com toque suave.",
  },
  {
    icon: Flame,
    title: "Massagem com Pedras Quentes",
    text: "Relaxamento profundo através do calor terapêutico das pedras vulcânicas.",
  },
  {
    icon: Circle,
    title: "Ventosaterapia",
    text: "Alívio imediato de dores musculares profundas e melhora da circulação local.",
  },
  {
    icon: Syringe,
    title: "Dry Needling",
    text: "Agulhamento a seco: reduz dor, rigidez e inflamação, aumentando a mobilidade.",
  },
  {
    icon: Ribbon,
    title: "Aplicação de Kinesio",
    text: "Suporte muscular localizado e alívio de tensões por região específica.",
  },
];

function ServicosPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 md:px-6 md:pt-24">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">
          Tratamentos
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
          Nossos serviços
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Escolha o cuidado ideal para o seu momento. Cada sessão é pensada para
          acolher você por inteiro.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-serif text-2xl text-foreground">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Combo Queridinho */}
      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-gradient-to-br from-primary/15 via-rose-soft/40 to-accent/25 p-8 md:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
                <Star className="h-3.5 w-3.5" aria-hidden="true" /> Combo
                Queridinho
              </span>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground md:text-5xl">
                Massagem Relaxante <span className="text-primary">+</span>{" "}
                Ventosaterapia
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/75">
                A combinação preferida de quem quer relaxar e aliviar dores
                profundas na mesma sessão. Uma experiência completa de cuidado
                em um único momento seu.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <WhatsAppButton size="lg">Agendar o combo</WhatsAppButton>
              <span className="text-xs text-muted-foreground">
                Vagas limitadas na agenda
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
