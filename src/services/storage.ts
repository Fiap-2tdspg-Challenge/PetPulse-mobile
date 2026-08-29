import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/usuario';
import { Pet } from '../types/pet';
import { HistoricoClinico } from '../types/historicoClinico';
import { AlertaInteligente } from '../types/alertaInteligente';
import { mockUsuario } from '../mocks/usuario';
import { mockPets } from '../mocks/pet';
import { mockHistorico } from '../mocks/historicoClinico';
import { mockAlertas } from '../mocks/alertaInteligente';

const KEYS = {
  USUARIOS: '@petpulse:usuarios',
  PETS: '@petpulse:pets',
  HISTORICO: '@petpulse:historico_v2',
  ALERTAS: '@petpulse:alertas',
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

// ── ALERTAS ────────────────────────────────────────────────────────────────

export async function getAlertas(idsPets?: number[]): Promise<AlertaInteligente[]> {
  const raw = await AsyncStorage.getItem(KEYS.ALERTAS);
  if (!raw) {
    await AsyncStorage.setItem(KEYS.ALERTAS, JSON.stringify(mockAlertas));
    return idsPets ? mockAlertas.filter((a) => idsPets.includes(a.idPet)) : mockAlertas;
  }
  const alertas = JSON.parse(raw) as AlertaInteligente[];
  return idsPets ? alertas.filter((a) => idsPets.includes(a.idPet)) : alertas;
}

// ── SEED (dev) ────────────────────────────────────────────────────────────────
// Semeia apenas as chaves ainda inexistentes, para não apagar dados já
// cadastrados pelo usuário a cada vez que o app é aberto.
export async function seedStorage(): Promise<void> {
  const [usuarios, pets, historico, alertas] = await Promise.all([
    AsyncStorage.getItem(KEYS.USUARIOS),
    AsyncStorage.getItem(KEYS.PETS),
    AsyncStorage.getItem(KEYS.HISTORICO),
    AsyncStorage.getItem(KEYS.ALERTAS),
  ]);

  const pendentes: Promise<void>[] = [];
  if (!usuarios) pendentes.push(AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify([mockUsuario])));
  if (!pets) pendentes.push(AsyncStorage.setItem(KEYS.PETS, JSON.stringify(mockPets)));
  if (!historico) pendentes.push(AsyncStorage.setItem(KEYS.HISTORICO, JSON.stringify(mockHistorico)));
  if (!alertas) pendentes.push(AsyncStorage.setItem(KEYS.ALERTAS, JSON.stringify(mockAlertas)));

  await Promise.all(pendentes);
}
