import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { cores } from "../../theme/cores";
import { TemaCores, useTema } from "../../context/ThemeContext";

const MEMBROS = [
  { nome: "Gabriel Neris Losano", rm: "564093" },
  { nome: "João Vitor Biribilli Ravelli", rm: "565594" },
  { nome: "Pietro Paranhos Wilhelm", rm: "561378" },
];

const REPOSITORIO_URL = "https://github.com/Fiap-2tdspg-Challenge/PetPulse-mobile";

export const SobreApp = () => {
  const navigation = useNavigation();
  const { tema } = useTema();
  const styles = useMemo(() => criarEstilos(tema), [tema]);

  const versao = Constants.expoConfig?.version ?? "1.0.0";
  const commitHash = (Constants.expoConfig?.extra?.commitHash as string | undefined) ?? "desconhecido";

  const InfoItem = ({ icone, label, valor }: { icone: string; label: string; valor: string }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconeWrap}>
        <Ionicons name={icone as any} size={18} color={tema.roxoMedio} />
      </View>
      <View style={styles.infoTexto}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={tema.roxoMedio} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={cores.branco} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Sobre o App</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* LOGO */}
        <View style={styles.logoArea}>
          <View style={styles.logoCirculo}>
            <Ionicons name="paw" size={44} color={cores.branco} />
          </View>
          <Text style={styles.appNome}>PetPulse</Text>
          <Text style={styles.appSubtitulo}>Carteira digital de saúde pet</Text>
        </View>

        {/* VERSÃO */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Versão publicada</Text>
          <InfoItem icone="pricetag-outline" label="Versão do app" valor={versao} />
          <InfoItem icone="git-commit-outline" label="Commit" valor={commitHash} />
        </View>

        {/* EQUIPE */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Equipe</Text>
          {MEMBROS.map((membro) => (
            <View key={membro.rm} style={styles.membroRow}>
              <View style={styles.membroAvatar}>
                <Ionicons name="person" size={16} color={tema.roxoMedio} />
              </View>
              <View style={styles.infoTexto}>
                <Text style={styles.infoValor}>{membro.nome}</Text>
                <Text style={styles.infoLabel}>RM {membro.rm} · 2TDSPG</Text>
              </View>
            </View>
          ))}
        </View>

        {/* REPOSITÓRIO */}
        <TouchableOpacity
          style={styles.linkBtn}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(REPOSITORIO_URL)}
        >
          <Ionicons name="logo-github" size={20} color={tema.roxoMedio} />
          <Text style={styles.linkBtnTexto}>Ver repositório no GitHub</Text>
        </TouchableOpacity>

        <Text style={styles.rodape}>FIAP · Challenge 2026 · Análise e Desenvolvimento de Sistemas</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const criarEstilos = (tema: TemaCores) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: tema.roxoMedio,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: tema.roxoMedio,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    voltarBtn: {
      width: 36,
      alignItems: "flex-start",
    },
    headerTitulo: {
      fontSize: 17,
      fontWeight: "700",
      color: cores.branco,
    },
    scroll: {
      paddingBottom: 32,
    },
    logoArea: {
      backgroundColor: tema.roxoMedio,
      alignItems: "center",
      paddingBottom: 28,
      paddingTop: 8,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    logoCirculo: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    appNome: {
      fontSize: 24,
      fontWeight: "800",
      color: cores.branco,
    },
    appSubtitulo: {
      fontSize: 13,
      color: "rgba(255,255,255,0.75)",
      marginTop: 4,
    },
    card: {
      backgroundColor: tema.superficie,
      borderRadius: 16,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 16,
      gap: 12,
    },
    cardTitulo: {
      fontSize: 14,
      fontWeight: "700",
      color: tema.texto,
      marginBottom: 4,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    infoIconeWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: tema.roxoFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    infoTexto: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 11,
      color: tema.textoSecundario,
      fontWeight: "500",
    },
    infoValor: {
      fontSize: 14,
      color: tema.texto,
      fontWeight: "600",
    },
    membroRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    membroAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: tema.roxoFundo,
      alignItems: "center",
      justifyContent: "center",
    },
    linkBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginHorizontal: 20,
      marginTop: 20,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: tema.superficie,
      borderWidth: 1,
      borderColor: tema.roxoClaro,
    },
    linkBtnTexto: {
      fontSize: 14,
      fontWeight: "700",
      color: tema.roxoMedio,
    },
    rodape: {
      fontSize: 11,
      color: tema.textoSecundario,
      textAlign: "center",
      marginTop: 24,
    },
  });
