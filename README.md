# Pet Routine Expo

**Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School
**Projeto:** App de Gestão e Rotina Pet
**Branch da disciplina:** `feature/pratica_03`

## Sobre o projeto

O Pet Routine Expo é um aplicativo de gestão da rotina de animais de estimação, desenvolvido com React Native, Expo e TypeScript como parte da disciplina de Desenvolvimento Mobile da CESAR School.

O projeto evolui ao longo das práticas da disciplina, incorporando conceitos de modelagem de domínio, componentes reutilizáveis, gerenciamento de estado, listas, interação por toque e acesso a recursos do dispositivo.

Na Prática 3, o aplicativo passa a trabalhar com uma lista de pets agrupada pelo status do passeio, busca por nome, atualização da lista e registro de passeio com localização e fotografia.

## Funcionalidades da Prática 3

* **Lista de pets:** exibição dos animais cadastrados em uma lista agrupada por status do passeio.
* **Agrupamento por status:** organização em seções de passeios pendentes, concluídos e cancelados.
* **Interação com os itens:** toque curto para alternar o status do passeio e toque longo para remover um pet da lista.
* **Busca por nome:** filtragem dos pets sem diferenciar letras maiúsculas de minúsculas.
* **Estados da lista:** exibição da lista com dados, estado vazio, atualização e mensagem específica quando a busca não encontra resultados.
* **Registro de passeio:** acesso a uma tela de registro por meio da ação “Registrar passeio”.
* **Localização:** obtenção da posição atual do dispositivo, com exibição das coordenadas e da precisão aproximada em metros.
* **Fotografia:** captura de uma foto pela câmera do dispositivo e exibição de uma prévia.
* **Miniatura no card:** exibição da foto no cartão do pet quando existe uma imagem registrada.
* **Tratamento de permissões:** mensagens para situações de permissão negada ou bloqueada, serviço de localização desligado e indisponibilidade da câmera ou do recurso solicitado.
* **Degradação graciosa:** possibilidade de salvar o registro sem localização ou foto, mantendo o funcionamento do aplicativo mesmo quando o usuário não concede as permissões.

Os dados utilizados nesta etapa são simulados localmente. A prática não implementa uma API nem persistência remota dos registros.

## Tecnologias e recursos utilizados

* React Native
* Expo
* TypeScript
* `SectionList`, para exibição dos pets agrupados em seções
* `Pressable`, para interação por toque curto e longo
* `TextInput`, para a busca por nome
* `StyleSheet` e Flexbox, para organização dos componentes e estilos
* `expo-location`, para obtenção da localização
* `expo-camera`, para captura de fotografias
* `expo-image`, para exibição da prévia e das miniaturas
* `expo-sensors`, disponível no projeto para as atividades relacionadas a sensores

## Estrutura do projeto

A organização dos arquivos separa os dados, as regras de processamento, os componentes visuais, a tela de registro, os tipos e os tokens de estilo.

```text
pet-routine-expo/
├── App.tsx
├── src/
│   ├── components/
│   │   ├── card.tsx
│   │   ├── card-pet.tsx
│   │   ├── item-pet.tsx
│   │   └── lista-vazia.tsx
│   ├── data/
│   │   └── pets.ts
│   ├── lib/
│   │   └── agrupar.ts
│   ├── screens/
│   │   ├── pet-form.tsx
│   │   └── tela-registro.tsx
│   ├── services/
│   │   └── pet-service.ts
│   ├── theme.ts
│   └── types/
│       └── pet.ts
├── PRATICA.md
├── README.md
└── package.json
```

### Responsabilidade dos principais arquivos

| Arquivo                          | Responsabilidade                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `App.tsx`                        | Gerenciamento do estado da lista, busca, atualização e exibição condicional da tela de registro. |
| `src/data/pets.ts`               | Dados simulados dos pets utilizados para testar a lista.                                         |
| `src/lib/agrupar.ts`             | Agrupamento por status e filtragem por nome, fora do JSX da tela.                                |
| `src/components/card.tsx`        | Componente genérico de cartão reutilizável.                                                      |
| `src/components/card-pet.tsx`    | Apresentação das informações do pet, localização, foto e ação de registro de passeio.            |
| `src/components/item-pet.tsx`    | Interação com cada pet por meio de `Pressable`.                                                  |
| `src/components/lista-vazia.tsx` | Mensagens específicas para lista sem dados e busca sem resultados.                               |
| `src/screens/tela-registro.tsx`  | Obtenção da localização, captura da foto, tratamento de permissões e salvamento do registro.     |
| `src/types/pet.ts`               | Tipos e funções auxiliares do domínio Pet.                                                       |
| `src/theme.ts`                   | Tokens de cores, espaçamentos, tipografia, bordas e parâmetros de interação.                     |
| `src/services/pet-service.ts`    | Serviço mockado utilizado nas etapas anteriores da disciplina.                                   |

## Como executar o projeto

### Pré-requisitos

* Node.js 22.11 ou superior.
* npm.
* Expo Go instalado em um dispositivo compatível.
* Acesso ao repositório e à branch da Prática 3.

### Instalação

Clone o repositório e acesse a branch da disciplina:

```bash
git clone https://github.com/renanalencar/pet-routine-expo pet-routine-expo
cd pet-routine-expo
git checkout feature/pratica_03
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Escaneie o QR code com o Expo Go para abrir o aplicativo no dispositivo.

**Importante:** a atividade recomenda o uso de um aparelho físico para testar a câmera e a localização. Emuladores podem oferecer recursos virtuais, mas não substituem completamente a experiência com os sensores e a câmera reais.

## Práticas desenvolvidas na disciplina

O projeto foi construído progressivamente, com cada prática acrescentando conceitos e funcionalidades.

| Prática   | Escopo                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| Prática 1 | Modelagem do domínio Pet, tipagem com TypeScript e serviço mockado.                                               |
| Prática 2 | Componentes reutilizáveis, cartão de pet, formulário, gerenciamento de estado e sistema de tokens de estilo.      |
| Prática 3 | Lista agrupada com `SectionList`, interações com `Pressable`, busca, atualização, localização e captura de fotos. |

Os comentários `TODO` do scaffold devem ser resolvidos conforme o enunciado de cada prática. A estrutura fornecida deve ser preservada, e os comentários de tarefa devem ser removidos quando os respectivos pontos forem concluídos.

## Decisões de Projeto — Prática 2

### Decisão de modelagem

Optamos por utilizar a propriedade opcional `destacado?: boolean` no componente `Card`, em vez de criar componentes separados para cartões comuns e destacados. Como o destaque altera principalmente a apresentação visual, a propriedade booleana permite reutilizar o componente e manter sua implementação genérica.

### Decisão de organização dos estilos

As cores, os espaçamentos, a tipografia e outros valores compartilhados foram centralizados em `src/theme.ts`. Essa abordagem favorece a consistência visual e facilita ajustes globais.

As propriedades estruturais de layout, como `flexDirection`, alinhamento e distribuição dos elementos, permanecem nos estilos locais dos componentes, pois dependem da organização específica de cada tela.

## Decisões da Prática 3

### 1. Por que SectionList em vez de FlatList?

Optamos por utilizar `SectionList` porque os pets são organizados em grupos definidos pelo status do passeio: pendente, concluído e cancelado.

A `SectionList` oferece suporte nativo a seções com cabeçalhos, permitindo que os grupos sejam apresentados de forma organizada e legível. Com uma `FlatList`, seria necessário implementar manualmente a organização visual dos grupos ou adaptar os dados para simular essa estrutura.

A escolha da `SectionList` atende ao requisito de representar os estados dos passeios em seções próprias, mantendo a responsabilidade pela exibição da lista no componente de interface.

### 2. Onde os dados são agrupados e por que essa lógica fica fora do JSX?

O agrupamento e a filtragem estão separados da renderização, no arquivo `src/lib/agrupar.ts`, por meio das funções `agrupar` e `filtrarPorNome`.

A função `agrupar` organiza os pets pelo status do passeio na seguinte ordem:

1. Pendente.
2. Concluído.
3. Cancelado.

Se um grupo não tiver pets, sua seção não será criada. A função também preserva a lista original, sem modificar diretamente os dados recebidos.

A função `filtrarPorNome` realiza uma busca sem diferenciar letras maiúsculas de minúsculas e desconsidera espaços extras no início e no fim do termo. Quando a busca está vazia, todos os pets são devolvidos.

Manter essas regras em `src/lib/agrupar.ts`, fora do JSX, separa a lógica de negócio da apresentação visual. Isso facilita a leitura, a manutenção e os testes das funções sem depender da renderização da tela.

### 3. Escolha de Accuracy: precisão e consumo de bateria

A obtenção da localização utiliza `Location.Accuracy.Balanced`, por meio de `Location.getCurrentPositionAsync`.

A escolha busca equilibrar precisão e consumo de bateria. Para registrar o local de um passeio, não é necessário exigir a maior precisão possível em todas as situações; uma precisão equilibrada é adequada ao objetivo da funcionalidade e evita solicitar precisão máxima sem uma justificativa específica.

A implementação realiza uma leitura pontual da posição atual, em vez de manter atualizações contínuas de GPS. A tela apresenta as coordenadas e, quando disponível, o raio de precisão informado pelo dispositivo, em metros.

### 4. Limitações assumidas

**Assinatura de localização e encerramento de recursos**

A implementação atual utiliza `getCurrentPositionAsync`, que obtém uma posição pontual e não cria uma assinatura contínua de localização. Por isso, não existe uma assinatura de GPS ativa que precise ser encerrada ao sair da tela.

A câmera é apresentada por meio de `CameraView` e fechada quando o usuário cancela a captura ou conclui a fotografia. O código controla a exibição da câmera e limpa a referência mantida pelo estado.

Caso uma versão futura passe a utilizar uma assinatura contínua, como `watchPositionAsync` ou `addListener`, será necessário avaliar e implementar o encerramento apropriado do recurso. A prática não utiliza esse fluxo contínuo de localização.

**Armazenamento das fotografias**

As fotos são capturadas pela câmera e referenciadas por URI. O aplicativo não salva as imagens na galeria e não oferece seleção de fotografias do rolo da câmera.

O arquivo capturado permanece no cache do aplicativo. Assim, sua disponibilidade não é permanente: o sistema operacional ou a limpeza do cache podem remover o arquivo. A implementação utiliza o URI para exibir a prévia e a miniatura, sem armazenar a imagem em base64.

**Permissões e recursos indisponíveis**

A localização e a fotografia são opcionais. O aplicativo deve continuar funcionando mesmo quando o usuário nega as permissões ou quando um recurso não está disponível.

As falhas são tratadas com mensagens orientativas, distinguindo situações como permissão negada, permissão bloqueada, serviço de localização desligado e indisponibilidade da câmera. O registro pode ser salvo sem localização ou foto.

**Persistência dos dados**

Os dados são simulados localmente e não são enviados a uma API ou banco de dados. A atualização da lista utiliza os dados mockados da aplicação; portanto, as alterações não representam persistência remota e podem ser perdidas quando os dados simulados são restaurados ou a aplicação é reiniciada.

## Critérios e restrições considerados

Durante a implementação, são consideradas as regras definidas no enunciado da Prática 3:

* Utilização de `SectionList`, sem envolver a lista em uma `ScrollView`.
* Utilização de `Pressable` para as interações de toque.
* Uso de `onPress` para a ação e de `pressed` para o feedback visual.
* Uso de `onLongPress` para a remoção de um pet.
* Implementação de `ListEmptyComponent` com mensagens distintas para lista inicialmente vazia e busca sem resultados.
* Atualização imutável dos estados e arrays.
* Separação do agrupamento e da filtragem em `src/lib/agrupar.ts`.
* Utilização de `expo-location`, `expo-camera` e `expo-image` para os recursos da Prática 3.
* Definição explícita de `contentFit` nas imagens de `expo-image`.
* Tratamento das permissões e dos estados de falha.
* Uso dos tokens de `src/theme.ts` para valores visuais compartilhados.
* Ausência de `any` no código TypeScript.
* Preservação do funcionamento do aplicativo quando localização ou foto não estão disponíveis.

## Disclaimer

Esta atividade foi elaborada com auxílio de Inteligência Artificial, utilizando o ChatGPT como ferramenta de apoio. A IA foi utilizada para pesquisa e comparação de tecnologias e soluções, esclarecimento de conceitos, organização e desenvolvimento das ideias e revisão do texto e do código.

O conteúdo gerado foi revisado e supervisionado, e a decisão final sobre as soluções adotadas, assim como a validação dos resultados e a responsabilidade pela entrega, é de minha autoria.