import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { festaAtivo, reveillonAtivo, temaEpoca } from "../lib/natal";
import { NatalDecor } from "../components/NatalDecor";
import { DescontoCard } from "../components/DescontoCard";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif text-foreground">404</h1>
        <h2 className="mt-4 text-xl text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-serif text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Carleane Pantoja Massoterapeuta — O poder do toque que transforma" },
      {
        name: "description",
        content:
          "Massoterapia humanizada em Boa Vista/RR: relaxante, drenagem linfática, pedras quentes, ventosaterapia e mais. Agende sua sessão com Carleane Pantoja.",
      },
      { name: "author", content: "Carleane Pantoja" },
      { property: "og:site_name", content: "Carleane Pantoja Massoterapeuta" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Carleane Pantoja Massoterapeuta — O poder do toque que transforma" },
      { name: "twitter:title", content: "Carleane Pantoja Massoterapeuta — O poder do toque que transforma" },
      { property: "og:description", content: "Massoterapia humanizada em Boa Vista/RR: relaxante, drenagem linfática, pedras quentes, ventosaterapia e mais. Agende sua sessão com Carleane Pantoja." },
      { name: "twitter:description", content: "Massoterapia humanizada em Boa Vista/RR: relaxante, drenagem linfática, pedras quentes, ventosaterapia e mais. Agende sua sessão com Carleane Pantoja." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0073c8c-4ab0-4828-95e4-6ac010008be5/id-preview-5ef2a8fd--8a427734-ff88-47a1-87ea-88dcab0ebafb.lovable.app-1785329648700.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0073c8c-4ab0-4828-95e4-6ac010008be5/id-preview-5ef2a8fd--8a427734-ff88-47a1-87ea-88dcab0ebafb.lovable.app-1785329648700.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon-carleane.png" },
      { rel: "icon", type: "image/x-icon", href: "/favicon-carleane.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Roboto:wght@300;400;500;700&display=swap",
      },
      ...(festaAtivo()
        ? [
            {
              rel: "stylesheet",
              href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap",
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function classesTema() {
  const t = temaEpoca();
  return t === "reveillon" ? "natal reveillon" : t === "natal" ? "natal" : "";
}

function FaixaReveillon() {
  if (!reveillonAtivo()) return null;
  return (
    <div className="natal-faixa px-4 py-2 text-center text-sm font-medium tracking-wide">
      ✦ Feliz {new Date().getFullYear() + 1}! Que o novo ano chegue com leveza ✦
    </div>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={classesTema() || undefined}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // O tema de Natal vale para as páginas públicas; o painel da Carleane mantém as cores normais.
  useEffect(() => {
    const painel = /^\/(admin|agendamentos|clientes)(\/|$)/.test(pathname);
    const html = document.documentElement.classList;
    const tema = painel ? null : temaEpoca();
    html.toggle("natal", tema !== null);
    html.toggle("reveillon", tema === "reveillon");
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <FaixaReveillon />
        <SiteHeader />
        <main className="relative flex-1">
          <NatalDecor />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
        <SiteFooter />
      </div>
      <DescontoCard />
      <Toaster />
    </QueryClientProvider>
  );
}
