# Auditoria de estilo — TelaResumo

**Autora:** Maria Gabriela Damásio Bezerra
**Data:** 09/10/2026

## 1. Problemas encontrados

| #  | Onde (linha/trecho)                                                          | O que está errado                                                                                                                                                   | Consequência concreta                                                                                                                                                          | Correção                                                                                                                                                                                                   |
| -- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | `function TelaResumo(props: any): JSX.Element`                               | O uso de `any` elimina a verificação de tipos das propriedades, e a anotação de retorno `JSX.Element` é desnecessária neste caso.                                   | Erros como acessar `props.totla` em vez de `props.total` não são identificados como acesso a uma propriedade inexistente.                                                      | Criar um tipo `TelaResumoProps` com `total`, `nome` e `detalhe` tipados e permitir que o TypeScript infira o retorno da função.                                                                            |
| 2  | `ScrollView` com `style={{ padding: 20, alignItems: 'center' }}`             | Os estilos do contêiner rolável estão misturados aos estilos do conteúdo interno.                                                                                   | O `alignItems` aplicado ao `ScrollView` não controla o alinhamento dos filhos como esperado, podendo deixar o conteúdo desalinhado.                                            | Utilizar `contentContainerStyle` para definir o padding e o alinhamento dos elementos internos.                                                                                                            |
| 3  | Cabeçalho e textos com `fontSize` e `color` inline                           | Os estilos são definidos diretamente no JSX e repetidos em diferentes componentes.                                                                                  | Uma alteração de tipografia ou cor exige localizar várias ocorrências e pode deixar textos equivalentes com aparências diferentes.                                             | Centralizar valores reutilizáveis em `theme.ts` e criar estilos específicos para cada componente com `StyleSheet.create`.                                                                                  |
| 4  | Texto de detalhe com `fontSize: 14` e `fontSize: 16`                         | A propriedade `fontSize` está duplicada no mesmo objeto de estilo.                                                                                                  | O TypeScript pode sinalizar a duplicidade como erro, dependendo da configuração; em JavaScript, a última declaração prevalece.                                                 | Manter apenas um valor de `fontSize`, preferencialmente referenciado por um token tipográfico.                                                                                                             |
| 5  | `<Button style={globalStyles.button} />`                                     | O `Button` nativo do React Native não oferece uma propriedade `style` para personalização geral da aparência.                                                       | O código pode apresentar erro de TypeScript, e o estilo personalizado não é aplicado como esperado.                                                                            | Utilizar as propriedades suportadas pelo `Button` ou, se a atividade permitir, criar um botão personalizado com um componente apropriado.                                                                  |
| 6  | `globalStyles.container` aplicado a dois `View` diferentes                   | Um único estilo global combina `flex: 1` e `padding: 20` para contêineres com funções diferentes.                                                                   | Uma alteração feita para uma seção pode modificar o dimensionamento de outra. Além disso, `flex: 1` em um contêiner dentro do `ScrollView` pode produzir um layout inadequado. | Separar os estilos por responsabilidade e manter no tema somente os valores visuais compartilhados. Definir `flex` de acordo com a função de cada contêiner.                                               |
| 7  | Cores `'#333'`, `'#666'`, `'#000'` e `'blue'` espalhadas pelo código         | Os valores de cores não estão organizados em uma fonte centralizada.                                                                                                | A alteração da paleta exige editar diferentes trechos e pode gerar inconsistências visuais.                                                                                    | Criar tokens semânticos, como `cores.texto`, `cores.textoSecundario`, `cores.primaria` e `cores.sombra`.                                                                                                   |
| 8  | `padding: 20`, `marginBottom: 10`, `marginBottom: 8` e `borderRadius: 5`     | Espaçamentos e raios de borda são definidos diretamente nos estilos. O uso de `marginBottom` para espaçar elementos irmãos também contraria a convenção da prática. | A padronização exige procurar valores espalhados, e o uso de margens individuais dificulta a manutenção consistente do espaçamento entre elementos.                            | Criar tokens de espaçamento e bordas em `theme.ts`. Para espaçar elementos irmãos, utilizar `gap` no contêiner pai em vez de `margin`.                                                                     |
| 9  | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` e `elevation` | A sombra é definida por várias propriedades específicas de plataforma, sem uma estratégia de estilo consistente.                                                    | A aparência pode variar entre iOS e Android, e a manutenção exige revisar várias propriedades relacionadas à mesma decisão visual.                                             | Utilizar `boxShadow`, conforme a convenção da prática, centralizando seu valor no tema quando necessário. Validar a compatibilidade com a versão do React Native e as plataformas utilizadas pelo projeto. |
| 10 | `globalStyles.text` e `globalStyles.button`                                  | Existem estilos globais que não são utilizados corretamente ou não aparecem em uso no trecho apresentado.                                                           | Definições sem benefício comprovado aumentam a quantidade de código que precisa ser revisada e mantida.                                                                        | Verificar as referências no projeto antes de remover os estilos e excluir somente aqueles que realmente não são utilizados.                                                                                |

## 2. O problema arquitetural

O principal problema arquitetural é o **acoplamento entre estilos de layout, componentes e decisões visuais em um único arquivo global**.

O arquivo `globalStyles.ts` mistura valores que poderiam ser compartilhados, como cores e espaçamentos, com regras específicas de componentes, como `flex: 1`, `alignItems` e a composição visual de um botão.

Além disso, diferentes contêineres utilizam o mesmo estilo `globalStyles.container`, mesmo tendo responsabilidades distintas. Dessa forma, uma mudança necessária para um componente pode afetar outro que utiliza a mesma definição.

Esse problema não é resolvido apenas alterando uma propriedade, pois a própria estrutura incentiva o compartilhamento de regras que nem sempre deveriam ser compartilhadas.

A solução é separar as responsabilidades:

* **`theme.ts`:** concentra valores visuais reutilizáveis, como cores, espaçamentos, tipografia, bordas e, quando necessário, valores de sombra.
* **Estilos locais:** definem o layout e a composição de cada componente, utilizando os tokens do tema.
* **Componentes reutilizáveis:** compartilham regras quando possuem a mesma responsabilidade visual, sem depender de estilos globais excessivamente genéricos.

Essa organização reduz o acoplamento, facilita mudanças futuras e diminui o risco de efeitos colaterais em outras telas.

## 3. `globalStyles.ts` reescrito como `theme.ts`

```ts
// theme.ts

export const cores = {
  texto: '#333333',
  textoSecundario: '#666666',
  primaria: 'blue',
  sombra: '#000000',
} as const;

export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const tipografia = {
  legenda: 14,
  corpo: 16,
  titulo: 18,
} as const;

export const bordas = {
  raioPequeno: 5,
} as const;
```

### O que foi removido do `globalStyles.ts` e por quê?

* **`container`:** removido como estilo global pronto porque `flex: 1` e o layout dependem da função e do contexto de cada contêiner. O padding pode ser reutilizado por meio dos tokens de espaçamento.
* **`text`:** removido como estilo pronto de componente. Seus valores de tipografia e cor foram representados por tokens, que podem ser combinados de acordo com a finalidade de cada texto.
* **`button`:** removido porque reúne regras de layout e aparência de um componente específico. A cor, o espaçamento e o raio de borda podem ser tokens, mas o alinhamento e a composição do botão devem permanecer no estilo do componente.
* **`StyleSheet.create`:** removido do tema porque ele deve fornecer valores reutilizáveis, e não estilos completos de layout. O `StyleSheet.create` continua sendo utilizado nos componentes.
* **Propriedades da sombra:** não foram transformadas em um estilo completo dentro do tema. A sombra pode ser definida nos estilos locais com `boxShadow`, utilizando valores centralizados quando houver necessidade real de compartilhamento.

Os tokens de espaçamento foram organizados em uma escala consistente de 4, 8, 12, 16 e 20 unidades. Essa escala padroniza os valores existentes e facilita a escolha de espaçamentos intermediários sem espalhar números arbitrários pelo código.

Os tokens mantêm as cores e os valores tipográficos identificados no código original, mas organizam os espaçamentos em uma escala padronizada. A paleta definitiva ainda deve ser validada com o padrão visual do produto.

## 4. Ordem de refatoração — tenho meio dia

| Ordem | O que faço                                                                                                                                   | Risco se não fizer                                                                                                   | Retorno                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1     | Corrigir os problemas de compilação: propriedade duplicada, `style` inválido no `Button` e tipagem de `props`.                               | A aplicação pode não compilar corretamente ou continuar permitindo erros de propriedades.                            | **Alto:** desbloqueia a validação do código e reduz erros básicos.                               |
| 2     | Corrigir o layout do `ScrollView`, revisar o dimensionamento dos contêineres e substituir espaçamentos individuais por `gap` onde aplicável. | O conteúdo pode ficar desalinhado ou apresentar dimensionamento inadequado em diferentes tamanhos de tela.           | **Alto:** melhora diretamente o comportamento e a previsibilidade da interface.                  |
| 3     | Criar o `theme.ts` e substituir cores, espaçamentos, tipografia e bordas repetidos por tokens.                                               | A duplicação continuará dificultando mudanças visuais e aumentando o risco de inconsistências.                       | **Alto:** centraliza decisões visuais e facilita a manutenção.                                   |
| 4     | Substituir a implementação da sombra por `boxShadow` e validar sua aparência nas plataformas e versões suportadas.                           | A interface pode apresentar diferenças visuais ou utilizar uma implementação incompatível com o ambiente do projeto. | **Médio:** melhora a consistência visual depois de controlar os riscos mais críticos.            |
| 5     | Revisar estilos sem uso e separar as regras globais dos estilos locais.                                                                      | Definições desnecessárias e regras genéricas continuarão aumentando a complexidade da manutenção.                    | **Médio:** reduz o acoplamento e facilita futuras refatorações sem exigir um redesenho completo. |

A prioridade considera primeiro os problemas que podem bloquear a compilação, depois os que afetam o comportamento da interface e, em seguida, as melhorias que reduzem o custo de manutenção. A revisão estética mais ampla fica para depois porque tem menor retorno imediato do que corrigir erros funcionais e organizar os estilos.

## 5. O que eu decidi NÃO corrigir

Decidi não alterar a identidade visual nem redesenhar a paleta de cores nesta etapa.

Apesar de haver cores definidas diretamente no código, a auditoria não apresenta o guia visual do produto nem critérios aprovados de design e acessibilidade. Alterar a paleta sem essas informações poderia gerar retrabalho e mudanças visuais não solicitadas.

Por isso, manteria inicialmente os valores de cores existentes, centralizando-os no `theme.ts`. Uma revisão de contraste, acessibilidade e identidade visual poderia ser realizada posteriormente, com os critérios de design definidos.
