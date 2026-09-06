import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "../../theme/cores";
import { useAuth } from "../../context/AuthContext";

// Painel inicial do veterinário. Login ainda é local (ver AuthContext) enquanto
// a API não ganha autenticação real com JWT + roles — quando isso acontecer,
// esta tela vira o ponto de partida para as funcionalidades reais do perfil
// (ex: consultar/gerenciar histórico clínico dos pets atendidos).
export const PainelVeterinario = () => {
  const { veterinario, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoPrimario} />

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="medkit" size={28} color={cores.branco} />
        </View>
        <Text style={styles.nome}>{veterinario?.nome}</Text>
        <Text style={styles.sub}>{veterinario?.crmv}</Text>
        <Text style={styles.sub}>{veterinario?.clinica}</Text>
      </View>

      <View style={styles.corpo}>
        <Ionicons name="construct-outline" size={40} color={cores.cinzaMedio} />
        <Text style={styles.emBreveTitulo}>Painel do veterinário</Text>
        <Text style={styles.emBreveTexto}>
          As funcionalidades para o perfil de veterinário (ex: consultar e registrar histórico clínico
          dos pets atendidos) chegam aqui assim que a API tiver autenticação real com perfis.
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={20} color={cores.roxoMedio} />
        <Text style={styles.logoutTexto}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.branco },
  header: {
    backgroundColor: cores.roxoMedio,
    alignItems: "center",
    paddingVertical: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  nome: { fontSize: 20, fontWeight: "800", color: cores.branco },
  sub: { fontSize: 13, color: "rgba(255,255,255,0.8)" },

  corpo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emBreveTitulo: { fontSize: 17, fontWeight: "700", color: cores.cinzaEscuro },
  emBreveTexto: { fontSize: 13, color: cores.cinzaMedio, textAlign: "center", lineHeight: 19 },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.roxoClaro,
  },
  logoutTexto: { fontSize: 14, fontWeight: "700", color: cores.roxoMedio },
});
