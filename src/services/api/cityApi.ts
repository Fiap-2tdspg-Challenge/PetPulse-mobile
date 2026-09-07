import { apiFetch } from './client';
import { CityRequest, CityResponse } from '../../types/types';

/** Busca a cidade pelo nome (dentro do estado informado) ou cria uma nova, caso ainda não exista. */
export function findOrCreateCity(request: CityRequest): Promise<CityResponse> {
  return apiFetch<CityResponse>('/cities', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
