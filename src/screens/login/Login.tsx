import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { cores } from '../../theme/cores';

export const Login = () => {
  const navigation = useNavigation();
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
    
        {/* ── FORMULÁRIO ── */}
        <View style={styles.form}>
          <Text style={styles.titulo}>Entre na sua conta</Text>

          {/* Email */}
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="Insira seu email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
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
                name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="rgba(255,255,255,0.7)"
              />
            </TouchableOpacity>
          </View>

          {/* Esqueceu a senha */}
          <TouchableOpacity style={styles.esqueceuWrap}>
            <Text style={styles.esqueceuTexto}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão Login */}
          <TouchableOpacity style={styles.botaoLogin} onPress={() => navigation.replace('Home')} activeOpacity={0.85}>  
            <Text style={styles.botaoLoginTexto}>Login</Text>
          </TouchableOpacity>

          {/* Criar conta */}
          <TouchableOpacity style={styles.criarContaWrap}>
            <Text style={styles.criarContaTexto}>Crie uma nova conta?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.roxoMedio,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  logoTexto: {
    fontSize: 22,
    fontWeight: '800',
    color: cores.branco,
    letterSpacing: 1,
  },

  // Formulário
  form: {
    width: '100%',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.branco,
    marginBottom: 24,
  },

  // Inputs
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    marginBottom: 14,
    width: '100%',
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

  // Esqueceu
  esqueceuWrap: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  esqueceuTexto: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  // Botão
  botaoLogin: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  botaoLoginTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.branco,
  },

  // Criar conta
  criarContaWrap: {
    marginTop: 4,
  },
  criarContaTexto: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
});