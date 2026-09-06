import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/usuario';
import { Veterinario } from '../types/veterinario';
import { getUsuarios, getVeterinarios, updateUsuario } from '../services/storage';

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
          const u = usuarios.find((u) => u.idUsuario === sessao.id);
          if (u) setUsuario(u);
        }
      } finally {
        setCarregando(false);
      }
    }
    carregarSessao();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = senha.trim();
    const usuarios = await getUsuarios();
    const u = usuarios.find(
      (u) => u.email.trim().toLowerCase() === emailNormalizado && u.senha.trim() === senhaNormalizada
    );
    if (!u) return false;
    await AsyncStorage.setItem(SESSAO_KEY, JSON.stringify({ tipo: 'TUTOR', id: u.idUsuario }));
    setUsuario(u);
    return true;
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
    await updateUsuario(dados);
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
