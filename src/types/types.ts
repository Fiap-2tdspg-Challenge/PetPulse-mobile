// Tipos espelhando os DTOs/enums do PetPulse-Api (Spring Boot).
// Fonte: PetPulse-Api/src/main/java/fiap/com/br/petpulse/{dto,enums}/**

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type ApiSex = 'M' | 'F';

export type ApiRecordType = 'VACINA' | 'CONSULTA' | 'DOENCA' | 'MEDICAMENTO' | 'OBSERVACAO' | 'EXAME';

export type ApiAlertRiskLevel = 'BAIXO' | 'MEDIO' | 'ALTO';

export type ApiAlertOrigin = 'HISTORICO_CLINICO' | 'DISPOSITIVO_IOT' | 'SISTEMA' | 'USUARIO';

export type ApiAlertStatus = 'ABERTO' | 'VISUALIZADO' | 'RESOLVIDO';

// ── Species / Breed (catálogo, "buscar ou cadastrar") ───────────────────────

export interface SpeciesRequest {
  name: string;
}

export interface SpeciesResponse {
  id: number;
  name: string;
}

export interface BreedRequest {
  speciesId: number;
  name: string;
}

export interface BreedResponse {
  id: number;
  speciesId: number;
  speciesName: string;
  name: string;
}

// ── Tutor ────────────────────────────────────────────────────────────────

export interface TutorRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export interface TutorResponse {
  id: number;
  name: string;
  cpf: string;
  email: string;
  createdAt: string;
}

export interface TutorLoginRequest {
  email: string;
  password: string;
}

// ── Pet ──────────────────────────────────────────────────────────────────

export interface PetRequest {
  name: string;
  birthDate: string; // LocalDate (YYYY-MM-DD)
  weight: number;
  sex: ApiSex;
  neutered: boolean;
  tutorId: number;
  speciesId: number;
  breedId: number;
  petSizeId: number;
}

export interface PetResponse {
  id: number;
  name: string;
  birthDate: string;
  weight: number;
  sex: ApiSex;
  neutered: boolean;
  tutorId: number;
  tutorName: string;
  speciesId: number;
  speciesName: string;
  breedId: number;
  breedName: string;
  petSizeId: number;
  petSizeDescription: string;
  createdAt: string;
}

// ── Clinical History ─────────────────────────────────────────────────────

export interface ClinicalHistoryRequest {
  petId: number;
  professionalId?: number | null;
  recordType: ApiRecordType;
  description?: string | null;
  returnDate?: string | null;
  observations?: string | null;
}

export interface ClinicalHistoryResponse {
  id: number;
  petId: number;
  petName: string;
  professionalId: number | null;
  professionalName: string | null;
  professionalCrmv: string | null;
  recordType: ApiRecordType;
  description: string | null;
  recordDate: string;
  returnDate: string | null;
  observations: string | null;
}

// ── Smart Alert ──────────────────────────────────────────────────────────

export interface SmartAlertRequest {
  petId: number;
  alertTypeId: number;
  riskLevel: ApiAlertRiskLevel;
  origin: ApiAlertOrigin;
  message?: string | null;
  recommendation?: string | null;
  status: ApiAlertStatus;
}

export interface SmartAlertResponse {
  id: number;
  petId: number;
  petName: string;
  alertTypeId: number;
  alertTypeDescription: string;
  riskLevel: ApiAlertRiskLevel;
  origin: ApiAlertOrigin;
  message: string | null;
  recommendation: string | null;
  generatedAt: string;
  status: ApiAlertStatus;
}
