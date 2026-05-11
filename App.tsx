import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './src/screens/Home/home';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" >


        <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{title: "Home" }} 
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

