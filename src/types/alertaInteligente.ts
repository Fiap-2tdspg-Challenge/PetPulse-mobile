export type TipoAlerta = 'SAUDE' | 'ATIVIDADE' | 'VACINA' | 'MEDICACAO' | 'OUTRO';
export type NivelRisco = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
export type OrigemAlerta = 'IOT' | 'SISTEMA' | 'MANUAL';
export type StatusAlerta = 'PENDENTE' | 'LIDO' | 'RESOLVIDO';

export interface AlertaInteligente {
  idAlerta: number;
  idPet: number;
  tipoAlerta: TipoAlerta;
  nivelRisco: NivelRisco;
  origemAlerta: OrigemAlerta;
  mensagem: string;
  recomendacao: string;
  dtGeracao: string;
  status: StatusAlerta;
}
