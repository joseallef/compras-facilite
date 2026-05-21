<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:code-organization-rules -->
# Organização do Código

Todo componente React ou arquivo com lógica DEVE seguir a seguinte ordem de organização (leia o arquivo CODE_ORGANIZATION_GUIDE.md para mais detalhes):

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

## Regras Importantes
- **NÃO USE os comentários de seção no código real**: Os comentários (// 1. STATES, etc.) são apenas para referência na documentação, NÃO devem ser adicionados aos arquivos do projeto
- Coloque os imports no topo, antes do componente/função principal
- **IMPORTANTE**: Sempre que concluir uma implementação ou alteração, VALIDE TODOS OS IMPORTS dos arquivos que foram modificados
<!-- END:code-organization-rules -->
