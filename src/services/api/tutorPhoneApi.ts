import { apiFetch } from './client';
import { TutorPhoneRequest, TutorPhoneResponse } from '../../types/types';

export function createTutorPhone(request: TutorPhoneRequest): Promise<TutorPhoneResponse> {
  return apiFetch<TutorPhoneResponse>('/tutor-phones', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateTutorPhone(id: number, request: TutorPhoneRequest): Promise<TutorPhoneResponse> {
  return apiFetch<TutorPhoneResponse>(`/tutor-phones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}
