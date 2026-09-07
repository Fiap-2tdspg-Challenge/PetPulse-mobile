import { ClinicalHistoryResponse, PetResponse } from '../types/types';

export type Lembrete = { descricao: string; dtRetorno: string; petNome: string };

export function calcularProximoRetorno(historicos: ClinicalHistoryResponse[], pets: PetResponse[]): Lembrete | null {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximos = historicos
    .filter((r) => r.returnDate && new Date(r.returnDate) >= hoje)
    .sort((a, b) => new Date(a.returnDate!).getTime() - new Date(b.returnDate!).getTime());

  if (proximos.length === 0) return null;

  const r = proximos[0];
  const pet = pets.find((p) => p.id === r.petId);
  return { descricao: r.description ?? '', dtRetorno: r.returnDate!, petNome: pet?.name ?? '' };
}
