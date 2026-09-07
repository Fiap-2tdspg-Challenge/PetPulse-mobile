import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllPets, createPet, updatePet, deletePet } from '../services/api/petApi';
import { PetRequest } from '../types/types';

export function usePets(tutorId?: number) {
  return useQuery({
    queryKey: ['pets', tutorId],
    queryFn: async () => {
      const pets = await getAllPets();
      return pets.filter((pet) => pet.tutorId === tutorId);
    },
    enabled: !!tutorId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: PetRequest) => createPet(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dados }: PetRequest & { id: number }) => updatePet(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
