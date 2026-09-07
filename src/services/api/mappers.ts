import { Pet, PetFormInput, Sexo } from '../../types/pet';
import { HistoricoClinico, HistoricoFormInput } from '../../types/historicoClinico';
import { AlertaInteligente } from '../../types/alertaInteligente';
import {
  ApiSex,
  ClinicalHistoryRequest,
  ClinicalHistoryResponse,
  PetRequest,
  PetResponse,
  SmartAlertResponse,
} from '../../types/types';

// ── Sexo ─────────────────────────────────────────────────────────────────

export function sexoParaApi(sexo: Sexo): ApiSex {
  return sexo === 'MACHO' ? 'M' : 'F';
}

export function sexoDaApi(sexo: ApiSex): Sexo {
  return sexo === 'M' ? 'MACHO' : 'FEMEA';
}

// ── Pet ──────────────────────────────────────────────────────────────────

export function petDaApi(response: PetResponse): Pet {
  return {
    idPet: response.id,
    idUsuario: response.tutorId,
    nome: response.name,
    especie: response.speciesName,
    raca: response.breedName,
    dtNascimento: response.birthDate,
    peso: response.weight,
    sexo: sexoDaApi(response.sex),
    castrado: response.neutered,
    porte: portePorDescricao(response.petSizeDescription),
    dtCadastro: response.createdAt,
    especieId: response.speciesId,
    racaId: response.breedId,
    porteId: response.petSizeId,
  };
}

export function petParaApi(dados: PetFormInput): PetRequest {
  return {
    name: dados.nome,
    birthDate: dados.dtNascimento,
    weight: dados.peso,
    sex: sexoParaApi(dados.sexo),
    neutered: dados.castrado,
    tutorId: dados.tutorId,
    speciesId: dados.especieId,
    breedId: dados.racaId,
    petSizeId: dados.porteId,
  };
}

function portePorDescricao(descricao: string): Pet['porte'] {
  const normalizado = descricao.trim().toUpperCase();
  if (normalizado === 'PEQUENO' || normalizado === 'MEDIO' || normalizado === 'GRANDE') {
    return normalizado;
  }
  return 'MEDIO';
}

// ── Histórico Clínico ────────────────────────────────────────────────────

export function historicoDaApi(response: ClinicalHistoryResponse): HistoricoClinico {
  return {
    idHistorico: response.id,
    idPet: response.petId,
    tipoRegistro: response.recordType,
    descricao: response.description ?? '',
    dtRegistro: response.recordDate,
    dtRetorno: response.returnDate,
    profissionalClinica: response.professionalName ?? '',
    observacoes: response.observations,
  };
}

export function historicoParaApi(dados: HistoricoFormInput): ClinicalHistoryRequest {
  return {
    petId: dados.idPet,
    professionalId: null,
    recordType: dados.tipoRegistro,
    description: dados.descricao || null,
    returnDate: dados.dtRetorno,
    observations: dados.observacoes,
  };
}

// ── Alerta Inteligente ───────────────────────────────────────────────────

export function alertaDaApi(response: SmartAlertResponse): AlertaInteligente {
  return {
    idAlerta: response.id,
    idPet: response.petId,
    tipoAlerta: response.alertTypeDescription,
    nivelRisco: response.riskLevel,
    origemAlerta: response.origin,
    mensagem: response.message ?? '',
    recomendacao: response.recommendation ?? '',
    dtGeracao: response.generatedAt,
    status: response.status,
  };
}
