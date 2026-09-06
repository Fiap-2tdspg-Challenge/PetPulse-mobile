export type Porte = 'PEQUENO' | 'MEDIO' | 'GRANDE';
export type Sexo = 'MACHO' | 'FEMEA';

export interface Pet {
  idPet: number;
  idUsuario: number;
  nome: string;
  especie: string;
  raca: string;
  dtNascimento: string;
  peso: number;
  sexo: Sexo;
  castrado: boolean;
  porte: Porte;
  dtCadastro: string;
  /** Ids do catálogo (src/constants/catalogoPet.ts) usados para editar via API. */
  especieId?: number;
  racaId?: number;
  porteId?: number;
}

/** Dados de formulário para criar/editar um pet via a API (ids do catálogo, não nomes). */
export interface PetFormInput {
  nome: string;
  dtNascimento: string;
  peso: number;
  sexo: Sexo;
  castrado: boolean;
  tutorId: number;
  especieId: number;
  racaId: number;
  porteId: number;
}
