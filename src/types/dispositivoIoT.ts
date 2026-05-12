export type StatusDispositivo = 'ATIVO' | 'INATIVO' | 'MANUTENCAO';

export interface DispositivoIoT {
  idDispositivo: number;
  idPet: number;
  dtVinculacao: string;
  intervaloColetaMinutos: number;
  frequenciaCardiaca: number;
  nivelAtividade: number;
  pressao: string;
  dtUltimaLeitura: string;
  status: StatusDispositivo;
}
