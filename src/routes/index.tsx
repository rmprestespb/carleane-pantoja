import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, HeartPulse, Activity, Leaf } from "lucide-react";
import heroImg from "../assets/hero-massage.jpg";
import stonesImg from "../assets/banner-stones.jpg";
import { WhatsAppButton } from "../components/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carleane Pantoja Massoterapeuta — O poder do toque que transforma" },
      {
        name: "description",
        content:
          "Massoterapia humanizada em Boa Vista/RR: relaxante, drenagem linfática, pedras quentes, ventosaterapia e mais. Agende sua sessão com Carleane Pantoja.",
      },
      {
        property: "og:title",
        content: "Carleane Pantoja Massoterapeuta — O poder do toque que transforma",
      },
      {
        property: "og:description",
        content:
          "Massoterapia humanizada em Boa Vista/RR: relaxante, drenagem linfática, pedras quentes, ventosaterapia e mais. Agende sua sessão com Carleane Pantoja.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const benefits = [
  {
    icon: Sparkles,
    title: "Alívio do estresse",
    text: "Redução da ansiedade e retomada do equilíbrio emocional.",
  },
  {
    icon: HeartPulse,
    title: "Menos dores e tensões",
    text: "Liberação de nós musculares e alívio profundo do corpo.",
  },
  {
    icon: Activity,
    title: "Circulação e flexibilidade",
    text: "Estímulo à circulação, mobilidade e recuperação muscular.",
  },
  {
    icon: Leaf,
    title: "Leveza e bem-estar",
    text: "Mais qualidade de vida, disposição e sensação de renovação.",
  },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary">
              <Flower /> Massoterapia humanizada
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              O poder do toque que{" "}
              <span className="italic text-primary">transforma</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Mais que uma massagem, um cuidado completo para o seu corpo e sua
              mente. Sessões acolhedoras em Boa Vista — RR.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton size="lg">Agendar sua sessão</WhatsAppButton>
              <a
                href="/servicos"
                className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-transparent px-6 py-3.5 text-base font-medium text-primary transition-all hover:bg-primary/10"
              >
                Ver tratamentos
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/25 via-accent/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-[0_30px_80px_-30px_rgba(120,60,60,0.35)]">
              <img
                src={heroImg}
                alt="Ambiente sereno de massoterapia com pétalas de rosa, toalhas e óleo essencial"
                width={1400}
                height={1400}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">
            Benefícios
          </p>
          <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
            Cuidado que se sente em cada respiração
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-3xl border border-border/60 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/25 text-accent-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-serif text-xl text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Motivational banner */}
      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem]">
          <img
            src={stonesImg}
            alt="Pedras quentes de basalto sobre toalha macia com vela e ramos de eucalipto"
            width={1600}
            height={900}
            loading="lazy"
            className="h-[420px] w-full object-cover md:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.2_0.03_30_/_0.75)] via-[oklch(0.2_0.03_30_/_0.45)] to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-8 md:px-14">
              <p className="text-xs uppercase tracking-[0.25em] text-[oklch(0.95_0.02_60)]">
                Uma pausa merecida
              </p>
              <p className="mt-4 font-serif text-3xl leading-tight text-[oklch(0.98_0.01_60)] md:text-4xl lg:text-5xl">
                “Todo mundo merece um dia para relaxar. Cuidar de quem você ama
                também é se permitir descansar.”
              </p>
              <div className="mt-8">
                <WhatsAppButton size="lg" variant="accent">
                  Reserve seu momento
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Flower() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="12" cy="19" r="2.4" />
      <circle cx="5" cy="12" r="2.4" />
      <circle cx="19" cy="12" r="2.4" />
    </svg>
  );
}
