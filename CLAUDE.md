# 🛠️ CLAUDE.md - Guia de Desenvolvimento

Este guia contém comandos e padrões essenciais para o desenvolvimento no projeto **Compras Facilite**.

## 🚀 Comandos Principais

### Desenvolvimento
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run start`: Inicia o servidor de produção após o build.
- `npm run lint`: Executa a verificação do ESLint.
- `npx tsc --noEmit`: Verifica erros de tipagem.

### Banco de Dados (Prisma)
- `npx prisma generate`: Gera o cliente Prisma.
- `npx prisma migrate dev`: Cria e aplica migrações em desenvolvimento.
- `npx prisma studio`: Abre a interface visual para explorar o banco de dados.
- `npx prisma db seed`: Popula o banco com dados iniciais (se configurado).

### Testes
- `npm test`: Executa todos os testes com Jest.
- `npm run test:watch`: Executa testes em modo watch.

---

## 🎨 Padrões de Código

### Estilo e Tipagem
- **TypeScript**: Obrigatório em todos os arquivos. Evite o uso de `any`.
- **Naming**:
  - Componentes: `PascalCase`
  - Arquivos de componentes: `kebab-case.tsx` (ex: `market-list-card.tsx`)
  - Hooks: `camelCase` com prefixo `use` (ex: `use-market-lists.ts`)
  - Funções/Variáveis: `camelCase`
  - Arquivos de Página: `page.tsx` (convenção do Next.js)

### Estrutura de Componentes
Sempre utilize a estrutura de pastas definida no [Guia de Arquitetura](./ARCHITECTURE_GUIDE.md).
- Componentes globais (UI): `src/shared/ui/`
- Componentes de feature: `src/features/[feature]/components/`
- Layout global: `src/shared/layout/`
- Tipos globais: `src/shared/types/`

### Importações
Utilize o alias `@/` para referenciar a pasta `src`:
```tsx
import { Button } from "@/shared/ui/button";
import { MarketItem, MarketList } from "@/shared/types";
import { useMarketLists } from "@/features/mercado/hooks/use-market-lists";
```

Ordem de importações:
1. Bibliotecas externas
2. Imports de `@/features/`
3. Imports de `@/shared/`
4. Imports de `@/core/`
5. Imports relativos

### Nomenclatura Importante
- "Shopping" foi renomeado para "Market" ou "Mercado" no código:
  - `ShoppingList` → `MarketList`
  - `ShoppingItem` → `MarketItem`
  - `ShoppingListTemplate` → `MarketListTemplate`
  - Apenas as tabelas do banco permanecem com nomes antigos (conforme decisão)

### Autenticação
- Use sempre o hook customizado `useAuth` de `@/features/auth/hooks/use-auth`.
- Rotas autenticadas estão em `app/(protected)/`.

---

## 🛡️ Regras de Segurança
- **Segredos**: Nunca commite arquivos `.env`.
- **Senhas**: Utilize o `PASSWORD_PEPPER` configurado no servidor para hash de senhas.
- **CSRF**: O Auth.js já lida com proteção CSRF por padrão.
- **Autorização**: Sempre verifique a propriedade do recurso nas Server Actions!
- Valide dados **no servidor** sempre!

---
*Este documento é uma referência rápida. Para detalhes estruturais, consulte o [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md).*
