import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllSmartAlerts, updateSmartAlert } from '../services/api/smartAlertApi';
import { SmartAlertResponse } from '../types/types';

// Os alertas da IA nascem no backend a qualquer momento (a cada leitura da coleira),
// então a Home consulta de novo periodicamente: o sino e a notificação chegam sozinhos.
const INTERVALO_ALERTAS_MS = 10000;

export function useAlertasPendentes(idsPets: number[]) {
  return useQuery({
    queryKey: ['alertas', idsPets.join(',')],
    queryFn: async () => {
      const alertas = await getAllSmartAlerts();
      return alertas.filter((a) => idsPets.includes(a.petId));
    },
    enabled: idsPets.length > 0,
    select: (alertas) => alertas.filter((a) => a.status === 'ABERTO'),
    refetchInterval: INTERVALO_ALERTAS_MS,
  });
}

// Marca um alerta como resolvido (some do sino/badge). A API exige o objeto
// inteiro no PUT, não só o status — por isso recebe o alerta completo.
export function useResolverAlerta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alerta: SmartAlertResponse) =>
      updateSmartAlert(alerta.id, {
        petId: alerta.petId,
        alertTypeId: alerta.alertTypeId,
        riskLevel: alerta.riskLevel,
        origin: alerta.origin,
        message: alerta.message,
        recommendation: alerta.recommendation,
        status: 'RESOLVIDO',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
}
