
/* IA foi utilizada como ferramenta de apoio para compreensão de
conceitos e requisitos, identificação/correção de erros no código.
Todo o conteúdo gerado foi revisado e supervisionado por mim, sendo
de minha responsabilidade a validação e os resultados finais. */

export type EspeciePet = 'cachorro' | 'gato' | 'ave' | 'outro';

export type PortePet = 'pequeno' | 'medio' | 'grande';

export type StatusPasseio = 'pendente' | 'concluido' | 'cancelado';

export interface LocalizacaoPet {
  latitude: number;
  longitude: number;
  precisao?: number;
}

export interface Pet {
  id: string;
  nome: string;
  especie: EspeciePet;
  porte: PortePet;
  statusPasseio: StatusPasseio;
  idadeMeses: number;
  criadoEm: string;
  microchip: string;

  // Dados opcionais registrados na Prática 3
  local?: LocalizacaoPet;
  fotoUri?: string;
}

export type NovoPet = Omit<
  Pet,
  'id' | 'statusPasseio' | 'criadoEm'
>;

export type ResumoPet = Pick<
  Pet,
  'id' | 'nome' | 'especie' | 'statusPasseio'
>;

export type AtualizacaoPet = Partial<
  Omit<Pet, 'id' | 'statusPasseio' | 'criadoEm'>
>;

export function rotuloStatusPasseio(status: StatusPasseio): string {
  switch (status) {
    case 'pendente':
      return 'Pendente';

    case 'concluido':
      return 'Concluído';

    case 'cancelado':
      return 'Cancelado';
  }
}

export function rotuloEspecie(especie: EspeciePet): string {
  switch (especie) {
    case 'cachorro':
      return 'Cachorro';

    case 'gato':
      return 'Gato';

    case 'ave':
      return 'Ave';

    case 'outro':
      return 'Outro';
  }
}

export function rotuloPorte(porte: PortePet): string {
  switch (porte) {
    case 'pequeno':
      return 'Pequeno';

    case 'medio':
      return 'Médio';

    case 'grande':
      return 'Grande';
  }
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
  microchip: 'BR123456789',
};

const resumo: ResumoPet = {
  id: 'p1',
  nome: 'Fubá',
  especie: 'gato',
  statusPasseio: 'pendente',
};

const parcial: AtualizacaoPet = { idadeMeses: 31 };

// Localização e foto são opcionais.
const atualizacaoComLocal: AtualizacaoPet = {
  local: {
    latitude: -8.0476,
    longitude: -34.877,
    precisao: 10,
  },
};

const atualizacaoComFoto: AtualizacaoPet = {
  fotoUri: 'file:///foto-pet.jpg',
};

// DEVEM dar erro — descomente uma de cada vez para confirmar:
// const errado1: NovoPet = { nome: 'Fubá', especie: 'gato', porte: 'pequeno', idadeMeses: 30, id: 'p1' };
// const errado2: NovoPet = { nome: 'Fubá', especie: 'peixe', porte: 'pequeno', idadeMeses: 30 };
// const errado3: ResumoPet = { id: 'p1', nome: 'Fubá', especie: 'gato' };
// const errado4: AtualizacaoPet = { statusPasseio: 'concluido' };