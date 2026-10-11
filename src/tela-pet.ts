/* IA foi utilizada como ferramenta de apoio para compreensão dos requisitos, esclarecimento de 
conceitos e identificação/correção de erros no código. Todo o conteúdo gerado foi revisado e 
supervisionado por mim, sendo de minha responsabilidade a validação e os resultados 
finais da atividade. */


// 1. A união discriminada torna não representável um estado como carregando com dados ou mensagem.
// 2. `carregar()` captura a exceção para transformar a falha do serviço em um estado de erro que a tela pode tratar.
// 3. `criadoEm` foi modelado como `string` porque datas recebidas de APIs normalmente são serializadas como texto.

import type { Pet } from './types/pet';
import { rotuloEspecie, rotuloStatusPasseio } from './types/pet';
import { buscarPetEmDestaque } from './services/pet-service';

export type EstadoTela<T> =
  | { tipo: 'carregando' }
  | { tipo: 'sucesso'; dados: T }
  | { tipo: 'erro'; mensagem: string };

export function descreverTela(estado: EstadoTela<Pet>): string {
  switch (estado.tipo) {
    case 'carregando':
      return 'Carregando…';

    case 'sucesso':
      return `${estado.dados.nome} · ${rotuloEspecie(
        estado.dados.especie
      )} · ${rotuloStatusPasseio(estado.dados.statusPasseio)}`;

    case 'erro':
      return `Erro: ${estado.mensagem}`;
  }
}

export async function carregar(): Promise<EstadoTela<Pet>> {
  try {
    const dados = await buscarPetEmDestaque();

    return {
      tipo: 'sucesso',
      dados,
    };
  } catch (erro) {
    return {
      tipo: 'erro',
      mensagem:
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar o pet.',
    };
  }
}

// ============================================================
// VERIFICAÇÃO — não apague
// ============================================================
declare const petExemplo: Pet;

const VERIFICACAO_DE_TIPOS: boolean = false;

if (VERIFICACAO_DE_TIPOS) {
  descreverTela({ tipo: 'carregando' });
  descreverTela({ tipo: 'sucesso', dados: petExemplo });
  descreverTela({ tipo: 'erro', mensagem: 'Sem conexão' });
}

// DEVEM dar erro — descomente uma de cada vez (dentro do `if` acima):
// descreverTela({ tipo: 'carregando', dados: petExemplo });
// descreverTela({ tipo: 'erro', dados: petExemplo });
// descreverTela({ tipo: 'offline' });

// Rode com `npx tsx src/tela-pet.ts` depois de descomentar:

carregar().then((estado) => console.log(descreverTela(estado)));