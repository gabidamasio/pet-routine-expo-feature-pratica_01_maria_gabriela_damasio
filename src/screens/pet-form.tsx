// ============================================================
// Prática 2.1 — Formulário de cadastro/edição de Pet
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Formulário com campos controlados, validação, Switch e Button.
// A tela pode ser testada temporariamente pelo App.tsx.
// ============================================================

/*
IA foi utilizada como ferramenta de apoio para compreensão dos
requisitos, esclarecimento de conceitos e identificação/correção
de erros no código. Todo o conteúdo gerado foi revisado e
supervisionado por mim, sendo de minha responsabilidade a
validação e os resultados finais da atividade.
*/

import { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  bordas,
  cores,
  espaco,
  tipografia,
} from '../theme';

export default function PetForm() {
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [alertaVacina, setAlertaVacina] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const nomeVazio = nome.trim() === '';

  function salvar() {
    if (nomeVazio) {
      setMensagem('Informe o nome do pet.');
      return;
    }

    const nomePet = nome.trim();
    const racaPet = raca.trim();
    const descricaoRaca = racaPet
      ? ` Raça: ${racaPet}.`
      : '';

    const descricaoAlerta = alertaVacina
      ? 'Alerta de vacina ativado.'
      : 'Alerta de vacina desativado.';

    setMensagem(
      `Dados de ${nomePet} preparados para cadastro.${descricaoRaca} ${descricaoAlerta}`,
    );
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>
        Cadastrar pet
      </Text>

      <Text style={styles.rotulo}>
        Nome do pet
      </Text>

      <TextInput
        value={nome}
        onChangeText={(valor) => {
          setNome(valor);
          setMensagem('');
        }}
        style={[
          styles.input,
          nomeVazio && styles.inputInvalido,
        ]}
        placeholder="Ex: Rex"
        placeholderTextColor={cores.textoFraco}
        accessibilityLabel="Nome do pet"
      />

      {nomeVazio ? (
        <Text style={styles.aviso}>
          O nome é obrigatório.
        </Text>
      ) : null}

      <Text style={styles.rotulo}>
        Raça
      </Text>

      <TextInput
        value={raca}
        onChangeText={setRaca}
        style={styles.input}
        placeholder="Ex: Golden Retriever"
        placeholderTextColor={cores.textoFraco}
        accessibilityLabel="Raça do pet"
      />

      <View style={styles.linha}>
        <Text style={styles.rotulo}>
          Alerta de vacina
        </Text>

        <Switch
          value={alertaVacina}
          onValueChange={setAlertaVacina}
          trackColor={{
            false: cores.borda,
            true: cores.sucesso,
          }}
          thumbColor={cores.cartao}
          accessibilityLabel="Ativar alerta de vacina"
        />
      </View>

      <View style={styles.areaBotao}>
        <Button
          title="Salvar"
          onPress={salvar}
          disabled={nomeVazio}
          color={cores.primaria}
        />
      </View>

      {mensagem !== '' ? (
        <Text style={styles.confirmacao}>
          {mensagem}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    padding: espaco.lg,
    gap: espaco.md,
  },

  input: {
    borderWidth: bordas.largura,
    borderColor: cores.borda,
    borderRadius: bordas.raioPequeno,
    padding: espaco.md,
    fontSize: tipografia.corpo.fontSize,
    color: cores.texto,
    backgroundColor: cores.cartao,
  },

  inputInvalido: {
    borderColor: cores.erro,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espaco.md,
  },

  rotulo: {
    ...tipografia.corpo,
    fontWeight: '600',
  },

  areaBotao: {
    borderRadius: bordas.raioPequeno,
    overflow: 'hidden',
  },

  titulo: {
    ...tipografia.titulo,
  },

  aviso: {
    ...tipografia.legenda,
    color: cores.erro,
  },

  confirmacao: {
    ...tipografia.corpo,
    color: cores.sucesso,
  },
});