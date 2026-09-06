import { apiFetch } from './client';
import { BreedRequest, BreedResponse } from './types';

/** Busca a raça pelo nome (dentro da espécie informada) ou cria uma nova, caso ainda não exista. */
export function findOrCreateBreed(request: BreedRequest): Promise<BreedResponse> {
  return apiFetch<BreedResponse>('/breeds', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
