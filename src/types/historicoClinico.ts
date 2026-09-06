// Alinhado com o enum RecordType da API (PetPulse-Api).
export type TipoRegistro =
  | 'VACINA'
  | 'CONSULTA'
  | 'DOENCA'
  | 'MEDICAMENTO'
  | 'OBSERVACAO'
  | 'EXAME';

export interface HistoricoClinico {
  idHistorico: number;
  idPet: number;
  tipoRegistro: TipoRegistro;
  descricao: string;
  dtRegistro: string;
  dtRetorno: string | null;
  profissionalClinica: string;
  observacoes: string | null;
}

/** Dados de formulário para criar/editar um registro de histórico clínico via a API. */
export interface HistoricoFormInput {
  idPet: number;
  tipoRegistro: TipoRegistro;
  descricao: string;
  dtRetorno: string | null;
  observacoes: string | null;
}
