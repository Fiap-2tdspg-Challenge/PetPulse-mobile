import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { cores } from "../../theme/cores";
import { Footer } from "../../components/Footer";
import { Pet } from "../../types/pet";
import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/usePets";

const PORTE_LABEL: Record<string, string> = {
  PEQUENO: "Pequeno",
  MEDIO: "Médio",
  GRANDE: "Grande",
};

const SEXO_LABEL: Record<string, string> = {
  MACHO: "Macho",
  FEMEA: "Fêmea",
};

const TIPO_ICONE: Record<string, string> = {
  VACINA: "shield-checkmark",
  CONSULTA: "medkit",
  EXAME: "document-text",
  MEDICACAO: "fitness",
  CIRURGIA: "cut",
  OUTRO: "ellipsis-horizontal-circle",
};

// Função para calcular idade a partir da data de nascimento, ira apenas conter no app para visualização
function calcularIdade(dtNascimento: string): string {
  const nasc = new Date(dtNascimento);
  const hoje = new Date();
  const anos = hoje.getFullYear() - nasc.getFullYear();
  const meses =
    hoje.getMonth() - nasc.getMonth() + (hoje.getDate() < nasc.getDate() ? -1 : 0);
  const mesesTotal = anos * 12 + meses;
  if (mesesTotal < 12) return `${mesesTotal} ${mesesTotal === 1 ? "mês" : "meses"}`;
  const a = Math.floor(mesesTotal / 12);
  return `${a} ${a === 1 ? "ano" : "anos"}`;
}

// formatador de dada para DD/MM/AAAA
function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export const PerfilPet = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { usuario } = useAuth();
  const petParam = (route.params as { pet: Pet } | undefined)?.pet;
  const { data: pets, isLoading: carregandoPets } = usePets(!petParam ? usuario?.idUsuario : undefined);
  const pet = petParam ?? pets?.[0] ?? null;
  const carregando = !petParam && carregandoPets;

  if (carregando) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.roxoMedio, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={cores.branco} />
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.roxoMedio, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: cores.branco, fontSize: 16 }}>Pet não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CadastraPet" as never)} style={{ marginTop: 16 }}>
          <Text style={{ color: cores.roxoClaro }}>Cadastrar pet</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const InfoItem = ({ icone, label, valor }: { icone: string; label: string; valor: string }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconeWrap}>
        <Ionicons name={icone as any} size={18} color={cores.roxoMedio} />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={cores.branco} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Perfil do Pet</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* AVATAR */}
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Ionicons name="paw" size={48} color={cores.branco} />
          </View>
          <Text style={styles.petNome}>{pet.nome}</Text>
          <Text style={styles.petSubtitulo}>{pet.especie} · {pet.raca}</Text>
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Informações</Text>
          <InfoItem icone="calendar-outline"     label="Nascimento" valor={formatarData(pet.dtNascimento)} />
          <InfoItem icone="time-outline"          label="Idade"      valor={calcularIdade(pet.dtNascimento)} />
          <InfoItem icone="barbell-outline"       label="Peso"       valor={`${pet.peso} kg`} />
          <InfoItem icone="resize-outline"        label="Porte"      valor={PORTE_LABEL[pet.porte] ?? pet.porte} />
          <InfoItem icone="male-female-outline"   label="Sexo"       valor={SEXO_LABEL[pet.sexo] ?? pet.sexo} />
          <InfoItem
            icone={pet.castrado ? "checkmark-circle-outline" : "close-circle-outline"}
            label="Castrado"
            valor={pet.castrado ? "Sim" : "Não"}
          />
          <InfoItem icone="today-outline" label="Cadastrado em" valor={formatarData(pet.dtCadastro)} />
        </View>

        {/* AÇÕES */}
        <View style={styles.acoesRow}>
          <TouchableOpacity
            style={styles.acaoBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("HistoricoClinico" as never)}
          >
            <Ionicons name="clipboard-outline" size={22} color={cores.branco} />
            <Text style={styles.acaoBtnTexto}>Histórico{"\n"}Clínico</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acaoBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("LocalizaPet" as never)}
          >
            <Ionicons name="location-outline" size={22} color={cores.branco} />
            <Text style={styles.acaoBtnTexto}>Localizar{"\n"}Pet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acaoBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Coleira" as never, { pet } as never)}
          >
            <Ionicons name="pulse-outline" size={22} color={cores.branco} />
            <Text style={styles.acaoBtnTexto}>Coleira{"\n"}Inteligente</Text>
          </TouchableOpacity>
        </View>

        {/* EDITAR PET */}
        <TouchableOpacity
          style={styles.editarBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("EditaPet" as never, { pet } as never)}
        >
          <Ionicons name="create-outline" size={20} color={cores.roxoMedio} />
          <Text style={styles.editarBtnTexto}>Editar informações do pet</Text>
        </TouchableOpacity>

      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.roxoMedio,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.roxoMedio,
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
    paddingBottom: 24,
  },
  avatarArea: {
    backgroundColor: cores.roxoMedio,
    alignItems: "center",
    paddingBottom: 32,
    paddingTop: 12,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  petNome: {
    fontSize: 24,
    fontWeight: "800",
    color: cores.branco,
  },
  petSubtitulo: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    gap: 12,
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.cinzaEscuro,
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
    backgroundColor: cores.roxoFundo,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: cores.cinzaMedio,
    fontWeight: "500",
  },
  infoValor: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    fontWeight: "600",
    marginTop: 1,
  },
  acoesRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    gap: 10,

  },
  acaoBtn: {
    flex: 1,
    backgroundColor: cores.roxoPrimario,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 4,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  acaoBtnTexto: {
    color: cores.branco,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  editarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.roxoClaro,
  },
  editarBtnTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.roxoMedio,
  },
});
