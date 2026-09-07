import { apiFetch } from './client';
import { SpeciesRequest, SpeciesResponse } from '../../types/types';

/** Busca a espécie pelo nome ou cria uma nova, caso ainda não exista. */
export function findOrCreateSpecies(request: SpeciesRequest): Promise<SpeciesResponse> {
  return apiFetch<SpeciesResponse>('/species', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
