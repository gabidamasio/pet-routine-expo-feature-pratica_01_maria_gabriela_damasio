
 // ============================================================
 // Práticas 2 e 3 — Sistema de tokens de design
 // Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
 //
 // Tokens são VALORES (cores, espaçamentos, tipografia), nunca
 // layouts prontos. Componentes consomem estes tokens — nunca o
 // contrário. Nenhum componente deve ter um hex ou número mágico;
 // tudo vem daqui.
 //
 // Regra: `as const` AQUI, nunca dentro de `StyleSheet.create`.
 //
 // IA foi utilizada como ferramenta de apoio para compreensão dos
 // requisitos, esclarecimento de conceitos e identificação/correção
 // de erros no código. Todo o conteúdo gerado foi revisado e
 // supervisionado por mim, sendo de minha responsabilidade a
 // validação e os resultados finais da atividade.
 // ============================================================

export const cores = {
  // Cores originais da Prática 2
  fundo: '#FEF7EE',
  cartao: '#FFFFFF',
  texto: '#302820',
  textoFraco: '#776B60',
  primaria: '#8B5E3C',
  sucesso: '#397A50',
  erro: '#B42318',
  borda: '#E5D8CA',
  destaque: '#F8EBDD',

  // Complementos para os estados da Prática 3
  primariaFraca: '#F1E4D8',
  sucessoFundo: '#E7F3E9',
  alerta: '#946200',
  alertaFundo: '#FFF1D2',
  erroFundo: '#FDE9E7',
  desabilitado: '#B8ADA3',
  sobreposicao: 'rgba(48, 40, 32, 0.45)',
} as const;

export const espaco = {
  // Mantidos os tokens originais da Prática 2
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,

  // Novos tokens para ajustes de layout
  xxs: 2,
  xxl: 40,
} as const;

export const tipografia = {
  // Estilos originais da Prática 2
  titulo: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: cores.texto,
  },
  corpo: {
    fontSize: 16,
    color: cores.texto,
  },
  legenda: {
    fontSize: 14,
    color: cores.textoFraco,
  },

  // Novos tamanhos para listas, formulários e mensagens
  tituloGrande: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: cores.texto,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: cores.texto,
  },
  pequena: {
    fontSize: 12,
    color: cores.textoFraco,
  },
  botao: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: cores.cartao,
  },
} as const;

export const bordas = {
  // Tokens originais da Prática 2
  raio: 12,
  raioPequeno: 8,
  largura: 1,

  // Complementos para componentes da Prática 3
  raioGrande: 16,
  raioCircular: 999,
} as const;

export const sombras = {
  // Mantida a sombra original da Prática 2
  card: '0px 2px 8px rgba(48, 40, 32, 0.10)',
} as const;

// Configurações de interação e sensores.
// Centralizadas aqui para evitar números mágicos nos componentes.
export const interacao = {
  atrasoPressaoMs: 100,
  atrasoAtualizacaoMs: 400,
  opacidadePressionado: 0.7,

  casasDecimaisCoordenada: 4,

  qualidadeFoto: 0.7,
  alturaPreviaFoto: 240,
  alturaMiniaturaFoto: 180,

  hitSlop: {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
  },
} as const;