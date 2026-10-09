// ============================================================
// Prática 2 — Sistema de tokens de design
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Tokens são VALORES (cores, espaçamentos, tipografia), nunca
// layouts prontos. Componentes consomem estes tokens — nunca o
// contrário. Nenhum componente deve ter um hex ou número mágico;
// tudo vem daqui.
//
// Regra: `as const` AQUI, nunca dentro de `StyleSheet.create`.
//
// ⚠️  Preencha este arquivo PRIMEIRO — os demais dependem dele.
// ============================================================

/* IA foi utilizada como ferramenta de apoio para compreensão dos requisitos, esclarecimento de 
conceitos e identificação/correção de erros no código. Todo o conteúdo gerado foi revisado e 
supervisionado por mim, sendo de minha responsabilidade a validação e os resultados 
finais da atividade. */

export const cores = {
  fundo: '#FEF7EE',
  cartao: '#FFFFFF',
  texto: '#302820',
  textoFraco: '#776B60',
  primaria: '#8B5E3C',
  sucesso: '#397A50',
  erro: '#B42318',
  borda: '#E5D8CA',
  destaque: '#F8EBDD',
} as const;

export const espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const tipografia = {
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
} as const;

export const bordas = {
  raio: 12,
  raioPequeno: 8,
  largura: 1,
} as const;

export const sombras = {
  card: '0px 2px 8px rgba(48, 40, 32, 0.10)',
} as const;
