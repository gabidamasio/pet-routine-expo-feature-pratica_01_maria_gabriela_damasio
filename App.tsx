// ============================================================
// Prática 2 — Tela do pet em destaque
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Esta tela mostra UMA única entidade em destaque, não uma lista.
// Usa a união discriminada EstadoTela<Pet> para garantir que cada
// estado (carregando, sucesso, erro) seja tratado de forma exaustiva.
//
// Restrições:
//   • Nenhum `any` ou `as` desnecessário
//   • switch sem `default` — a exaustividade é o ponto
//   • Cores e espaçamentos vindos do theme.ts — nenhum hex solto
// ============================================================

/* IA foi utilizada como ferramenta de apoio para compreensão dos requisitos, esclarecimento de 
conceitos e identificação/correção de erros no código. Todo o conteúdo gerado foi revisado e 
supervisionado por mim, sendo de minha responsabilidade a validação e os resultados 
finais da atividade. */

import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CardPet } from './src/components/card-pet';
import {
  buscarPetEmDestaque,
  registrarPasseio as registrarPasseioService,
} from './src/services/pet-service';
import { type EstadoTela, type Pet } from './src/types/pet';
import { cores, espaco, tipografia } from './src/theme';


export default function App() {
  const [estado, setEstado] = useState<EstadoTela<Pet>>({
    tipo: 'carregando',
  });

  const carregar = useCallback(async () => {
    setEstado({ tipo: 'carregando' });

    try {
      const pet = await buscarPetEmDestaque();

      setEstado({
        tipo: 'sucesso',
        dados: pet,
      });
    } catch (erro: unknown) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar o pet.';

      setEstado({
        tipo: 'erro',
        mensagem,
      });
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function registrarPasseio() {
    if (
      estado.tipo !== 'sucesso' ||
      estado.dados.statusPasseio !== 'pendente'
    ) {
      return;
    }

    try {
      const petAtualizado = await registrarPasseioService(
        estado.dados,
      );

      setEstado({
        tipo: 'sucesso',
        dados: petAtualizado,
      });
    } catch (erro: unknown) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : 'Não foi possível registrar o passeio.';

      setEstado({
        tipo: 'erro',
        mensagem,
      });
    }
  }

  switch (estado.tipo) {
    case 'carregando':
      return (
        <View style={styles.centro}>
          <Text style={styles.carregando}>
            Carregando pet...
          </Text>
        </View>
      );

    case 'sucesso':
      return (
        <View style={styles.container}>
          <Text style={styles.titulo}>
            Pet em destaque
          </Text>

          <CardPet
            pet={estado.dados}
            aoRegistrarPasseio={registrarPasseio}
          />
        </View>
      );

    case 'erro':
      return (
        <View style={styles.centro}>
          <Text style={styles.erro}>
            {estado.mensagem}
          </Text>

          <Text
            onPress={carregar}
            style={styles.tentarNovamente}
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
          >
            Tentar novamente
          </Text>
        </View>
      );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espaco.lg,
    paddingTop: espaco.xl,
    backgroundColor: cores.fundo,
    gap: espaco.lg,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.lg,
    backgroundColor: cores.fundo,
    gap: espaco.md,
  },
  titulo: {
    ...tipografia.titulo,
  },
  carregando: {
    ...tipografia.corpo,
    color: cores.primaria,
  },
  erro: {
    ...tipografia.corpo,
    color: cores.erro,
    textAlign: 'center',
  },
  tentarNovamente: {
    ...tipografia.corpo,
    color: cores.primaria,
    fontWeight: '700',
    padding: espaco.sm,
  },
});