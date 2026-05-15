import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { Home } from "../screens/Home/home";
import { cores } from "../theme/cores";
import { Perfil } from "../screens/perfil/Perfil";
import { PerfilPet } from "../screens/perfilPet/perfilPet";
import { HistoricoClinico } from "../screens/historicoClinico/historicoClinico";
import { LocalizaPet } from "../screens/localizaPet/LocalizaPet";
import { CadastraPet } from "../screens/cadastraPet/CadastraPet";
import { ActivityIndicator, View } from "react-native";
import { Login } from "../screens/login/Login";
import { Cadastro } from "../screens/cadastro/Cadastro";

export const Routes = () => {

const Stack = createNativeStackNavigator();
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