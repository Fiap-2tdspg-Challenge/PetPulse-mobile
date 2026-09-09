import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cores } from "../../theme/cores";
import { useAuth } from "../../context/AuthContext";
import { useAllPets } from "../../hooks/usePets";
import { PetResponse } from "../../types/types";

export const PainelVeterinario = () => {
  const navigation = useNavigation();
  const { veterinario, logout } = useAuth();
  const { data: pets = [], isLoading } = useAllPets();
  const [busca, setBusca] = useState("");

  const petsFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return pets;
    return pets.filter(
      (p) => p.name.toLowerCase().includes(termo) || p.tutorName.toLowerCase().includes(termo)
    );
  }, [pets, busca]);

  const abrirPet = (pet: PetResponse) => {
    navigation.navigate("HistoricoPetVeterinario" as never, { petId: pet.id } as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoPrimario} />

      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <View style={styles.avatar}>
            <Ionicons name="medkit" size={22} color={cores.branco} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{veterinario?.name}</Text>
            <Text style={styles.sub}>
              {veterinario?.crmv} · {veterinario?.clinicName}
            </Text>
          </View>
          <TouchableOpacity onPress={logout} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="log-out-outline" size={22} color={cores.branco} />
          </TouchableOpacity>
        </View>

        <View style={styles.buscaWrap}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar por pet ou tutor"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={cores.roxoMedio} />
        </View>
      ) : (
        <FlatList
          data={petsFiltrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centrado}>
              <Ionicons name="paw-outline" size={44} color={cores.cinzaMedio} />
              <Text style={styles.semResultado}>
                {pets.length === 0 ? "Nenhum pet cadastrado ainda." : "Nenhum pet encontrado."}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.petCard} activeOpacity={0.8} onPress={() => abrirPet(item)}>
              <View style={styles.petAvatar}>
                <Ionicons name="paw" size={20} color={cores.roxoMedio} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.petNome}>{item.name}</Text>
                <Text style={styles.petSub}>
                  {item.speciesName} · {item.breedName}
                </Text>
                <View style={styles.tutorRow}>
                  <Ionicons name="person-outline" size={12} color={cores.cinzaMedio} />
                  <Text style={styles.tutorNome}>{item.tutorName}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={cores.cinzaMedio} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.roxoPrimario },
  header: {
    backgroundColor: cores.roxoMedio,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    gap: 14,
  },
  headerTopo: { flexDirection: "row", alignItems: "center", gap: 20  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  nome: { fontSize: 17, fontWeight: "800", color: cores.branco },
  sub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },

  buscaWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  buscaInput: { flex: 1, fontSize: 14, color: cores.branco },

  lista: { padding: 16, gap: 10 },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.roxoFundo,
    alignItems: "center",
    justifyContent: "center",
  },
  petNome: { fontSize: 15, fontWeight: "700", color: cores.cinzaEscuro },
  petSub: { fontSize: 12, color: cores.cinzaMedio, marginTop: 2 },
  tutorRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  tutorNome: { fontSize: 12, color: cores.roxoMedio, fontWeight: "600" },

  centrado: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 },
  semResultado: { fontSize: 14, color: cores.cinzaMedio },
});
