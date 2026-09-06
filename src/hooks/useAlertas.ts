import { useQuery } from '@tanstack/react-query';
import { getAllSmartAlerts } from '../services/api/smartAlertApi';
import { alertaDaApi } from '../services/api/mappers';

export function useAlertasPendentes(idsPets: number[]) {
  return useQuery({
    queryKey: ['alertas', idsPets.join(',')],
    queryFn: async () => {
      const alertas = await getAllSmartAlerts();
      return alertas.map(alertaDaApi).filter((a) => idsPets.includes(a.idPet));
    },
    enabled: idsPets.length > 0,
    select: (alertas) => alertas.filter((a) => a.status === 'ABERTO'),
  });
}
