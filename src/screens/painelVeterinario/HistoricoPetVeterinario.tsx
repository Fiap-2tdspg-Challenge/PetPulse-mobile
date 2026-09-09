import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { cores } from "../../theme/cores";
import { getPetById } from "../../services/api/petApi";
import { getTutorById } from "../../services/api/tutorApi";
import { useHistorico } from "../../hooks/useHistorico";
import { ApiRecordType, ClinicalHistoryResponse } from "../../types/types";

const CATEGORIAS: Record<ApiRecordType, { label: string; icone: string; cor: string; corFundo: string }> = {
  VACINA: { label: "Vacina", icone: "fitness", cor: "#2563EB", corFundo: "#EFF6FF" },
  CONSULTA: { label: "Consulta", icone: "calendar", cor: cores.verde, corFundo: "#ECFEFF" },
  EXAME: { label: "Exame", icone: "document-text", cor: cores.roxoMedio, corFundo: cores.roxoFundo },
  MEDICAMENTO: { label: "Medicamento", icone: "medkit", cor: "#EA580C", corFundo: "#FFF7ED" },
  DOENCA: { label: "Doença", icone: "bandage", cor: cores.erro, corFundo: "#FEF2F2" },
  OBSERVACAO: {
    label: "Observação",
    icone: "ellipsis-horizontal-circle",
    cor: cores.cinzaEscuro,
    corFundo: cores.cinzaClaro,
  },
};

function calcularIdade(dtNascimento: string): string {
  const nasc = new Date(dtNascimento);
  const hoje = new Date();
  const mesesTotal =
    (hoje.getFullYear() - nasc.getFullYear()) * 12 +
    hoje.getMonth() -
    nasc.getMonth() +
    (hoje.getDate() < nasc.getDate() ? -1 : 0);
  if (mesesTotal < 12) return `${mesesTotal} ${mesesTotal === 1 ? "mês" : "meses"}`;
  const a = Math.floor(mesesTotal / 12);
  return `${a} ${a === 1 ? "ano" : "anos"}`;
}

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export const HistoricoPetVeterinario = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = route.params as { petId: number };

  const { data: pet, isLoading: carregandoPet } = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => getPetById(petId),
  });

  const { data: tutor, isLoading: carregandoTutor } = useQuery({
    queryKey: ["tutor", pet?.tutorId],
    queryFn: () => getTutorById(pet!.tutorId),
    enabled: !!pet,
  });

  const { data: historico = [], isLoading: carregandoHistorico } = useHistorico(petId);

  const registros = useMemo(
    () => [...historico].sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()),
    [historico]
  );

  const irParaNovoRegistro = () => {
    navigation.navigate("CadastraHistorico" as never, { petId, tipoRegistro: "CONSULTA" } as never);
  };

  const irParaEditarRegistro = (item: ClinicalHistoryResponse) => {
    navigation.navigate("CadastraHistorico" as never, {
      petId,
      tipoRegistro: item.recordType,
      historico: item,
    } as never);
  };

  if (carregandoPet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={cores.roxoMedio} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoPrimario} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={cores.branco} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>{pet?.name}</Text>
        <TouchableOpacity style={styles.voltarBtn} onPress={irParaNovoRegistro}>
          <Ionicons name="add" size={22} color={cores.branco} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* CARD DO PET */}
        {pet && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.petAvatar}>
                <Ionicons name="paw" size={22} color={cores.roxoMedio} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitulo}>{pet.name}</Text>
                <Text style={styles.cardSub}>
                  {pet.speciesName} · {pet.breedName} · {calcularIdade(pet.birthDate)}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sexo</Text>
              <Text style={styles.infoValor}>{pet.sex === "M" ? "Macho" : "Fêmea"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValor}>{pet.weight} kg</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Castrado</Text>
              <Text style={styles.infoValor}>{pet.neutered ? "Sim" : "Não"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Porte</Text>
              <Text style={styles.infoValor}>{pet.petSizeDescription}</Text>
            </View>
          </View>
        )}

        {/* CARD DO TUTOR */}
        <Text style={styles.secaoLabel}>Tutor responsável</Text>
        {carregandoTutor ? (
          <View style={styles.centradoInline}>
            <ActivityIndicator size="small" color={cores.roxoMedio} />
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.tutorAvatar}>
                <Ionicons name="person" size={20} color={cores.branco} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitulo}>{tutor?.name ?? pet?.tutorName}</Text>
                {tutor?.email ? <Text style={styles.cardSub}>{tutor.email}</Text> : null}
              </View>
            </View>
            {tutor?.cpf ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CPF</Text>
                <Text style={styles.infoValor}>{tutor.cpf}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* HISTÓRICO */}
        <Text style={[styles.secaoLabel, { marginTop: 20 }]}>Histórico clínico</Text>

        {carregandoHistorico ? (
          <View style={styles.centradoInline}>
            <ActivityIndicator size="large" color={cores.roxoMedio} />
          </View>
        ) : registros.length === 0 ? (
          <View style={styles.centradoInline}>
            <Ionicons name="document-text-outline" size={40} color={cores.cinzaMedio} />
            <Text style={styles.semRegistros}>Nenhum registro encontrado.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {registros.map((item, idx) => {
              const cat = CATEGORIAS[item.recordType];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemRow, idx < registros.length - 1 && styles.itemRowBorder]}
                  activeOpacity={0.7}
                  onPress={() => irParaEditarRegistro(item)}
                >
                  <View style={[styles.itemIcone, { backgroundColor: cat.corFundo }]}>
                    <Ionicons name={cat.icone as any} size={18} color={cat.cor} />
                  </View>
                  <View style={styles.itemBody}>
                    <Text style={styles.itemTipo}>{cat.label}</Text>
                    {item.description ? <Text style={styles.itemDescricao}>{item.description}</Text> : null}
                    {item.professionalName ? (
                      <Text style={styles.itemProfissional}>{item.professionalName}</Text>
                    ) : null}
                    {item.returnDate && (
                      <View style={styles.retornoRow}>
                        <Ionicons name="calendar-outline" size={12} color={cores.verde} />
                        <Text style={styles.retornoText}>Retorno: {formatarData(item.returnDate)}</Text>
                      </View>
                    )}
                    {item.observations ? <Text style={styles.itemObs}>{item.observations}</Text> : null}
                  </View>
                  <Text style={styles.itemData}>{formatarData(item.recordDate)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.cinzaClaro },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.roxoPrimario,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  voltarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitulo: { fontSize: 18, fontWeight: "700", color: cores.branco },

  scroll: { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.roxoFundo,
    alignItems: "center",
    justifyContent: "center",
  },
  tutorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.roxoMedio,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitulo: { fontSize: 15, fontWeight: "700", color: cores.cinzaEscuro },
  cardSub: { fontSize: 12, color: cores.cinzaMedio, marginTop: 2 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: cores.cinzaClaro,
  },
  infoLabel: { fontSize: 13, color: cores.cinzaMedio },
  infoValor: { fontSize: 13, color: cores.cinzaEscuro, fontWeight: "600" },

  secaoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: cores.cinzaMedio,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },

  itemRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12, gap: 12 },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: cores.cinzaClaro },
  itemIcone: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itemBody: { flex: 1 },
  itemTipo: { fontSize: 13, fontWeight: "700", color: cores.cinzaEscuro },
  itemDescricao: { fontSize: 13, color: cores.cinzaEscuro, marginTop: 2 },
  itemProfissional: { fontSize: 12, color: cores.cinzaMedio, marginTop: 2 },
  retornoRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  retornoText: { fontSize: 12, color: cores.verde, fontWeight: "500" },
  itemObs: { fontSize: 12, color: cores.cinzaEscuro, fontStyle: "italic", marginTop: 4 },
  itemData: { fontSize: 12, color: cores.cinzaMedio },

  centrado: { flex: 1, alignItems: "center", justifyContent: "center" },
  centradoInline: { alignItems: "center", justifyContent: "center", paddingVertical: 30, gap: 10 },
  semRegistros: { fontSize: 14, color: cores.cinzaMedio },
});
