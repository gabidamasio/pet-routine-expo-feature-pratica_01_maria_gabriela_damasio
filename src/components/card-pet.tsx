
/*
Prática 3 — Card de informações do pet.

IA foi utilizada como ferramenta de apoio para compreensão dos
requisitos, esclarecimento de conceitos e identificação/correção
de erros no código. Todo o conteúdo gerado foi revisado e
supervisionado por mim, sendo de minha responsabilidade a validação
e os resultados finais da atividade.
*/

import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  type Pet,
  rotuloEspecie,
  rotuloStatusPasseio,
} from '../types/pet';

import {
  bordas,
  cores,
  espaco,
  interacao,
  tipografia,
} from '../theme';

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
      {pet.fotoUri ? (
        <Image
          source={{ uri: pet.fotoUri }}
          contentFit="cover"
          style={styles.foto}
          accessibilityLabel={`Foto de ${pet.nome}`}
        />
      ) : null}

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

      <Text style={styles.detalhe}>
        Porte: {pet.porte}
      </Text>

      <Text style={styles.idade}>
        {pet.idadeMeses} meses de idade
      </Text>

      <Text style={styles.detalhe}>
        Microchip: {pet.microchip}
      </Text>

      {pet.local ? (
        <View style={styles.localizacao}>
          <Text style={styles.rotuloLocalizacao}>
            Localização registrada
          </Text>

          <Text style={styles.detalhe}>
            Latitude: {pet.local.latitude.toFixed(
              interacao.casasDecimaisCoordenada,
            )}
          </Text>

          <Text style={styles.detalhe}>
            Longitude: {pet.local.longitude.toFixed(
              interacao.casasDecimaisCoordenada,
            )}
          </Text>

          {pet.local.precisao !== undefined ? (
            <Text style={styles.idade}>
              Precisão aproximada: {pet.local.precisao} metros
            </Text>
          ) : null}
        </View>
      ) : (
        <Text style={styles.idade}>
          Localização não registrada
        </Text>
      )}

      {pet.statusPasseio === 'pendente' ? (
        <Pressable
          onPress={aoRegistrarPasseio}
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
          ]}
          hitSlop={interacao.hitSlop}
          accessibilityRole="button"
          accessibilityLabel={`Registrar passeio de ${pet.nome}`}
        >
          <Text style={styles.textoBotao}>
            Registrar passeio
          </Text>
        </Pressable>
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
  foto: {
    width: '100%',
    height: interacao.alturaMiniaturaFoto,
    borderRadius: bordas.raioPequeno,
    backgroundColor: cores.destaque,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espaco.sm,
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

  localizacao: {
    gap: espaco.xs,
    padding: espaco.md,
    borderRadius: bordas.raioPequeno,
    backgroundColor: cores.destaque,
  },

  rotuloLocalizacao: {
    ...tipografia.legenda,
    color: cores.primaria,
    fontWeight: '700',
  },

  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.md,
    borderRadius: bordas.raioPequeno,
    backgroundColor: cores.primaria,
  },

  botaoPressionado: {
    opacity: interacao.opacidadePressionado,
  },

  textoBotao: {
    ...tipografia.corpo,
    color: cores.cartao,
    fontWeight: '700',
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