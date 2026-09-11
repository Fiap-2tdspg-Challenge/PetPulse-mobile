// Geocodificação reversa (coordenadas → endereço legível) via Google Geocoding
// API. Serviço externo ao PetPulse-Api, por isso fica fora de services/api/
// (mesmo critério usado em coleiraApi.ts).
const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? "";

/** Resolve coordenadas para um endereço formatado. Retorna null se a API não encontrar nada ou falhar. */
export async function buscarEnderecoReverso(latitude: number, longitude: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}&language=pt-BR`
    );
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch {
    return null;
  }
}
