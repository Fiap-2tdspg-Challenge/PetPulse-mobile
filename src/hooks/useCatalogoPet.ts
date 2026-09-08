import { useMutation, useQuery } from '@tanstack/react-query';
import { findOrCreateSpecies } from '../services/api/speciesApi';
import { findOrCreateBreed } from '../services/api/breedApi';
import { getAllPetSizes } from '../services/api/petSizeApi';

/** Resolve o nome digitado de uma espécie para o id real na API (cria se não existir). */
export function useFindOrCreateSpecies() {
  return useMutation({
    mutationFn: (nome: string) => findOrCreateSpecies({ name: nome }),
  });
}

/** Resolve o nome digitado de uma raça (dentro de uma espécie) para o id real na API (cria se não existir). */
export function useFindOrCreateBreed() {
  return useMutation({
    mutationFn: ({ speciesId, nome }: { speciesId: number; nome: string }) =>
      findOrCreateBreed({ speciesId, name: nome }),
  });
}

/** Lista os portes de pet cadastrados na API (ex: Pequeno, Médio, Grande). */
export function usePetSizes() {
  return useQuery({
    queryKey: ['pet-sizes'],
    queryFn: getAllPetSizes,
  });
}
