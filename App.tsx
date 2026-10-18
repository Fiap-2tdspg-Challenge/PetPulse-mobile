import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTema } from './src/context/ThemeContext';
import { Routes } from './src/routes/Routes';
import { queryClient } from './src/services/queryClient';

// Ref de navegação fora da árvore de componentes, pra poder navegar a partir
// do listener de notificação (dispara mesmo com o app em background, onde
// não há um useNavigation() de tela disponível).
const navigationRef = createNavigationContainerRef();

const NavegacaoComTema = () => {
  const { navigationTheme } = useTema();
  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Routes />
    </NavigationContainer>
  );
};

export default function App() {
  // Ao tocar numa notificação de alerta, leva o tutor pra Home (onde os
  // alertas pendentes aparecem) — é a "integração com o fluxo do app" da
  // notificação, não só um aviso solto.
  useEffect(() => {
    const assinatura = Notifications.addNotificationResponseReceivedListener((resposta) => {
      const tipo = resposta.notification.request.content.data?.tipo;
      if (tipo === 'alerta-risco' && navigationRef.isReady()) {
        navigationRef.navigate('Home' as never);
      }
    });
    return () => assinatura.remove();
  }, []);

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
