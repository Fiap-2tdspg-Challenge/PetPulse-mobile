// Catálogo de Porte usado para cadastrar/editar pets via a API Java.
//
// A API (PetPulse-Api) não expõe endpoint de listagem para PetSize (é só uma
// FK em PetRequest, sem controller próprio). Os valores abaixo foram
// extraídos do script de carga do banco (PetPulseDB/03_CARGA.sql) e dependem
// da ordem de inserção lá (IDENTITY). Se o backend ganhar um endpoint de
// listagem no futuro, troque este arquivo por uma chamada real — os
// componentes que o usam não mudam.
//
// Espécie e Raça não têm mais catálogo fixo: a API ganhou POST /species e
// POST /breeds ("buscar ou cadastrar"), então o tutor digita livremente e o
// app resolve/cria o registro real via src/hooks/useCatalogoPet.ts.

export interface ItemCatalogo {
  id: number;
  nome: string;
}

export const PORTES: ItemCatalogo[] = [
  { id: 1, nome: 'Pequeno' },
  { id: 2, nome: 'Médio' },
  { id: 3, nome: 'Grande' },
];

export function nomePorte(id: number): string {
  return PORTES.find((p) => p.id === id)?.nome ?? '';
}
