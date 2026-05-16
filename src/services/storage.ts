import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/usuario';
import { Pet } from '../types/pet';
import { HistoricoClinico } from '../types/historicoClinico';
import { mockUsuario } from '../mocks/usuario';
import { mockPets } from '../mocks/pet';
import { mockHistorico } from '../mocks/historicoClinico';

const KEYS = {
  USUARIOS: '@petpulse:usuarios',
  PETS: '@petpulse:pets',
  HISTORICO: '@petpulse:historico_v2',
};

// ── USUÁRIOS ─────────────────────────────────────────────────────────────────

export async function getUsuarios(): Promise<Usuario[]> {
  const raw = await AsyncStorage.getItem(KEYS.USUARIOS);
  if (!raw) {
    // Semeie com o mock na primeira execução
    await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify([mockUsuario]));
    return [mockUsuario];
  }
  return JSON.parse(raw) as Usuario[];
}

export async function saveUsuario(
  dados: Omit<Usuario, 'idUsuario' | 'dtCadastro'>
): Promise<Usuario> {
  const usuarios = await getUsuarios();
  const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.idUsuario)) + 1 : 1;
  const novoUsuario: Usuario = {
    ...dados,
    idUsuario: novoId,
    dtCadastro: new Date().toISOString().split('T')[0],
  };
  await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify([...usuarios, novoUsuario]));
  return novoUsuario;
}

export async function getUsuarioPorEmail(email: string): Promise<Usuario | undefined> {
  const usuarios = await getUsuarios();
  return usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// ── PETS ─────────────────────────────────────────────────────────────────────

export async function getPets(idUsuario?: number): Promise<Pet[]> {
  const raw = await AsyncStorage.getItem(KEYS.PETS);
  if (!raw) {
    // Semeie com os mocks na primeira execução
    await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(mockPets));
    return idUsuario ? mockPets.filter((p) => p.idUsuario === idUsuario) : mockPets;
  }
  const pets = JSON.parse(raw) as Pet[];
  return idUsuario ? pets.filter((p) => p.idUsuario === idUsuario) : pets;
}

export async function savePet(
  dados: Omit<Pet, 'idPet' | 'dtCadastro'>
): Promise<Pet> {
  const pets = await getPets();
  const novoId = pets.length > 0 ? Math.max(...pets.map((p) => p.idPet)) + 1 : 1;
  const novoPet: Pet = {
    ...dados,
    idPet: novoId,
    dtCadastro: new Date().toISOString().split('T')[0],
  };
  await AsyncStorage.setItem(KEYS.PETS, JSON.stringify([...pets, novoPet]));
  return novoPet;
}

export async function updatePet(petAtualizado: Pet): Promise<void> {
  const pets = await getPets();
  const atualizados = pets.map((p) => (p.idPet === petAtualizado.idPet ? petAtualizado : p));
  await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(atualizados));
}

export async function updateUsuario(usuarioAtualizado: Usuario): Promise<void> {
  const usuarios = await getUsuarios();
  const atualizados = usuarios.map((u) =>
    u.idUsuario === usuarioAtualizado.idUsuario ? usuarioAtualizado : u
  );
  await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify(atualizados));
}

// ── HISTÓRICO CLÍNICO ─────────────────────────────────────────────────────────

export async function getHistorico(idPet?: number): Promise<HistoricoClinico[]> {
  const raw = await AsyncStorage.getItem(KEYS.HISTORICO);
  if (!raw) {
    await AsyncStorage.setItem(KEYS.HISTORICO, JSON.stringify(mockHistorico));
    return idPet ? mockHistorico.filter((h) => h.idPet === idPet) : mockHistorico;
  }
  const historico = JSON.parse(raw) as HistoricoClinico[];
  return idPet ? historico.filter((h) => h.idPet === idPet) : historico;
}

export async function saveHistorico(
  dados: Omit<HistoricoClinico, 'idHistorico'>
): Promise<HistoricoClinico> {
  const historico = await getHistorico();
  const novoId = historico.length > 0 ? Math.max(...historico.map((h) => h.idHistorico)) + 1 : 1;
  const novo: HistoricoClinico = { ...dados, idHistorico: novoId };
  await AsyncStorage.setItem(KEYS.HISTORICO, JSON.stringify([...historico, novo]));
  return novo;
}

// ── SEED (dev) ────────────────────────────────────────────────────────────────
// Força a carga dos mocks no AsyncStorage.
// Chame no startup do app durante desenvolvimento.
export async function seedStorage(): Promise<void> {
  await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify([mockUsuario]));
  await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(mockPets));
  await AsyncStorage.setItem(KEYS.HISTORICO, JSON.stringify(mockHistorico));
}
