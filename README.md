# RecipeApp Web

Frontend do RecipeApp: aplicação Next.js para gerenciar receitas, com autenticação (e-mail/senha + Google), edição/criação de receitas com imagens, chat com IA especializado em cada receita, e um **assistente agentic geral** que responde perguntas sobre toda a coleção de receitas do usuário.

Consome a [RecipeApp API](https://github.com/murilo-souza/recipe-api) através de um padrão **BFF (Backend for Frontend)**, sem expor tokens ao cliente.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **pnpm** como gerenciador de pacotes
- **Tailwind CSS v4** + **shadcn/ui** (Radix + Base UI por baixo)
- **React Hook Form** + **Zod** para formulários e validação
- **react-markdown** para renderizar as respostas do chat
- **next-cloudinary** para upload e exibição de imagens
- **@react-oauth/google** para login social
- Deploy: **Vercel**

## Arquitetura

### Padrão BFF (Backend for Frontend)

O frontend nunca fala diretamente com a API .NET a partir do browser. Todo o tráfego passa pelas **Route Handlers** do Next.js (`src/app/api/**`), que atuam como um proxy autenticado:

```
Browser  →  Next.js Route Handlers (BFF)  →  RecipeApp API (.NET)  →  RecipeApp MCP Server
             (src/app/api/**)                                          (apenas via chat geral)
```

Por quê: o **access token JWT** e o **refresh token** ficam guardados em um cookie `HttpOnly` no lado do servidor Next.js (`src/lib/session.ts`), nunca acessíveis via JavaScript no browser. Isso reduz a superfície de ataque para XSS — mesmo que um script malicioso rode na página, não consegue ler os tokens.

Fluxo de uma requisição autenticada:

1. Uma Server Component ou Route Handler chama `apiFetch()` (`src/lib/api/server.ts`)
2. `apiFetch` lê o cookie de sessão, extrai o `accessToken` e injeta o header `Authorization: Bearer`
3. A chamada vai direto para a API .NET (`process.env.API_URL`)

### Refresh automático de token

O arquivo `src/proxy.ts` roda em toda navegação (exceto rotas de auth e assets estáticos). Ele:

1. Decodifica o `accessToken` do cookie e checa o `exp`
2. Se estiver a menos de 1 minuto de expirar, chama `/api/auth/refresh` na API .NET
3. Atualiza o cookie de sessão com o novo par de tokens
4. Se o refresh falhar, redireciona para `/login`

### Dois chats, duas arquiteturas diferentes

O projeto tem dois tipos de chat, propositalmente implementados de forma diferente:

- **Chat por receita** (`/recipes/[id]`) — contexto fixo: a receita atual é injetada diretamente no prompt enviado à API. Simples e previsível, porque o escopo da pergunta já é conhecido.
- **Chat geral** (`/chat`) — sem escopo fixo. Cada mensagem é processada pela API como um agente: o Gemini decide se responde direto ou se precisa consultar as receitas do usuário via um servidor MCP (busca semântica ou filtro exato), podendo encadear múltiplas consultas antes de responder. Ver detalhes da arquitetura agentic no [README da API](https://github.com/murilo-souza/recipe-api/blob/main/README.md).

### Estrutura de pastas

```
src/
├── app/
│   ├── (app)/                # Rotas autenticadas: home, perfil, receitas (view/edit/new), chat geral
│   ├── (auth)/                # Rotas públicas: login, registro, reset de senha
│   └── api/                   # BFF — Route Handlers que fazem proxy para a API .NET
│       ├── auth/                # login, register, google, logout, forgot/reset-password
│       ├── recipes/             # CRUD de receitas + mensagens do chat por receita
│       ├── chat/general/        # chat geral (agentic)
│       └── users/
├── components/
│   ├── auth/                  # Componentes de autenticação
│   ├── chat/                  # Chat por receita e chat geral (bubble, panel)
│   ├── recipes/                # Form, card, grid, inputs dinâmicos de receita
│   └── ui/                     # Componentes shadcn/ui (button, dialog, form, etc.)
├── lib/
│   ├── api/                    # Clients de API: server.ts (BFF→API) e chamadas por recurso
│   ├── validations/             # Schemas Zod por formulário
│   ├── session.ts               # Leitura/escrita do cookie de sessão HttpOnly
│   └── utils.ts
└── proxy.ts                    # Middleware de refresh automático de token
```

Os grupos de rota `(app)` e `(auth)` isolam layout e proteção de acesso: `(app)` assume usuário autenticado, `(auth)` é o fluxo público de entrada.

## Rodando localmente

### Pré-requisitos

- Node.js (versão compatível com Next.js 16)
- **pnpm** (`packageManager: pnpm@11.5.3` no `package.json`)
- A [API](https://github.com/murilo-souza/recipe-api) e o MCP Server rodando localmente (o MCP Server só é necessário para o chat geral funcionar)

### Setup

```bash
pnpm install
pnpm dev
```

Aplicação disponível em `http://localhost:3000`.

### Variáveis de ambiente

Criar um `.env.local` na raiz com:

```bash
API_URL=http://localhost:5000          # URL da RecipeApp API
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...        # Client ID do Google OAuth (mesmo usado na API)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...   # Cloud name do Cloudinary
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=... # Upload preset unsigned do Cloudinary
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

## Decisões de arquitetura

- **BFF em vez de chamada direta à API**: mantém tokens fora do alcance do JavaScript do cliente (cookie HttpOnly) e evita expor a URL/estrutura da API .NET diretamente ao browser.
- **Refresh de token via middleware** (`proxy.ts`) em vez de lógica no client: centraliza a renovação em um único ponto, sem precisar de interceptors espalhados pelas chamadas do frontend.
- **App Router + Server Components** para os dados que não mudam a cada interação, com Route Handlers isolando toda a lógica de rede sensível (tokens, headers de auth).
- **Chat por receita e chat geral com implementações deliberadamente diferentes**: injeção direta de contexto é suficiente (e mais barata) quando o escopo já é conhecido; o padrão agentic só se justifica quando a pergunta pode abranger toda a coleção de receitas.
- **shadcn/ui**: componentes copiados para o repo (não uma dependência de UI fechada), permitindo customização total mantendo acessibilidade via Radix/Base UI.
