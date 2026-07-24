

## Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS + Framer Motion
- PostgreSQL + Prisma
- TMDb API (dados dos filmes)

## 1. Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente (ou um banco gerenciado, ex. Neon/Supabase)
- Uma chave gratuita da API do TMDb: crie uma conta em
  https://www.themoviedb.org/, vá em **Configurações → API** e gere uma
  "API Key (v3 auth)"

## 2. Instalação

```bash
npm install
```

## 3. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

```env
TMDB_API_KEY=sua_chave_aqui
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cinerank"
```

Se preferir testar rápido sem instalar Postgres, você pode trocar o
`provider` em `prisma/schema.prisma` de `postgresql` para `sqlite` e usar
`DATABASE_URL="file:./dev.db"` — funciona igual para desenvolvimento local.

## 4. Banco de dados

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Isso cria as tabelas `Movie`, `Rating`, `MovieList` e `ListItem`.

## 5. Rodando o projeto

```bash
npm run dev
```

Acesse http://localhost:3000

## Como funciona (resumo)

- **Busca (`/api/search`)** — consulta a TMDb em tempo real conforme você
  digita na barra do header (com debounce de 350ms).
- **Página do filme (`/filme/[tmdbId]`)** — ao abrir, o servidor verifica se
  o filme já existe no banco. Se não existir, busca os detalhes na TMDb
  (sinopse, elenco, diretor, trailer etc.) e cria o registro automaticamente.
  Você nunca cadastra um filme manualmente.
- **Avaliação (`/api/ratings`)** — cada nota (0–10, com decimais) fica
  vinculada ao filme. A média e o ranking são recalculados a partir das
  notas atuais sempre que a página é carregada — não existe um número de
  ranking "salvo" que possa ficar desatualizado.
- **Listas (`/api/lists`)** — listas pessoais (Favoritos, Quero Assistir
  etc.), com filmes adicionados/removidos pela página do filme.
- **Perfil (`/api/profile`)** — estatísticas agregadas: quantidade de
  filmes avaliados, nota média dada, filme favorito e avaliações recentes.

## Estrutura

```
src/
  app/
    page.tsx              → Home (banner, recentes, ranking)
    filme/[id]/page.tsx    → Página do filme + avaliação
    listas/                → Listas pessoais
    perfil/page.tsx        → Perfil e estatísticas
    api/                    → Rotas da API (search, movies, ratings, lists, ranking, profile)
  components/               → Componentes de UI reutilizáveis
  lib/
    prisma.ts               → Cliente Prisma
    tmdb.ts                 → Toda a integração com a API do TMDb
    utils.ts                → Helpers (formatação de nota, média, medalhas)
  types/                     → Tipos compartilhados
prisma/schema.prisma         → Modelo do banco de dados
```



## Próximos passos sugeridos (não incluídos, mas fáceis de adicionar)

- Infinite scroll na lista de "adicionados recentemente"
- Cache de respostas da TMDb em uma tabela própria para reduzir chamadas
- Autenticação, caso queira multiusuário no futuro
