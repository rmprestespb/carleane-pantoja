import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import aboutPhoto from "../assets/about-carleane.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre mim — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Conheça Carleane Pantoja, massoterapeuta em Boa Vista/RR. Atendimento humanizado, acolhedor e personalizado para cuidar do corpo e da mente.",
      },
      {
        property: "og:title",
        content: "Sobre mim — Carleane Pantoja Massoterapeuta",
      },
      {
        property: "og:description",
        content:
          "Sou Carleane Pantoja, massoterapeuta boa-vistense. Ofereço cuidado personalizado, relaxamento e recuperação muscular.",
      },
      { property: "og:url", content: "/sobre" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 md:px-6 md:pt-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div className="relative order-2 md:order-1">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/25 via-primary/20 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-[0_30px_80px_-30px_rgba(120,60,60,0.35)]">
            <img
              src={aboutPhoto}
              alt="Carleane Pantoja, massoterapeuta em Boa Vista/RR"
              width={1023}
              height={1537}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/5] w-full object-cover object-top md:aspect-[3/4]"
            />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">
            Sobre mim
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
            Carleane Pantoja | Massoterapeuta
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Sou Carleane Pantoja, boa-vistense e massoterapeuta, apaixonada
              pelo cuidado com o corpo, pela saúde e pelo bem-estar das pessoas.
            </p>
            <p>
              Atuo com foco em regeneração e recuperação muscular, utilizando
              técnicas de massoterapia que auxiliam no relaxamento, na redução de
              tensões e desconfortos musculares, na recuperação do corpo e na
              promoção de uma melhor qualidade de vida.
            </p>
            <p>
              Acredito que cada pessoa possui necessidades únicas. Por isso, meu
              trabalho é realizado de forma acolhedora, humanizada e
              personalizada, buscando compreender o momento e as necessidades
              de cada cliente para proporcionar uma experiência de cuidado
              completa.
            </p>
            <p>
              Mais do que aliviar tensões e promover relaxamento, meu propósito
              é proporcionar momentos de equilíbrio, leveza e conexão com o
              próprio corpo.
            </p>
            <p>
              Cada atendimento é uma oportunidade de cuidar, acolher e
              contribuir para que você se sinta melhor — física e emocionalmente.
            </p>
            <p>Cuidar do corpo é também cuidar de si.</p>
          </div>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-accent/25 px-5 py-2.5 text-sm text-foreground">
            <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
            Atendimento humanizado e personalizado
          </div>
        </div>
      </div>
    </section>
  );
}
