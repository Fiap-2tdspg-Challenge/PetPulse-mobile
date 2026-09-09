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
import { useNavigation, useRoute } from "@react-navigation/native";
import { cores } from "../../theme/cores";
import { PawBackground } from "../../components/PawBackground";
import { useAuth } from "../../context/AuthContext";
import { useCreateHistorico, useUpdateHistorico } from "../../hooks/useHistorico";
import { ApiRecordType, ClinicalHistoryResponse } from "../../types/types";

const CATEGORIAS: Array<{ tipo: ApiRecordType; label: string }> = [
  { tipo: "VACINA", label: "Vacina" },
  { tipo: "CONSULTA", label: "Consulta" },
  { tipo: "EXAME", label: "Exame" },
  { tipo: "MEDICAMENTO", label: "Medicamento" },
  { tipo: "DOENCA", label: "Doença" },
  { tipo: "OBSERVACAO", label: "Observação" },
];

function isoParaDisplay(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function displayParaISO(display: string): string {
  const [dia, mes, ano] = display.split("/");
  return `${ano}-${mes}-${dia}`;
}

export const CadastraHistorico = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { petId: number; tipoRegistro: ApiRecordType; historico?: ClinicalHistoryResponse };
  const { petId, historico } = params;
  const modoEdicao = !!historico;
  const { veterinario } = useAuth();

  const criarHistorico = useCreateHistorico();
  const atualizarHistorico = useUpdateHistorico();
  const carregando = criarHistorico.isPending || atualizarHistorico.isPending;

  const [tipoRegistro, setTipoRegistro] = useState<ApiRecordType>(historico?.recordType ?? params.tipoRegistro);
  const [form, setForm] = useState({
    descricao: historico?.description ?? "",
    dtRetorno: historico?.returnDate ? isoParaDisplay(historico.returnDate) : "",
    observacoes: historico?.observations ?? "",
  });
  const [erros, setErros] = useState<Partial<Record<"descricao" | "dtRetorno", string>>>({});

  const atualizar = (campo: keyof typeof form, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: "" }));
  };

  const mascararData = (valor: string) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    let resultado = numeros;
    if (numeros.length > 2) resultado = numeros.slice(0, 2) + "/" + numeros.slice(2);
    if (numeros.length > 4) resultado = numeros.slice(0, 2) + "/" + numeros.slice(2, 4) + "/" + numeros.slice(4);
    atualizar("dtRetorno", resultado);
  };

  const validar = (): boolean => {
    const novosErros: Partial<Record<"descricao" | "dtRetorno", string>> = {};
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (form.descricao.trim().length < 3) novosErros.descricao = "Descrição deve ter pelo menos 3 caracteres.";
    if (form.dtRetorno && !dataRegex.test(form.dtRetorno)) novosErros.dtRetorno = "Data no formato DD/MM/AAAA.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;

    const dados = {
      petId,
      professionalId: modoEdicao ? historico!.professionalId : veterinario?.id ?? null,
      recordType: tipoRegistro,
      description: form.descricao.trim(),
      returnDate: form.dtRetorno ? displayParaISO(form.dtRetorno) : null,
      observations: form.observacoes.trim() || null,
    };

    try {
      if (modoEdicao) {
        await atualizarHistorico.mutateAsync({ id: historico!.id, ...dados });
      } else {
        await criarHistorico.mutateAsync(dados);
      }
      Alert.alert("Sucesso", `Registro ${modoEdicao ? "atualizado" : "cadastrado"} com sucesso!`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Erro", `Não foi possível ${modoEdicao ? "atualizar" : "cadastrar"} o registro. Tente novamente.`);
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
          <Text style={styles.titulo}>{modoEdicao ? "Editar Registro" : "Novo Registro"}</Text>

          <View style={styles.form}>
            {/* Tipo de registro */}
            <View style={styles.toggleGroup}>
              <Text style={styles.toggleLabel}>Tipo</Text>
              <View style={styles.toggleRowWrap}>
                {CATEGORIAS.map((cat) => (
                  <TouchableOpacity
                    key={cat.tipo}
                    style={[styles.toggleBtnWrap, tipoRegistro === cat.tipo && styles.toggleBtnAtivo]}
                    onPress={() => setTipoRegistro(cat.tipo)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.toggleBtnTexto, tipoRegistro === cat.tipo && styles.toggleBtnTextoAtivo]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Descrição */}
            <View style={styles.inputWrap}>
              <Ionicons name="document-text-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Descrição (ex: Vacina V10, Check-up geral)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={form.descricao}
                onChangeText={(v) => atualizar("descricao", v)}
              />
            </View>
            {erros.descricao ? <Text style={styles.erro}>{erros.descricao}</Text> : null}

            {/* Data de retorno */}
            <View style={styles.inputWrap}>
              <Ionicons name="calendar-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Data de retorno (opcional)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                maxLength={10}
                value={form.dtRetorno}
                onChangeText={mascararData}
              />
            </View>
            {erros.dtRetorno ? <Text style={styles.erro}>{erros.dtRetorno}</Text> : null}

            {/* Observações */}
            <View style={[styles.inputWrap, styles.inputWrapMultiline]}>
              <Ionicons name="create-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Observações (opcional)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                multiline
                numberOfLines={3}
                value={form.observacoes}
                onChangeText={(v) => atualizar("observacoes", v)}
              />
            </View>

            {/* Botão */}
            <TouchableOpacity
              style={[styles.botao, carregando && { opacity: 0.6 }]}
              onPress={handleSalvar}
              activeOpacity={0.85}
              disabled={carregando}
            >
              <Text style={styles.botaoTexto}>
                {carregando ? "Salvando..." : modoEdicao ? "Salvar alterações" : "Cadastrar Registro"}
              </Text>
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
  inputWrapMultiline: { height: 84, alignItems: "flex-start", paddingTop: 12 },
  inputIcone: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: cores.branco },
  inputMultiline: { textAlignVertical: "top" },
  toggleGroup: { width: "100%", marginBottom: 16 },
  toggleLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    fontWeight: "600",
  },
  toggleRowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  toggleBtnWrap: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
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
  toggleBtnTextoAtivo: { color: cores.branco },
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
