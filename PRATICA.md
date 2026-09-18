# Práticas — Aula 1

> **Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School
> **Domínio destas práticas:** **App de Gestão e Rotina Pet** (`Pet`).

| Projeto                    | Repositório        | Branch da disciplina |     |
| -------------------------- | ------------------ | -------------------- | --- |
| App de Gestão e Rotina Pet | `pet-routine-expo` | `feature/pratica_01` |     |


## Por que um domínio diferente do projeto

Os exercícios de `exercises.md` e o projeto da disciplina usam o domínio **`Habito`**. Estas práticas usam **`Pet`** de propósito.

O motivo é simples: quando o domínio é o mesmo, dá para resolver copiando o que já foi escrito, e você exercita a **memória** em vez do **conceito**. Trocando de domínio, você é obrigado a decidir de novo — quais são os estados possíveis aqui, o que o servidor gera e o que o formulário envia, o que o card precisa mostrar. É a mesma ginástica que você vai fazer no primeiro dia de qualquer projeto real.

Se travar, a **tabela de equivalência** no final deste arquivo mostra o paralelo entre os dois domínios. Use como último recurso, não como primeiro.

> 📌 **Como funciona o esqueleto.** Onde você vir `/* … */` ou um comentário `TODO`, é sua vez de escrever. O que já está escrito **não deve ser apagado** — em particular, os blocos marcados como *verificação* existem para provar que sua solução está certa: alguns precisam compilar, outros precisam **falhar** na compilação.

> ⚠️ **Escopo.** Tudo aqui é **TypeScript puro** — nenhuma prática desta aula precisa de React Native ou de projeto Expo. Componentes de tela chegam na Aula 2; listas (`FlatList`, `SectionList`), nas próximas aulas.

### Setup

```bash
node --version                    # precisa ser 22.11 ou superior

mkdir pratica01-pet && cd pratica01-pet
npm init -y
npm add -D "typescript@^6"        # a disciplina fixa a linha 6.x
npx tsc --init --strict
```

Verifique sempre com `npx tsc --noEmit`. Para rodar de fato: `npx tsx arquivo.ts`.

---

## Prática 1 — Modelagem do domínio Pet

**Nível:** ⭐⭐ · **Tempo estimado:** 45 min · **Arquivo:** `src/types/pet.ts`

### Contexto

O **App de Gestão e Rotina Pet** ajuda tutores a acompanhar a rotina dos seus animais: espécie, porte, idade e o passeio do dia. O backend ainda não existe. Modele o domínio agora, para que a troca do mock pela API real seja quase indolor depois.

Regras do domínio que você precisa respeitar:

- Um pet tem **exatamente uma** espécie e **exatamente um** porte.
- O passeio do dia tem três desfechos possíveis: ainda **pendente**, **concluído** ou **cancelado**.
- Quem gera `id`, `criadoEm` e o `statusPasseio` inicial é o **servidor** — o formulário de cadastro não envia nenhum dos três.
- A lista "Meus pets" mostra só **nome, espécie e status do passeio** (mais o `id`, para identificar).

### Esqueleto

```ts
// ============================================================
// TODO P1.1 — Union types literais. Nenhum destes pode ser `string`.
//   EspeciePet     → cachorro, gato, ave, outro
//   PortePet       → pequeno, medio, grande
//   StatusPasseio  → pendente, concluido, cancelado
// ============================================================
export type EspeciePet = /* … */;
export type PortePet = /* … */;
export type StatusPasseio = /* … */;

// ============================================================
// TODO P1.2 — A entidade completa, como ela virá do servidor um dia.
//   Campos: id, nome, especie, porte, statusPasseio, idadeMeses, criadoEm.
//   Pense no tipo de cada um. Você vai justificar uma dessas escolhas
//   na Prática 2.
// ============================================================
export interface Pet {
  /* … */
}

// ============================================================
// TODO P1.3 — Tipos DERIVADOS. Use utility types; não redigite campos.
//   NovoPet         → o que o formulário de cadastro envia
//   ResumoPet       → o que o card da lista "Meus pets" precisa
//   AtualizacaoPet  → edição parcial de um pet já cadastrado
// ============================================================
export type NovoPet = /* … */;
export type ResumoPet = /* … */;
export type AtualizacaoPet = /* … */;

// ============================================================
// TODO P1.4 — Rótulos legíveis, com switch exaustivo e SEM `default`.
// ============================================================
export function rotuloStatusPasseio(status: StatusPasseio): string {
  /* … */
}

export function rotuloEspecie(especie: EspeciePet): string {
  /* … */
}

// ============================================================
// VERIFICAÇÃO — não apague
// ============================================================

// DEVEM compilar exatamente assim, sem campos a mais nem a menos:
const novo: NovoPet = {
  nome: 'Fubá',
  especie: 'gato',
  porte: 'pequeno',
  idadeMeses: 30,
};

const resumo: ResumoPet = {
  id: 'p1',
  nome: 'Fubá',
  especie: 'gato',
  statusPasseio: 'pendente',
};

const parcial: AtualizacaoPet = { idadeMeses: 31 };

// DEVEM dar erro — descomente uma de cada vez para confirmar:
// const errado1: NovoPet = { nome: 'Fubá', especie: 'gato', porte: 'pequeno', idadeMeses: 30, id: 'p1' };
// const errado2: NovoPet = { nome: 'Fubá', especie: 'peixe', porte: 'pequeno', idadeMeses: 30 };
// const errado3: ResumoPet = { id: 'p1', nome: 'Fubá', especie: 'gato' };
// const errado4: AtualizacaoPet = { statusPasseio: 'concluido' };
```

### Teste final da prática

Acrescente o campo `microchip: string` à interface `Pet`. **Quantos dos três tipos derivados você precisou editar à mão?** Anote a resposta — ela é o argumento inteiro a favor de derivar em vez de redigitar.

### Critérios de avaliação

| Critério | Peso | O que se espera |
|---|---|---|
| **Unions literais** | 30% | Nenhum campo de domínio tipado como `string` genérica |
| **Tipos derivados** | 30% | `Omit`/`Pick`/`Partial` a partir de `Pet`; nenhum campo redigitado à mão |
| **Exaustividade** | 25% | `switch` sem `default`; os blocos de verificação passam e os de erro falham |
| **Ausência de `any` e `as`** | 15% | Nenhum `any`; `as` só com justificativa em comentário |

---

## Prática 2 — Serviço mockado e estado de tela

**Nível:** ⭐⭐ · **Tempo estimado:** 30 min · **Arquivos:** `src/services/petService.ts` e `src/tela-pet.ts`

### Contexto

Antes de existir tela, existe o **estado da tela**. Nesta prática você monta a camada de dados falsa e a máquina de estados que a tela vai consumir na Aula 2 — tudo em TypeScript puro, verificável por `tsc`.

### Esqueleto — arquivo 1 de 2

`src/services/petService.ts`

```ts
import type { Pet } from '../types/pet';

// Deixe esta constante no código para conseguir testar o caminho de erro
// sem editar mais nada.
const SIMULAR_ERRO = false;

const ATRASO_MS = 1000;   // para o estado de carregando ser visível

// TODO P2.1 — declare o pet mockado. Ele precisa satisfazer `Pet` inteiro;
//   não use `as` para escapar de campos faltando.
const MOCK: Pet = {
  /* … */
};

/**
 * Devolve UM pet — o do tutor logado. Assinatura propositalmente idêntica
 * à que uma chamada HTTP real teria, para a troca ser indolor.
 */
export async function buscarPetDoUsuario(): Promise<Pet> {
  // TODO P2.2 — espere ATRASO_MS antes de responder.
  //   Dica: `await new Promise((r) => setTimeout(r, ATRASO_MS));`

  // TODO P2.3 — se SIMULAR_ERRO for true, lance um Error com mensagem legível
  //   para o usuário final — não um stack trace.

  // TODO P2.4 — devolva o MOCK.
  /* … */
}

/**
 * Registra o passeio do dia. Por enquanto só devolve o pet com o
 * status atualizado; persistência é assunto de aula futura.
 */
export async function registrarPasseio(pet: Pet): Promise<Pet> {
  // TODO P2.5 — devolva uma CÓPIA do pet com statusPasseio 'concluido'.
  //   Não mute o objeto recebido.
  /* … */
}
```

### Esqueleto — arquivo 2 de 2

`src/tela-pet.ts` — a lógica da tela, ainda sem tela.

```ts
import type { Pet } from './types/pet';
import { rotuloEspecie, rotuloStatusPasseio } from './types/pet';
import { buscarPetDoUsuario } from './services/petService';

// ============================================================
// TODO P2.6 — união discriminada pelo campo `tipo`, três variantes:
//   'carregando'  → nenhum outro campo
//   'sucesso'     → dados: T
//   'erro'        → mensagem: string
// ============================================================
export type EstadoTela<T> = /* … */;

// ============================================================
// TODO P2.7 — devolva o texto que a tela mostraria em cada estado.
//   Use SOMENTE os campos que existem em cada variante.
//   Não escreva `default`.
//     carregando → 'Carregando…'
//     sucesso    → `${nome} · ${especie legível} · ${status legível}`
//     erro       → `Erro: ${mensagem}`
// ============================================================
export function descreverTela(estado: EstadoTela<Pet>): string {
  /* … */
}

// ============================================================
// TODO P2.8 — carregue o pet e devolva o EstadoTela resultante.
//   Sucesso → { tipo: 'sucesso', dados }
//   Falha   → { tipo: 'erro', mensagem }  (nunca deixe a exceção escapar)
// ============================================================
export async function carregar(): Promise<EstadoTela<Pet>> {
  /* … */
}

// ============================================================
// VERIFICAÇÃO — não apague
// ============================================================
declare const petExemplo: Pet;

// `declare const` existe só para o compilador — ele é apagado na compilação.
// Por isso as chamadas abaixo ficam atrás deste guard: elas precisam ser
// TYPE-CHECKED, mas não podem EXECUTAR (dariam `ReferenceError: petExemplo
// is not defined` ao rodar o arquivo com tsx). O tipo explícito `: boolean`
// impede o TS de estreitar para `false` e marcar o bloco como inalcançável.
const VERIFICACAO_DE_TIPOS: boolean = false;

if (VERIFICACAO_DE_TIPOS) {
  // DEVEM compilar:
  descreverTela({ tipo: 'carregando' });
  descreverTela({ tipo: 'sucesso', dados: petExemplo });
  descreverTela({ tipo: 'erro', mensagem: 'Sem conexão' });
}

// DEVEM dar erro — descomente uma de cada vez (dentro do `if` acima):
// descreverTela({ tipo: 'carregando', dados: petExemplo });
// descreverTela({ tipo: 'erro', dados: petExemplo });
// descreverTela({ tipo: 'offline' });

// Rode com `npx tsx src/tela-pet.ts` depois de descomentar:
// carregar().then((estado) => console.log(descreverTela(estado)));
```

### O que entregar

Os dois arquivos completos, mais **três linhas de comentário** no topo de `tela-pet.ts` respondendo:

1. Qual estado impossível a união discriminada torna **não representável** aqui?
2. Por que `carregar()` captura a exceção em vez de deixá-la subir?
3. Uma decisão de modelagem que você tomou na Prática 1 e o motivo.

### Critérios de avaliação

| Critério | Peso | O que se espera |
|---|---|---|
| **União discriminada correta** | 30% | Três variantes, discriminante literal, campos exclusivos de cada uma |
| **`switch` exaustivo** | 25% | Sem `default`; os blocos de erro da verificação realmente falham |
| **Serviço assíncrono** | 25% | Atraso artificial, caminho de erro testável, `registrarPasseio` sem mutar o argumento |
| **As três respostas** | 20% | Específicas, não genéricas |

---

## Prática 3 — Relatório de decisão de plataforma

**Nível:** ⭐⭐ · **Tempo estimado:** 1 h · **Entrega:** individual · **Formato:** 1 a 2 páginas

### Contexto

Uma **rede de 40 clínicas veterinárias** contratou sua consultoria para um app que ajude tutores a acompanhar a rotina dos pets. Restrições do projeto:

- **Orçamento:** R$ 90 mil, primeira versão
- **Prazo:** 3 meses até o piloto
- **Equipe disponível:** 2 desenvolvedores — ambos com TypeScript e React, **nenhum** com Kotlin ou Swift
- **Público:** tutores de todas as faixas de renda; **65% dos aparelhos do público-alvo são Android de entrada** com menos de 4 GB de RAM
- **Requisitos funcionais que envolvem hardware:**
  - Tirar foto do pet e de documentos (carteira de vacinação)
  - Capturar a localização GPS durante passeios
  - Funcionar com conectividade instável — registrar offline e sincronizar depois
  - Notificar o tutor sobre vacinas e consultas agendadas
- Também é necessário um **painel para as clínicas**, usado em desktop na recepção

### Esqueleto do relatório

Preencha as lacunas. A estrutura é fixa; o conteúdo é seu.

```markdown
# Relatório de decisão de plataforma — App de Rotina Pet

**Autor:** ____________________   **Data:** ____________

## 1. Recomendação

Para o app do tutor, recomendo a abordagem **____________________**
(nativo | cross-platform | web/PWA).

## 2. Restrições que sustentam a escolha

Cite TRÊS restrições do enunciado, textualmente. Não argumente em abstrato.

| # | Restrição do enunciado | Como ela empurra para a minha escolha |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

## 3. O que estamos perdendo

Abordagem rejeitada: ____________________

O que a organização deixa de ganhar ao não escolhê-la:
____________________________________________________________

(Toda decisão tem custo. Uma resposta que não nomeia nenhum custo
está escondendo o custo, não eliminando-o.)

## 4. O painel das clínicas

Mesma tecnologia do app do tutor?  ( ) sim   ( ) não

Justificativa:
____________________________________________________________

## 5. Risco técnico e mitigação

| | |
|---|---|
| **Risco concreto** | |
| **Por que ele é plausível aqui** | |
| **Como eu mitigaria** | |

## 6. A pergunta que eu faria ao cliente

Algo que o enunciado NÃO informa e que poderia mudar minha resposta:

____________________________________________________________

Se a resposta fosse ____________, eu mudaria minha recomendação para
____________, porque ____________.
```

### Critérios de avaliação

| Critério | Peso | O que se espera |
|---|---|---|
| **Argumentação ancorada nas restrições** | 35% | Cita restrições do enunciado, não generalidades sobre tecnologia |
| **Honestidade sobre o trade-off** | 25% | Reconhece o que se perde; não vende a escolha como perfeita |
| **Risco e mitigação** | 20% | Risco plausível e específico, com mitigação viável |
| **Decisão sobre o painel** | 10% | Coerente, com justificativa |
| **Qualidade da pergunta ao cliente** | 10% | Uma pergunta que **realmente** mudaria a decisão |

> **Não existe uma resposta única correta.** Cross-platform é defensável; PWA é defensável em parte; nativo é defensável com ressalvas fortes. O que é avaliado é a **qualidade do raciocínio**, não a coincidência com a opinião do professor.

---

# Anexo — Equivalência de domínio

Use como **último recurso**, quando travar de verdade. O ponto da prática é decidir de novo, não traduzir.

| `Habito` *(exercises.md e projeto)* | `Pet` *(estas práticas)* |
|---|---|
| `Habito` | `Pet` |
| `titulo: string` | `nome: string` |
| `categoria: CategoriaHabito` (`'saude' \| 'produtividade' \| 'mentalidade' \| 'sono'`) | `especie: EspeciePet` (`'cachorro' \| 'gato' \| 'ave' \| 'outro'`) |
| `frequencia: FrequenciaHabito` | `porte: PortePet` (`'pequeno' \| 'medio' \| 'grande'`) |
| `status: StatusHabito` (`'pendente' \| 'concluido' \| 'pulado'`) | `statusPasseio: StatusPasseio` (`'pendente' \| 'concluido' \| 'cancelado'`) |
| `streakDias: number` | `idadeMeses: number` |
| `rotuloStatus()` | `rotuloStatusPasseio()` |
| `buscarHabitoDoDia()` | `buscarPetDoUsuario()` |
| "Marcar concluído hoje" | "Registrar passeio" |
| `CardHabito` *(Aula 2)* | `CardPet` *(Aula 2)* |
