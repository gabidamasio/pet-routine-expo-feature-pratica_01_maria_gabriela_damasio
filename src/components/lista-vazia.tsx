// ============================================================
// Prática 3 — Estado vazio da lista
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Toda lista tem ListEmptyComponent. Sem exceção.
// O texto orienta o usuário conforme o cenário.
// ============================================================

/*
IA foi utilizada como ferramenta de apoio para compreensão dos
requisitos, esclarecimento de conceitos e identificação/correção
de erros no código. Todo o conteúdo gerado foi revisado e
supervisionado por mim, sendo de minha responsabilidade a validação
e os resultados finais da atividade.
*/

import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, tipografia } from '../theme';

type ListaVaziaProps = {
  termoBusca?: string;
};

export function ListaVazia({ termoBusca }: ListaVaziaProps) {
  const buscaAtiva = termoBusca !== undefined && termoBusca.trim().length > 0;

  const mensagem = buscaAtiva
    ? `Nenhum pet encontrado para "${termoBusca}".`
    : 'Nenhum pet cadastrado. Que tal adicionar um?';

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.xl,
    gap: espaco.md,
  },
  texto: {
    ...tipografia.corpo,
    color: cores.textoFraco,
    textAlign: 'center',
  },
});