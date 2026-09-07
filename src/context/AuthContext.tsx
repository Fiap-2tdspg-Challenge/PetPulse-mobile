import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/Usuario';
import { Veterinario } from '../types/Veterinario';
import { getUsuarios, getVeterinarios, salvarUsuarioLocal } from '../services/storage';
import { loginTutor } from '../services/api/tutorApi';

const SESSAO_KEY = '@petpulse:sessao';

type TipoSessao = 'TUTOR' | 'VETERINARIO';
interface SessaoArmazenada {
  tipo: TipoSessao;
  id: number;
}

interface AuthContextData {
  usuario: Usuario | null;
  veterinario: Veterinario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  loginVeterinario: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  atualizarUsuario: (dados: Usuario) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const raw = await AsyncStorage.getItem(SESSAO_KEY);
        if (!raw) return;

        const sessao: SessaoArmazenada = JSON.parse(raw);
        if (sessao.tipo === 'VETERINARIO') {
          const veterinarios = await getVeterinarios();
          const v = veterinarios.find((v) => v.idVeterinario === sessao.id);
          if (v) setVeterinario(v);
        } else {
          const usuarios = await getUsuarios();
          const u = usuarios.find((u) => u.id === sessao.id);
          if (u) setUsuario(u);
        }
      } finally {
        setCarregando(false);
      }
    }
    carregarSessao();
  }, []);

  // Login do Tutor consulta a API de verdade (POST /tutors/login) — ainda é
  // provisório (sem hash de senha, sem token), mas já valida contra o banco
  // em vez de comparar só localmente. A cópia local (AsyncStorage) é
  // reconciliada depois, pra manter campos que a API não tem (telefone,
  // endereço) e permitir restaurar a sessão sem a API no ar.
  const login = async (email: string, senha: string): Promise<boolean> => {
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = senha.trim();
    try {
      const tutor = await loginTutor({ email: emailNormalizado, password: senhaNormalizada });

      // Reconcilia com a cópia local, que guarda campos que a API não tem
      // (telefone, endereço) — cria a cópia se ainda não existir (ex: conta
      // criada direto na API/Swagger).
      const usuarios = await getUsuarios();
      const existente = usuarios.find((u) => u.id === tutor.id);
      const usuarioLocal: Usuario = {
        ...tutor,
        telefone: existente?.telefone ?? '',
        endereco: existente?.endereco ?? '',
        numero: existente?.numero ?? '',
        complemento: existente?.complemento ?? '',
        cep: existente?.cep ?? '',
        bairro: existente?.bairro ?? '',
        cidade: existente?.cidade ?? '',
        estado: existente?.estado ?? '',
        phoneId: existente?.phoneId,
        enderecoId: existente?.enderecoId,
      };
      await salvarUsuarioLocal(usuarioLocal);

      await AsyncStorage.setItem(SESSAO_KEY, JSON.stringify({ tipo: 'TUTOR', id: usuarioLocal.id }));
      setUsuario(usuarioLocal);
      return true;
    } catch {
      return false;
    }
  };

  const loginVeterinario = async (email: string, senha: string): Promise<boolean> => {
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = senha.trim();
    const veterinarios = await getVeterinarios();
    const v = veterinarios.find(
      (v) => v.email.trim().toLowerCase() === emailNormalizado && v.senha.trim() === senhaNormalizada
    );
    if (!v) return false;
    await AsyncStorage.setItem(SESSAO_KEY, JSON.stringify({ tipo: 'VETERINARIO', id: v.idVeterinario }));
    setVeterinario(v);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSAO_KEY);
    setUsuario(null);
    setVeterinario(null);
  };

  const atualizarUsuario = async (dados: Usuario) => {
    await salvarUsuarioLocal(dados);
    setUsuario(dados);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, veterinario, carregando, login, loginVeterinario, logout, atualizarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
