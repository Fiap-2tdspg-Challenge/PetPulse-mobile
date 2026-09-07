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
import {
  useUpdateTutor,
  useCreateTutorPhone,
  useUpdateTutorPhone,
  useFindOrCreateState,
  useFindOrCreateCity,
  useCreateTutorAddress,
  useUpdateTutorAddress,
} from "../../hooks/useTutor";
import { nomeEstado } from "../../constants/estadosBrasil";

// Mesmo padrão do Cadastro: sem seletor de tipo de endereço, sempre Residencial.
const ADDRESS_TYPE_ID_RESIDENCIAL = 1;

export const EditaPerfil = () => {
  const navigation = useNavigation();
  const { usuario, atualizarUsuario } = useAuth();
  const atualizarTutor = useUpdateTutor();
  const criarTelefone = useCreateTutorPhone();
  const atualizarTelefone = useUpdateTutorPhone();
  const resolverEstado = useFindOrCreateState();
  const resolverCidade = useFindOrCreateCity();
  const criarEndereco = useCreateTutorAddress();
  const atualizarEndereco = useUpdateTutorAddress();
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const [form, setForm] = useState({
    nome: usuario?.name ?? "",
    email: usuario?.email ?? "",
    telefone: usuario?.telefone ?? "",
    cpf: usuario?.cpf ?? "",
    endereco: usuario?.endereco ?? "",
    numero: usuario?.numero ?? "",
    complemento: usuario?.complemento ?? "",
    cep: usuario?.cep ?? "",
    bairro: usuario?.bairro ?? "",
    cidade: usuario?.cidade ?? "",
    estado: usuario?.estado ?? "",
    senha: "",
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

  const mascararCEP = (valor: string) => {
    const d = valor.replace(/\D/g, "").slice(0, 8);
    const r = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    atualizar("cep", r);
  };

  const validar = (): boolean => {
    const novosErros: Partial<Record<keyof typeof form, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (form.nome.trim().length < 3) novosErros.nome = "Nome deve ter pelo menos 3 caracteres.";
    if (!emailRegex.test(form.email)) novosErros.email = "E-mail inválido.";
    if (form.telefone.replace(/\D/g, "").length < 10) novosErros.telefone = "Telefone inválido.";
    if (form.cpf.replace(/\D/g, "").length !== 11) novosErros.cpf = "CPF deve ter 11 dígitos.";
    if (form.endereco.trim().length < 5) novosErros.endereco = "Endereço inválido.";
    if (form.numero.trim().length === 0) novosErros.numero = "Número é obrigatório.";
    if (form.cep.replace(/\D/g, "").length !== 8) novosErros.cep = "CEP deve conter 8 dígitos.";
    if (form.bairro.trim().length < 2) novosErros.bairro = "Bairro inválido.";
    if (form.cidade.trim().length < 2) novosErros.cidade = "Cidade inválida.";
    if (!/^[A-Za-z]{2}$/.test(form.estado.trim())) novosErros.estado = "Use a sigla do estado (ex: SP).";
    if (form.senha.length < 6) novosErros.senha = "Senha deve ter no mínimo 6 caracteres.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar() || !usuario) return;
    setCarregando(true);
    try {
      const nome = form.nome.trim();
      const email = form.email.trim();
      const cpf = form.cpf.replace(/\D/g, "");
      const telefone = form.telefone.replace(/\D/g, "");
      const endereco = form.endereco.trim();
      const numero = form.numero.trim();
      const complemento = form.complemento.trim();
      const cep = form.cep.trim();
      const bairro = form.bairro.trim();
      const cidade = form.cidade.trim();
      const estado = form.estado.trim().toUpperCase();
      const senha = form.senha.trim();

      // Atualiza o Tutor de verdade na API — o PUT /tutors/{id} exige senha
      // no corpo (mesmo DTO usado na criação), por isso ela é pedida aqui
      // pra confirmar a alteração.
      const tutorAtualizado = await atualizarTutor.mutateAsync({
        id: usuario.id,
        dados: { name: nome, cpf, email, password: senha },
      });

      const fone = usuario.phoneId
        ? await atualizarTelefone.mutateAsync({
            id: usuario.phoneId,
            dados: { tutorId: usuario.id, phoneNumber: telefone },
          })
        : await criarTelefone.mutateAsync({ tutorId: usuario.id, phoneNumber: telefone });

      const estadoResolvido = await resolverEstado.mutateAsync({ code: estado, name: nomeEstado(estado) });
      const cidadeResolvida = await resolverCidade.mutateAsync({ name: cidade, stateCode: estadoResolvido.code });
      const dadosEndereco = {
        tutorId: usuario.id,
        addressTypeId: ADDRESS_TYPE_ID_RESIDENCIAL,
        cityId: cidadeResolvida.id,
        address: endereco,
        number: numero,
        complement: complemento || null,
        zipCode: cep,
        neighborhood: bairro,
      };
      const enderecoApi = usuario.enderecoId
        ? await atualizarEndereco.mutateAsync({ id: usuario.enderecoId, dados: dadosEndereco })
        : await criarEndereco.mutateAsync(dadosEndereco);

      await atualizarUsuario({
        ...tutorAtualizado,
        telefone,
        endereco,
        numero,
        complemento,
        cep,
        bairro,
        cidade,
        estado,
        phoneId: fone.id,
        enderecoId: enderecoApi.id,
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert(
        "Não foi possível salvar",
        "Não foi possível conectar à API. Verifique se ela está no ar e tente novamente."
      );
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

            {/* Número + Complemento */}
            <View style={styles.linha}>
              <View style={[styles.inputWrap, styles.inputEstreita]}>
                <TextInput
                  style={styles.input}
                  placeholder="Número"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="numeric"
                  value={form.numero}
                  onChangeText={(v) => atualizar("numero", v)}
                />
              </View>
              <View style={[styles.inputWrap, styles.inputLarga]}>
                <TextInput
                  style={styles.input}
                  placeholder="Complemento"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="words"
                  value={form.complemento}
                  onChangeText={(v) => atualizar("complemento", v)}
                />
              </View>
            </View>
            {erros.numero ? <Text style={styles.erro}>{erros.numero}</Text> : null}

            {/* CEP */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-open-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="CEP"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                maxLength={9}
                value={form.cep}
                onChangeText={mascararCEP}
              />
            </View>
            {erros.cep ? <Text style={styles.erro}>{erros.cep}</Text> : null}

            {/* Bairro */}
            <View style={styles.inputWrap}>
              <Ionicons name="home-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Bairro"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.bairro}
                onChangeText={(v) => atualizar("bairro", v)}
              />
            </View>
            {erros.bairro ? <Text style={styles.erro}>{erros.bairro}</Text> : null}

            {/* Cidade + Estado */}
            <View style={styles.linha}>
              <View style={[styles.inputWrap, styles.inputLarga]}>
                <Ionicons name="business-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
                <TextInput
                  style={styles.input}
                  placeholder="Cidade"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="words"
                  value={form.cidade}
                  onChangeText={(v) => atualizar("cidade", v)}
                />
              </View>
              <View style={[styles.inputWrap, styles.inputEstreita]}>
                <TextInput
                  style={styles.input}
                  placeholder="UF"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="characters"
                  maxLength={2}
                  value={form.estado}
                  onChangeText={(v) => atualizar("estado", v.toUpperCase())}
                />
              </View>
            </View>
            {erros.cidade ? <Text style={styles.erro}>{erros.cidade}</Text> : null}
            {erros.estado ? <Text style={styles.erro}>{erros.estado}</Text> : null}

            {/* Senha (confirma a alteração na API) */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                value={form.senha}
                onChangeText={(v) => atualizar("senha", v)}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={styles.inputIconeDireita}>
                <Ionicons
                  name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
            </View>
            {erros.senha ? <Text style={styles.erro}>{erros.senha}</Text> : null}

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
  linha: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
  },
  inputLarga: {
    flex: 2,
  },
  inputEstreita: {
    flex: 1,
  },
  inputIcone: { marginRight: 10 },
  inputIconeDireita: { marginLeft: 8 },
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
