// Tipos espelhando os DTOs/enums do PetPulse-Api (Spring Boot).
// Fonte: PetPulse-Api/src/main/java/fiap/com/br/petpulse/{dto,enums}/**

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

// Formato de resposta paginada do GET /tutors — usado pra resolver o tutor
// logado por e-mail (ver tutorApi.ts), já que o JWT não carrega o id.
export interface TutorPaginado {
  content: TutorResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TutorLoginRequest {
  email: string;
  password: string;
}

// Resposta de POST /login (AuthController) — só o token, sem dados do tutor.
export interface TokenResponse {
  token: string;
}

// ── Professional (Veterinário) ──────────────────────────────────────────────
// Login compartilha o mesmo POST /login (mesmo request/response de Tutor) —
// o backend resolve o papel (ROLE_TUTOR/ROLE_PROFESSIONAL) pelo e-mail.

export interface ProfessionalRequest {
  name: string;
  email: string;
  password: string;
  crmv: string;
  clinicId: number;
}

export interface ProfessionalResponse {
  id: number;
  name: string;
  email: string;
  crmv: string;
  clinicId: number;
  clinicName: string;
  createdAt: string;
}

// Formato de resposta paginada do GET /professionals — usado pra resolver o
// veterinário logado por e-mail (ver professionalApi.ts).
export interface ProfessionalPaginado {
  content: ProfessionalResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TutorPhoneRequest {
  tutorId: number;
  phoneNumber: string;
}

export interface TutorPhoneResponse {
  id: number;
  tutorId: number;
  phoneNumber: string;
}

// Formato de resposta paginada do GET /tutor-phones — sem filtro por tutorId
// na API, então filtramos no cliente (ver tutorPhoneApi.ts).
export interface TutorPhonePaginado {
  content: TutorPhoneResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── State / City (catálogo, "buscar ou cadastrar") ──────────────────────────

export interface StateRequest {
  code: string;
  name: string;
}

export interface StateResponse {
  code: string;
  name: string;
}

export interface CityRequest {
  name: string;
  stateCode: string;
}

export interface CityResponse {
  id: number;
  name: string;
  stateCode: string;
  stateName: string;
}

// ── Tutor Address ────────────────────────────────────────────────────────

export interface TutorAddressRequest {
  tutorId: number;
  addressTypeId: number;
  cityId: number;
  address: string;
  number?: string | null;
  complement?: string | null;
  zipCode?: string | null;
  neighborhood?: string | null;
}

export interface TutorAddressResponse {
  id: number;
  tutorId: number;
  addressTypeId: number;
  addressTypeDescription: string;
  cityId: number;
  cityName: string;
  stateCode: string;
  stateName: string;
  address: string;
  number: string | null;
  complement: string | null;
  zipCode: string | null;
  neighborhood: string | null;
}

// Formato de resposta paginada do GET /tutor-addresses — sem filtro por
// tutorId na API, então filtramos no cliente (ver tutorAddressApi.ts).
export interface TutorAddressPaginado {
  content: TutorAddressResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── Pet Size (catálogo, só listagem) ────────────────────────────────────────

export interface PetSizeResponse {
  id: number;
  description: string;
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

// Formato de resposta paginada do GET /pets — sem filtro por tutorId na API,
// então filtramos no cliente (ver petApi.ts / hooks/usePets.ts).
export interface PetPaginado {
  content: PetResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
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

// Formato de resposta paginada do GET /clinical-histories — sem filtro por
// petId na API, então filtramos no cliente (ver hooks/useHistorico.ts).
export interface ClinicalHistoryPaginado {
  content: ClinicalHistoryResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
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

// Formato de resposta paginada do GET /smart-alerts — sem filtro por petId na
// API, então filtramos no cliente (ver hooks/useAlertas.ts).
export interface SmartAlertPaginado {
  content: SmartAlertResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
