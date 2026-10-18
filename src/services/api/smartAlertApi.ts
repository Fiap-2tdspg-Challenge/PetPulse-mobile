import { apiFetch } from './client';
import { SmartAlertPaginado, SmartAlertRequest, SmartAlertResponse } from '../../types/types';

// Sem filtro por petId em GET /smart-alerts hoje: busca uma página grande
// e filtra no cliente (ver mappers.ts / hooks/useAlertas.ts).
const PAGE_SIZE = 200;

export async function getAllSmartAlerts(): Promise<SmartAlertResponse[]> {
  const page = await apiFetch<SmartAlertPaginado>(`/smart-alerts?size=${PAGE_SIZE}`);
  return page.content;
}

export function updateSmartAlert(id: number, request: SmartAlertRequest): Promise<SmartAlertResponse> {
  return apiFetch<SmartAlertResponse>(`/smart-alerts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}
