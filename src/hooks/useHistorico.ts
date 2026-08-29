import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getHistorico, saveHistorico } from '../services/storage';
import { HistoricoClinico } from '../types/historicoClinico';

export function useHistorico(idPet?: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['historico', idPet],
    queryFn: () => getHistorico(idPet),
    enabled: !!idPet && (options?.enabled ?? true),
  });
}

export function useHistoricosDeVariosPets(idsPets: number[]) {
  return useQueries({
    queries: idsPets.map((idPet) => ({
      queryKey: ['historico', idPet],
      queryFn: () => getHistorico(idPet),
    })),
    combine: (results) => ({
      data: results.flatMap((r) => r.data ?? []),
      isLoading: results.some((r) => r.isLoading),
    }),
  });
}

export function useCreateHistorico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: Omit<HistoricoClinico, 'idHistorico'>) => saveHistorico(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
}
