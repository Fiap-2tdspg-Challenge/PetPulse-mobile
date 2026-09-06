// Alinhado com os enums da API (PetPulse-Api): AlertRiskLevel, AlertOrigin, AlertStatus.
// tipoAlerta vem de uma tabela de referência livre (AlertType) na API, sem união fechada.
export type NivelRisco = 'BAIXO' | 'MEDIO' | 'ALTO';
export type OrigemAlerta = 'HISTORICO_CLINICO' | 'DISPOSITIVO_IOT' | 'SISTEMA' | 'USUARIO';
export type StatusAlerta = 'ABERTO' | 'VISUALIZADO' | 'RESOLVIDO';

export interface AlertaInteligente {
  idAlerta: number;
  idPet: number;
  tipoAlerta: string;
  nivelRisco: NivelRisco;
  origemAlerta: OrigemAlerta;
  mensagem: string;
  recomendacao: string;
  dtGeracao: string;
  status: StatusAlerta;
}
