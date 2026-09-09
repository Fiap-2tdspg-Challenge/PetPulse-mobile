import AsyncStorage from '@react-native-async-storage/async-storage';
import { Veterinario } from '../types/Veterinario';
import { mockVeterinarios } from '../mocks/veterinario';

// Pets, Histórico Clínico, Alertas Inteligentes e Tutor (perfil, telefone,
// endereço) vêm todos da API real, sem cache local — ver src/hooks/usePets.ts,
// useHistorico.ts, useAlertas.ts e AuthContext.tsx. Este arquivo cuida só do
// login local do Veterinário (temporário, até a API ganhar JWT pra esse perfil).

const KEYS = {
  VETERINARIOS: '@petpulse:veterinarios',
};

// ── VETERINÁRIOS (login local, temporário até a API ganhar JWT + roles) ──────

export async function getVeterinarios(): Promise<Veterinario[]> {
  const raw = await AsyncStorage.getItem(KEYS.VETERINARIOS);
  if (!raw) {
    await AsyncStorage.setItem(KEYS.VETERINARIOS, JSON.stringify(mockVeterinarios));
    return mockVeterinarios;
  }
  return JSON.parse(raw) as Veterinario[];
}

// ── SEED (dev) ────────────────────────────────────────────────────────────────
// Veterinários não têm tela de autocadastro (não é o tutor quem cria essas
// contas), então precisam de dados de teste semeados.
export async function seedStorage(): Promise<void> {
  const veterinarios = await AsyncStorage.getItem(KEYS.VETERINARIOS);
  if (!veterinarios) {
    await AsyncStorage.setItem(KEYS.VETERINARIOS, JSON.stringify(mockVeterinarios));
  }
}
