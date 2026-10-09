// ============================================================
// Prática 2 — Componente Card reutilizável
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Este componente é genérico — ele não sabe nada sobre Pet.
// Props tipadas, children: ReactNode, prop opcional `destacado`.
//
// Restrições:
//   • Sombra com `boxShadow` (uma string), não com shadow*/elevation
//   • Espaçamento interno com `gap`
//   • Nenhum hex ou número mágico — tudo vem do theme.ts
// ============================================================

/* IA foi utilizada como ferramenta de apoio para compreensão dos requisitos, esclarecimento de 
conceitos e identificação/correção de erros no código. Todo o conteúdo gerado foi revisado e 
supervisionado por mim, sendo de minha responsabilidade a validação e os resultados 
finais da atividade. */

import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { bordas, cores, espaco, sombras } from '../theme';

type CardProps = {
  children: ReactNode;

  destacado?: boolean;
};

export function Card({
  children,
  destacado = false,
}: CardProps) {

  return (
    <View
      style={[
        styles.card,
        destacado && styles.cardDestacado,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: espaco.lg,
    borderRadius: bordas.raio,
    backgroundColor: cores.cartao,

    boxShadow: sombras.card,
    gap: espaco.md,
  },

  cardDestacado: {
    // P2.10: O destaque altera o fundo e adiciona borda
    // para diferenciar visualmente o card principal.
    backgroundColor: cores.destaque,
    borderColor: cores.primaria,
    borderWidth: bordas.largura,
  },
});