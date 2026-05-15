import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cores } from "../../theme/cores";
import { PawBackground } from "../../components/PawBackground";
import { useAuth } from "../../context/AuthContext";

export const EditaPerfil = () => {
  const navigation = useNavigation();
  const { usuario, atualizarUsuario } = useAuth();
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nome: usuario?.nome ?? "",
    email: usuario?.email ?? "",
    telefone: usuario?.telefone ?? "",
    cpf: usuario?.cpf ?? "",
    endereco: usuario?.endereco ?? "",
  });

  const [erros, setErros] = useState<Partial<Record<keyof typeof form, string>>>({});

  const atualizar = (campo: keyof typeof form, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const mascararTelefone = (valor: string) => {
    const d = valor.replace(/\D/g, "").slice(0, 11);
    let r = d;
    if (d.length > 2) r = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) r = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    atualizar("telefone", r);
  };

  const mascararCPF = (valor: string) => {
    const d = valor.replace(/\D/g, "").slice(0, 11);
    let r = d;
    if (d.length > 3) r = `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length > 6) r = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    if (d.length > 9) r = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
    atualizar("cpf", r);
  };

  const validar = (): boolean => {
    const novosErros: Partial<Record<keyof typeof form, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (form.nome.trim().length < 3) novosErros.nome = "Nome deve ter pelo menos 3 caracteres.";
    if (!emailRegex.test(form.email)) novosErros.email = "E-mail inválido.";
    if (form.telefone.replace(/\D/g, "").length < 10) novosErros.telefone = "Telefone inválido.";
    if (form.cpf.replace(/\D/g, "").length !== 11) novosErros.cpf = "CPF deve ter 11 dígitos.";
    if (form.endereco.trim().length < 5) novosErros.endereco = "Endereço inválido.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar() || !usuario) return;
    setCarregando(true);
    try {
      await atualizarUsuario({
        ...usuario,
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.replace(/\D/g, ""),
        cpf: form.cpf.replace(/\D/g, ""),
        endereco: form.endereco.trim(),
      });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o perfil. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PawBackground />
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />

      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={cores.branco} />
        <Text style={styles.headerTexto}>Voltar</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          <Text style={styles.titulo}>Editar Perfil</Text>

          <View style={styles.form}>

            {/* Nome */}
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.nome}
                onChangeText={(v) => atualizar("nome", v)}
              />
            </View>
            {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}

            {/* E-mail */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(v) => atualizar("email", v)}
              />
            </View>
            {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}

            {/* Telefone */}
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
                maxLength={15}
                value={form.telefone}
                onChangeText={mascararTelefone}
              />
            </View>
            {erros.telefone ? <Text style={styles.erro}>{erros.telefone}</Text> : null}

            {/* CPF */}
            <View style={styles.inputWrap}>
              <Ionicons name="card-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                maxLength={14}
                value={form.cpf}
                onChangeText={mascararCPF}
              />
            </View>
            {erros.cpf ? <Text style={styles.erro}>{erros.cpf}</Text> : null}

            {/* Endereço */}
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.endereco}
                onChangeText={(v) => atualizar("endereco", v)}
              />
            </View>
            {erros.endereco ? <Text style={styles.erro}>{erros.endereco}</Text> : null}

            <TouchableOpacity
              style={[styles.botao, carregando && { opacity: 0.6 }]}
              onPress={handleSalvar}
              activeOpacity={0.85}
              disabled={carregando}
            >
              <Text style={styles.botaoTexto}>{carregando ? "Salvando..." : "Salvar alterações"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.roxoMedio },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  headerTexto: { fontSize: 15, color: cores.branco, fontWeight: "600" },
  container: { alignItems: "center", paddingHorizontal: 32, paddingBottom: 40 },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: cores.branco,
    marginBottom: 24,
    marginTop: 8,
  },
  form: { width: "100%", alignItems: "center" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    marginBottom: 4,
    width: "100%",
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcone: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: cores.branco },
  erro: { color: "#FFD6D6", fontSize: 12, alignSelf: "flex-start", marginBottom: 8 },
  botao: {
    backgroundColor: cores.branco,
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  botaoTexto: { fontSize: 15, fontWeight: "700", color: cores.roxoMedio },
});
