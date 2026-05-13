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
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { cores } from '../../theme/cores';
import { PawBackground } from '../../components/PawBackground';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      const sucesso = await login(email.trim(), senha);
      if (!sucesso) {
        Alert.alert('Erro', 'E-mail ou senha incorretos.');
      }
      // Se sucesso, o AuthContext atualiza `usuario` e o App.tsx redireciona automaticamente para Home
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PawBackground />
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoMedio} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
    
        {/* ── FORMULÁRIO ── */}
        <View style={styles.form}>
          <Image source={require('../../img/logo.png')} style={styles.logo} resizeMode="contain" />
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
              value={email}
              onChangeText={setEmail}
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
              value={senha}
              onChangeText={setSenha}
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
          <TouchableOpacity
            style={[styles.botaoLogin, carregando && { opacity: 0.6 }]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={carregando}
          >
            <Text style={styles.botaoLoginTexto}>{carregando ? 'Entrando...' : 'Login'}</Text>
          </TouchableOpacity>

          {/* Criar conta */}
          <TouchableOpacity style={styles.criarContaWrap} onPress={() => navigation.navigate('Cadastro' as never)} activeOpacity={0.85}>
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

  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
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