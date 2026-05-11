import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/screens/Home/home';
import { Login } from './src/screens/login/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login' }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

