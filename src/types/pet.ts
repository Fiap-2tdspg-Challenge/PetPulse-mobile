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
}
