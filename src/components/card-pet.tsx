// ============================================================
// Prática 2.1 — Card do pet em destaque
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Apresenta nome, espécie, status, idade e ação de passeio.
// A lógica de atualização pertence ao componente pai.
// ============================================================

/*
IA foi utilizada como ferramenta de apoio para compreensão dos
requisitos, esclarecimento de conceitos e identificação/correção
de erros no código. Todo o conteúdo gerado foi revisado e
supervisionado por mim, sendo de minha responsabilidade a
validação e os resultados finais da atividade.
*/

import { StyleSheet, Text, View } from 'react-native';
import {
  type Pet,
  rotuloEspecie,
  rotuloStatusPasseio,
} from '../types/pet';
import { bordas, cores, espaco, tipografia } from '../theme';
import { Card } from './card';

type CardPetProps = {
  pet: Pet;
  aoRegistrarPasseio: () => void;
};

export function CardPet({
  pet,
  aoRegistrarPasseio,
}: CardPetProps) {
  return (
    <Card destacado>
      <Text style={styles.nome}>
        {pet.nome}
      </Text>

      <View style={styles.linha}>
        <Text style={styles.detalhe}>
          {rotuloEspecie(pet.especie)}
        </Text>

        <Text style={styles.status}>
          {rotuloStatusPasseio(pet.statusPasseio)}
        </Text>
      </View>

      <Text style={styles.idade}>
        {pet.idadeMeses} meses de idade
      </Text>

      {pet.statusPasseio === 'pendente' ? (
        <Text
          onPress={aoRegistrarPasseio}
          style={styles.botao}
          accessibilityRole="button"
          accessibilityLabel="Registrar passeio"
        >
          Registrar passeio
        </Text>
      ) : pet.statusPasseio === 'concluido' ? (
        <Text style={styles.confirmacao}>
          Passeio do dia concluído
        </Text>
      ) : (
        <Text style={styles.cancelado}>
          Passeio do dia cancelado
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espaco.sm,
  },

  botao: {
    fontWeight: '700',
    color: cores.primaria,
    fontSize: tipografia.corpo.fontSize,
    paddingVertical: espaco.sm,
    borderRadius: bordas.raioPequeno,
  },

  nome: {
    ...tipografia.titulo,
  },

  detalhe: {
    ...tipografia.corpo,
    flexShrink: 1,
  },

  status: {
    ...tipografia.legenda,
    color: cores.primaria,
    flexShrink: 1,
    textAlign: 'right',
  },

  idade: {
    ...tipografia.legenda,
  },

  confirmacao: {
    ...tipografia.corpo,
    color: cores.sucesso,
    fontWeight: '700',
  },

  cancelado: {
    ...tipografia.corpo,
    color: cores.erro,
    fontWeight: '700',
  },
});