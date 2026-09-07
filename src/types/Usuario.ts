import { TutorResponse } from './types';

/**
 * Tutor no app: os dados reais do Tutor na API (id, name, cpf, email,
 * createdAt) mais as extensões locais que a API não guarda (telefone,
 * endereço). Sem "id local" separado — o id é sempre o id do Tutor na API,
 * já que o login (POST /tutors/login) sempre passa por lá.
 */
export interface Usuario extends TutorResponse {
  telefone: string;
  /** Rua/Avenida — vai para o campo "address" do TutorAddress na API. */
  endereco: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  cidade: string;
  /** UF (2 letras). */
  estado: string;
  /** Id do TutorPhone correspondente na API, quando já sincronizado (POST /tutor-phones). */
  phoneId?: number;
  /** Id do TutorAddress correspondente na API, quando já sincronizado (POST /tutor-addresses). */
  enderecoId?: number;
}
