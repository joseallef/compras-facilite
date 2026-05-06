# 🛠️ CLAUDE.md - Guia de Desenvolvimento

Este guia contém comandos e padrões essenciais para o desenvolvimento no projeto **Compras Facilite**.

## 🚀 Comandos Principais

### Desenvolvimento
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run start`: Inicia o servidor de produção após o build.
- `npm run lint`: Executa a verificação do ESLint.

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
  - Componentes: `PascalCase` (ex: `Button.tsx`)
  - Hooks: `camelCase` com prefixo `use` (ex: `useAuth.ts`)
  - Funções/Variáveis: `camelCase`
  - Arquivos de Página: `page.tsx` (convenção do Next.js)

### Estrutura de Componentes
Sempre utilize a estrutura de pastas definida no [Guia de Arquitetura](./ARCHITECTURE_GUIDE.md).
- Componentes globais: `src/components/ui/`
- Componentes de página: `src/app/(pagina)/components/`

### Importações
Utilize o alias `@/` para referenciar a pasta `src`:
```tsx
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
```

### Autenticação
- Nunca utilize `signIn` ou `signOut` do `next-auth/react` diretamente nos componentes.
- Use sempre o hook customizado `useAuth` de `@/hooks/useAuth`.

---

## 🛡️ Regras de Segurança
- **Segredos**: Nunca commite arquivos `.env`.
- **Senhas**: Utilize o `PASSWORD_PEPPER` configurado no servidor para hash de senhas.
- **CSRF**: O Auth.js já lida com proteção CSRF por padrão.

---
*Este documento é uma referência rápida. Para detalhes estruturais, consulte o [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md).*
