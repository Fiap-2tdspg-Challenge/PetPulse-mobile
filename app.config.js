// Convertido de app.json para app.config.js só pra poder injetar a chave do
// Google Maps nativa (react-native-maps) a partir da variável de ambiente, em
// vez de deixá-la hardcoded num arquivo versionado. O Expo já carrega o .env
// automaticamente aqui (suporte nativo a EXPO_PUBLIC_* em app.config.js).
module.exports = {
  expo: {
    name: 'PetPulse-mobile',
    slug: 'PetPulse-mobile',
    version: '1.0.0',
    userInterfaceStyle: 'automatic',
    plugins: ['expo-status-bar', 'expo-font'],
    android: {
      package: 'com.petpulsemobile',
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
        },
      },
    },
    ios: {
      bundleIdentifier: 'com.petpulsemobile',
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
      },
    },
  },
};
