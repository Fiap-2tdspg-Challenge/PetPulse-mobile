import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClinicalHistory,
  deleteClinicalHistory,
  getAllClinicalHistories,
  updateClinicalHistory,
} from '../services/api/clinicalHistoryApi';
import { historicoDaApi, historicoParaApi } from '../services/api/mappers';
import { HistoricoFormInput } from '../types/historicoClinico';

export function useHistorico(idPet?: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['historico', idPet],
    queryFn: async () => {
      const historicos = await getAllClinicalHistories();
      return historicos.map(historicoDaApi).filter((h) => h.idPet === idPet);
    },
    enabled: !!idPet && (options?.enabled ?? true),
  });
}

export function useHistoricosDeVariosPets(idsPets: number[]) {
  return useQueries({
    queries: idsPets.map((idPet) => ({
      queryKey: ['historico', idPet],
      queryFn: async () => {
        const historicos = await getAllClinicalHistories();
        return historicos.map(historicoDaApi).filter((h) => h.idPet === idPet);
      },
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
    mutationFn: (dados: HistoricoFormInput) =>
      createClinicalHistory(historicoParaApi(dados)).then(historicoDaApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
}

export function useUpdateHistorico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idHistorico, ...dados }: HistoricoFormInput & { idHistorico: number }) =>
      updateClinicalHistory(idHistorico, historicoParaApi(dados)).then(historicoDaApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
}

export function useDeleteHistorico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idHistorico: number) => deleteClinicalHistory(idHistorico),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
}
