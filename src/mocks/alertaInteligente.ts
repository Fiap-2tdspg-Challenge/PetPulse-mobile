import { AlertaInteligente } from '../types/alertaInteligente';

export const mockAlertas: AlertaInteligente[] = [
  {
    idAlerta: 1,
    idPet: 1,
    tipoAlerta: 'VACINA',
    nivelRisco: 'MEDIO',
    origemAlerta: 'SISTEMA',
    mensagem: 'Reforço da Vacina VB vence em 5 dias.',
    recomendacao: 'Agende uma consulta na clínica veterinária.',
    dtGeracao: '2025-05-11T08:00:00',
    status: 'PENDENTE',
  },
  {
    idAlerta: 2,
    idPet: 1,
    tipoAlerta: 'SAUDE',
    nivelRisco: 'ALTO',
    origemAlerta: 'IOT',
    mensagem: 'Frequência cardíaca acima do normal detectada.',
    recomendacao: 'Observe o comportamento e consulte um veterinário se persistir.',
    dtGeracao: '2025-05-10T22:15:00',
    status: 'LIDO',
  },
];
