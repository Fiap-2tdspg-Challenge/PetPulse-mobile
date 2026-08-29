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
import { useCreatePet } from "../../hooks/usePets";
import { useAuth } from "../../context/AuthContext";
import { Porte, Sexo } from "../../types/pet";

export const CadastraPet = () => {
  const navigation = useNavigation();
  const { usuario } = useAuth();
  const criarPet = useCreatePet();
  const carregando = criarPet.isPending;

  const [form, setForm] = useState({
    nome: "",
    especie: "",
    raca: "",
    dtNascimento: "",
    peso: "",
  });

  const [sexo, setSexo] = useState<Sexo>("MACHO");
  const [porte, setPorte] = useState<Porte>("MEDIO");
  const [castrado, setCastrado] = useState(false);

  const [erros, setErros] = useState<Partial<Record<keyof typeof form, string>>>({});

  const atualizar = (campo: keyof typeof form, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const mascararData = (valor: string) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    let resultado = numeros;
    if (numeros.length > 2) resultado = numeros.slice(0, 2) + "/" + numeros.slice(2);
    if (numeros.length > 4) resultado = numeros.slice(0, 2) + "/" + numeros.slice(2, 4) + "/" + numeros.slice(4);
    atualizar("dtNascimento", resultado);
  };

  const dataParaISO = (dataMascarada: string): string => {
    const [dia, mes, ano] = dataMascarada.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const validar = (): boolean => {
    const novosErros: Partial<Record<keyof typeof form, string>> = {};
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const pesoNum = parseFloat(form.peso.replace(",", "."));

    if (form.nome.trim().length < 2) novosErros.nome = "Nome deve ter pelo menos 2 caracteres.";
    if (form.especie.trim().length < 2) novosErros.especie = "Espécie inválida.";
    if (form.raca.trim().length < 2) novosErros.raca = "Raça inválida.";
    if (!dataRegex.test(form.dtNascimento)) novosErros.dtNascimento = "Data no formato DD/MM/AAAA.";
    if (isNaN(pesoNum) || pesoNum <= 0) novosErros.peso = "Peso inválido.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastrar = async () => {
    if (!validar()) return;
    if (!usuario) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      await criarPet.mutateAsync({
        idUsuario: usuario.idUsuario,
        nome: form.nome.trim(),
        especie: form.especie.trim(),
        raca: form.raca.trim(),
        dtNascimento: dataParaISO(form.dtNascimento),
        peso: parseFloat(form.peso.replace(",", ".")),
        sexo,
        castrado,
        porte,
      });
      Alert.alert("Sucesso", "Pet cadastrado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o pet. Tente novamente.");
    }
  };

  const ToggleGroup = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (v: any) => void;
  }) => (
    <View style={styles.toggleGroup}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.toggleBtn, value === opt.value && styles.toggleBtnAtivo]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleBtnTexto, value === opt.value && styles.toggleBtnTextoAtivo]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <PawBackground />
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />

      {/* HEADER */}
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={cores.branco} />
        <Text style={styles.headerTexto}>Voltar</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          <Text style={styles.titulo}>Cadastrar Pet</Text>

          <View style={styles.form}>

            {/* Nome */}
            <View style={styles.inputWrap}>
              <Ionicons name="paw-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Nome do pet"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.nome}
                onChangeText={(v) => atualizar("nome", v)}
              />
            </View>
            {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}

            {/* Espécie */}
            <View style={styles.inputWrap}>
              <Ionicons name="leaf-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Espécie (ex: Cachorro, Gato)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.especie}
                onChangeText={(v) => atualizar("especie", v)}
              />
            </View>
            {erros.especie ? <Text style={styles.erro}>{erros.especie}</Text> : null}

            {/* Raça */}
            <View style={styles.inputWrap}>
              <Ionicons name="ribbon-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Raça"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.raca}
                onChangeText={(v) => atualizar("raca", v)}
              />
            </View>
            {erros.raca ? <Text style={styles.erro}>{erros.raca}</Text> : null}

            {/* Data de Nascimento */}
            <View style={styles.inputWrap}>
              <Ionicons name="calendar-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                maxLength={10}
                value={form.dtNascimento}
                onChangeText={mascararData}
              />
            </View>
            {erros.dtNascimento ? <Text style={styles.erro}>{erros.dtNascimento}</Text> : null}

            {/* Peso */}
            <View style={styles.inputWrap}>
              <Ionicons name="barbell-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Peso (kg)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="decimal-pad"
                value={form.peso}
                onChangeText={(v) => atualizar("peso", v)}
              />
            </View>
            {erros.peso ? <Text style={styles.erro}>{erros.peso}</Text> : null}

            {/* Sexo */}
            <ToggleGroup
              label="Sexo"
              options={[
                { label: "Macho", value: "MACHO" },
                { label: "Fêmea", value: "FEMEA" },
              ]}
              value={sexo}
              onChange={setSexo}
            />

            {/* Porte */}
            <ToggleGroup
              label="Porte"
              options={[
                { label: "Pequeno", value: "PEQUENO" },
                { label: "Médio", value: "MEDIO" },
                { label: "Grande", value: "GRANDE" },
              ]}
              value={porte}
              onChange={setPorte}
            />

            {/* Castrado */}
            <View style={styles.toggleGroup}>
              <Text style={styles.toggleLabel}>Castrado</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, castrado && styles.toggleBtnAtivo]}
                  onPress={() => setCastrado(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.toggleBtnTexto, castrado && styles.toggleBtnTextoAtivo]}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, !castrado && styles.toggleBtnAtivo]}
                  onPress={() => setCastrado(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.toggleBtnTexto, !castrado && styles.toggleBtnTextoAtivo]}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão */}
            <TouchableOpacity
              style={[styles.botao, carregando && { opacity: 0.6 }]}
              onPress={handleCadastrar}
              activeOpacity={0.85}
              disabled={carregando}
            >
              <Text style={styles.botaoTexto}>{carregando ? "Salvando..." : "Cadastrar Pet"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  headerTexto: {
    fontSize: 15,
    color: cores.branco,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: cores.branco,
    marginBottom: 24,
    marginTop: 8,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
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
  inputIcone: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: cores.branco,
  },
  toggleGroup: {
    width: "100%",
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  toggleBtnAtivo: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderColor: cores.branco,
  },
  toggleBtnTexto: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "600",
  },
  toggleBtnTextoAtivo: {
    color: cores.branco,
  },
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: cores.branco,
  },
  erro: {
    alignSelf: "flex-start",
    fontSize: 11,
    color: "#FFD0D0",
    marginBottom: 10,
    marginLeft: 4,
  },
});