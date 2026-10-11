# Auditoria de lista — TelaPets

**Autora:** Maria Gabriela Damásio Bezerra

**Data:** 09/10/2026

## 1. Problemas encontrados

| #  | Trecho                                             | Problema                                                                                                | Sintoma para o usuário                                                                                                                              | Correção                                                                                                                                                                      |
| -- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | `ScrollView` envolvendo a `FlatList`               | Aninhamento de contêineres com rolagem vertical, que pode comprometer o comportamento da virtualização. | Com 4.000 pets, a tela pode apresentar rolagem lenta, travamentos e consumo elevado de memória.                                                     | Remover o `ScrollView` e utilizar a `FlatList` como contêiner principal, movendo o título e a busca para `ListHeaderComponent` e o total para `ListFooterComponent`.          |
| 2  | `initialNumToRender={100}`                         | Quantidade inicial de itens muito elevada em relação ao padrão usual.                                   | A abertura da tela pode demorar mais e consumir mais recursos antes mesmo de a pessoa começar a rolar a lista.                                      | Restaurar o valor padrão de 10 itens e ajustar somente após medir o desempenho.                                                                                               |
| 3  | `windowSize={50}`                                  | Janela de renderização maior que o padrão usual de 21 unidades de viewport.                             | Mais itens podem permanecer renderizados ao redor da área visível, aumentando o consumo de memória.                                                 | Restaurar o padrão de 21 e avaliar alterações com base em medições.                                                                                                           |
| 4  | `removeClippedSubviews={true}`                     | Propriedade configurada explicitamente sem evidências de que a opção seja benéfica para este layout.    | Em determinadas situações, alguns elementos podem apresentar problemas visuais durante a rolagem.                                                   | Conferir o padrão da versão utilizada do React Native — geralmente `true` no Android e `false` no iOS — e validar o comportamento com testes antes de alterar a configuração. |
| 5  | `alvo.statusPasseio = 'concluido'; setPets(pets);` | Mutação direta de um objeto do estado e reutilização da mesma referência do array.                      | A pessoa registra um passeio, mas a interface pode continuar exibindo o estado anterior.                                                            | Atualizar o estado de forma imutável, criando um novo array e um novo objeto para o pet alterado.                                                                             |
| 6  | `keyExtractor={(item, index) => index.toString()}` | Uso do índice como chave em uma lista filtrável.                                                        | Após uma busca ou mudança na ordem dos itens, componentes reutilizados podem ficar associados aos pets errados, provocando inconsistências visuais. | Utilizar um identificador único e estável, como `item.id.toString()`.                                                                                                         |
| 7  | `ListHeaderComponent={() => (...)}`                | Função de componente definida novamente a cada renderização.                                            | O campo de busca pode perder o foco ou ter seu estado interno reiniciado se o cabeçalho for desmontado e montado novamente.                         | Definir o componente de cabeçalho fora de `TelaPets` ou fornecer um elemento estável, verificando se o foco é preservado durante a digitação.                                 |
| 8  | `const alvo = pets.find((p) => p.id === id)`       | Ausência de validação caso o ID recebido não corresponda a nenhum pet.                                  | Se a função for chamada com um ID inexistente, pode ocorrer um erro ao tentar acessar `statusPasseio` de `undefined`.                               | Verificar se o pet foi encontrado antes de acessar ou atualizar suas propriedades. É uma proteção de robustez, não uma causa comprovada do problema relatado.                 |
| 9  | `p.nome.includes(busca)`                           | Busca sensível a maiúsculas e minúsculas e que não normaliza espaços extras.                            | Uma busca por "luna" pode não encontrar "Luna", e espaços acidentais podem gerar resultados inesperados.                                            | Normalizar os nomes e o texto da busca, utilizando `toLowerCase()` e `trim()` quando apropriado.                                                                              |
| 10 | `pets.filter((p) => p.nome.includes(busca))`       | Filtragem repetida em todas as renderizações, mesmo quando os dados e a busca não mudaram.              | Em dispositivos mais limitados, o trabalho adicional pode prejudicar a resposta da interface se a filtragem for um gargalo relevante.               | Avaliar `useMemo` com dependências em `pets` e `busca` somente se as medições indicarem benefício.                                                                            |

## 2. O problema arquitetural

O problema arquitetural mais grave é o aninhamento da `FlatList` dentro de um `ScrollView`, ambos com rolagem vertical.

A `FlatList` utiliza virtualização para controlar quais itens precisam permanecer renderizados conforme a pessoa percorre a lista. Quando está dentro de um `ScrollView` da mesma orientação, o comportamento de rolagem e virtualização pode ser prejudicado, dependendo da estrutura e das condições de renderização.

Com oito itens, esse problema pode passar despercebido. Com 4.000, pode contribuir para renderizações excessivas, aumento do consumo de memória e travamentos.

Esse problema é mais grave que os ajustes isolados de parâmetros porque compromete a arquitetura utilizada para exibir listas grandes. Alterar `windowSize`, `initialNumToRender` ou `removeClippedSubviews` não corrige o aninhamento.

A correção é remover o `ScrollView` e transformar a `FlatList` no contêiner principal da tela. O título e o campo de busca podem ser colocados no `ListHeaderComponent`, enquanto o total pode ser apresentado no `ListFooterComponent`.

## 3. Os três ajustes de desempenho deste arquivo

| Propriedade             | Padrão de referência                                                         | Efeito da configuração atual                                                                                                                                                                              | Por que não resolve o problema real                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `removeClippedSubviews` | Geralmente `true` no Android e `false` no iOS; confirmar a versão utilizada. | Com `true`, visualizações nativas fora da área visível podem ser removidas da hierarquia nativa, reduzindo algum trabalho de renderização, mas também podendo causar problemas visuais em certos layouts. | Não corrige o aninhamento e não garante melhoria em todos os dispositivos.                               |
| `windowSize`            | `21`                                                                         | O valor `50` amplia a janela de renderização, mantendo potencialmente mais conteúdo renderizado ao redor da área visível.                                                                                 | Uma janela maior não corrige o problema arquitetural e pode aumentar o consumo de memória.               |
| `initialNumToRender`    | `10`                                                                         | O valor `100` faz a lista renderizar muito mais itens na abertura inicial, aumentando o trabalho inicial de renderização.                                                                                 | Renderizar mais itens na abertura não resolve o problema arquitetural e pode agravar a lentidão inicial. |

Os três parâmetros foram configurados sem evidências de que os novos valores sejam adequados para o cenário de produção.

A abordagem recomendada é corrigir primeiro a arquitetura, retornar aos valores padrão apropriados para a versão utilizada e medir o comportamento em condições representativas. Somente depois devem ser testados outros valores, comparando o tempo de abertura, a fluidez da rolagem e o consumo de recursos.

## 4. O bug de "às vezes não atualiza"

A causa está nesta sequência:

```javascript
const alvo = pets.find((p) => p.id === id);

alvo.statusPasseio = 'concluido';

setPets(pets);
```

O código modifica diretamente o objeto encontrado no array `pets` e passa para `setPets` a mesma referência do array anterior.

O React pode ignorar a atualização porque o novo estado tem a mesma identidade do anterior, verificada por `Object.is`. Além disso, a `FlatList` é um `PureComponent` e realiza uma comparação superficial das propriedades. Como a referência de `data` não muda, ela pode não identificar a alteração.

Isso ajuda a explicar por que a pessoa registra um passeio, mas a interface pode continuar mostrando informações antigas.

**Opção 1 — Atualização imutável (escolhida):** criar um novo array com `map` e um novo objeto para o pet cujo ID corresponde ao recebido.

```javascript
function registrar(id) {
  setPets((petsAtuais) =>
    petsAtuais.map((pet) =>
      pet.id === id
        ? { ...pet, statusPasseio: 'concluido' }
        : pet
    )
  );
}
```

**Opção 2 — Utilizar `extraData`:** informar à `FlatList` uma propriedade que mude quando dados externos relevantes para a renderização forem alterados. Essa opção pode ser útil em determinadas estruturas, mas não corrige a mutação direta do estado e não é suficiente como solução isolada.

A opção 1 é a escolhida porque corrige a causa do problema, preserva a imutabilidade e fornece uma nova referência para `data`. O atualizador funcional também evita depender de uma versão possivelmente desatualizada do estado.

## 5. Ordem de refatoração — tenho meio dia

| Ordem | O que faço                                                                                    | Risco se não fizer                                                                                                 | Retorno esperado                                                                                            |
| ----- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 1     | Remover o `ScrollView` e transferir título, busca e total para a estrutura da `FlatList`.     | A lista de 4.000 itens pode continuar apresentando lentidão, consumo excessivo de memória e rolagem inconsistente. | Muito alto: restabelece uma arquitetura apropriada para listas grandes.                                     |
| 2     | Corrigir a atualização do estado para utilizar `map` e novos objetos.                         | A pessoa pode registrar um passeio sem ver a interface refletir a alteração.                                       | Muito alto: corrige uma falha funcional relatada pelo time.                                                 |
| 3     | Restaurar os padrões de `initialNumToRender` e `windowSize`; validar `removeClippedSubviews`. | A tela pode continuar realizando trabalho desnecessário ou apresentar problemas visuais.                           | Alto: elimina configurações potencialmente prejudiciais e estabelece uma referência para medições.          |
| 4     | Substituir o índice por `item.id` no `keyExtractor`.                                          | A filtragem pode provocar reutilização inadequada de componentes e inconsistências na interface.                   | Alto: melhora a reconciliação e a estabilidade dos itens.                                                   |
| 5     | Estabilizar o cabeçalho e verificar se o campo de busca mantém o foco.                        | A pesquisa pode apresentar perda de foco ou reinicialização do campo durante a digitação.                          | Médio/alto: melhora uma interação frequente da tela.                                                        |
| 6     | Tratar IDs inexistentes e confirmar visualmente o registro do passeio.                        | Chamadas inválidas podem provocar erros, e a pessoa pode ficar sem confirmação da ação.                            | Alto: aumenta a robustez e a confiabilidade funcional.                                                      |
| 7     | Normalizar a busca e avaliar a memoização do filtro.                                          | Pesquisas podem retornar resultados inesperados, e o processamento pode ser repetido sem necessidade.              | Médio: melhora a experiência e pode reduzir trabalho desnecessário, caso as medições confirmem o benefício. |
| 8     | Executar testes de regressão e medições em build de release com 4.000 itens.                  | Problemas de desempenho e regressões podem passar despercebidos no ambiente de desenvolvimento.                    | Muito alto: verifica se as correções resolvem os sintomas reais.                                            |

A ordem considera o impacto no usuário, o risco de manter o defeito e o retorno esperado em relação ao tempo disponível. Primeiro, são tratados o problema estrutural e a falha funcional relatada. Em seguida, são corrigidos os riscos de renderização e interação. As otimizações menores ficam para depois, pois precisam de evidências e não devem atrasar as correções prioritárias.

## 6. O que eu decidi NÃO corrigir

Não vou adicionar `useMemo` ao filtro imediatamente. Embora a filtragem seja executada novamente em cada renderização, não há evidências de que essa operação, isoladamente, seja um gargalo relevante para uma lista de 4.000 itens.

Primeiro vou corrigir o aninhamento, restabelecer os parâmetros padrão apropriados e medir o desempenho em condições representativas. Se o perfil de execução demonstrar que a filtragem é significativa, avaliarei a memoização com base nos resultados, evitando complexidade e otimizações prematuras.

## Disclaimer

Esta atividade foi elaborada com auxílio de Inteligência Artificial, utilizando o ChatGPT como ferramenta de apoio à pesquisa, à comparação de alternativas técnicas, à organização das ideias e à revisão do texto. A seleção das informações, a avaliação das alternativas e a responsabilidade pelo conteúdo final são da autora.