# Pet Routine Expo

**Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School
**Branch:** `feature/ads025_2026-2`

## Sobre o projeto

App de Gestão e Rotina Pet: um aplicativo para tutores de animais de estimação organizarem a rotina, passeios e histórico de saúde dos pets.

Este projeto é usado nas atividades guiadas e aplicadas da disciplina ao longo do semestre. Cada aula adiciona uma camada nova por cima da anterior — o histórico de commits desta branch é, em si, um registro do progresso.

## Estado atual (Aula 1)

Scaffold inicial gerado com Expo (`create-expo-app`, template `blank-typescript`). Nenhuma tela ou modelagem de domínio foi implementada ainda — isso é propositalmente deixado para as próximas aulas. Veja os comentários `TODO` em `App.tsx`.

## Como rodar

```bash
npm install
npx expo start
```

Abra o app **Expo Go** no celular e escaneie o QR code (ou use um emulador). Requisito: **Node.js 22.11+**.

## Práticas da Aula 1

Os esqueletos das práticas de `PRATICA.md` já estão no repositório. Cada `TODO Px.y` no código corresponde a um item do enunciado — resolva na ordem.

| Prática                              | Arquivo                                     | Escopo          |
| ------------------------------------ | ------------------------------------------- | --------------- |
| 1 — Modelagem do domínio Pet         | `src/types/pet.ts`                          | TypeScript puro |
| 2 — Serviço mockado                  | `src/services/petService.ts`                | TypeScript puro |
| 2 — Estado de tela                   | `src/tela-pet.ts`                           | TypeScript puro |
| 3 — Relatório de plataforma          | `docs/pratica-03-relatorio-plataforma.md`   | Texto           |
| 4 — Material desatualizado *(bônus)* | `docs/pratica-04-material-desatualizado.md` | Texto           |

As Práticas 1 e 2 **não precisam de React Native nem do Expo** — são verificáveis só com o compilador:

```bash
npm run typecheck        # equivale a `npx tsc --noEmit`
npm run pratica:tela     # roda src/tela-pet.ts via tsx
```

> ⚠️ **O `typecheck` falha de propósito enquanto os TODOs não estiverem resolvidos.** Cada erro reportado aponta para um `TODO` que ainda falta preencher — é esse o critério de pronto. Alguns blocos marcados como *verificação* precisam **falhar** ao serem descomentados; não os apague.

## Próximos passos (exercícios)

Os `TODO` deixados no código apontam para os exercícios de `exercises.md` de cada aula. Resolva-os na ordem em que aparecem e mantenha um commit por exercício (ou por bloco), para que o histórico da branch sirva de evidência de progresso.

---

## Prática 2.1 — Componentes, estilos, estado e formulários

Esta prática aplica conceitos de desenvolvimento mobile com React Native, TypeScript e Expo, incluindo componentes reutilizáveis, organização de estilos com tokens, gerenciamento de estado e validação de formulários.

### Decisões de implementação

#### 1. Decisão de modelagem

Optei por utilizar tipos explícitos para representar os dados do pet e os estados da tela. O tipo `Pet` define a estrutura dos dados do animal, enquanto `EstadoTela<T>` representa os estados de carregamento, sucesso e erro.

Essa abordagem torna o código mais previsível, facilita a identificação de inconsistências durante o desenvolvimento e permite que o TypeScript ajude a garantir que cada estado contenha os dados apropriados.

Os status do passeio são representados por valores definidos no modelo, evitando inconsistências entre os componentes que exibem ou atualizam essas informações.

#### 2. Decisão de organização dos estilos

Optei por centralizar em `theme.ts` os valores reutilizáveis de cores, espaçamentos, tipografia, bordas e sombras. Essa organização evita a repetição de valores e mantém a consistência visual entre os componentes.

As propriedades específicas de layout, como `flexDirection`, `alignItems` e `justifyContent`, permanecem nos estilos locais, pois descrevem a organização dos elementos de cada componente. Para espaçar elementos irmãos, utilizo `gap`, conforme as restrições da atividade.

Essa separação facilita a manutenção do tema sem comprometer a flexibilidade dos layouts.

### Considerações finais

A implementação da Prática 2.1 utiliza componentes reutilizáveis, tipagem explícita, gerenciamento dos estados da tela e validação de formulário, seguindo as restrições técnicas estabelecidas no enunciado.
