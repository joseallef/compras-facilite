# Compras Facilite

Gerencie suas listas de mercado inteligentes, controle seus gastos e acompanhe seu dinheiro em um só lugar.

## 🚀 Características Principais

- 📝 Listas de mercado inteligentes com categorização automática
- � Controle financeiro completo
- � Dashboard visual e intuitivo
- � Autenticação segura
- � Design moderno e responsivo

## �️ Tech Stack

- **Framework**: Next.js 15 (App Router)
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

2. Configure as variáveis de ambiente no arquivo `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/compras-facilite"
AUTH_SECRET="seu-secret-aqui"
```

3. Inicie o servidor:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/              # Rotas da aplicação (App Router)
├── features/         # Módulos por domínio (auth, mercado, transactions, etc.)
├── shared/           # Código reutilizável (UI, layout, utils)
└── core/             # Infraestrutura (auth, db, security)
```

## � Documentação Adicional

- [Guia de Arquitetura](./ARCHITECTURE_GUIDE.md)
- [Relatório de Auditoria de Segurança](./SECURITY_AUDIT.md)
- [Checklist de Segurança](./SECURITY_CHECKLIST.md)
- [Análise do Projeto](./PROJECT_ANALYSIS.md)
