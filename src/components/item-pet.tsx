
/*
Prática 3 — Item tocável da lista de pets
Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School

Envolve o CardPet em um Pressable para toque curto e longo.
A ação vai em onPress; o feedback visual usa pressed.
Não utilizar onPressIn.
*/

/*
IA foi utilizada como ferramenta de apoio para compreensão dos
requisitos, esclarecimento de conceitos e identificação/correção
de erros no código. Todo o conteúdo gerado foi revisado e
supervisionado por mim, sendo de minha responsabilidade a validação
e os resultados finais da atividade.
*/

import { Pressable, StyleSheet } from 'react-native';

import type { Pet } from '../types/pet';
import { interacao } from '../theme';

import { CardPet } from './card-pet';

type ItemPetProps = {
  pet: Pet;
  onAlternar: (id: string) => void;
  onRemover: (id: string) => void;
  onRegistrar: (id: string) => void;
};

export function ItemPet({
  pet,
  onAlternar,
  onRemover,
  onRegistrar,
}: ItemPetProps) {
  return (
    <Pressable
      onPress={() => onAlternar(pet.id)}
      onLongPress={() => onRemover(pet.id)}
      delayLongPress={500}
      accessibilityRole="button"
      accessibilityLabel={`${pet.nome}, ${pet.statusPasseio}`}
      accessibilityHint="Toque para alternar o status do passeio. Mantenha pressionado para remover o pet."
      hitSlop={interacao.hitSlop}
      unstable_pressDelay={interacao.atrasoPressaoMs}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressionado,
      ]}
    >
      <CardPet
        pet={pet}
        aoRegistrarPasseio={() => onRegistrar(pet.id)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    // O espaçamento entre itens será controlado pela lista,
    // por meio de ItemSeparatorComponent ou gap no container.
  },

  itemPressionado: {
    opacity: interacao.opacidadePressionado,
  },
});