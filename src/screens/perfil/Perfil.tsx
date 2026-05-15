import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cores } from "../../theme/cores";
import { Footer } from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarCPF(cpf: string): string {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatarTelefone(tel: string): string {
  const d = tel.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return tel;
}

const InfoItem = ({
  icone,
  label,
  valor,
}: {
  icone: string;
  label: string;
  valor: string;
}) => (
  <View style={styles.infoItem}>
    <View style={styles.infoIconeWrap}>
      <Ionicons name={icone as any} size={18} color={cores.roxoMedio} />
    </View>
    <View style={styles.infoTexto}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  </View>
);

export const Perfil = () => {
  const navigation = useNavigation();
  const { usuario, logout } = useAuth();

  if (!usuario) return null;

  const iniciais = usuario.nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={cores.branco} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Meu Perfil</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* AVATAR */}
        <View style={styles.avatarArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIniciais}>{iniciais}</Text>
          </View>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Informações pessoais</Text>
          <InfoItem icone="person-outline"    label="Nome completo" valor={usuario.nome} />
          <InfoItem icone="mail-outline"      label="E-mail"        valor={usuario.email} />
          <InfoItem icone="call-outline"      label="Telefone"      valor={formatarTelefone(usuario.telefone)} />
          <InfoItem icone="card-outline"      label="CPF"           valor={formatarCPF(usuario.cpf)} />
          <InfoItem icone="location-outline"  label="Endereço"      valor={usuario.endereco} />
          <InfoItem icone="today-outline"     label="Membro desde"  valor={formatarData(usuario.dtCadastro)} />
        </View>

        {/* SAIR */}
        <TouchableOpacity style={styles.sairBtn} activeOpacity={0.8} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={cores.erro} />
          <Text style={styles.sairTexto}>Sair da conta</Text>
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
  avatarIniciais: {
    fontSize: 32,
    fontWeight: "800",
    color: cores.branco,
  },
  nome: {
    fontSize: 22,
    fontWeight: "800",
    color: cores.branco,
  },
  email: {
    fontSize: 13,
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
  infoTexto: {
    flex: 1,
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
  },
  sairBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.erro,
  },
  sairTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: cores.erro,
  },
});