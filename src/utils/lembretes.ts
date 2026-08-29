import { HistoricoClinico } from '../types/historicoClinico';
import { Pet } from '../types/pet';

export type Lembrete = { descricao: string; dtRetorno: string; petNome: string };

export function calcularProximoRetorno(historicos: HistoricoClinico[], pets: Pet[]): Lembrete | null {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximos = historicos
    .filter((r) => r.dtRetorno && new Date(r.dtRetorno) >= hoje)
    .sort((a, b) => new Date(a.dtRetorno!).getTime() - new Date(b.dtRetorno!).getTime());

  if (proximos.length === 0) return null;

  const r = proximos[0];
  const pet = pets.find((p) => p.idPet === r.idPet);
  return { descricao: r.descricao, dtRetorno: r.dtRetorno!, petNome: pet?.nome ?? '' };
}
