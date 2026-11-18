import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, HeartPulse, Activity, Leaf } from "lucide-react";
import spaSet from "../assets/hero-spa-blob.webp";
import heroBg from "../assets/hero-bg-texture.webp";
import logoCarleane from "../assets/logo-carleane.webp";
import stonesImg from "../assets/banner-stones.jpg";
import decoLeft from "../assets/hero-deco-left.webp";
import decoRightTop from "../assets/hero-deco-right-top.webp";
import decoRightBottom from "../assets/hero-deco-right-bottom.webp";
import decoBottom from "../assets/hero-deco-bottom.webp";
import heroNatal from "../assets/hero-natal.webp";
import heroNatalDireita from "../assets/hero-natal-direita.webp";
import heroNatalLogo from "../assets/hero-natal-logo.webp";
import { festaAtivo, natalAtivo } from "../lib/natal";
import { guirlanda } from "../components/NatalDecor";
import natalPinho from "../assets/natal-pinho.webp";
import { WHATSAPP_URL } from "../lib/site";
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
      {natalAtivo() && <NatalHero />}

      {/* Hero */}
      {!natalAtivo() && (
      <section className="relative -mt-[73px] overflow-hidden pt-[73px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_bottom,black_80%,transparent)]" />
          <img src={decoLeft} alt="" className="absolute left-0 top-0 hidden w-[17vw] max-w-[345px] lg:block" />
          <img src={decoRightTop} alt="" className="absolute right-0 top-0 hidden w-[265px] lg:block" />
          <img src={decoRightBottom} alt="" className="absolute bottom-0 right-0 hidden w-[425px] lg:block" />
          <img src={decoBottom} alt="" className="absolute bottom-0 left-0 w-[640px] max-w-full lg:w-[1100px]" />
        </div>

        <img
          src={logoCarleane}
          alt="Logo Carleane Pantoja Massoterapeuta"
          width={720}
          height={787}
          className="relative z-10 mx-auto -mb-8 mt-6 w-32 min-[1280px]:absolute min-[1280px]:mb-0 min-[1280px]:left-1/2 min-[1280px]:top-[92px] min-[1280px]:mt-0 min-[1280px]:w-[190px] min-[1280px]:-translate-x-1/2"
        />

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
            <img
              src={spaSet}
              alt="Pedras quentes de basalto, velas acesas, óleo e lavanda sobre toalha rosada"
              width={1243}
              height={1045}
              className="relative mx-auto w-full max-w-[640px] lg:-mr-[8vw] lg:-my-8 lg:ml-auto lg:w-[122%] lg:max-w-none"
            />
          </div>
        </div>
      </section>
      )}

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-2xl">
          <p className="natal-eyebrow text-xs uppercase tracking-[0.25em] text-primary">
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
              className="natal-card group rounded-3xl border border-border/60 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              <span className="natal-ico flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/25 text-accent-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary">
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
        <div className="natal-banner relative overflow-hidden rounded-[2.5rem]">
          <img
            src={stonesImg}
            alt="Pedras quentes de basalto sobre toalha macia com vela e ramos de eucalipto"
            width={1600}
            height={900}
            loading="lazy"
            className="h-[420px] w-full object-cover md:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.25_0.04_185_/_0.78)] via-[oklch(0.25_0.04_185_/_0.45)] to-transparent" />
          {festaAtivo() && (
            <>
              <div
                aria-hidden="true"
                className="natal-pisca pointer-events-none absolute inset-x-0 top-0 h-11 bg-repeat-x"
                style={{ backgroundImage: guirlanda(), backgroundSize: "360px 44px" }}
              />
              {natalAtivo() && (
              <img
                src={natalPinho}
                alt=""
                width={380}
                height={160}
                className="pointer-events-none absolute bottom-0 left-0 w-40 opacity-95 [mask-composite:intersect] [mask-image:linear-gradient(to_right,black_50%,transparent),linear-gradient(to_top,black_50%,transparent)] md:w-52"
              />
              )}
            </>
          )}
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
                <WhatsAppButton size="lg" variant="accent" className="natal-cta">
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

/**
 * Hero de Natal. Em telas largas (1280px+) é a arte de Natal exatamente como foi enviada,
 * com links por cima dos botões. Em telas menores, o texto é real (legível) e a arte entra recortada.
 */
function NatalHero() {
  return (
    <>
      {/* Telas largas */}
      <section className="relative hidden w-full xl:block" style={{ aspectRatio: "1790 / 663" }}>
        <img
          src={heroNatal}
          alt="Cenário de Natal com árvore iluminada, presente dourado, toalha com laço verde, pedras e velas"
          width={1790}
          height={663}
          className="absolute inset-0 h-full w-full"
        />
        <h1 className="sr-only">O poder do toque que transforma</h1>
        <p className="sr-only">
          Mais que uma massagem, um cuidado completo para o seu corpo e sua mente. Sessões acolhedoras em Boa Vista — RR.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar sua sessão pelo WhatsApp"
          className="absolute rounded-full transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          style={{ left: "22.2%", top: "75.6%", width: "12.6%", height: "8.1%" }}
        />
        <a
          href="/servicos"
          aria-label="Ver tratamentos"
          className="absolute rounded-full transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          style={{ left: "35.6%", top: "75.9%", width: "9.5%", height: "7.7%" }}
        />
      </section>

      {/* Telas menores */}
      <section className="natal-escuro relative overflow-hidden bg-[oklch(0.2_0.055_142)] xl:hidden">
        <div className="mx-auto grid max-w-3xl gap-6 px-4 pb-0 pt-8 text-center md:px-6">
          <img
            src={heroNatalLogo}
            alt="Logo Carleane Pantoja Massoterapeuta"
            width={230}
            height={240}
            className="mx-auto w-40 [mask-image:radial-gradient(closest-side,black_72%,transparent)]"
          />
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/50 bg-accent px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-deep">
              Massoterapia humanizada
            </span>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
              O poder do toque que <span className="italic text-primary">transforma</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-foreground/90">
              Mais que uma massagem, um cuidado completo para o seu corpo e sua mente. Sessões acolhedoras em Boa Vista — RR.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <WhatsAppButton size="lg">Agendar sua sessão</WhatsAppButton>
              <a
                href="/servicos"
                className="inline-flex items-center justify-center rounded-full border border-primary/60 px-6 py-3.5 text-base font-medium text-foreground transition-all hover:bg-primary/10"
              >
                Ver tratamentos
              </a>
            </div>
          </div>
          <img
            src={heroNatalDireita}
            alt="Toalha com laço verde, flor, pedras e velas acesas ao lado de uma árvore de Natal iluminada"
            width={690}
            height={663}
            className="mx-auto mt-2 w-full max-w-xl [mask-image:linear-gradient(to_bottom,transparent,black_18%)]"
          />
        </div>
      </section>
    </>
  );
}
