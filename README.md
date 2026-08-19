# RecipeApp Web

Frontend do RecipeApp: aplicação Next.js para gerenciar receitas, com autenticação (e-mail/senha + Google), edição/criação de receitas com imagens, e um chat com IA especializado em cada receita.

Consome a [RecipeApp API](../recipe-api) através de um padrão **BFF (Backend for Frontend)**, sem expor tokens ao cliente.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **pnpm** como gerenciador de pacotes
- **Tailwind CSS v4** + **shadcn/ui** (Radix + Base UI por baixo)
- **React Hook Form** + **Zod** para formulários e validação
- **react-markdown** para renderizar as respostas do chat
- **next-cloudinary** para exibição de imagens
- **@react-oauth/google** para login social
- Deploy: **Vercel**

## Arquitetura

### Padrão BFF (Backend for Frontend)

O frontend nunca fala diretamente com a API .NET a partir do browser. Todo o tráfego passa pelas **Route Handlers** do Next.js (`src/app/api/**`), que atuam como um proxy autenticado:

```
Browser  →  Next.js Route Handlers (BFF)  →  RecipeApp API (.NET)
             (src/app/api/**)
```

Por quê: o **access token JWT** e o **refresh token** ficam guardados em um cookie `HttpOnly` no lado do servidor Next.js (`src/lib/session.ts`), nunca acessíveis via JavaScript no browser. Isso reduz a superfície de ataque para XSS — mesmo que um script malicioso rode na página, não consegue ler os tokens.

Fluxo de uma requisição autenticada:

1. Uma Server Component ou Server Action chama `apiFetch()` (`src/lib/api/server.ts`)
2. `apiFetch` lê o cookie de sessão, extrai o `accessToken` e injeta o header `Authorization: Bearer`
3. A chamada vai direto para a API .NET (`process.env.API_URL`)

### Refresh automático de token

O arquivo `src/proxy.ts` roda como middleware em toda navegação (exceto rotas de auth e assets estáticos). Ele:

1. Decodifica o `accessToken` do cookie e checa o `exp`
2. Se estiver a menos de 1 minuto de expirar, chama `/api/auth/refresh` na API .NET
3. Atualiza o cookie de sessão com o novo par de tokens
4. Se o refresh falhar, redireciona para `/login`

### Estrutura de pastas

```
src/
├── app/
│   ├── (app)/              # Rotas autenticadas: home, perfil, receitas (view/edit/new)
│   ├── (auth)/              # Rotas públicas: login, registro, reset de senha
│   └── api/                 # BFF — Route Handlers que fazem proxy para a API .NET
│       ├── auth/             # login, register, google, logout, forgot/reset-password
│       ├── recipes/          # CRUD de receitas + mensagens do chat
│       └── users/
├── components/
│   ├── auth/                # Componentes de autenticação
│   ├── chat/                # Chat da receita (bubble, panel, drawer mobile)
│   ├── recipes/              # Form, card, grid, inputs dinâmicos de receita
│   └── ui/                   # Componentes shadcn/ui (button, dialog, form, etc.)
├── lib/
│   ├── api/                  # Clients de API: server.ts (BFF→API) e chamadas por recurso
│   ├── validations/           # Schemas Zod por formulário
│   ├── session.ts             # Leitura/escrita do cookie de sessão HttpOnly
│   └── utils.ts
└── proxy.ts                  # Middleware de refresh automático de token
```

Os grupos de rota `(app)` e `(auth)` isolam layout e proteção de acesso: `(app)` assume usuário autenticado, `(auth)` é o fluxo público de entrada.

## Rodando localmente

### Pré-requisitos

- Node.js (versão compatível com Next.js 16)
- **pnpm** (`packageManager: pnpm@11.5.3` no `package.json`)
- A [API](../recipe-api) rodando localmente ou uma URL de API acessível

### Setup

```bash
pnpm install
pnpm dev
```

Aplicação disponível em `http://localhost:3000`.

### Variáveis de ambiente

Criar um `.env.local` na raiz com:

```bash
API_URL=http://localhost:5000        # URL da RecipeApp API
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...      # Client ID do Google OAuth (mesmo usado na API)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=... # Cloud name do Cloudinary, para exibição de imagens
```

> `API_URL` é usada apenas server-side (Route Handlers e Server Components) — nunca é exposta ao browser, reforçando o padrão BFF.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Sobe o servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Sobe o build de produção |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:check` | Prettier |

## Deploy

Aplicação publicada na **Vercel**, configurada para chamar a API hospedada no Render via `API_URL`. Um header `Cross-Origin-Opener-Policy: same-origin-allow-popups` é aplicado globalmente (`next.config.ts`) para permitir o popup de login do Google funcionar corretamente.

## TODO

Roadmap do projeto (compartilhado com o backend):

- [ ] 2FA
- [ ] Busca de receitas
- [ ] Compartilhar receita via PDF
- [ ] Compartilhar receita via app
- [ ] Chat geral (não vinculado a uma receita específica)
- [ ] **RAG** — busca semântica sobre as receitas
- [ ] **MCP** — servidor MCP expondo:
  - [ ] tool para criar receita
  - [ ] tool para buscar receita por ingrediente

## Decisões de arquitetura

- **BFF em vez de chamada direta à API**: mantém tokens fora do alcance do JavaScript do cliente (cookie HttpOnly) e evita expor a URL/estrutura da API .NET diretamente ao browser.
- **Refresh de token via middleware** (`proxy.ts`) em vez de lógica no client: centraliza a renovação em um único ponto, sem precisar de interceptors espalhados pelas chamadas do frontend.
- **App Router + Server Components** para os dados que não mudam a cada interação, com Route Handlers isolando toda a lógica de rede sensível (tokens, headers de auth).
- **shadcn/ui**: componentes copiados para o repo (não uma dependência de UI fechada), permitindo customização total mantendo acessibilidade via Radix/Base UI.
