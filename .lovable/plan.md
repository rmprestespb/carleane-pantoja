# Dividir "Sobre & Contato" em "Sobre mim" e "Contato"

## O que será feito

- Separar a seção atual de Sobre & Contato em duas páginas distintas:
  - **Sobre mim** (`/sobre`): nova biografia com o texto enviado.
  - **Contato** (`/contato`): dados de contato, WhatsApp, Instagram e endereço.
- Atualizar o menu do site (header desktop/mobile) e o rodapé para exibir os dois links separados.
- Manter a identidade visual, imagens e SEO de cada rota.

## Mudanças por arquivo

1. `src/routes/sobre.tsx`
   - Atualizar o título para "Sobre mim — Carleane Pantoja Massoterapeuta".
   - Substituir o texto da seção "Sobre mim" pelo novo fornecido.
   - Remover a seção de agendamento/contato (ela vai para a nova rota).
   - Manter a imagem `about-spa.jpg` e o layout com gradiente de fundo.
   - Atualizar meta tags e canonical para `/sobre`.

2. `src/routes/contato.tsx` (novo)
   - Criar rota `/contato`.
   - Título: "Contato — Carleane Pantoja Massoterapeuta".
   - Exibir os cards de WhatsApp, Instagram e endereço, reutilizando as constantes de `src/lib/site.ts`.
   - Incluir CTA principal "Agendar via WhatsApp".
   - Reutilizar o estilo visual da seção de contato atual (rounded cards, gradientes, sombras).
   - Adicionar meta tags e canonical para `/contato`.

3. `src/components/SiteHeader.tsx`
   - Substituir o item `{ to: "/sobre", label: "Sobre & Contato" }` por:
     - `{ to: "/sobre", label: "Sobre mim" }`
     - `{ to: "/contato", label: "Contato" }`
   - Garantir que o menu mobile também exiba os dois itens.

4. `src/components/SiteFooter.tsx`
   - Dividir o link "Sobre & Contato" em "Sobre mim" (`/sobre`) e "Contato" (`/contato`).
   - Manter a coluna de Contato com WhatsApp, Instagram e endereço.

5. Roteamento
   - A nova rota `src/routes/contato.tsx` será reconhecida automaticamente pelo TanStack Router; `src/routeTree.gen.ts` será regenerado no build.

## Texto que será aplicado em `/sobre`

Título: **Carleane Pantoja | Massoterapeuta**

> Sou Carleane Pantoja, boa-vistense e massoterapeuta, apaixonada pelo cuidado com o corpo, pela saúde e pelo bem-estar das pessoas.
>
> Atuo com foco em regeneração e recuperação muscular, utilizando técnicas de massoterapia que auxiliam no relaxamento, na redução de tensões e desconfortos musculares, na recuperação do corpo e na promoção de uma melhor qualidade de vida.
>
> Acredito que cada pessoa possui necessidades únicas. Por isso, meu trabalho é realizado de forma acolhedora, humanizada e personalizada, buscando compreender o momento e as necessidades de cada cliente para proporcionar uma experiência de cuidado completa.
>
> Mais do que aliviar tensões e promover relaxamento, meu propósito é proporcionar momentos de equilíbrio, leveza e conexão com o próprio corpo.
>
> Cada atendimento é uma oportunidade de cuidar, acolher e contribuir para que você se sinta melhor — física e emocionalmente.
>
> Cuidar do corpo é também cuidar de si.

## Resultado esperado

- Menu principal: Início | Preços | Agendar | Sobre mim | Contato
- Rodapé com links separados para Sobre mim e Contato
- `/sobre` com a nova biografia e imagem de destaque
- `/contato` com os canais de contato e botão de agendamento
- SEO único e canonical correto para cada rota
