import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/Usuario';
import { Veterinario } from '../types/Veterinario';
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
// O Tutor sempre existe primeiro na API (POST /tutors) — não há mais criação
// "só local". Este arquivo guarda apenas uma cópia por id (o id do Tutor na
// API) com os campos que a API não tem: telefone, endereço.

export async function getUsuarios(): Promise<Usuario[]> {
  const raw = await AsyncStorage.getItem(KEYS.USUARIOS);
  return raw ? (JSON.parse(raw) as Usuario[]) : [];
}

/** Grava (cria ou atualiza) a cópia local de um Tutor, indexada pelo id da API. */
export async function salvarUsuarioLocal(usuario: Usuario): Promise<void> {
  const usuarios = await getUsuarios();
  const existe = usuarios.some((u) => u.id === usuario.id);
  const atualizados = existe
    ? usuarios.map((u) => (u.id === usuario.id ? usuario : u))
    : [...usuarios, usuario];
  await AsyncStorage.setItem(KEYS.USUARIOS, JSON.stringify(atualizados));
}

/** Remove a cópia local de um Tutor (usado ao excluir a conta). */
export async function removerUsuarioLocal(id: number): Promise<void> {
  const usuarios = await getUsuarios();
  const atualizados = usuarios.filter((u) => u.id !== id);
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
