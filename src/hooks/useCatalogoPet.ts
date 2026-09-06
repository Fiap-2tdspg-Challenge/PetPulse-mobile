import { useMutation } from '@tanstack/react-query';
import { findOrCreateSpecies } from '../services/api/speciesApi';
import { findOrCreateBreed } from '../services/api/breedApi';

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
