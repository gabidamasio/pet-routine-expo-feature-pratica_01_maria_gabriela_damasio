# Atividade 3: Relatório de decisão de plataforma

## *1. Recomendação para o app do tutor*

A recomendação é utilizar React Native (cross-platform). Assim, é possível desenvolver para Android e iOS utilizando uma base de código compartilhada e aproveitando o conhecimento dos dois desenvolvedores em React e TypeScript. Essa escolha é compatível com o orçamento de R$ 90 mil e com o prazo de 3 meses para o piloto, além de evitar a necessidade de desenvolver duas aplicações nativas com uma equipe pequena. O React Native também permite trabalhar com os recursos necessários ao projeto, como câmera, GPS, armazenamento offline e notificações, embora algumas funcionalidades possam exigir integração com recursos nativos.

## *2. Restrições que sustentam a escolha*

* **Orçamento:** “R$ 90 mil, primeira versão”, tornando importante controlar o custo de desenvolvimento e evitar a necessidade de manter duas implementações completamente separadas.
* **Prazo:** “3 meses até o piloto”, tornando relevante o compartilhamento de código entre Android e iOS para reduzir o esforço de desenvolvimento.
* **Equipe:** “2 desenvolvedores — ambos com TypeScript e React, nenhum com Kotlin ou Swift”, favorecendo uma tecnologia que permita aproveitar as competências já existentes sem exigir o domínio das duas linguagens nativas.

## *3. O que se perde ao não escolher o desenvolvimento nativo?*

Ao rejeitar o desenvolvimento nativo, perde-se parte do controle e da integração direta com os recursos específicos de Android e iOS e sobre otimizações direcionadas individualmente a cada plataforma. Algumas funcionalidades, como GPS durante passeios, notificações e operações em segundo plano, podem exigir configurações ou código nativo adicional. Esse é um trade-off da escolha, pois a solução prioriza o compartilhamento de código e o aproveitamento das competências da equipe para atender ao prazo do piloto.

## *4. Recomendação para o painel das clínicas*

O painel não precisa utilizar a mesma tecnologia do aplicativo do tutor. A recomendação é uma aplicação web com React e TypeScript, pois o painel será utilizado em desktops nas recepções das clínicas. Dessa forma, ele pode ser acessado diretamente pelo navegador, sem necessidade de instalação de um aplicativo específico, e a equipe continua utilizando tecnologias que já conhece.

## *5. Risco técnico e mitigação*

O principal risco é o desempenho inadequado em Androids de entrada com menos de 4 GB de RAM. Isso pode resultar em lentidão, consumo elevado de memória ou encerramento do aplicativo, principalmente durante operações que envolvam fotos e outros recursos do dispositivo. Para reduzir esse risco, devem ser realizados testes desde o início em aparelhos de baixo custo, além de otimização e compressão de imagens, redução de dependências desnecessárias e monitoramento do consumo de memória e do tempo de resposta.

## *6. Pergunta ao cliente*

*“O GPS precisa continuar registrando a localização durante os passeios com a tela bloqueada ou com o aplicativo em segundo plano?”*

Se a resposta fosse “sim, o GPS precisa funcionar continuamente em segundo plano e esse requisito exigir recursos nativos específicos”, eu mudaria minha recomendação para nativo, porque o acesso direto às APIs de localização de cada plataforma proporcionaria maior controle sobre esse requisito.

## *Conclusão*

A escolha recomendada é React Native, pois permite equilibrar as restrições de equipe, orçamento, prazo e público-alvo, possibilitando o desenvolvimento para Android e iOS com código compartilhado. Apesar de oferecer menos controle específico sobre cada plataforma do que uma solução nativa, esse é um custo considerado diante da equipe disponível e do prazo de 3 meses para o piloto. Para o painel das clínicas, uma aplicação web com React e TypeScript é mais adequada ao contexto de uso em desktops.

***Disclaimer:*** Esta atividade foi elaborada com auxílio de Inteligência Artificial, utilizando o *ChatGPT (modelo GPT-5.6 Luna)* como ferramenta de apoio. A IA foi utilizada para pesquisa e comparação de tecnologias e soluções, organização e desenvolvimento das ideias, análise das alternativas e revisão do texto. A decisão final, a seleção das informações e a responsabilidade pelo conteúdo apresentado são de minha autoria.
