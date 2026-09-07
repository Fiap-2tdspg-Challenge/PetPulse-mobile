import { apiFetch } from './client';
import { StateRequest, StateResponse } from '../../types/types';

/** Busca o estado (UF) pelo código ou cria um novo, caso ainda não exista. */
export function findOrCreateState(request: StateRequest): Promise<StateResponse> {
  return apiFetch<StateResponse>('/states', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
