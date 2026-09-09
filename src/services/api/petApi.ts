import { apiFetch } from './client';
import { PetPaginado, PetRequest, PetResponse } from '../../types/types';

// A API ainda não tem filtro por tutorId em GET /pets, então buscamos uma
// página grande e filtramos no cliente (ver mappers.ts / hooks/usePets.ts).
const PAGE_SIZE = 200;

export async function getAllPets(): Promise<PetResponse[]> {
  const page = await apiFetch<PetPaginado>(`/pets?size=${PAGE_SIZE}`);
  return page.content;
}

export function getPetById(id: number): Promise<PetResponse> {
  return apiFetch<PetResponse>(`/pets/${id}`);
}

export function createPet(request: PetRequest): Promise<PetResponse> {
  return apiFetch<PetResponse>('/pets', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updatePet(id: number, request: PetRequest): Promise<PetResponse> {
  return apiFetch<PetResponse>(`/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

export function deletePet(id: number): Promise<void> {
  return apiFetch<void>(`/pets/${id}`, { method: 'DELETE' });
}
