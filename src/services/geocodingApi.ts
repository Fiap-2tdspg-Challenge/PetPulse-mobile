// Geocodificação reversa (coordenadas → endereço legível) via Nominatim, a
// API pública do OpenStreetMap — sem chave, sem cartão de cobrança cadastrado
// (diferente da Geocoding API do Google, que hoje exige billing habilitado
// no projeto). Serviço externo ao PetPulse-Api, por isso fica fora de
// services/api/ (mesmo critério usado em coleiraApi.ts).
//
// A instância pública (nominatim.openstreetmap.org) pede uso leve e um
// User-Agent identificável — adequado pro volume de um app de
// desenvolvimento/demonstração como este. Ver https://operations.osmfoundation.org/policies/nominatim/
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

/** Resolve coordenadas para um endereço formatado. Retorna null se a API não encontrar nada ou falhar. */
export async function buscarEnderecoReverso(latitude: number, longitude: number): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(latitude),
      lon: String(longitude),
      "accept-language": "pt-BR",
    });
    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: { "User-Agent": "PetPulse-mobile (FIAP Challenge 2TDSPG)" },
    });
    const data = await res.json();
    if (data?.display_name) {
      return data.display_name as string;
    }
    return null;
  } catch {
    return null;
  }
}
