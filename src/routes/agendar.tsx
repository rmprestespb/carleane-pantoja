import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { fetchServices, formatPrice, servicesQueryKey } from "@/lib/services";
import { requestAppointment } from "@/lib/appointments";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar Sessão — Carleane Pantoja Massoterapeuta" },
      {
        name: "description",
        content:
          "Solicite seu horário de massoterapia em Boa Vista/RR: escolha o tratamento, a data e a hora desejada e receba a confirmação pelo WhatsApp.",
      },
      {
        property: "og:title",
        content: "Agendar Sessão — Carleane Pantoja Massoterapeuta",
      },
      {
        property: "og:description",
        content:
          "Escolha o tratamento, a data e a hora desejada e reserve o seu momento de cuidado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgendarPage,
});

const schema = z.object({
  client_name: z.string().trim().min(2, "Informe seu nome").max(120),
  client_phone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .max(30, "Telefone muito longo"),
  service_id: z.string().min(1, "Escolha um tratamento"),
  date: z.string().min(1, "Escolha a data"),
  time: z.string().min(1, "Escolha o horário"),
  notes: z.string().trim().max(1000).optional(),
});

const emptyForm = {
  client_name: "",
  client_phone: "",
  service_id: "",
  date: "",
  time: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25";

function AgendarPage() {
  const [form, setForm] = useState(emptyForm);
  const [done, setDone] = useState(false);

  const { data: services = [] } = useQuery({
    queryKey: servicesQueryKey,
    queryFn: fetchServices,
  });
  const visible = services.filter((s) => s.is_visible);

  const mutation = useMutation({
    mutationFn: requestAppointment,
    onSuccess: () => {
      setForm(emptyForm);
      setDone(true);
      toast.success("Pedido de agendamento enviado!");
    },
    onError: (error: unknown) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o pedido.",
      ),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const service = visible.find((s) => s.id === parsed.data.service_id);
    if (!service) {
      toast.error("Escolha um tratamento disponível.");
      return;
    }
    const preferred = new Date(`${parsed.data.date}T${parsed.data.time}`);
    if (Number.isNaN(preferred.getTime())) {
      toast.error("Data ou horário inválido.");
      return;
    }
    mutation.mutate({
      client_name: parsed.data.client_name,
      client_phone: parsed.data.client_phone,
      service_id: service.id,
      service_name: service.name,
      preferred_at: preferred.toISOString(),
      notes: parsed.data.notes?.trim() || null,
    });
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 md:px-6 md:pt-24">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">
          Agendamento
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
          Reserve o seu momento de cuidado
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Escolha o tratamento, informe a data e a hora que preferir. Eu confirmo
          o seu horário pelo WhatsApp.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
        {done ? (
          <div className="rounded-3xl border border-accent/40 bg-card p-8 text-center shadow-[var(--shadow-soft)] md:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-serif text-3xl text-foreground">
              Pedido recebido!
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Seu pedido de agendamento foi registrado. Em breve você recebe a
              confirmação — se preferir, fale comigo agora mesmo no WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <WhatsAppButton size="lg">Falar no WhatsApp</WhatsAppButton>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="rounded-full border border-input px-6 py-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                Fazer outro agendamento
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-5 rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] md:p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="client_name" className="mb-1.5 block text-sm text-foreground">
                  Seu nome *
                </label>
                <input
                  id="client_name"
                  value={form.client_name}
                  maxLength={120}
                  autoComplete="name"
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="client_phone" className="mb-1.5 block text-sm text-foreground">
                  WhatsApp / Telefone *
                </label>
                <input
                  id="client_phone"
                  value={form.client_phone}
                  maxLength={30}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(46) 99118-8015"
                  onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="service_id" className="mb-1.5 block text-sm text-foreground">
                Tratamento *
              </label>
              <select
                id="service_id"
                value={form.service_id}
                onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                className={inputClass}
              >
                <option value="">Escolha um tratamento…</option>
                {visible.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} — {formatPrice(service.price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm text-foreground">
                  Data desejada *
                </label>
                <input
                  id="date"
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="time" className="mb-1.5 block text-sm text-foreground">
                  Horário desejado *
                </label>
                <input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm text-foreground">
                Observações (opcional)
              </label>
              <textarea
                id="notes"
                rows={4}
                maxLength={1000}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Conte se sente alguma dor específica, preferências de horário…"
                className={`${inputClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="justify-self-start rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {mutation.isPending ? "Enviando…" : "Solicitar agendamento"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
