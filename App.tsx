import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTema } from './src/context/ThemeContext';
import { Routes } from './src/routes/Routes';
import { queryClient } from './src/services/queryClient';

const NavegacaoComTema = () => {
  const { navigationTheme } = useTema();
  return (
    <NavigationContainer theme={navigationTheme}>
      <Routes />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavegacaoComTema />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
