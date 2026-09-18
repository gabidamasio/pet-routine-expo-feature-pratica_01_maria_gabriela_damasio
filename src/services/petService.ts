/* IA foi utilizada como ferramenta de apoio para compreensão dos requisitos, esclarecimento de 
conceitos e identificação/correção de erros no código. Todo o conteúdo gerado foi revisado e 
supervisionado por mim, sendo de minha responsabilidade a validação e os resultados 
finais da atividade. */

import type { Pet } from '../types/pet';

const SIMULAR_ERRO = false;

const ATRASO_MS = 1000;

const MOCK: Pet = {
  id: 'p1',
  nome: 'Fubá',
  especie: 'gato',
  porte: 'pequeno',
  statusPasseio: 'pendente',
  idadeMeses: 30,
  criadoEm: '2026-09-18T10:00:00.000Z',
  microchip: 'BR123456789',
};

export async function buscarPetDoUsuario(): Promise<Pet> {
  await new Promise((r) => setTimeout(r, ATRASO_MS));

  if (SIMULAR_ERRO) {
    throw new Error('Não foi possível carregar o pet.');
  }

  return MOCK;
}

export async function registrarPasseio(pet: Pet): Promise<Pet> {
  return {
    ...pet,
    statusPasseio: 'concluido',
  };
}