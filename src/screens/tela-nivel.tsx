import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';

const TAMANHO_AREA = 240;
const TAMANHO_BOLHA = 36;
const LIMITE_NIVELADO = 0.05;

export default function TelaNivel() {
  const [ativo, setAtivo] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const assinatura = useRef<ReturnType<
    typeof Accelerometer.addListener
  > | null>(null);

  useEffect(() => {
    return () => {
      assinatura.current?.remove();
      assinatura.current = null;
    };
  }, []);

  function ligarNivel() {
    if (ativo) return;

    // 50 ms (~20 leituras/s) oferece movimento suficientemente suave
    // para ajustar o comedouro sem provocar renderizações excessivas.
    Accelerometer.setUpdateInterval(50);

    assinatura.current = Accelerometer.addListener(({ x, y }) => {
      setX(x);
      setY(y);
    });

    setAtivo(true);
  }

  function desligarNivel() {
    assinatura.current?.remove();
    assinatura.current = null;
    setAtivo(false);
    setX(0);
    setY(0);
  }

  const nivelado =
    Math.abs(x) < LIMITE_NIVELADO &&
    Math.abs(y) < LIMITE_NIVELADO;

  // Converte as leituras em deslocamento visual limitado à área.
  const limite = (TAMANHO_AREA - TAMANHO_BOLHA) / 2;
  const deslocamentoX = Math.max(-limite, Math.min(limite, x * 100));
  const deslocamentoY = Math.max(-limite, Math.min(limite, -y * 100));

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Comedouro nivelado</Text>
      <Text style={estilos.instrucao}>
        Apoie o telefone sobre o comedouro e ajuste até centralizar a bolha.
      </Text>

      <View style={estilos.area}>
        <View
          style={[
            estilos.bolha,
            {
              transform: [
                { translateX: deslocamentoX },
                { translateY: deslocamentoY },
              ],
              backgroundColor: ativo && nivelado ? '#22c55e' : '#f59e0b',
            },
          ]}
        />
        {!ativo && (
          <Text style={estilos.aviso}>Medição desligada</Text>
        )}
      </View>

      {ativo && (
        <Text style={estilos.status}>
          {nivelado ? 'Nivelado!' : 'Ajuste a inclinação'}
        </Text>
      )}

      <View style={estilos.botoes}>
        <Pressable
          style={[estilos.botao, ativo && estilos.botaoDesabilitado]}
          onPress={ligarNivel}
          disabled={ativo}
        >
          <Text style={estilos.textoBotao}>Ligar</Text>
        </Pressable>

        <Pressable
          style={[estilos.botao, !ativo && estilos.botaoDesabilitado]}
          onPress={desligarNivel}
          disabled={!ativo}
        >
          <Text style={estilos.textoBotao}>Desligar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#f8fafc',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  instrucao: {
    textAlign: 'center',
    color: '#475569',
  },
  area: {
    width: TAMANHO_AREA,
    height: TAMANHO_AREA,
    borderWidth: 2,
    borderColor: '#64748b',
    borderRadius: TAMANHO_AREA / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  bolha: {
    width: TAMANHO_BOLHA,
    height: TAMANHO_BOLHA,
    borderRadius: TAMANHO_BOLHA / 2,
    position: 'absolute',
  },
  aviso: {
    position: 'absolute',
    bottom: 16,
    color: '#475569',
    fontSize: 12,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
  },
  botoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  botaoDesabilitado: {
    backgroundColor: '#94a3b8',
  },
  textoBotao: {
    color: '#ffffff',
    fontWeight: '600',
  },
});