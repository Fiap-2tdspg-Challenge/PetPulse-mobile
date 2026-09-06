export interface Usuario {
  idUsuario: number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  dtCadastro: string;
  /** Id do Tutor correspondente na API Java (PetPulse-Api), quando já sincronizado. */
  tutorId?: number;
}
