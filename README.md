# 🛒 Compras Facilite

**Sua Lista de Mercado Inteligente** - Organize suas compras, controle gastos e economize tempo com uma interface moderna e intuitiva.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-000?style=flat-square&logo=next.js)](https://authjs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Funcionalidades

- 📝 **Gestão de Listas**: Crie, edite e organize múltiplas listas de compras.
- 💡 **Listas Inteligentes**: Use templates pré-definidos para agilizar seu dia a dia.
- 💰 **Controle de Gastos**: Acompanhe o valor total e o progresso da lista em tempo real.
- 📱 **Mobile First**: Interface otimizada para uso no supermercado diretamente do celular.
- 🔒 **Segurança**: Autenticação robusta com Auth.js e criptografia de senhas.
- 📊 **Dashboard**: Visualize estatísticas sobre suas compras e economias.

---

## 🚀 Tecnologias

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
- **Autenticação**: [Auth.js v5 (NextAuth)](https://authjs.dev/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Testes**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)

---

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 20+
- PostgreSQL (Local ou Cloud como Supabase/Neon)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/compras-facilite.git
   cd compras-facilite
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/compras_facilite"
   NEXTAUTH_SECRET="seu_secret_aqui"
   PASSWORD_PEPPER="uma_string_aleatoria_longa"
   ```

4. **Prepare o banco de dados**
   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

---

## 📖 Documentação Adicional

- [🏗️ Guia de Arquitetura](./ARCHITECTURE_GUIDE.md) - Padrões de código e estrutura de pastas.
- [🛠️ Guia do Desenvolvedor (CLAUDE.md)](./CLAUDE.md) - Comandos úteis e fluxos de trabalho.

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido com ❤️ por [José Allef](https://github.com/joseallef)
