import { apiFetch } from './client';
import { SpringPage, TokenResponse, TutorLoginRequest, TutorRequest, TutorResponse } from '../../types/types';

export function createTutor(request: TutorRequest): Promise<TutorResponse> {
  return apiFetch<TutorResponse>('/tutors', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function getTutorById(id: number): Promise<TutorResponse> {
  return apiFetch<TutorResponse>(`/tutors/${id}`);
}

/**
 * Login movido pro `AuthController` (POST /login, fora de /tutors) desde que
 * o backend ganhou JWT. A resposta agora é só `{ token }` — sem
 * id/nome/email do tutor — então quem chama precisa resolver o tutor depois
 * via `getTutorByEmail`.
 */
export function loginTutor(request: TutorLoginRequest): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// SpringPage para paginação utilizada pelo backend. Do que eu conferi o TypeScript não saberia o formato da resposta virando UNKOWN podendo dar erro de compilação
export async function getTutorByEmail(email: string): Promise<TutorResponse | undefined> {
  const pagina = await apiFetch<SpringPage<TutorResponse>>('/tutors?size=200');
  return pagina.content.find((t) => t.email.toLowerCase() === email.toLowerCase());
}

export function updateTutor(id: number, request: TutorRequest): Promise<TutorResponse> {
  return apiFetch<TutorResponse>(`/tutors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

export function deleteTutor(id: number): Promise<void> {
  return apiFetch<void>(`/tutors/${id}`, {
    method: 'DELETE',
  });
}
