// ============================================================
// Prática 3 — Tela principal: lista de pets + registro de passeio
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
// ============================================================

/*
IA foi utilizada como ferramenta de apoio para compreensão dos
requisitos, esclarecimento de conceitos e identificação/correção
de erros no código. Todo o conteúdo gerado foi revisado e
supervisionado por mim, sendo de minha responsabilidade a validação
e os resultados finais da atividade.
*/

import { useState } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { Pet } from './src/types/pet';
import { PETS } from './src/data/pets';
import { agrupar, filtrarPorNome, type Secao } from './src/lib/agrupar';
import { ItemPet } from './src/components/item-pet';
import { ListaVazia } from './src/components/lista-vazia';
import { TelaRegistro } from './src/screens/tela-registro';
import { bordas, cores, espaco, interacao, tipografia } from './src/theme';

export default function App() {
  // P3.28: estados da tela.
  const [pets, setPets] = useState<Pet[]>(PETS);
  const [busca, setBusca] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [petRegistrando, setPetRegistrando] = useState<string | null>(null);

  // P3.29: alterna o status de maneira imutável.
  function alternarStatus(id: string) {
    setPets((anteriores) =>
      anteriores.map((pet) =>
        pet.id === id
          ? {
              ...pet,
              statusPasseio:
                pet.statusPasseio === 'concluido' ? 'pendente' : 'concluido',
            }
          : pet,
      ),
    );
  }

  // P3.30: remove o pet sem modificar o array original.
  function removerPet(id: string) {
    setPets((anteriores) => anteriores.filter((pet) => pet.id !== id));
  }

  // P3.31: restaura os dados mockados e limpa a busca.
  async function recarregar() {
    if (atualizando) {
      return;
    }

    setAtualizando(true);

    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, interacao.atrasoAtualizacaoMs);
      });

      setPets([...PETS]);
      setBusca('');
    } finally {
      setAtualizando(false);
    }
  }

  // P3.32: salva o resultado do registro de passeio.
  function handleRegistro(local?: Pet['local'], fotoUri?: string) {
    if (petRegistrando === null) {
      return;
    }

    setPets((anteriores) =>
      anteriores.map((pet) =>
        pet.id === petRegistrando
          ? {
              ...pet,
              statusPasseio: 'concluido',
              local: local ?? pet.local,
              fotoUri: fotoUri ?? pet.fotoUri,
            }
          : pet,
      ),
    );

    setPetRegistrando(null);
  }

  // P3.33: mostra o registro no lugar da lista.
  if (petRegistrando !== null) {
    const petAlvo = pets.find((pet) => pet.id === petRegistrando);

    if (petAlvo) {
      return (
        <TelaRegistro
          pet={petAlvo}
          onSalvar={handleRegistro}
          onCancelar={() => setPetRegistrando(null)}
        />
      );
    }

    setPetRegistrando(null);
  }

  // P3.34: filtra primeiro e agrupa depois.
  const secoes = agrupar(filtrarPorNome(pets, busca));

  return (
    <View style={styles.tela}>
      <SectionList<Pet, Secao>
        sections={secoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemPet
            pet={item}
            onAlternar={alternarStatus}
            onRemover={removerPet}
            onRegistrar={(id) => setPetRegistrando(id)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.cabecalhoSecao}>{section.title}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListEmptyComponent={<ListaVazia termoBusca={busca} />}
        stickySectionHeadersEnabled
        refreshing={atualizando}
        onRefresh={recarregar}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Rotina Pet</Text>

            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar pet por nome..."
              placeholderTextColor={cores.textoFraco}
              style={styles.busca}
              accessibilityLabel="Buscar pet por nome"
              returnKeyType="search"
            />
          </View>
        }
        contentContainerStyle={styles.conteudo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    paddingTop: espaco.xxl + espaco.sm,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    gap: espaco.md,
    paddingHorizontal: espaco.md,
    paddingBottom: espaco.sm,
  },
  titulo: {
    ...tipografia.tituloGrande,
  },
  conteudo: {
    flexGrow: 1,
    gap: espaco.sm,
    paddingHorizontal: espaco.md,
    paddingBottom: espaco.lg,
  },
  cabecalhoSecao: {
    ...tipografia.titulo,
    backgroundColor: cores.fundo,
    paddingVertical: espaco.sm,
    paddingHorizontal: espaco.md,
  },
  busca: {
    borderWidth: bordas.largura,
    borderColor: cores.borda,
    borderRadius: bordas.raioPequeno,
    padding: espaco.md,
    fontSize: tipografia.corpo.fontSize,
    color: cores.texto,
    backgroundColor: cores.cartao,
  },
  separador: {
    height: espaco.sm,
  },
});
