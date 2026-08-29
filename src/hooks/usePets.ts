import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPets, savePet, updatePet } from '../services/storage';
import { Pet } from '../types/pet';

export function usePets(idUsuario?: number) {
  return useQuery({
    queryKey: ['pets', idUsuario],
    queryFn: () => getPets(idUsuario),
    enabled: !!idUsuario,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: Omit<Pet, 'idPet' | 'dtCadastro'>) => savePet(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pet: Pet) => updatePet(pet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
