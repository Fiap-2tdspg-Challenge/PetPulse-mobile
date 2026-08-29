import { useQuery } from '@tanstack/react-query';
import { getAlertas } from '../services/storage';

export function useAlertasPendentes(idsPets: number[]) {
  return useQuery({
    queryKey: ['alertas', idsPets.join(',')],
    queryFn: () => getAlertas(idsPets),
    enabled: idsPets.length > 0,
    select: (alertas) => alertas.filter((a) => a.status === 'PENDENTE'),
  });
}
