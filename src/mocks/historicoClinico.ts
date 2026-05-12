import { HistoricoClinico } from '../types/historicoClinico';

export const mockHistorico: HistoricoClinico[] = [
  {
    idHistorico: 1,
    idPet: 1,
    tipoRegistro: 'VACINA',
    descricao: 'Vacina VB (Polivalente)',
    dtRegistro: '2025-04-20',
    dtRetorno: '2025-05-20',
    profissionalClinica: 'Clínica PetVida',
    observacoes: 'Reforço anual. Pet em ótimo estado.',
  },
  {
    idHistorico: 2,
    idPet: 1,
    tipoRegistro: 'CONSULTA',
    descricao: 'Check-up geral',
    dtRegistro: '2025-03-10',
    dtRetorno: null,
    profissionalClinica: 'Dr. Carlos Mendes - PetVida',
    observacoes: 'Nenhuma alteração identificada.',
  },
  {
    idHistorico: 3,
    idPet: 1,
    tipoRegistro: 'EXAME',
    descricao: 'Hemograma completo',
    dtRegistro: '2025-03-10',
    dtRetorno: null,
    profissionalClinica: 'Lab PetSaúde',
    observacoes: 'Resultados dentro do esperado.',
  },
  {
    idHistorico: 4,
    idPet: 2,
    tipoRegistro: 'VACINA',
    descricao: 'Vacina Tríplice Felina',
    dtRegistro: '2025-02-14',
    dtRetorno: '2025-03-14',
    profissionalClinica: 'Clínica Felinos & Cia',
    observacoes: null,
  },
];
