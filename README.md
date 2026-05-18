# Compras Facilite

Gerencie suas listas de mercado inteligentes, controle receitas, despesas e investimentos em um só lugar.

## 🚀 Características Principais

- 📝 Listas de mercado inteligentes com categorização
- 💰 Controle financeiro completo (receitas, despesas, investimentos)
- 📊 Dashboard visual e intuitivo com gráficos
- 📅 Contas fixas/recorrentes
- 🔐 Autenticação segura
- 📱 Design moderno e responsivo

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **ORM**: Prisma
- **Autenticação**: Auth.js (NextAuth) v5
- **Banco de Dados**: PostgreSQL
- **Testes**: Jest + React Testing Library

## 🏁 Iniciando o Projeto

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env.local`
   - Preencha as variáveis de ambiente

3. Execute as migrações do banco de dados:
```bash
npx prisma migrate deploy
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📦 Deploy

### Vercel (Recomendado)

O projeto já está configurado para deploy no Vercel com o script `vercel-build`!

1. Conecte seu repositório ao Vercel
2. Adicione as variáveis de ambiente no painel do Vercel:
   - `DATABASE_URL` (URL do PostgreSQL)
   - `NEXTAUTH_URL` (URL do seu app)
   - `NEXTAUTH_SECRET` (gerada com `openssl rand -hex 32`)
3. Faça o deploy!

### Outros Providers

1. Build da aplicação:
```bash
npm run build
```

2. Execute as migrações:
```bash
npm run prisma:migrate:deploy
```

3. Inicie o servidor:
```bash
npm start
```

## Scripts Úteis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm start`: Inicia o servidor de produção
- `npm run lint`: Executa o ESLint
- `npm test`: Executa os testes
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate:deploy`: Executa as migrações em produção

## 📁 Estrutura do Projeto

```
src/
├── app/              # Rotas da aplicação (App Router)
├── features/         # Módulos por domínio (auth, mercado, transactions, etc.)
├── shared/           # Código reutilizável (UI, layout, utils)
└── core/             # Infraestrutura (auth, db, security)
```

## 📚 Documentação Adicional

- [Guia de Arquitetura](./ARCHITECTURE_GUIDE.md)
- [Relatório de Auditoria de Segurança](./SECURITY_AUDIT.md)
- [Checklist de Segurança](./SECURITY_CHECKLIST.md)
- [Análise do Projeto](./PROJECT_ANALYSIS.md)
- [Guia LGPD](./LGPD_IMPLEMENTATION_GUIDE.md)
