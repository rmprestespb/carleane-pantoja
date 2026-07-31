import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { ServiceDetailDialog } from "../components/ServiceDetailDialog";
import {
  fetchServices,
  formatPrice,
  servicesQueryKey,
  type Service,
} from "@/lib/services";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Tabela de Preços — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Consulte os valores das sessões de massoterapia em Boa Vista/RR: relaxante, drenagem linfática, pedras quentes, ventosaterapia e mais.",
      },
      {
        property: "og:title",
        content: "Tabela de Preços — Carleane Pantoja Massoterapeuta",
      },
      {
        property: "og:description",
        content:
          "Escolha o tratamento ideal para o seu bem-estar e confira os valores das sessões.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrecosPage,
});

function PrecosPage() {
  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: servicesQueryKey,
    queryFn: fetchServices,
  });
  const [selected, setSelected] = useState<Service | null>(null);



  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 md:px-6 md:pt-24">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">
          Tratamentos
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
          Tabela de preços
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Escolha o tratamento ideal para o seu bem-estar. Cada sessão é pensada
          para acolher você por inteiro.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
        {isLoading && (
          <p className="py-12 text-center text-muted-foreground">
            Carregando tratamentos…
          </p>
        )}

        {isError && (
          <p className="py-12 text-center text-muted-foreground">
            Não foi possível carregar a tabela de preços agora. Fale conosco no
            WhatsApp para consultar os valores.
          </p>
        )}

        {!isLoading && !isError && services.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            Em breve os valores estarão disponíveis aqui.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            >
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={`Sessão de ${service.name}`}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-primary/10 text-primary">
                  <Sparkles className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-7">
                <h2 className="font-serif text-2xl text-foreground">
                  {service.name}
                </h2>
                {service.detail && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.detail}
                  </p>
                )}
                <p className="mt-5 font-serif text-3xl text-primary">
                  {formatPrice(service.price)}
                </p>
                <div className="mt-6 pt-1">
                  <WhatsAppButton className="w-full">Agendar</WhatsAppButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-gradient-to-br from-primary/15 via-rose-soft/40 to-accent/25 p-8 text-center md:p-14">
          <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Um momento só seu, para renovar corpo e mente
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-foreground/75">
            Tem dúvida sobre qual tratamento escolher? Me chame no WhatsApp e
            montamos juntos o cuidado ideal para você.
          </p>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton size="lg">
              Falar no WhatsApp e agendar
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
