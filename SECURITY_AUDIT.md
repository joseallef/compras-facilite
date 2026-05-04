# Relatório de Segurança (Revisão Defensiva)

Este relatório consolida uma análise defensiva do código-fonte e dependências, com foco em identificar riscos reais e reduzir a superfície de ataque. A revisão foi baseada em leitura de código e checagem de dependências, sem instruções de exploração.

## Escopo

- Autenticação e sessão (Auth.js/NextAuth)
- Fluxo de recuperação e redefinição de senha
- Server Actions e acesso a dados (Prisma)
- Controles de acesso por recurso (ownership)
- Endurecimento do app (headers, políticas)
- Dependências (npm audit)

## Principais Achados (prioridade)

### 1) Crítico — Controle de acesso ausente em Server Actions de listas (IDOR/BOLA)

**Risco**
- Operações que atualizam/deletam listas/itens dependem de IDs passados como parâmetro e não comprovam a sessão do usuário nem a posse do recurso.
- Isso abre a possibilidade de acesso indevido a dados e alterações em recursos de terceiros (BOLA/IDOR) caso IDs sejam obtidos por qualquer meio (logs, UI, histórico, compartilhamento, etc.).

**Evidência**
- Server actions em [shopping-lists.service.ts](file:///c:/Users/josea/Documents/trae_projects/compras-facilite/src/services/shopping-lists.service.ts) recebem `userId`, `listId`, `itemId` e operam diretamente no banco sem checar ownership.

**Recomendação**
- Em cada action:
  - Derivar `userId` exclusivamente da sessão server-side (`auth()`), nunca aceitar `userId` vindo do cliente.
  - Para operações por `listId/itemId`, aplicar filtros por `userId` em todas as queries (ex.: `where: { id: listId, userId: session.user.id }`).
  - Para `itemId`, validar vínculo com lista do usuário (join/relacionamento) antes de atualizar/deletar.
  - Retornar erro consistente (ex.: “não encontrado”/“não autorizado”) sem vazar detalhes.

**Validação defensiva sugerida**
- Adicionar testes de regressão para garantir que um usuário não consegue alterar/deletar recursos de outro usuário, mesmo com IDs válidos.

---

### 2) Alto — Token de reset de senha em texto puro e fluxo exposto ao cliente

**Risco**
- O token é armazenado em claro no banco e é retornado ao client, que então monta o link e envia o e-mail via EmailJS no browser.
- Em caso de vazamento de banco/logs/telemetria, o token pode ser reutilizado até expirar.

**Evidência**
- Emissão e persistência do token em claro: [auth-server.service.ts](file:///c:/Users/josea/Documents/trae_projects/compras-facilite/src/services/auth-server.service.ts)
- Envio de e-mail pelo client e token em URL: [auth.service.ts](file:///c:/Users/josea/Documents/trae_projects/compras-facilite/src/services/auth.service.ts)
- Modelagem com `token @unique`: [schema.prisma](file:///c:/Users/josea/Documents/trae_projects/compras-facilite/prisma/schema.prisma)

**Recomendação**
- Persistir apenas o hash do token (ex.: SHA-256) e comparar por hash.
- Não retornar token para o client; enviar o e-mail no servidor (credenciais server-side).
- Manter expiração curta (ok) e invalidar tokens antigos (já existe `deleteMany`, manter).

---

### 3) Alto — Ausência de rate limit / anti-abuso (login, registro, recuperação)

**Risco**
- Facilita brute force, credential stuffing e spam de recuperação.

**Evidência**
- Não há mecanismo de rate limit detectado no `src/`.

**Recomendação**
- Rate limit por IP + por identificador (e-mail), com janela e cooldown.
- Opcional: desafio (CAPTCHA/Turnstile) em “forgot password”/“register”.
- Complementar com controles no edge/CDN/WAF.

---

### 4) Médio — Regras críticas validadas apenas no client

**Risco**
- Regras de senha/e-mail/nome podem ser contornadas por chamadas diretas às actions.

**Evidência**
- Actions aceitam strings sem política formal de validação: [auth-server.service.ts](file:///c:/Users/josea/Documents/trae_projects/compras-facilite/src/services/auth-server.service.ts)

**Recomendação**
- Validar no servidor: normalização (trim/lowercase), limites de tamanho, política mínima de senha.
- Padronizar mensagens e evitar diferenciação excessiva em erros sensíveis.

---

### 5) Médio — `trustHost: true` exige cuidado de deploy

**Risco**
- Em ambientes com proxy mal configurado, pode confiar em headers/host incorretos, afetando URLs/callbacks.

**Evidência**
- Configuração em [auth.config.ts](file:///c:/Users/josea/Documents/trae_projects/compras-facilite/src/auth.config.ts)

**Recomendação**
- Garantir `X-Forwarded-*` corretos no deploy e restringir domínios/hosts.
- Considerar condicionar essa opção por ambiente.

---

### 6) Médio (operacional) — Seed pode criar credenciais previsíveis

**Risco**
- Se executado em ambiente indevido, pode criar conta conhecida.

**Evidência**
- [seed-data.ts](file:///c:/Users/josea/Documents/trae_projects/compras-facilite/src/lib/seed-data.ts)

**Recomendação**
- Bloquear seed fora de dev ou exigir flag explícita.

---

### 7) Baixo/Médio — Hardening de headers ausente

**Risco**
- Aumenta impacto de falhas futuras (ex.: XSS) e reduz proteção do navegador.

**Evidência**
- Não foi encontrada configuração de CSP/HSTS/Referrer-Policy/Permissions-Policy no projeto.

**Recomendação**
- Adicionar headers de segurança no framework (CSP adequada ao app, HSTS em prod, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`).

## Dependências (npm audit)

Resumo do `npm audit --audit-level=moderate`:
- 7 vulnerabilidades moderadas reportadas (inclui `postcss`, `uuid`, e cadeia envolvendo `prisma`/`@prisma/dev` e `@hono/node-server`).
- Correção automática sugerida pelo npm envolve mudanças breaking em versões principais.

Recomendação:
- Tratar como backlog de atualização controlada (planejar upgrade de dependências com testes).
- Evitar aplicar `--force` sem um ciclo de validação (build, testes, smoke).

## Próximas ações recomendadas (ordem)

1. Corrigir controle de acesso nas Server Actions (ownership + sessão server-side).
2. Reestruturar reset de senha (hash do token + envio server-side).
3. Implementar rate limit e anti-abuso.
4. Endurecer validações no servidor.
5. Adicionar headers de segurança.
6. Planejar atualização de dependências (audit).

