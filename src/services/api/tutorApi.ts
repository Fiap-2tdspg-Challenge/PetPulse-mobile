import { apiFetch } from './client';
import { TokenResponse, TutorLoginRequest, TutorPaginado, TutorRequest, TutorResponse } from '../../types/types';

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

/**
 * O JWT não carrega o id do tutor (só email e role), e não existe endpoint
 * "/tutors/me" — então resolvemos o tutor logado buscando a listagem (já
 * autenticada, GET /tutors exige role TUTOR) e filtrando pelo e-mail no
 * cliente. Mesmo padrão de filtro client-side já usado pra pets/histórico.
 */
export async function getTutorByEmail(email: string): Promise<TutorResponse | undefined> {
  const pagina = await apiFetch<TutorPaginado>('/tutors?size=200');
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
