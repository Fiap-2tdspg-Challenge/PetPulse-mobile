import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllPets, createPet, updatePet, deletePet } from '../services/api/petApi';
import { petDaApi, petParaApi } from '../services/api/mappers';
import { PetFormInput } from '../types/pet';

export function usePets(tutorId?: number) {
  return useQuery({
    queryKey: ['pets', tutorId],
    queryFn: async () => {
      const pets = await getAllPets();
      return pets.map(petDaApi).filter((pet) => pet.idUsuario === tutorId);
    },
    enabled: !!tutorId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: PetFormInput) => createPet(petParaApi(dados)).then(petDaApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idPet, ...dados }: PetFormInput & { idPet: number }) =>
      updatePet(idPet, petParaApi(dados)).then(petDaApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idPet: number) => deletePet(idPet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
