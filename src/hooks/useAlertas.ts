import { useQuery } from '@tanstack/react-query';
import { getAllSmartAlerts } from '../services/api/smartAlertApi';

export function useAlertasPendentes(idsPets: number[]) {
  return useQuery({
    queryKey: ['alertas', idsPets.join(',')],
    queryFn: async () => {
      const alertas = await getAllSmartAlerts();
      return alertas.filter((a) => idsPets.includes(a.petId));
    },
    enabled: idsPets.length > 0,
    select: (alertas) => alertas.filter((a) => a.status === 'ABERTO'),
  });
}
