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
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cores } from "../../theme/cores";
import { PawBackground } from "../../components/PawBackground";
import { useCreateTutor, useCreateTutorPhone, useFindOrCreateState, useFindOrCreateCity, useCreateTutorAddress } from "../../hooks/useTutor";
import { nomeEstado } from "../../constants/estadosBrasil";
import { loginTutor } from "../../services/api/tutorApi";
import { setAuthToken } from "../../services/api/client";


const ADDRESS_TYPE_ID_RESIDENCIAL = 1;

export const Cadastro = () => {
  const navigation = useNavigation();
  const criarTutor = useCreateTutor();
  const criarTelefone = useCreateTutorPhone();
  const resolverEstado = useFindOrCreateState();
  const resolverCidade = useFindOrCreateCity();
  const criarEndereco = useCreateTutorAddress();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    endereco: '',
    numero: '',
    complemento: '',
    cep: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [erros, setErros] = useState<Partial<typeof form>>({});

  const atualizar = (campo: keyof typeof form, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: '' }));
  };

  const mascararCEP = (valor: string) => {
    const d = valor.replace(/\D/g, '').slice(0, 8);
    const r = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    atualizar('cep', r);
  };

  const validar = (): boolean => {
    const novosErros: Partial<typeof form> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cpfNumeros = form.cpf.replace(/\D/g, '');
    const telNumeros = form.telefone.replace(/\D/g, '');
    const cepNumeros = form.cep.replace(/\D/g, '');

    if (form.nome.trim().length < 3)
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres.';
    if (cpfNumeros.length !== 11)
      novosErros.cpf = 'CPF deve conter 11 dígitos.';
    if (!emailRegex.test(form.email))
      novosErros.email = 'E-mail inválido.';
    if (telNumeros.length < 10)
      novosErros.telefone = 'Telefone deve ter pelo menos 10 dígitos.';
    if (form.senha.length < 6)
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres.';
    if (form.endereco.trim().length < 5)
      novosErros.endereco = 'Endereço inválido.';
    if (form.numero.trim().length === 0)
      novosErros.numero = 'Número é obrigatório.';
    if (cepNumeros.length !== 8)
      novosErros.cep = 'CEP deve conter 8 dígitos.';
    if (form.bairro.trim().length < 2)
      novosErros.bairro = 'Bairro inválido.';
    if (form.cidade.trim().length < 2)
      novosErros.cidade = 'Cidade inválida.';
    if (!/^[A-Za-z]{2}$/.test(form.estado.trim()))
      novosErros.estado = 'Use a sigla do estado (ex: SP).';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastrar = async () => {
    if (!validar()) return;

    const { nome, cpf, telefone, endereco, numero, complemento, cep, bairro, cidade } = form;
    const email = form.email.trim().toLowerCase();
    const senha = form.senha.trim();
    const estado = form.estado.trim().toUpperCase();
    setCarregando(true);
    try {
      const tutor = await criarTutor.mutateAsync({ name: nome, cpf, email, password: senha });
      const { token } = await loginTutor({ email, password: senha });
      setAuthToken(token);

      await criarTelefone.mutateAsync({ tutorId: tutor.id, phoneNumber: telefone });

      const estadoResolvido = await resolverEstado.mutateAsync({ code: estado, name: nomeEstado(estado) });
      const cidadeResolvida = await resolverCidade.mutateAsync({ name: cidade, stateCode: estadoResolvido.code });
      await criarEndereco.mutateAsync({
        tutorId: tutor.id,
        addressTypeId: ADDRESS_TYPE_ID_RESIDENCIAL,
        cityId: cidadeResolvida.id,
        address: endereco,
        number: numero,
        complement: complemento || null,
        zipCode: cep,
        neighborhood: bairro,
      });


      setAuthToken(null);

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Login' as never) },
      ]);
    } catch {
      setAuthToken(null);
      Alert.alert(
        'Não foi possível criar a conta',
        'Não foi possível conectar ou o e-mail, tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PawBackground />
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />

      {/* ── HEADER ── */}
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={cores.branco} />
        <Text style={styles.headerTexto}>Voltar</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          {/* ── LOGO ── */}
          <Image source={require("../../img/logo.png")} style={styles.logo} resizeMode="contain" />

          {/* ── FORMULÁRIO ── */}
          <View style={styles.form}>
            <Text style={styles.titulo}>Crie sua conta</Text>

            {/* Nome */}
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Insira seu nome"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.nome}
                onChangeText={(v) => atualizar('nome', v)}
              />
            </View>
            {erros.nome ? <Text style={styles.erro}>{erros.nome}</Text> : null}

            {/* CPF */}
            <View style={styles.inputWrap}>
              <Ionicons name="card-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Insira seu cpf"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                maxLength={14}
                value={form.cpf}
                onChangeText={(v) => atualizar('cpf', v)}
              />
            </View>
            {erros.cpf ? <Text style={styles.erro}>{erros.cpf}</Text> : null}

            {/* Email */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Insira seu email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(v) => atualizar('email', v)}
              />
            </View>
            {erros.email ? <Text style={styles.erro}>{erros.email}</Text> : null}

            {/* Telefone */}
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
                value={form.telefone}
                onChangeText={(v) => atualizar('telefone', v)}
              />
            </View>
            {erros.telefone ? <Text style={styles.erro}>{erros.telefone}</Text> : null}

            {/* Senha */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                value={form.senha}
                onChangeText={(v) => atualizar('senha', v)}
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

            {/* Endereço */}
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
                value={form.endereco}
                onChangeText={(v) => atualizar('endereco', v)}
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
                  onChangeText={(v) => atualizar('numero', v)}
                />
              </View>
              <View style={[styles.inputWrap, styles.inputLarga]}>
                <TextInput
                  style={styles.input}
                  placeholder="Complemento"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="words"
                  value={form.complemento}
                  onChangeText={(v) => atualizar('complemento', v)}
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
                onChangeText={(v) => atualizar('bairro', v)}
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
                  onChangeText={(v) => atualizar('cidade', v)}
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
                  onChangeText={(v) => atualizar('estado', v.toUpperCase())}
                />
              </View>
            </View>
            {erros.cidade ? <Text style={styles.erro}>{erros.cidade}</Text> : null}
            {erros.estado ? <Text style={styles.erro}>{erros.estado}</Text> : null}

            {/* Botão Cadastrar */}
            <TouchableOpacity
              style={[styles.botao, carregando && { opacity: 0.6 }]}
              onPress={handleCadastrar}
              activeOpacity={0.85}
              disabled={carregando}
            >
              <Text style={styles.botaoTexto}>{carregando ? 'Salvando...' : 'Cadastrar'}</Text>
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
    paddingBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: cores.branco,
    marginBottom: 24,
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
  inputIcone: {
    marginRight: 10,
  },
  inputIconeDireita: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
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
    alignSelf: 'flex-start',
    fontSize: 11,
    color: '#FFD0D0',
    marginBottom: 10,
    marginLeft: 4,
  },
});