
/*
IA foi utilizada como ferramenta de apoio para compreensão dos requisitos,
esclarecimento de conceitos e identificação/correção de erros no código.
Todo o conteúdo gerado foi revisado e supervisionado por mim, sendo de minha
responsabilidade a validação e os resultados finais da atividade.
*/

import type { Pet, StatusPasseio } from '../types/pet';
import { rotuloStatusPasseio } from '../types/pet';

export type Secao = {
  title: string;
  data: Pet[];
};

/**
 * Agrupa os pets por status de passeio.
 *
 * A ordem das seções é:
 * 1. Pendente
 * 2. Concluído
 * 3. Cancelado
 *
 * Se um status não tiver pets, sua seção não será criada.
 * A lista original não é modificada.
 */
export function agrupar(pets: Pet[]): Secao[] {
  const ordemStatus: StatusPasseio[] = [
    'pendente',
    'concluido',
    'cancelado',
  ];

  return ordemStatus
    .map((status) => ({
      title: rotuloStatusPasseio(status),
      data: pets.filter((pet) => pet.statusPasseio === status),
    }))
    .filter((secao) => secao.data.length > 0);
}

/**
 * Filtra os pets pelo nome, ignorando maiúsculas e minúsculas
 * e espaços extras no início e no fim da busca.
 *
 * Quando a busca está vazia, todos os pets são devolvidos.
 */
export function filtrarPorNome(
  pets: Pet[],
  busca: string,
): Pet[] {
  const termo = busca.trim().toLocaleLowerCase('pt-BR');

  if (termo.length === 0) {
    return pets;
  }

  return pets.filter((pet) =>
    pet.nome.toLocaleLowerCase('pt-BR').includes(termo),
  );
}