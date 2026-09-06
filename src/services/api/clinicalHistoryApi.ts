import { apiFetch } from './client';
import { ClinicalHistoryRequest, ClinicalHistoryResponse, SpringPage } from './types';

// Sem filtro por petId em GET /clinical-histories hoje: busca uma página
// grande e filtra no cliente (ver mappers.ts / hooks/useHistorico.ts).
const PAGE_SIZE = 200;

export async function getAllClinicalHistories(): Promise<ClinicalHistoryResponse[]> {
  const page = await apiFetch<SpringPage<ClinicalHistoryResponse>>(`/clinical-histories?size=${PAGE_SIZE}`);
  return page.content;
}

export function createClinicalHistory(request: ClinicalHistoryRequest): Promise<ClinicalHistoryResponse> {
  return apiFetch<ClinicalHistoryResponse>('/clinical-histories', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateClinicalHistory(
  id: number,
  request: ClinicalHistoryRequest
): Promise<ClinicalHistoryResponse> {
  return apiFetch<ClinicalHistoryResponse>(`/clinical-histories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

export function deleteClinicalHistory(id: number): Promise<void> {
  return apiFetch<void>(`/clinical-histories/${id}`, { method: 'DELETE' });
}
