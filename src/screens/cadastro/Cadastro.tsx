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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cores } from "../../theme/cores";
import { PawBackground } from "../../components/PawBackground";

export const Cadastro = () => {
  const navigation = useNavigation();
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <PawBackground />
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />

      {/* ── HEADER ── */}
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={cores.branco} />
        <Text style={styles.headerTexto}>Criar conta</Text>
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
              />
            </View>

            {/* CPF */}
            <View style={styles.inputWrap}>
              <Ionicons name="card-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Insira seu cpf"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Insira seu email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Telefone */}
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
              />
            </View>

            {/* Senha */}
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry={!senhaVisivel}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={styles.inputIconeDireita}>
                <Ionicons
                  name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
            </View>

            {/* Endereço */}
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="words"
              />
            </View>

            {/* Botão Login */}
            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Login' as never)} activeOpacity={0.85}>
              <Text style={styles.botaoTexto}>Login</Text>
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
    marginBottom: 14,
    width: "100%",
    paddingHorizontal: 14,
    height: 50,
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
});