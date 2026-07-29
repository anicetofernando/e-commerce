# Albimaq Peças

E-commerce de peças para máquinas de construção e equipamento pesado (escavadoras,
retroescavadoras, pás carregadoras, etc.), para a empresa Albimaq (Moçambique).

Stack: **Next.js 16** (App Router, React 19) + **TypeScript** + **Tailwind CSS v4** +
**PostgreSQL** via **Prisma 7**. Todos os dados de produtos, marcas e encomendas são
fictícios, gerados por `prisma/seed.ts`, prontos a ser substituídos por dados reais.

## Arranque rápido

```bash
npm install       # instala dependências e gera o Prisma Client
npm run db:push   # aplica o schema à base de dados
npm run db:seed   # popula com dados fictícios (catálogo, marcas, utilizadores)
npm run dev       # arranca a base de dados local + Next.js em http://localhost:3000
```

Utilizadores de teste criados pelo seed:

| Papel    | Email                  | Password       |
| -------- | ---------------------- | -------------- |
| Cliente  | `cliente@demo.com`     | `Albimaq@2026` |
| Admin    | `admin@albimaq.co.mz`  | `Admin@2026`   |

## Base de dados

Em desenvolvimento, `npm run dev` arranca automaticamente um **PostgreSQL local
embutido** (via [PGlite](https://pglite.dev/) exposto por um socket TCP em
`scripts/pg-server.mjs`, na porta `55432`) — não é preciso instalar Postgres nem
Docker para experimentar o projeto. Os dados ficam guardados em `.pgdata/`
(ignorado pelo git).

Para produção, basta apontar `DATABASE_URL` (em `.env`) para qualquer Postgres real
(Neon, Supabase, RDS, um servidor próprio, etc.) — o schema Prisma é Postgres puro,
sem nada específico do PGlite.

> **Nota**: para parar `npm run dev`, use sempre `Ctrl+C` no terminal (permite à base
> de dados local gravar os dados de forma limpa). Se a base de dados local for
> terminada de forma abrupta (ex: fim de tarefa forçado, queda de energia) pode ficar
> corrompida e o arranque seguinte falhar com um erro do WASM. Como são sempre dados
> fictícios, a solução é apagar a pasta `.pgdata/` e correr novamente
> `npm run db:push && npm run db:seed`.

Comandos úteis:

```bash
npm run db:server   # só a base de dados local (sem o Next.js)
npm run db:push     # sincroniza o schema Prisma com a base de dados (sem migrations)
npm run db:migrate  # cria/aplica uma migration versionada
npm run db:seed     # volta a popular com os dados fictícios
npm run db:studio   # abre o Prisma Studio para inspecionar os dados
```

## Estrutura

```
prisma/schema.prisma      Modelo de dados (produtos, categorias, marcas/modelos de
                           máquina, compatibilidade, utilizadores, encomendas...)
prisma/seed.ts             Dados fictícios: categorias, marcas, ~50 peças, blog
scripts/pg-server.mjs      Servidor Postgres local (dev) via PGlite
scripts/generate-illustrations.mjs  Gera os SVGs de categorias/hero em public/images

src/lib/                   db.ts (Prisma Client), auth.ts + session.ts (sessão via
                           cookie assinado, sem dependências externas), data.ts
                           (queries), validation.ts (Zod), cart-store.ts (Zustand)
src/actions/                Server Actions: auth, conta, checkout, contacto,
                           avaliações, favoritos
src/components/            UI, layout (header/footer/carrinho), home, catálogo,
                           produto, checkout, conta
src/app/                   Rotas (App Router), em português: /loja, /produto/[slug],
                           /marcas, /carrinho, /checkout, /conta, /entrar, etc.
```

## Notas de arquitetura

- **Autenticação**: sessão própria (cookie HttpOnly assinado com `jose`, palavras-passe
  com `bcryptjs`), seguindo o padrão recomendado na documentação do Next.js — sem
  NextAuth/Auth.js para evitar fricção de compatibilidade com o Next 16 recém-lançado.
- **Carrinho**: guardado no browser (`zustand` + `localStorage`), permitindo checkout
  sem conta. A validação de preços/stock é sempre refeita no servidor no momento da
  encomenda (`src/actions/checkout.ts`).
- **Imagens de categorias/produtos**: SVGs gerados localmente
  (`scripts/generate-illustrations.mjs`) — fácil de substituir por fotografia real
  dos produtos quando existir (ver secção seguinte).
- **Fotos do carrossel do hero** (`public/images/hero-photos/`): fotografias reais
  (motor, cilindro hidráulico, disco de travão, trem de rolamento), obtidas no
  [Pexels](https://www.pexels.com/license/) — uso comercial livre, sem necessidade de
  atribuição. Substituir por fotografia própria da Albimaq assim que disponível
  (mesmo caminho de ficheiro, proporção ~4:3).
- **Renderização**: as páginas com dados (loja, produto, conta, checkout...) são
  dinâmicas (`force-dynamic` ou uso de `cookies()`), para refletirem sempre stock e
  preços atuais.

## Substituir pelos dados reais da Albimaq

1. Atualizar `src/lib/constants.ts` (`CONTACT_INFO`) com morada, telefones e email reais.
2. Substituir o conteúdo de `prisma/seed.ts` por um import/CSV dos produtos reais, ou
   ligar a um ERP/sistema de stock existente.
3. Substituir as ilustrações de categoria por fotografia real dos produtos (mantendo
   a mesma proporção quadrada usada em `ProductCard`/`ProductGallery`).
4. Configurar um `DATABASE_URL` de produção e correr `npm run db:migrate` /
   `prisma migrate deploy`.
