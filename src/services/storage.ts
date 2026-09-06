import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/usuario';
import { Veterinario } from '../types/veterinario';
import { mockVeterinarios } from '../mocks/veterinario';

// Pets, Histórico Clínico e Alertas Inteligentes vêm da API real (ver
// src/hooks/usePets.ts, useHistorico.ts, useAlertas.ts). Este arquivo cuida
// só da sessão local: Tutor (login/cadastro, sem endpoint de autenticação na
// API ainda) e Veterinário (login local temporário, ver AuthContext.tsx).

const KEYS = {
  USUARIOS: '@petpulse:usuarios',
  VETERINARIOS: '@petpulse:veterinarios',
};

// ── USUÁRIOS (Tutor) ─────────────────────────────────────────────────────────

export async function getUsuarios(): Promise<Usuario[]> {
  const raw = await AsyncStorage.getItem(KEYS.USUARIOS);
  return raw ? (JSON.parse(raw) as Usuario[]) : [];
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

export async function updateUsuario(usuarioAtualizado: Usuario): Promise<void> {
  const usuarios = await getUsuarios();
  const atualizados = usuarios.map((u) =>
    u.idUsuario === usuarioAtualizado.idUsuario ? usuarioAtualizado : u
  );
  await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify(atualizados));
}

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
// contas), então precisam de dados de teste semeados. Tutores se cadastram
// normalmente pela tela de Cadastro, sem necessidade de seed.
export async function seedStorage(): Promise<void> {
  const veterinarios = await AsyncStorage.getItem(KEYS.VETERINARIOS);
  if (!veterinarios) {
    await AsyncStorage.setItem(KEYS.VETERINARIOS, JSON.stringify(mockVeterinarios));
  }
}
