import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';

export type ModoTema = 'light' | 'dark';

// Tokens de superfície/texto para as telas de "canvas neutro" (listas, dashboards)
// — as telas com fundo roxo de marca (Login, Cadastro, Perfil etc.) não usam
// esses tokens: o roxo da marca já funciona em qualquer tema, de propósito.
//
// roxoPrimario/roxoMedio/roxoClaro/roxoFundo espelham os tokens de mesmo nome
// em src/theme/cores.ts, mas com uma variante mais clara no escuro — usados
// só dentro das telas de canvas neutro (headers/cards roxos ali dentro, ex:
// o card do pet na Home), pra ficarem homogêneos com o resto do tema escuro
// em vez de usar o roxo fixo do modo claro.
export interface TemaCores {
  fundo: string;
  superficie: string;
  texto: string;
  textoSecundario: string;
  borda: string;
  roxoPrimario: string;
  roxoMedio: string;
  roxoClaro: string;
  roxoFundo: string;
}

const TEMA_CLARO: TemaCores = {
  fundo: '#F3F4F6',
  superficie: '#FFFFFF',
  texto: '#111827',
  textoSecundario: '#9CA3AF',
  borda: '#E5E7EB',
  roxoPrimario: '#6B21A8',
  roxoMedio: '#9333EA',
  roxoClaro: '#C084FC',
  roxoFundo: '#F5F3FF',
};

const TEMA_ESCURO: TemaCores = {
  fundo: '#121212',
  superficie: '#1E1E24',
  texto: '#F3F4F6',
  textoSecundario: '#9CA3AF',
  borda: '#2D2D35',
  roxoPrimario: '#7C3AED',
  roxoMedio: '#A855F7',
  roxoClaro: '#D8B4FE',
  roxoFundo: '#2D2140',
};

const PREFERENCIA_KEY = '@petpulse:tema';

interface ThemeContextData {
  modo: ModoTema;
  tema: TemaCores;
  alternarModo: () => void;
  navigationTheme: NavigationTheme;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const sistemaPrefereEscuro = useColorScheme() === 'dark';
  const [preferenciaManual, setPreferenciaManual] = useState<ModoTema | null>(null);

  // Lê a preferência salva (se o usuário já alternou manualmente antes); até
  // carregar, segue o tema do sistema operacional.
  useEffect(() => {
    AsyncStorage.getItem(PREFERENCIA_KEY).then((salvo) => {
      if (salvo === 'light' || salvo === 'dark') setPreferenciaManual(salvo);
    });
  }, []);

  const modo: ModoTema = preferenciaManual ?? (sistemaPrefereEscuro ? 'dark' : 'light');
  const tema = modo === 'dark' ? TEMA_ESCURO : TEMA_CLARO;

  const alternarModo = () => {
    const novoModo: ModoTema = modo === 'dark' ? 'light' : 'dark';
    setPreferenciaManual(novoModo);
    AsyncStorage.setItem(PREFERENCIA_KEY, novoModo);
  };

  const navigationTheme = useMemo<NavigationTheme>(() => {
    const base = modo === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: tema.fundo,
        card: tema.superficie,
        text: tema.texto,
        border: tema.borda,
      },
    };
  }, [modo, tema]);

  return (
    <ThemeContext.Provider value={{ modo, tema, alternarModo, navigationTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTema = () => useContext(ThemeContext);
