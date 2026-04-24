# 🏗️ ARCHITECTURE_GUIDE.md

## 🎯 Objetivo do Projeto

Criar um sistema web para gerenciamento de compras de mercado mensal, permitindo:

* Listas pré-montadas
* Criação e edição de listas
* Marcação de itens durante a compra
* Controle de quantidades

O sistema deve ser:

* Performático
* Escalável
* De fácil manutenção
* Com código limpo e organizado
* Com interface moderna e intuitiva

---

## 📁 Estrutura de Pastas

```
src/
│
├── components/         # Componentes reutilizáveis globais (genéricos)
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # Configuração NextAuth
│   │
│   ├── login/
│   │   ├── page.tsx
│   │   ├── types.ts
│   │   ├── components/ (componentes específicos da página)
│   │
│   ├── (protected)/
│   │   ├── layout.tsx  # Proteção de rotas (client-side)
│   │   ├── listas/
│   │       ├── page.tsx
│   │       ├── [id]/
│   │           ├── page.tsx
│   │
│   ├── layout.tsx      # Root layout (SessionProvider)
│   ├── page.tsx        # Landing page
│
├── hooks/              # Hooks globais (REGRA: todos hooks devem ficar aqui)
├── services/           # Regras de negócio globais / Abstração de API / Auth Service
├── contexts/           # React Contexts
├── utils/              # Funções utilitárias
├── types/              # Tipagens globais (entities, auth types)
├── styles/             # Estilos globais
```

---

## 🔐 Camada de Autenticação (NextAuth.js)

### ✅ Regras Obrigatórias

* **Tecnologia**: Utilizar **NextAuth.js (Auth.js)** para toda a gestão de sessão e autenticação.
* **Configuração**: Centralizada em `src/app/api/auth/[...nextauth]/route.ts`.
* **Login**: Implementado em `src/app/login/`, com formulário de email/senha e feedback de erro.
* **Persistência**: NextAuth gerencia automaticamente via Cookies seguros.
* **Hook Global `useAuth`**: Localizado em `src/hooks/useAuth.ts`, abstrai o `useSession` do NextAuth e expõe:
  * `user`: dados do usuário logado.
  * `isAuthenticated`: booleano de estado.
  * `isLoading`: estado de carregamento da sessão.
  * `login()`: função que chama o service de login.
  * `logout()`: função que chama o service de logout.
* **Auth Service**: Localizado em `src/services/auth.service.ts`, abstrai as funções `signIn` e `signOut` do NextAuth.
  * **⚠️ Regra de Ouro**: A UI/Componentes **NUNCA** devem chamar `signIn` ou `signOut` diretamente. Devem usar o `useAuth` ou o `auth.service`.
* **Proteção de Rotas**:
  * **Middleware**: Implementar `src/middleware.ts` para proteção em nível de servidor.
  * **Layout Protegido**: O `layout.tsx` dentro de `(protected)` reforça a verificação e garante acesso apenas a usuários autenticados.

---

## 🧩 Regras de Componentização

### ✅ `components/` (global)

* Apenas componentes **genéricos e reutilizáveis**.
* Ex: Button, Input, Modal, Card (genérico).

### ❌ PROIBIDO:

* Componentes específicos de páginas dentro da pasta global `components/`.

---

## 📦 Componentes por página

Cada página deve conter seus próprios componentes internos:

```
ListaCompras/
├── page.tsx
├── types.ts
├── components/
│   ├── ItemLista.tsx
│   ├── TabelaCompras.tsx
```

---

## 🪝 Hooks (REGRA IMPORTANTE)

Todos os hooks devem ficar **EXCLUSIVAMENTE** na pasta global:

```
hooks/
├── useListaCompras.ts
├── useAuth.ts
```

### ❌ PROIBIDO:

* Criar hooks dentro de pastas de páginas ou componentes.

---

## 📄 Estrutura padrão de `page.tsx`

A ordem dentro dos arquivos deve ser **SEMPRE**:

```tsx
export default function Page() {
  // 1. STATES
  const [items, setItems] = useState([])

  // 2. VARIÁVEIS
  const totalItems = items.length

  // 3. FUNÇÕES
  function handleAddItem() {}

  // 4. EFFECTS
  useEffect(() => {
    // lógica
  }, [])

  // 5. RETURN (JSX)
  return (
    <div>{/* UI */}</div>
  )
}
```

---

## 🧠 Boas Práticas e Padrões de Código

### 🐞 Bugs e Lógica
* **Debounce em Inputs**: Para atualizações automáticas em inputs de texto (ex: nome da lista), utilize `use-debounce` para evitar múltiplas chamadas de API desnecessárias.
* **Tratamento de Erros**: Sempre adicione `console.error("[NomeDaFuncao]", error)` dentro dos blocos `catch` para facilitar o rastreamento de bugs em produção, além do feedback visual ao usuário via `toast`.

### ✨ Desenvolvimento e Organização
* **Tipagem Forte**: O uso de `any` é proibido. Utilize sempre as interfaces e tipos definidos em `src/types`.
* **Hooks Customizados**: Extraia a lógica complexa de UI e cálculos de progresso para hooks específicos (ex: `useListDetail`). Isso mantém o componente de página limpo e focado em renderização.
* **Código Limpo**: Remova estados (`useState`) e variáveis declaradas que não estão sendo utilizadas para evitar confusão na manutenção.

### ⚡ Performance
* **Memoização**: Utilize `useMemo` para cálculos que dependem de arrays de objetos (ex: progresso da lista, contagem de itens marcados). Isso evita re-renderizações pesadas.

### 🛡️ Segurança e UX
* **Validação de Parâmetros**: Valide sempre o tipo e a existência de parâmetros de URL (`params.id`) antes de utilizá-los na lógica do componente.
* **Feedback de Operação**: Desabilite botões de envio (`disabled={isSubmitting}`) e mostre estados de carregamento durante operações assíncronas para evitar submissões duplicadas.

---

## 🏛️ Arquitetura (Clean Architecture Adaptada)

| Camada   | Responsabilidade                |
| -------- | ------------------------------- |
| UI       | Renderização (pages/components) |
| Hooks    | Estado e lógica reutilizável    |
| Services | Regras de negócio / API / Auth  |
| Utils    | Funções auxiliares              |

---

## ❗ Regras para IA / Builder

* Seguir **100%** esse documento.
* Priorizar organização ao invés de velocidade.
* Nunca quebrar a hierarquia de pastas definida.
