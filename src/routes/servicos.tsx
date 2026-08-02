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
  const { data, isLoading, isError } = useQuery({
    queryKey: servicesQueryKey,
    queryFn: fetchServices,
  });
  const services = (data ?? []).filter((service) => service.is_visible);
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

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(service)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(service);
                }
              }}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="relative">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={`Sessão de ${service.name}`}
                    loading="lazy"
                    className="h-24 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-28"
                  />
                ) : (
                  <div className="flex h-24 w-full items-center justify-center bg-primary/10 text-primary sm:h-28">
                    <Sparkles className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent px-3 py-1.5 font-serif text-sm leading-tight text-background sm:text-base">
                  {service.name}
                </p>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-serif text-base leading-snug text-foreground sm:text-lg">
                  {service.name}
                </h2>
                {service.detail && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {service.detail}
                  </p>
                )}
                <p className="mt-auto pt-3 font-serif text-xl text-primary sm:text-2xl">
                  {formatPrice(service.price)}
                </p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-primary/70">
                  Ver detalhes
                </p>
              </div>
            </article>
          ))}
        </div>


        <ServiceDetailDialog
          service={selected}
          open={selected !== null}
          onOpenChange={(open) => !open && setSelected(null)}
        />
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
