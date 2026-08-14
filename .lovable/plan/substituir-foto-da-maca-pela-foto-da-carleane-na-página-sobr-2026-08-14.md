# Substituir foto da maca pela foto da Carleane na página Sobre mim

## O que será feito

Substituir a imagem atual (`about-spa.jpg`) da página **Sobre mim** (`/sobre`) pela foto enviada, aplicando ajustes sutis de cores, luz e contraste para deixá-la mais profissional e harmoniosa com o site. A foto continuará na mesma posição e formato retrato da imagem atual.

## Mudanças por arquivo

1. **Imagem do upload**
   - Aplicar edição leve na foto enviada (`image-3.png`): ajustar iluminação, cores, contraste e realce para harmonizar com a paleta creme/rosa/verde do site.
   - Fazer upload da imagem editada para o Lovable Assets (CDN), gerando um ponteiro `.asset.json` em `src/assets/`.

2. **`src/routes/sobre.tsx`**
   - Substituir o import de `about-spa.jpg` pelo novo ponteiro de asset (ex: `about-carleane.png.asset.json`).
   - Atualizar o `alt` da imagem para descrever a Carleane Pantoja.
   - Manter as dimensões (`width={1200} height={1400}`), o efeito de gradiente/blur e o posicionamento lateral.

3. **Limpeza de assets antigos**
   - Remover o arquivo `src/assets/about-spa.jpg` (ou `about-spa.jpg.asset.json`) se não for mais usado em outro lugar.

4. **SEO/Head**
   - Ajustar o `og:image` da rota `/sobre` para usar a URL absoluta da nova imagem do CDN (conforme regra de head metadata).

## Resultado esperado

- A página `/sobre` exibe a foto da Carleane no lugar da foto da maca.
- A imagem está com cores/luz aprimoradas e posicionada no mesmo lado da página.
- Menu, rodapé e texto permanecem inalterados.
- Build e preview atualizados sem erros.
