export type EstadoColeira = 'OK' | 'ALERTA' | 'CRITICO';

/**
 * Corresponde ao payload retornado por `GET /api/dados` no firmware da coleira
 * (função `handleApiDados()` em PetPulse-Iot.ino, repositório PetPulse-Iot).
 *
 * Exemplo:
 * {
 *   "idDispositivo": "COLLAR-001",
 *   "pet": "Rex",
 *   "frequenciaCardiaca": 95,
 *   "nivelAtividade": 45,
 *   "descAtividade": "caminhada",
 *   "aceleracaoTotal": 1.23,
 *   "pressaoSistolica": 130,
 *   "pressaoDiastolica": 80,
 *   "temperatura": 38.5,
 *   "score": 87,
 *   "estado": "OK",
 *   "alerta": "",
 *   "uptime": 12345
 * }
 */
export interface LeituraColeira {
  idDispositivo: string;
  pet: string;
  frequenciaCardiaca: number; // bpm
  nivelAtividade: number; // 0-100 (%)
  descAtividade: string; // 'repouso' | 'caminhada' | 'corrida'
  aceleracaoTotal: number; // m/s²
  pressaoSistolica: number; // mmHg
  pressaoDiastolica: number; // mmHg
  temperatura: number; // °C
  score: number; // 0-100
  estado: EstadoColeira;
  alerta: string; // motivo do alerta clínico; vazio quando não há alerta
  uptime: number; // segundos desde o boot do ESP32
}
