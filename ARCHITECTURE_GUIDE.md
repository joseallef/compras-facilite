# 🏗️ Guia de Arquitetura - Compras Facilite

Este documento descreve a arquitetura profissional adotada no projeto, baseada em **Feature-Based Design** e **Shared Kernel**.

## 🎯 Objetivo da Estrutura

A estrutura foi desenhada para ser escalável, clara e de fácil manutenção, seguindo as melhores práticas de produtos SaaS modernos.

---

## 📁 Estrutura de Pastas

```
src/
│
├── app/                # Next.js App Router (Apenas rotas e layouts)
│   ├── (public)/       # Rotas acessíveis sem login (login, register)
│   ├── (protected)/    # Rotas que exigem autenticação (dashboard, shopping)
│   ├── api/            # API Route Handlers
│   └── layout.tsx      # Root Layout
│
├── features/           # Módulos organizados por domínio (Feature-First)
│   ├── auth/           # Gestão de identidade e acesso
│   ├── dashboard/      # Painel financeiro e indicadores
│   ├── transactions/   # Movimentações financeiras (receitas/despesas)
│   ├── cards/          # Gestão de cartões de crédito
│   ├── goals/          # Metas e objetivos financeiros
│   └── shopping/       # Listas de mercado inteligentes
│
├── shared/             # Código reutilizável entre múltiplas features
│   ├── ui/             # Design System / Componentes base (button, modal)
│   ├── layout/         # Componentes de estrutura (header, footer, nav)
│   ├── providers/      # Context Providers (Auth, Theme)
│   ├── hooks/          # Hooks utilitários globais
│   ├── utils/          # Funções auxiliares (format, validation)
│   ├── constants/      # Valores estáticos e configurações
│   └── types/          # Interfaces TypeScript globais
│
├── core/               # Infraestrutura e configurações base
│   ├── db/             # Prisma client e migrações
│   ├── auth/           # Configurações do Auth.js (NextAuth)
│   └── security/       # Middlewares, rate limit e segurança
│
├── middleware.ts       # Middleware central do Next.js
└── tests/              # Suíte de testes (unit, integration, e2e)
```

---

## 📦 Anatomia de uma Feature

Cada pasta em `src/features/` deve conter tudo o que é necessário para aquele domínio funcionar de forma independente:

```
features/feature-name/
├── components/         # Componentes de UI específicos do domínio
├── actions/            # Server Actions (Escrita no banco)
├── queries/            # Consultas Prisma (Leitura de dados)
├── services/           # Regras de negócio complexas
├── hooks/              # Lógica de estado do domínio
├── schemas/            # Validações Zod
└── types/              # Tipagens exclusivas da feature
```

---

## 📏 Regras de Padronização

1.  **Nomenclatura de Arquivos**: Sempre use `kebab-case.ts`.
2.  **Componentes**: PascalCase para o nome da função/classe, mas o arquivo permanece kebab-case.
3.  **Imports**: Utilize os aliases configurados para evitar caminhos relativos longos:
    *   `@/app/*`
    *   `@/features/*`
    *   `@/shared/*`
    *   `@/core/*`
4.  **Shared UI**: Componentes em `shared/ui` devem ser "burros" (sem regra de negócio).

---

## 🔐 Camada de Autenticação

A lógica de autenticação está centralizada em `src/core/auth/` e exposta através do hook `@/features/auth/hooks/use-auth`. NUNCA utilize as funções do NextAuth diretamente nos componentes de UI fora do módulo de autenticação.

## 💾 Banco de Dados

O acesso ao banco de dados é feito exclusivamente via Prisma, com o cliente instanciado em `src/core/db/prisma.ts`. Prefira sempre o uso de Server Actions para mutações e Queries separadas para leituras.
