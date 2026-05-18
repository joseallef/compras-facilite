# Guia de Arquitetura

## Estrutura Geral

Este projeto segue uma arquitetura **Feature-First (Feature-Based Design)** + **Shared Kernel**.

### Regras de Organização

- Cada feature tem seu próprio diretório com:
  - `components/`: Componentes específicos da feature
  - `hooks/`: Hooks customizados da feature
  - `services/`: Server Actions e integrações externas
  - `actions/`: (opcional) Server Actions separados
  - `types/`: (opcional) Tipos específicos da feature
  - `constants/`: (opcional) Constantes específicas da feature

- Código compartilhado fica no diretório `shared/`
- Infraestrutura (db, auth, configs) fica em `core/`

## Estrutura de Diretórios Detalhada

```
src/
├── app/                          # Rotas (App Router)
│   ├── (protected)/              # Rotas autenticadas
│   │   ├── mercado/              # Listas de mercado (renomeado de shopping)
│   │   ├── dashboard/            # Dashboard principal
│   │   └── financas/             # Transações financeiras
│   ├── (public)/                 # Rotas públicas (login, register, etc.)
│   └── api/                      # API Routes (rotas de autenticação, etc.)
│
├── features/                     # Módulos por domínio
│   ├── auth/                     # Autenticação e gestão de usuários
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   └── ...
│   │
│   ├── mercado/                  # Listas de mercado
│   │   ├── components/
│   │   │   ├── market-list-card.tsx
│   │   │   ├── market-item-row.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── use-market-lists.ts
│   │   │   └── use-list-detail.ts
│   │   ├── services/
│   │   │   └── market-lists-service.ts
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── transactions/             # Transações financeiras
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   │
│   └── dashboard/                # Dashboard
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── ...
│
├── shared/                       # Código reutilizável
│   ├── ui/                       # Design System (Button, Input, Dialog, Skeleton, etc.)
│   ├── layout/                   # Header, Footer, NavBar, MobileNav
│   ├── providers/                # Providers (AuthProvider, ThemeProvider, etc.)
│   ├── types/                    # Tipos globais (Category, MarketList, MarketItem, etc.)
│   ├── constants/                # Constantes globais (templates de listas, categorias)
│   └── utils/                    # Funções utilitárias (cn, currency formatters, etc.)
│
└── core/                         # Infraestrutura
    ├── auth/                     # Configuração do Auth.js
    ├── db/                       # Cliente Prisma
    └── security/                 # Rate limit e configurações de segurança
```

## Convenções

### Nomenclatura de Arquivos
- Arquivos de componentes: `kebab-case.tsx`
- Hooks customizados: `use-something.ts`
- Arquivos de tipos: `types/index.ts` ou `types.ts`
- Arquivos de services/actions: `name-service.ts` ou `name-actions.ts`

### Importações
- Importações absolutas usando o alias `@/`
- Ordem de importação:
  1. Bibliotecas externas
  2. Imports de `@/features/`
  3. Imports de `@/shared/`
  4. Imports de `@/core/`
  5. Imports relativos

### Server Components vs Client Components
- Por padrão, tudo é Server Component
- Use `"use client"` apenas quando precisar de hooks de estado (`useState`, `useEffect`, etc.) ou interações do usuário

### Server Actions
- Coloque Server Actions em `features/[feature]/services/` ou `features/[feature]/actions/`
- Sempre valide inputs no servidor
- Sempre use revalidation adequada

## Design System

Todos os componentes de UI base devem ficar em `shared/ui/` e devem ser:
- Reutilizáveis
- Sem lógica de negócio
- Customizáveis via props

## Segurança

Verifique sempre:
- Rotas autenticadas em `app/(protected)/`
- Autorização nas Server Actions (verifique a propriedade do recurso!)
- Validação de dados no servidor
- Não exponha secrets no cliente
