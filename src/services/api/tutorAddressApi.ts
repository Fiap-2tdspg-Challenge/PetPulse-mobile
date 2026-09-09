import { apiFetch } from './client';
import { SpringPage, TutorAddressRequest, TutorAddressResponse } from '../../types/types';

export async function getTutorAddressByTutorId(tutorId: number): Promise<TutorAddressResponse | undefined> {
  const pagina = await apiFetch<SpringPage<TutorAddressResponse>>('/tutor-addresses?size=200');
  return pagina.content.find((e) => e.tutorId === tutorId);
}

export function createTutorAddress(request: TutorAddressRequest): Promise<TutorAddressResponse> {
  return apiFetch<TutorAddressResponse>('/tutor-addresses', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateTutorAddress(id: number, request: TutorAddressRequest): Promise<TutorAddressResponse> {
  return apiFetch<TutorAddressResponse>(`/tutor-addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}
