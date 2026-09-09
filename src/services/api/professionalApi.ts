import { apiFetch } from './client';
import { ProfessionalResponse, SpringPage, TokenResponse, TutorLoginRequest } from '../../types/types';

/** Login compartilha o mesmo POST /login do Tutor — o backend resolve o papel pelo e-mail. */
export function loginProfessional(request: TutorLoginRequest): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Mesmo motivo do Tutor: o JWT não carrega o id do profissional, então
 * resolvemos buscando a listagem (já autenticada) e filtrando pelo e-mail
 * no cliente.
 */
export async function getProfessionalByEmail(email: string): Promise<ProfessionalResponse | undefined> {
  const pagina = await apiFetch<SpringPage<ProfessionalResponse>>('/professionals?size=200');
  return pagina.content.find((p) => p.email.toLowerCase() === email.toLowerCase());
}
