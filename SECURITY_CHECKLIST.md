# Checklist de Hardening (Defensivo)

Use esta lista para acompanhar melhorias de segurança sem depender de “testes de exploração”. O objetivo é reduzir risco, aumentar resiliência e evitar regressões.

## Acesso e Autorização (BOLA/IDOR)

- Garantir que toda operação em lista/item valida ownership no servidor.
- Não aceitar `userId` vindo do client; derivar da sessão.
- Preferir queries com filtro de `userId` no `where` (e validar vínculo `item -> list -> user`).
- Padronizar resposta para recursos não pertencentes (evitar “vazamento” por diferença de erro).

## Recuperação de Senha

- Armazenar apenas hash do token (comparar por hash).
- Não expor token ao client (não retornar token em action).
- Enviar e-mail pelo servidor (evitar chaves e envio no browser).
- Invalidar tokens anteriores e aplicar expiração curta.

## Proteções Anti-Abuso

- Rate limit por IP e por e-mail em:
  - login
  - registro
  - recuperação de senha
- Aplicar cooldown incremental em tentativas repetidas.
- Considerar CAPTCHA/Turnstile em endpoints suscetíveis a spam.

## Validação Server-Side

- Normalizar entradas (`trim`, lower-case de e-mail).
- Limitar tamanho máximo de campos (nome, email, senha).
- Validar política mínima de senha e bloquear senhas muito curtas.
- Manter mensagens amigáveis, mas evitar respostas que permitam enumeração de usuários.

## Sessão, Cookies e Auth

- Garantir secret forte e estável em produção.
- Revisar configuração de host/proxy (`trustHost`) no ambiente.
- Manter rotas sensíveis protegidas por sessão no servidor quando possível.

## Headers e Navegador

- Definir CSP adequada ao app.
- HSTS em produção.
- `frame-ancestors`/anti-clickjacking conforme necessidade.
- `Referrer-Policy` e `Permissions-Policy`.

## Observabilidade e Logs

- Evitar logar dados sensíveis (tokens, e-mails completos em flows críticos, IDs correlacionáveis).
- Preferir logs com correlação e mensagens genéricas para falhas esperadas.

## Dependências e Supply Chain

- Revisar `npm audit` periodicamente.
- Planejar upgrades com testes (evitar `--force` sem validação).
- Fixar versões e revisar advisories críticos.

