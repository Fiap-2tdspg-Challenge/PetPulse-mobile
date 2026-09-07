import { apiFetch } from './client';
import { TutorLoginRequest, TutorRequest, TutorResponse } from '../../types/types';

export function createTutor(request: TutorRequest): Promise<TutorResponse> {
  return apiFetch<TutorResponse>('/tutors', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function getTutorById(id: number): Promise<TutorResponse> {
  return apiFetch<TutorResponse>(`/tutors/${id}`);
}

export function loginTutor(request: TutorLoginRequest): Promise<TutorResponse> {
  return apiFetch<TutorResponse>('/tutors/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
