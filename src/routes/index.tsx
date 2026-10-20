import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, HeartPulse, Activity, Leaf } from "lucide-react";
import heroImg from "../assets/hero-massage.jpg";
import stonesImg from "../assets/banner-stones.jpg";
import decoLeft from "../assets/hero-deco-left.webp";
import decoRightTop from "../assets/hero-deco-right-top.webp";
import decoRightBottom from "../assets/hero-deco-right-bottom.webp";
import decoBottom from "../assets/hero-deco-bottom.webp";
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
      <section className="relative -mt-[73px] overflow-hidden pt-[73px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <img src={decoLeft} alt="" className="absolute left-0 top-0 hidden w-[17vw] max-w-[345px] lg:block" />
          <img src={decoRightTop} alt="" className="absolute right-0 top-0 hidden w-[265px] lg:block" />
          <img src={decoRightBottom} alt="" className="absolute bottom-0 right-0 hidden w-[425px] lg:block" />
          <img src={decoBottom} alt="" className="absolute bottom-0 left-0 w-[640px] max-w-full lg:w-[1100px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1280px] gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24 lg:pl-[6vw] min-[1700px]:pl-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-deep">
              <Flower /> Massoterapia humanizada
            </span>
            <h1 className="mt-6 max-w-[6.6em] font-serif text-5xl leading-[1.05] text-foreground md:text-6xl lg:text-[5.25rem]">
              O poder do toque que{" "}
              <span className="italic text-primary-deep">transforma</span>.
            </h1>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-foreground/85">
              Mais que uma massagem, um cuidado completo para o seu corpo e sua
              mente. Sessões acolhedoras em Boa Vista — RR.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppButton size="lg">Agendar sua sessão</WhatsAppButton>
              <a
                href="/servicos"
                className="inline-flex items-center justify-center rounded-full border border-primary/50 bg-transparent px-6 py-3.5 text-base font-medium text-primary-deep transition-all hover:bg-primary/10"
              >
                Ver tratamentos
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/25 via-accent/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-[0_30px_80px_-30px_rgba(40,80,70,0.35)]">
              <img
                src={heroImg}
                alt="Ambiente sereno de massoterapia com pétalas de rosa, toalhas e óleo essencial"
                width={1400}
                height={1400}
                className="aspect-[590/540] h-full w-full object-cover object-[50%_30%]"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.25_0.04_185_/_0.78)] via-[oklch(0.25_0.04_185_/_0.45)] to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-8 md:px-14">
              <p className="text-xs uppercase tracking-[0.25em] text-[oklch(0.95_0.02_100)]">
                Uma pausa merecida
              </p>
              <p className="mt-4 font-serif text-3xl leading-tight text-[oklch(0.98_0.01_100)] md:text-4xl lg:text-5xl">
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
