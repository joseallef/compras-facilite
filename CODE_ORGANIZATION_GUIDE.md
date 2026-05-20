# Guia de Organização do Código - ComprasFácil

## Estrutura Padrão para Componentes e Arquivos

Todo componente React ou arquivo com lógica deve seguir a seguinte ordem de organização:

1. **STATES**
   - useState
   - useReducer
   - Qualquer hook de estado

2. **VARIÁVEIS**
   - Variáveis derivadas do estado
   - Constantes locais
   - Dados processados

3. **FUNÇÕES**
   - Funções de manipulação de eventos (handle*)
   - Funções utilitárias locais
   - Qualquer função que não seja um effect

4. **EFFECTS**
   - useEffect
   - useLayoutEffect
   - Qualquer hook de efeito

5. **RETURN (JSX)**
   - O retorno do componente com JSX

## Exemplo Prático (como no add-item-form.tsx)

```tsx
export function MeuComponente() {
  const [nome, setNome] = useState("");
  const [count, setCount] = useState(0);

  const saudacao = `Olá, ${nome}!`;
  const dobro = count * 2;

  const handleIncrement = () => {
    setCount(c => c + 1);
  };

  useEffect(() => {
    console.log("Contador alterado:", count);
  }, [count]);

  return (
    <div>
      <h1>{saudacao}</h1>
      <button onClick={handleIncrement}>Incrementar {count}</button>
    </div>
  );
}
```

## Regras Importantes

1. **NÃO USE os comentários de seção no código real**: Os comentários (// 1. STATES, etc.) são apenas para referência na documentação, NÃO devem ser adicionados aos arquivos do projeto
2. **Ordem dos imports**: Coloque os imports no topo, antes do componente/função principal.
3. **Ordem dos hooks**: Os hooks de estado (useState, useReducer) vêm antes dos hooks de efeito (useEffect, useLayoutEffect).
4. **🔴 Valide imports**: Sempre que concluir uma implementação ou alteração, VALIDE TODOS OS IMPORTS dos arquivos que foram modificados.

## Por Que Esta Estrutura?

- **Legibilidade**: Qualquer desenvolvedor que abrir o arquivo saberá exatamente onde encontrar cada tipo de código.
- **Manutenibilidade**: Facilita a localização de bugs e a adição de novas funcionalidades.
- **Consistência**: Todo o projeto segue a mesma estrutura, independentemente do arquivo.
