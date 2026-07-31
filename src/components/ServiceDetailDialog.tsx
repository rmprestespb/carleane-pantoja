import { Clock, Sparkles, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WhatsAppButton } from "./WhatsAppButton";
import { WHATSAPP_NUMBER } from "@/lib/site";
import { formatPrice, type Service } from "@/lib/services";

type Props = {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ServiceDetailDialog({ service, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-[92vw] max-w-3xl overflow-y-auto rounded-[2rem] border-primary/25 bg-card p-0 shadow-[0_40px_120px_-40px_var(--primary)]">
        {service && (
          <div>
            <DialogHeader className="space-y-2 px-6 pt-8 text-center md:px-10">
              <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
                Tratamento
              </p>
              <DialogTitle className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text font-serif text-4xl leading-tight text-transparent md:text-5xl">
                {service.name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detalhes do tratamento {service.name}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 px-6 md:px-10">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={`Sessão de ${service.name}`}
                  className="h-64 w-full rounded-3xl object-cover md:h-80"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center rounded-3xl bg-primary/10 text-primary md:h-80">
                  <Sparkles className="h-10 w-10" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="px-6 pb-8 pt-6 md:px-10 md:pb-10">
              <p className="text-center font-serif text-4xl text-primary md:text-5xl">
                {formatPrice(service.price)}
              </p>

              {service.detail && (
                <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-muted-foreground">
                  {service.detail}
                </p>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="block font-medium text-foreground">
                      Duração
                    </span>
                    Sessão de 60 a 90 minutos, em ambiente acolhedor.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                  <ShieldAlert
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <span className="block font-medium text-foreground">
                      Contraindicações
                    </span>
                    Inflamação aguda, febre ou quadros clínicos em crise.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <WhatsAppButton size="lg" className="w-full">
                  Agendar via WhatsApp ({WHATSAPP_NUMBER})
                </WhatsAppButton>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
