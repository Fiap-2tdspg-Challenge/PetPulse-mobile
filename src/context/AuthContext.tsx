import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/usuario';
import { getUsuarios } from '../services/storage';

const SESSAO_KEY = '@petpulse:sessao';

interface AuthContextData {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const raw = await AsyncStorage.getItem(SESSAO_KEY);
        if (raw) {
          const id = parseInt(raw, 10);
          const usuarios = await getUsuarios();
          const u = usuarios.find((u) => u.idUsuario === id);
          if (u) setUsuario(u);
        }
      } finally {
        setCarregando(false);
      }
    }
    carregarSessao();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    const usuarios = await getUsuarios();
    const u = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );
    if (!u) return false;
    await AsyncStorage.setItem(SESSAO_KEY, String(u.idUsuario));
    setUsuario(u);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSAO_KEY);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
