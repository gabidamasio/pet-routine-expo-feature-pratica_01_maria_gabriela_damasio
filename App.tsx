import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// TODO(Aula 1 — Ex. 3): este componente tem erros propositais de View/Text/StyleSheet
// para você corrigir — ver exercises.md da Aula 2.
// TODO(Aula 1 — Ex. 4 a 7): crie `src/types/pet.ts` com `Pet`, `StatusPasseio`,
// `EspeciePet` e os utility types derivados (Pick/Omit/Partial).
// TODO(Aula 2 — Ex. 6): modele o estado desta tela com `EstadoTela<Pet>`
// (carregando | sucesso | erro) em vez de booleanos soltos.
//
// NOTA (Aula 1 — práticas): as Práticas 1 e 2 de `PRATICA.md` são TypeScript
// puro e vivem em `src/` — não mexa nesta tela para resolvê-las. Elas produzem
// exatamente os tipos (`Pet`, `EstadoTela<Pet>`) que os TODOs acima vão consumir
// na Aula 2. Comece por `src/types/pet.ts`.
export default function App() {
  return (
    <View style={styles.container}>
      <Text>App de Gestão e Rotina Pet</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
