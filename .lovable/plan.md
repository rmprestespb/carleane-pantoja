## Site Carleane Pantoja Massoterapeuta — 3 páginas

Site institucional em TanStack Start com 3 rotas, design clean/spa, foco em conversão via WhatsApp.

### Design System (src/styles.css)
- Paleta (oklch):
  - background: creme/off-white (`oklch(0.98 0.012 85)`)
  - card: bege suave (`oklch(0.95 0.018 80)`)
  - primary: rosa seco / dusty rose (`oklch(0.72 0.055 15)`)
  - accent: verde menta/esmeralda suave (`oklch(0.78 0.06 165)`)
  - foreground: marrom escuro (`oklch(0.28 0.03 40)`)
  - muted-foreground: cinza chumbo (`oklch(0.45 0.015 40)`)
- Fontes carregadas via `<link>` em `__root.tsx`:
  - Títulos: **Cormorant Garamond** (serifada elegante)
  - Corpo: **Inter** (sans-serif moderna)
- Cards: bordas arredondadas (radius ~1rem), sombras suaves.

### Estrutura de rotas
```
src/routes/
  __root.tsx        (header + footer compartilhados, fontes, meta base)
  index.tsx         (Home — substitui placeholder)
  servicos.tsx      (Serviços & Tratamentos)
  sobre.tsx         (Sobre & Contato)
```

Cada rota define seu próprio `head()` com título/description/og únicos.

WhatsApp link: `https://wa.me/5546991188015?text=Olá%20Carleane...`

### Componentes reutilizáveis (src/components/)
- `SiteHeader.tsx` — logo + nav (Home / Serviços / Sobre) + CTA "Agendar Sessão"
- `SiteFooter.tsx` — marca, links, contatos, redes, copyright
- `BenefitCard.tsx` — card com ícone Lucide + título + texto
- `ServiceCard.tsx` — card de serviço com ícone, título, descrição
- `WhatsAppButton.tsx` — botão CTA reutilizável

Header/Footer renderizados em `__root.tsx` em torno do `<Outlet />`.

### Página 1 — Home (`/`)
1. Hero: título serifado "O Poder do Toque que Transforma", subtítulo, CTA WhatsApp, imagem lateral (spa/massagem).
2. Grid de 4 benefícios (ícones Lucide: Sparkles, HeartPulse, Activity, Leaf).
3. Banner motivacional em tom rosé/verde com frase destacada em serifa.

### Página 2 — Serviços (`/servicos`)
- Cabeçalho "Nossos Serviços".
- Grid responsivo (3 col desktop, 1 col mobile) com 6 cards: Massagem Relaxante, Drenagem Linfática, Pedras Quentes, Ventosaterapia, Dry Needling, Kinesio.
- Seção destaque "Combo Queridinho" (card grande com fundo em accent) + botão WhatsApp.

### Página 3 — Sobre & Contato (`/sobre`)
- Bloco Sobre: título "Conheça Carleane Pantoja (Cacau)", bio, foto/ilustração.
- Bloco Agendamento: frase destacada, lista de contatos (WhatsApp, Instagram, endereço Fisiocenter — Boa Vista/RR), CTA "FALAR NO WHATSAPP E AGENDAR".

### Assets
Gerar 3 imagens (fast tier, JPG) em `src/assets/`:
- `hero-massage.jpg` — cena de massagem relaxante
- `banner-stones.jpg` — pedras quentes / velas
- `about-carleane.jpg` — ambiente de spa acolhedor (retrato ilustrativo neutro; sem inventar rosto real)

### SEO
- Cada rota: `title`, `description`, `og:title`, `og:description`, `og:type=website`, `twitter:card`.
- Single H1 por página, HTML semântico, alt text nas imagens.

### Fora de escopo
- Sem backend / Lovable Cloud (site institucional estático).
- Sem formulário de contato — conversão via WhatsApp direto.
- Sem dark mode dedicado (paleta clara premium).
