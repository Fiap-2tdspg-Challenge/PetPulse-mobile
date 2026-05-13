import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/screens/Home/home';
import { Login } from './src/screens/login/Login';
import { Cadastro } from './src/screens/cadastro/Cadastro';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { cores } from './src/theme/cores';
import { Perfil } from './src/screens/perfil/Perfil';
import { PerfilPet } from './src/screens/perfilPet/perfilPet';
import { HistoricoClinico } from './src/screens/historicoClinico/historicoClinico';
import { LocalizaPet } from './src/screens/localizaPet/LocalizaPet';
import { CadastraPet } from './src/screens/cadastraPet/CadastraPet';


const Stack = createNativeStackNavigator();

function Routes() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.roxoMedio }}>
        <ActivityIndicator size="large" color={cores.branco} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="MeuPet" component={PerfilPet} />
          <Stack.Screen name="HistoricoClinico" component={HistoricoClinico} />
          <Stack.Screen name="LocalizaPet" component={LocalizaPet} />
          <Stack.Screen name="CadastraPet" component={CadastraPet} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

