import { apiFetch } from './client';
import { PetSizeResponse } from '../../types/types';

// lista de tamanhos de pets, sem a necessidade de paginação, pois são poucos registros
export function getAllPetSizes(): Promise<PetSizeResponse[]> {
  return apiFetch<PetSizeResponse[]>('/pet-sizes');
}
