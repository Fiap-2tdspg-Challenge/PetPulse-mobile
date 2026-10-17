const { execSync } = require('child_process');

// Convertido de app.json para app.config.js pra poder injetar a chave do
// Google Maps nativa a partir da variável de ambiente, em vez de deixá-la
// hardcoded num arquivo versionado, e pra capturar o hash do commit atual
// (usado na tela "Sobre o App") — ambos só dá pra fazer num arquivo JS que
// roda em build time, não num app.json estático. O Expo já carrega o .env
// automaticamente aqui (suporte nativo a EXPO_PUBLIC_* em app.config.js).
function commitAtual() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    // Sem repositório git disponível no momento do build (ex: build limpo
    // sem histórico) — não quebra o build por causa disso.
    return 'desconhecido';
  }
}

module.exports = {
  expo: {
    name: 'PetPulse-mobile',
    slug: 'PetPulse-mobile',
    version: '1.0.0',
    userInterfaceStyle: 'automatic',
    plugins: ['expo-status-bar', 'expo-font'],
    extra: {
      commitHash: commitAtual(),
    },
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
