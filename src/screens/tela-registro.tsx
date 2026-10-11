// ============================================================
// Prática 3 — Tela de registro de passeio (sensores)
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Contrato de três tempos:
//
// GPS:
// PEDIR → verificar o serviço e solicitar permissão.
// LER   → obter a posição atual uma única vez.
// PARAR → não se aplica: não há subscription.
//
// Câmera:
// PEDIR → solicitar permissão.
// LER   → capturar uma foto.
// PARAR → fechar a CameraView ao sair da visualização.
// ============================================================

/*
IA foi utilizada como ferramenta de apoio para compreensão dos
requisitos, esclarecimento de conceitos e identificação/correção
de erros no código. Todo o conteúdo gerado foi revisado e
supervisionado por mim, sendo de minha responsabilidade a validação
e os resultados finais da atividade.
*/

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { Pet, LocalizacaoPet } from '../types/pet';

import {
  bordas,
  cores,
  espaco,
  interacao,
  tipografia,
} from '../theme';

type TelaRegistroProps = {
  pet: Pet;
  onSalvar: (
    local?: LocalizacaoPet,
    fotoUri?: string,
  ) => void;
  onCancelar: () => void;
};

export function TelaRegistro({
  pet,
  onSalvar,
  onCancelar,
}: TelaRegistroProps) {
  const [local, setLocal] = useState<LocalizacaoPet | null>(
    pet.local ?? null,
  );

  const [fotoUri, setFotoUri] = useState<string | null>(
    pet.fotoUri ?? null,
  );

  const [erro, setErro] = useState('');
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [cameraDisponivel, setCameraDisponivel] = useState(true);
  const [capturandoFoto, setCapturandoFoto] = useState(false);

  // P3.16: hook oficial de permissões da câmera.
  const [permissaoCamera, pedirPermissaoCamera] =
    useCameraPermissions();

  // P3.17: referência da câmera controlada com useState,
  // sem utilizar useRef.
  const [cameraRef, setCameraRef] = useState<CameraView | null>(
    null,
  );

  // ------------------------------------------------------------
  // Localização
  // ------------------------------------------------------------

  async function obterLocalizacao() {
    try {
      setErro('');

      // PEDIR: verificar primeiro se o serviço está habilitado.
      const servicoAtivo =
        await Location.hasServicesEnabledAsync();

      if (!servicoAtivo) {
        setErro(
          'Serviço de localização desligado. Ative o GPS nas configurações do aparelho.',
        );
        return;
      }

      // PEDIR: verificar a permissão atual antes de solicitar.
      const permissaoAtual =
        await Location.getForegroundPermissionsAsync();

      let permissao = permissaoAtual;

      if (permissaoAtual.status !== 'granted') {
        if (!permissaoAtual.canAskAgain) {
          setErro(
            'Permissão de localização bloqueada. Abra as configurações do aparelho e autorize o acesso à localização.',
          );
          return;
        }

        permissao =
          await Location.requestForegroundPermissionsAsync();
      }

      if (permissao.status !== 'granted') {
        if (permissao.canAskAgain) {
          setErro(
            'Permissão de localização negada. Toque em "Obter localização" para tentar novamente.',
          );
        } else {
          setErro(
            'Permissão de localização bloqueada. Abra as configurações do aparelho e autorize o acesso à localização.',
          );
        }

        return;
      }

      // LER: obter uma única posição, sem assinatura contínua.
      // Balanced equilibra precisão e consumo de bateria para
      // registrar o local do passeio sem exigir precisão máxima.
      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocal({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        precisao: posicao.coords.accuracy ?? undefined,
      });

      setErro('');
    } catch {
      setErro(
        'Não foi possível obter a localização. Verifique o GPS, o sinal e a disponibilidade do sensor e tente novamente.',
      );
    }

    // PARAR: não se aplica. getCurrentPositionAsync realiza
    // uma leitura única e não cria uma subscription.
  }

  // ------------------------------------------------------------
  // Câmera
  // ------------------------------------------------------------

  async function abrirCamera() {
    try {
      setErro('');

      // PEDIR: verificar e solicitar a permissão de câmera.
      let permissao = permissaoCamera;

      if (!permissao?.granted) {
        if (permissao && !permissao.canAskAgain) {
          setErro(
            'Permissão de câmera bloqueada. Abra as configurações do aparelho e autorize o acesso à câmera.',
          );
          return;
        }

        permissao = await pedirPermissaoCamera();
      }

      if (!permissao.granted) {
        setErro(
          permissao.canAskAgain
            ? 'Permissão de câmera negada. Autorize o acesso para tirar uma foto do pet.'
            : 'Permissão de câmera bloqueada. Abra as configurações do aparelho e autorize o acesso à câmera.',
        );
        return;
      }

      setCameraDisponivel(true);
      setCameraRef(null);
      setMostrarCamera(true);
    } catch {
      setCameraDisponivel(false);
      setMostrarCamera(false);
      setErro(
        'Não foi possível acessar a câmera. Verifique se o aparelho possui uma câmera funcional e tente novamente.',
      );
    }
  }

  async function tirarFoto() {
    if (!cameraRef) {
      setErro(
        'A câmera ainda não está pronta. Aguarde a inicialização e tente novamente.',
      );
      return;
    }

    try {
      setCapturandoFoto(true);
      setErro('');

      // LER: capturar uma foto. Apenas o URI é necessário;
      // não precisamos armazenar a imagem em base64.
      const foto = await cameraRef.takePictureAsync({
        quality: interacao.qualidadeFoto,
        base64: false,
      });

      if (!foto?.uri) {
        setErro(
          'A câmera não conseguiu capturar a foto. Verifique se está disponível e tente novamente.',
        );
        return;
      }

      setFotoUri(foto.uri);

      // PARAR: fechar a visualização libera a CameraView.
      setMostrarCamera(false);
      setCameraRef(null);
      setErro('');
    } catch {
      setErro(
        'Não foi possível capturar a foto. Verifique se a câmera está disponível e tente novamente.',
      );
    } finally {
      setCapturandoFoto(false);
    }
  }

  function cancelarCamera() {
    setMostrarCamera(false);
    setCameraRef(null);
    setErro('');
  }

  // Salvar continua disponível mesmo sem localização ou foto.
  function salvar() {
    onSalvar(local ?? undefined, fotoUri ?? undefined);
  }

  // ------------------------------------------------------------
  // Renderização: câmera ativa
  // ------------------------------------------------------------

  if (mostrarCamera) {
    return (
      <View style={styles.tela}>
        <Text style={tipografia.titulo}>
          Foto de {pet.nome}
        </Text>

        {cameraDisponivel ? (
          <CameraView
            ref={setCameraRef}
            style={styles.camera}
            facing="back"
            onMountError={() => {
              setCameraDisponivel(false);
              setCameraRef(null);
              setErro(
                'Câmera indisponível. Verifique se o aparelho possui uma câmera funcional e se nenhum outro aplicativo está usando-a.',
              );
            }}
          />
        ) : (
          <View style={styles.avisoCamera}>
            <Text style={tipografia.corpo}>
              A câmera não está disponível neste aparelho.
            </Text>
          </View>
        )}

        {erro !== '' && (
          <Text style={styles.erro} accessibilityRole="alert">
            {erro}
          </Text>
        )}

        <View style={styles.acoes}>
          <Pressable
            onPress={tirarFoto}
            disabled={!cameraDisponivel || capturandoFoto}
            style={({ pressed }) => [
              styles.botaoAcao,
              (!cameraDisponivel || capturandoFoto) &&
                styles.botaoDesabilitado,
              pressed && styles.botaoPressionado,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Tirar foto do pet"
          >
            <Text style={styles.textoBotao}>
              {capturandoFoto ? 'Capturando...' : 'Tirar foto'}
            </Text>
          </Pressable>

          <Pressable
            onPress={cancelarCamera}
            style={({ pressed }) => [
              styles.botaoCancelar,
              pressed && styles.botaoPressionado,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Cancelar uso da câmera"
          >
            <Text style={styles.textoBotao}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ------------------------------------------------------------
  // Renderização: tela principal de registro
  // ------------------------------------------------------------

  return (
    <View style={styles.tela}>
      <Text style={tipografia.titulo}>
        Registrar passeio de {pet.nome}
      </Text>

      {erro !== '' && (
        <Text style={styles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      )}

      {/* Localização */}
      {local ? (
        <View style={styles.secao}>
          <Text style={styles.rotulo}>
            Localização registrada
          </Text>

          <Text style={tipografia.corpo}>
            Local: {local.latitude.toFixed(
              interacao.casasDecimaisCoordenada,
            )},{' '}
            {local.longitude.toFixed(
              interacao.casasDecimaisCoordenada,
            )}{' '}
            (
            {local.precisao !== undefined
              ? `±${Math.round(local.precisao)} m`
              : 'Precisão indisponível'}
            )
          </Text>

          <Pressable
            onPress={obterLocalizacao}
            style={({ pressed }) => [
              styles.botaoSecundario,
              pressed && styles.botaoPressionado,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Atualizar localização do passeio"
          >
            <Text style={styles.textoBotao}>
              Atualizar localização
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={obterLocalizacao}
          style={({ pressed }) => [
            styles.botaoAcao,
            pressed && styles.botaoPressionado,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Obter localização do passeio"
        >
          <Text style={styles.textoBotao}>
            Obter localização
          </Text>
        </Pressable>
      )}

      {/* Foto */}
      {fotoUri ? (
        <View style={styles.secao}>
          <Image
            source={{ uri: fotoUri }}
            style={styles.previa}
            contentFit="contain"
            accessibilityLabel={`Foto registrada de ${pet.nome}`}
          />

          <Pressable
            onPress={abrirCamera}
            style={({ pressed }) => [
              styles.botaoSecundario,
              pressed && styles.botaoPressionado,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Tirar outra foto do pet"
          >
            <Text style={styles.textoBotao}>
              Tirar outra foto
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={abrirCamera}
          style={({ pressed }) => [
            styles.botaoAcao,
            pressed && styles.botaoPressionado,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Tirar foto do pet"
        >
          <Text style={styles.textoBotao}>Tirar foto</Text>
        </Pressable>
      )}

      {/* Salvar permanece disponível mesmo sem sensores. */}
      <View style={styles.acoes}>
        <Pressable
          onPress={salvar}
          style={({ pressed }) => [
            styles.botaoAcao,
            styles.botaoFlexivel,
            pressed && styles.botaoPressionado,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Salvar registro do passeio"
        >
          <Text style={styles.textoBotao}>Salvar</Text>
        </Pressable>

        <Pressable
          onPress={onCancelar}
          style={({ pressed }) => [
            styles.botaoCancelar,
            styles.botaoFlexivel,
            pressed && styles.botaoPressionado,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Cancelar registro do passeio"
        >
          <Text style={styles.textoBotao}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    padding: espaco.md,
    paddingTop: espaco.xl + espaco.sm,
    backgroundColor: cores.fundo,
    gap: espaco.md,
  },

  erro: {
    ...tipografia.corpo,
    color: cores.erro,
  },

  secao: {
    gap: espaco.sm,
  },

  rotulo: {
    ...tipografia.legenda,
    color: cores.primaria,
  },

  camera: {
    flex: 1,
    borderRadius: bordas.raioPequeno,
    overflow: 'hidden',
  },

  avisoCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espaco.md,
    backgroundColor: cores.destaque,
    borderRadius: bordas.raioPequeno,
  },

  previa: {
    width: '100%',
    height: interacao.alturaPreviaFoto,
    borderRadius: bordas.raioPequeno,
    backgroundColor: cores.destaque,
  },

  botaoAcao: {
    backgroundColor: cores.primaria,
    padding: espaco.md,
    borderRadius: bordas.raioPequeno,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoSecundario: {
    backgroundColor: cores.sucesso,
    padding: espaco.md,
    borderRadius: bordas.raioPequeno,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoCancelar: {
    backgroundColor: cores.textoFraco,
    padding: espaco.md,
    borderRadius: bordas.raioPequeno,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoFlexivel: {
    flex: 1,
  },

  botaoDesabilitado: {
    opacity: interacao.opacidadePressionado,
  },

  botaoPressionado: {
    opacity: interacao.opacidadePressionado,
  },

  textoBotao: {
    ...tipografia.corpo,
    color: cores.cartao,
    fontWeight: '700',
  },

  acoes: {
    flexDirection: 'row',
    gap: espaco.md,
  },
});