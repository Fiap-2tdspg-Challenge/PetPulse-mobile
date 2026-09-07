import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClinicalHistory,
  deleteClinicalHistory,
  getAllClinicalHistories,
  updateClinicalHistory,
} from '../services/api/clinicalHistoryApi';
import { ClinicalHistoryRequest } from '../types/types';

export function useHistorico(petId?: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['historico', petId],
    queryFn: async () => {
      const historicos = await getAllClinicalHistories();
      return historicos.filter((h) => h.petId === petId);
    },
    enabled: !!petId && (options?.enabled ?? true),
  });
}

export function useHistoricosDeVariosPets(idsPets: number[]) {
  return useQueries({
    queries: idsPets.map((petId) => ({
      queryKey: ['historico', petId],
      queryFn: async () => {
        const historicos = await getAllClinicalHistories();
        return historicos.filter((h) => h.petId === petId);
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
    mutationFn: (dados: ClinicalHistoryRequest) => createClinicalHistory(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
}

export function useUpdateHistorico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dados }: ClinicalHistoryRequest & { id: number }) =>
      updateClinicalHistory(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
}

export function useDeleteHistorico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteClinicalHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
}
