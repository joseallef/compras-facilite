# Relatório de Segurança (Revisão Defensiva)

Este relatório consolida uma análise defensiva do código-fonte e dependências, com foco em identificar riscos reais e reduzir a superfície de ataque.

## Escopo

- Autenticação e sessão (Auth.js/NextAuth)
- Fluxo de recuperação e redefinição de senha
- Server Actions e acesso a dados (Prisma)
- Controles de acesso por recurso (ownership)
- Endurecimento do app (headers, políticas)
- Dependências (npm audit)

---

## Status dos Principais Achados (Atualizado)

### ✅ 1) Controle de acesso em Server Actions de listas (IDOR/BOLA) — CONCLUÍDO

**Status**: ✅ Implementado
- Todas as Server Actions em `src/features/mercado/services/market-lists-service.ts` usam `requireValidSession()` para derivar `userId`
- Todas as queries aplicam filtro de `userId` para verificar ownership
- Exemplos:
  - `getShoppingLists()`: `where: { userId }`
  - `deleteShoppingList()`: `deleteMany({ where: { id: listId, userId } })`
  - Operações com `ShoppingItem`: Verifica vínculo com lista do usuário (`shoppingList: { userId }`)

---

### ✅ 2) Rate Limit / Anti-Abuso — CONCLUÍDO

**Status**: ✅ Implementado
- Módulo de rate limit implementado em `src/core/security/rate-limit.ts`
- Usa tabela `RateLimit` no banco
- Funções disponíveis: `getClientIp()` e `consumeRateLimit()`
- Já aplicado em:
  - Criação de listas (`createShoppingList`, `duplicateShoppingList`, `createShoppingListFromTemplate`)

---

### 🔒 3) Sessão e Autenticação — IMPLEMENTADO

**Status**: ✅ Implementado
- Autenticação via Auth.js (NextAuth) v5
- Senhas com bcrypt + pepper (`PASSWORD_PEPPER` e `PASSWORD_PEPPER_PREVIOUS` para rotação)
- Normalização de e-mail (trim + lowercase)
- `requireValidSession()` para proteger Server Actions
- Sleep artificial para evitar enumeração de usuários

---

## Principais Riscos Restantes

### ✅ 1) Reset de senha (hash + envio server-side) — CONCLUÍDO

**Status**: ✅ Implementado em `src/features/auth/services/auth-server-service.ts`
- Token persistido como hash SHA-256; comparação por hash (com fallback legado para tokens antigos em texto)
- E-mail enviado no servidor via API EmailJS (`fetch` server-side)
- Token bruto nunca retornado ao client
- Rate limit por IP e e-mail em `createPasswordResetTokenAction` / `resetPasswordAction`

---

### 2) Médio — Regras críticas validadas apenas no client

**Risco**
- Regras de senha/e-mail/nome podem ser contornadas por chamadas diretas às actions.

**Recomendação**
- Validar no servidor: normalização (trim/lowercase), limites de tamanho, política mínima de senha.
- Padronizar mensagens e evitar diferenciação excessiva em erros sensíveis.

---

### 3) Médio — `trustHost: true` exige cuidado de deploy

**Risco**
- Em ambientes com proxy mal configurado, pode confiar em headers/host incorretos, afetando URLs/callbacks.

**Recomendação**
- Garantir `X-Forwarded-*` corretos no deploy e restringir domínios/hosts.
- Considerar condicionar essa opção por ambiente.

---

### 4) Baixo/Médio — Hardening de headers ausente

**Risco**
- Aumenta impacto de falhas futuras (ex.: XSS) e reduz proteção do navegador.

**Recomendação**
- Adicionar headers de segurança no framework (CSP adequada ao app, HSTS em prod, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`).

---

## Dependências (npm audit)

Resumo do `npm audit --audit-level=moderate`:
- 7 vulnerabilidades moderadas reportadas (inclui `postcss`, `uuid`, e cadeia envolvendo `prisma`/`@prisma/dev` e `@hono/node-server`).
- Correção automática sugerida pelo npm envolve mudanças breaking em versões principais.

Recomendação:
- Tratar como backlog de atualização controlada (planejar upgrade de dependências com testes).
- Evitar aplicar `--force` sem um ciclo de validação (build, testes, smoke).

---

## Próximas ações recomendadas (ordem)

1. ~~Reestruturar reset de senha (hash do token + envio server-side).~~ ✅
2. ~~Aplicar rate limit em login/registro/recuperação de senha.~~ ✅ (login em `auth.ts`; demais em `auth-server-service.ts`)
3. Endurecer validações no servidor.
4. Adicionar headers de segurança.
5. Planejar atualização de dependências (audit).
