import { apiFetch } from './client';
import { TutorAddressRequest, TutorAddressResponse } from '../../types/types';

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
