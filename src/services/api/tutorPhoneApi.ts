import { apiFetch } from './client';
import { TutorPhonePaginado, TutorPhoneRequest, TutorPhoneResponse } from '../../types/types';

/** Não existe filtro por tutorId na API — busca uma página grande e filtra no cliente (mesmo padrão de pets/histórico). */
export async function getTutorPhoneByTutorId(tutorId: number): Promise<TutorPhoneResponse | undefined> {
  const pagina = await apiFetch<TutorPhonePaginado>('/tutor-phones?size=200');
  return pagina.content.find((f) => f.tutorId === tutorId);
}

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
