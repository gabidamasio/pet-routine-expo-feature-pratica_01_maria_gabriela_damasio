# Auditoria — TelaPasseio

## 1. Problemas de permissão

| # | Sintoma para o usuário                                                                                                                             | Causa no código                                                                                                                                          | Correção                                                                                                                                                                                  |
| - | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | Ao negar a permissão de localização, a pessoa tenta iniciar o passeio, mas a funcionalidade pode falhar sem uma explicação clara.                  | O retorno de `Location.requestForegroundPermissionsAsync()` é ignorado, e o código tenta obter a localização sem confirmar se a permissão foi concedida. | Verificar a propriedade `granted` da resposta e interromper a inicialização com uma mensagem clara caso a autorização não tenha sido concedida.                                           |
| 2 | Depois de negar a permissão, a pessoa pode tentar iniciar o passeio novamente e continuar sem conseguir autorizar o acesso pelo fluxo esperado.    | A variável global `jaPediuPermissao` passa a ser `true` mesmo quando a permissão é negada, impedindo novas solicitações por esse fluxo.                  | Consultar o estado atual com `Location.getForegroundPermissionsAsync()` e solicitar a permissão quando apropriado, respeitando as decisões do usuário e as regras do sistema operacional. |
| 3 | Se a localização estiver indisponível ou uma operação falhar, a pessoa pode ver o passeio deixar de funcionar sem receber uma orientação adequada. | As operações assíncronas não têm tratamento de erros, e `if (!posicao)` não captura uma Promise rejeitada.                                               | Utilizar `try/catch`, apresentar uma mensagem compreensível e impedir que a inicialização continue quando uma etapa obrigatória falhar.                                                   |
| 4 | A pessoa pode não entender por que o aplicativo precisa da localização nem como os dados do passeio serão utilizados.                              | O trecho solicita a permissão sem apresentar uma explicação contextual da finalidade da coleta.                                                          | Explicar a finalidade antes da solicitação, coletar somente os dados necessários e oferecer uma forma clara de interromper o acompanhamento.                                              |

## 2. Vazamentos

Existem duas assinaturas que não são encerradas: o acompanhamento contínuo da localização e o listener do acelerômetro.

A primeira é criada por `Location.watchPositionAsync()`. Ela retorna uma assinatura que precisa ser removida quando o acompanhamento termina. No código, a assinatura não é armazenada para permitir seu encerramento.

A segunda é criada por `Accelerometer.addListener()`. Ela também retorna uma assinatura, mas o código não guarda essa referência nem remove o listener.

Se a pessoa tocar em **“Iniciar passeio” cinco vezes**, e as cinco inicializações forem concluídas sem que nenhuma assinatura seja removida, o código poderá criar:

* 5 assinaturas de localização;
* 5 assinaturas do acelerômetro.

Essa contagem é condicional: depende de as cinco chamadas serem concluídas e de não haver encerramento externo. O código não impede inicializações repetidas ou simultâneas.

As consequências incluem:

* **Bateria:** vários observadores e listeners podem manter trabalho contínuo desnecessário.
* **Processamento:** cada listener do acelerômetro pode processar atualizações do sensor, enquanto cada observador de localização pode disparar novas operações de geocodificação.
* **Memória:** as assinaturas mantêm callbacks ativos, e a lista `registros` continua acumulando itens sem uma política de limite ou descarte.
* **Experiência do usuário:** uma mesma caminhada pode gerar registros repetidos, e várias operações assíncronas podem atualizar a tela concorrentemente.

A correção é guardar as assinaturas retornadas, impedir que um passeio já ativo seja iniciado novamente e removê-las ao encerrar o acompanhamento ou desmontar a tela. A API de assinatura oferece o método `remove()` para esse fim.

## 3. Consumo de bateria

### 3.1. Precisão elevada de localização

**Trecho:** `Location.Accuracy.BestForNavigation` e `Location.Accuracy.Highest`.

**Problema:** a aplicação solicita alta precisão tanto para obter uma posição inicial quanto para acompanhar as atualizações. O código não demonstra que esse nível de precisão seja necessário para exibir o nome da rua e as coordenadas.

**Correção:** escolher uma precisão compatível com a finalidade do passeio e testar se uma configuração menos exigente atende aos requisitos. A precisão deve ser definida com base na necessidade funcional, não reduzida indiscriminadamente.

### 3.2. Frequência elevada de atualização do acelerômetro

**Trecho:** `Accelerometer.setUpdateInterval(16)`.

**Problema:** o intervalo solicitado de 16 milissegundos equivale a aproximadamente 62,5 atualizações por segundo, embora a frequência real possa variar. Isso pode gerar processamento desnecessário para uma lógica que apenas verifica se o eixo `x` ultrapassa um limite.

**Correção:** definir a frequência de acordo com a estratégia de detecção de passos e validar a precisão e o consumo em dispositivos reais. A frequência, por si só, não torna o algoritmo capaz de identificar passos corretamente.

### 3.3. Geocodificação em todas as atualizações de localização

**Trecho:** `await Location.reverseGeocodeAsync(p.coords)` dentro do callback de `watchPositionAsync`.

**Problema:** cada atualização recebida pode iniciar uma consulta de geocodificação reversa, mesmo quando a pessoa continua na mesma rua. Isso aumenta o número de operações assíncronas e pode gerar processamento e atividade de rede desnecessários.

**Correção:** limitar as consultas por tempo ou distância, evitar consultas redundantes e obter o endereço apenas quando houver necessidade funcional. Também é importante tratar falhas e evitar que consultas concorrentes gerem registros desnecessários.

Além dessas três decisões, encerrar corretamente as assinaturas é uma das medidas mais importantes para evitar consumo contínuo de recursos.

## 4. O uso errado de sensor

O acelerômetro está sendo usado como se fosse um contador de passos.

O código executa `setPassos((n) => n + 1)` sempre que o valor do eixo `x` ultrapassa `1.5`. O acelerômetro mede a aceleração em diferentes eixos; ele não informa diretamente que um passo aconteceu.

Uma única movimentação pode gerar várias leituras acima do limite, provocando contagens excessivas. Por outro lado, passos reais podem não ser detectados dependendo da orientação do aparelho e do padrão de movimento.

O autor provavelmente queria contar os passos dados durante o passeio, mas utilizou uma leitura isolada de aceleração como indicador de cada passo.

A correção recomendada é avaliar `Pedometer` de `expo-sensors`, que oferece uma API específica para acompanhar passos em dispositivos compatíveis. É necessário verificar a disponibilidade na plataforma utilizada e tratar os casos em que o recurso não esteja disponível. Caso seja necessário implementar uma solução própria com o acelerômetro, será preciso processar o sinal e validar o algoritmo em diferentes condições de uso.

## 5. Os defeitos de imagem

### 5.1. A mesma imagem para todos os registros

**Sintoma:** diferentes passeios aparecem com a mesma foto, sem uma representação visual específica de cada registro.

**Causa:** todos os registros recebem a mesma URL: `https://picsum.photos/seed/passeio/600/400`. Como a semente é igual, a imagem retornada é consistente entre os registros.

**Correção:** utilizar uma imagem associada a cada registro, caso a foto tenha finalidade funcional, ou remover a imagem se ela não acrescentar valor à tela.

### 5.2. Ausência de tratamento de falha no carregamento

**Sintoma:** quando a imagem remota não carrega, a pessoa pode encontrar um espaço vazio ou um cartão sem uma imagem útil.

**Causa:** o componente `Image` não define tratamento para falhas de carregamento nem apresenta uma imagem substituta.

**Correção:** tratar o evento `onError` e apresentar uma imagem padrão quando houver falha. Um indicador de carregamento também pode ser usado, se necessário, mantendo o espaço reservado para a foto.

## 6. Ordem de correção — tenho meio dia

| Ordem | Correção                                                                                              | Justificativa: impacto no usuário por hora de trabalho                                                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Corrigir o fluxo de permissão e o tratamento de erros de localização.                                 | Alto impacto e esforço relativamente baixo: evita tentativas sem autorização válida e falhas sem explicação, permitindo que a pessoa entenda por que o passeio não pode começar. |
| 2     | Armazenar e remover as assinaturas de localização e acelerômetro e impedir inicializações duplicadas. | Alto impacto: reduz o consumo contínuo de recursos, o processamento repetido e a geração de registros duplicados.                                                                |
| 3     | Corrigir a contagem de passos, preferencialmente avaliando `Pedometer`.                               | Alto impacto funcional: o contador é uma informação visível da tela e atualmente não representa os passos reais de forma confiável.                                              |
| 4     | Reduzir geocodificações redundantes e definir quando registrar uma nova posição.                      | Alto impacto com esforço moderado: diminui operações desnecessárias e ajuda a evitar atrasos e registros repetidos.                                                              |
| 5     | Ajustar a precisão da localização e a frequência do acelerômetro.                                     | Impacto relevante: pode reduzir o trabalho desnecessário, desde que os parâmetros escolhidos preservem a funcionalidade e sejam validados.                                       |
| 6     | Corrigir a exibição das fotos e apresentar uma imagem substituta em caso de falha.                    | Impacto moderado: melhora a consistência visual, mas apresenta menor risco imediato do que as falhas de permissão e as assinaturas não encerradas.                               |
| 7     | Definir a finalidade, a retenção e os controles dos dados de localização.                             | Impacto importante para a privacidade: esclarece como os dados serão utilizados e por quanto tempo serão mantidos. A implementação pode exigir alinhamento com o produto.        |

A ordem considera o impacto no usuário em relação ao esforço necessário para corrigir ou reduzir cada problema. As permissões vêm primeiro porque a funcionalidade pode falhar para quem não concedeu acesso. Em seguida, são tratados os vazamentos, que podem manter recursos ativos sem necessidade. A contagem de passos vem depois por ser uma funcionalidade central que apresenta resultados incorretos. As otimizações e melhorias visuais são realizadas posteriormente, sem ignorar a privacidade dos dados coletados.

## 7. O que eu decidi NÃO corrigir

Não vou substituir imediatamente o serviço de geocodificação reversa por outra biblioteca ou serviço.

Antes, preciso confirmar se o produto realmente precisa exibir o nome da rua em cada atualização ou se basta registrar a localização e obter o endereço em momentos específicos. Com essa informação, posso limitar as consultas e avaliar alternativas com base em precisão, custo, disponibilidade e consumo.

Essa decisão evita uma mudança maior sem necessidade comprovada. A prioridade imediata é controlar a frequência das consultas e corrigir os vazamentos; a substituição do serviço só será considerada se a solução atual continuar inadequada após essas medidas.

## Disclaimer

Esta atividade foi elaborada com auxílio de Inteligência Artificial, utilizando o ChatGPT como ferramenta de apoio à pesquisa, à comparação de tecnologias e soluções, à organização das ideias e à revisão do texto. A seleção das informações, a avaliação das alternativas e a responsabilidade pelo conteúdo final são da autora.