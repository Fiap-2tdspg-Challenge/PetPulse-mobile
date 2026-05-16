import { HistoricoClinico } from '../types/historicoClinico';

export const mockHistorico: HistoricoClinico[] = [
  // ── BELUGA (idPet: 1) ──────────────────────────────────────────────────────

  // Vacinas
  {
    idHistorico: 1,
    idPet: 1,
    tipoRegistro: 'VACINA',
    descricao: 'Vacina VB (Polivalente)',
    dtRegistro: '2026-04-20',
    dtRetorno: '2027-04-20',
    profissionalClinica: 'Clínica PetVida',
    observacoes: 'Reforço anual. Pet em ótimo estado.',
  },
  {
    idHistorico: 2,
    idPet: 1,
    tipoRegistro: 'VACINA',
    descricao: 'Vacina Antirrábica',
    dtRegistro: '2026-04-20',
    dtRetorno: '2027-04-20',
    profissionalClinica: 'Clínica PetVida',
    observacoes: null,
  },
  {
    idHistorico: 3,
    idPet: 1,
    tipoRegistro: 'VACINA',
    descricao: 'Vacina contra Gripe Canina',
    dtRegistro: '2025-10-05',
    dtRetorno: '2026-10-05',
    profissionalClinica: 'Clínica PetVida',
    observacoes: 'Aplicada sem intercorrências.',
  },

  // Consultas
  {
    idHistorico: 4,
    idPet: 1,
    tipoRegistro: 'CONSULTA',
    descricao: 'Check-up geral',
    dtRegistro: '2026-03-10',
    dtRetorno: null,
    profissionalClinica: 'Dr. Carlos Mendes - PetVida',
    observacoes: 'Nenhuma alteração identificada.',
  },
  {
    idHistorico: 5,
    idPet: 2,
    tipoRegistro: 'CONSULTA',
    descricao: 'Consulta dermatológica',
    dtRegistro: '2025-11-18',
    dtRetorno: '2025-12-18',
    profissionalClinica: 'Dra. Ana Lima - DermaPet',
    observacoes: 'Alergia de pele leve. Prescrição de shampoo medicinal.',
  },

  // Exames
  {
    idHistorico: 6,
    idPet: 1,
    tipoRegistro: 'EXAME',
    descricao: 'Hemograma completo',
    dtRegistro: '2026-03-10',
    dtRetorno: null,
    profissionalClinica: 'Lab PetSaúde',
    observacoes: 'Resultados dentro do esperado.',
  },
  {
    idHistorico: 7,
    idPet: 1,
    tipoRegistro: 'EXAME',
    descricao: 'Raio-X coluna vertebral',
    dtRegistro: '2025-08-22',
    dtRetorno: null,
    profissionalClinica: 'Centro de Imagem Animal',
    observacoes: 'Sem alterações estruturais visíveis.',
  },
  {
    idHistorico: 8,
    idPet: 1,
    tipoRegistro: 'EXAME',
    descricao: 'Ultrassonografia abdominal',
    dtRegistro: '2025-08-22',
    dtRetorno: null,
    profissionalClinica: 'Centro de Imagem Animal',
    observacoes: 'Órgãos abdominais sem alterações.',
  },

  // Medicações
  {
    idHistorico: 9,
    idPet: 1,
    tipoRegistro: 'MEDICACAO',
    descricao: 'Antipulgas e carrapatos (NexGard)',
    dtRegistro: '2026-05-01',
    dtRetorno: '2026-06-01',
    profissionalClinica: 'Clínica PetVida',
    observacoes: 'Administrar mensalmente com ou sem alimento.',
  },
  {
    idHistorico: 10,
    idPet: 1,
    tipoRegistro: 'MEDICACAO',
    descricao: 'Antibiótico (Amoxicilina 250mg)',
    dtRegistro: '2025-11-20',
    dtRetorno: null,
    profissionalClinica: 'Dra. Ana Lima - DermaPet',
    observacoes: 'Tratamento de 10 dias. 1 comprimido de 12/12h.',
  },

  // Cirurgia
  {
    idHistorico: 11,
    idPet: 1,
    tipoRegistro: 'CIRURGIA',
    descricao: 'Castração',
    dtRegistro: '2024-06-15',
    dtRetorno: '2024-06-22',
    profissionalClinica: 'Dr. Ricardo Alves - CirurgiaPet',
    observacoes: 'Procedimento sem complicações. Repouso de 7 dias.',
  },

  // Outro
  {
    idHistorico: 12,
    idPet: 1,
    tipoRegistro: 'OUTRO',
    descricao: 'Banho terapêutico',
    dtRegistro: '2026-04-10',
    dtRetorno: null,
    profissionalClinica: 'Pet Shop Patas & Cia',
    observacoes: 'Shampoo hipoalergênico indicado pela dermatologista.',
  },

  // ── MIA (idPet: 2) ─────────────────────────────────────────────────────────

  // Vacinas
  {
    idHistorico: 13,
    idPet: 2,
    tipoRegistro: 'VACINA',
    descricao: 'Vacina Tríplice Felina (V3)',
    dtRegistro: '2026-02-14',
    dtRetorno: '2027-02-14',
    profissionalClinica: 'Clínica Felinos & Cia',
    observacoes: null,
  },
  {
    idHistorico: 14,
    idPet: 2,
    tipoRegistro: 'VACINA',
    descricao: 'Vacina Antirrábica',
    dtRegistro: '2026-02-14',
    dtRetorno: '2027-02-14',
    profissionalClinica: 'Clínica Felinos & Cia',
    observacoes: null,
  },

  // Consultas
  {
    idHistorico: 15,
    idPet: 2,
    tipoRegistro: 'CONSULTA',
    descricao: 'Consulta de rotina',
    dtRegistro: '2026-01-08',
    dtRetorno: null,
    profissionalClinica: 'Dra. Priscila Faria - Felinos & Cia',
    observacoes: 'Pet saudável. Peso dentro do ideal.',
  },

  // Exames
  {
    idHistorico: 16,
    idPet: 2,
    tipoRegistro: 'EXAME',
    descricao: 'Exame de urina (EAS)',
    dtRegistro: '2026-01-08',
    dtRetorno: null,
    profissionalClinica: 'Lab PetSaúde',
    observacoes: 'Sem alterações.',
  },

  // Medicações
  {
    idHistorico: 17,
    idPet: 2,
    tipoRegistro: 'MEDICACAO',
    descricao: 'Vermífugo (Drontal)',
    dtRegistro: '2026-03-20',
    dtRetorno: '2026-06-20',
    profissionalClinica: 'Clínica Felinos & Cia',
    observacoes: 'Repetir a cada 3 meses.',
  },
];
