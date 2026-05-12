export type TipoRegistro =
   'VACINA'
   'CONSULTA'
   'EXAME'
   'MEDICACAO'
   'CIRURGIA'
   'OUTRO';

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
