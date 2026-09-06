import { apiFetch } from './client';
import { TutorRequest, TutorResponse } from './types';

export function createTutor(request: TutorRequest): Promise<TutorResponse> {
  return apiFetch<TutorResponse>('/tutors', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function getTutorById(id: number): Promise<TutorResponse> {
  return apiFetch<TutorResponse>(`/tutors/${id}`);
}
