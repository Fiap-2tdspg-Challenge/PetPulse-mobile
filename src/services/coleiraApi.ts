import { LeituraColeira } from '../types/coleiraLivre';

// ─────────────────────────────────────────────────────────────────────────
// URL base da coleira IoT (ESP32 simulado no Wokwi).
//
// Setup padrão deste projeto: Wokwi rodando pela extensão do VS Code, que
// encaminha o dashboard HTTP do ESP32 para uma porta local da sua máquina
// (http://localhost:8280 — ver README do PetPulse-Iot). Como o app roda no
// emulador Android (AVD), usamos o alias especial 10.0.2.2, que o próprio
// emulador mapeia para o "localhost" do computador host.
//
// Ajuste conforme o seu setup, de preferência definindo a variável de
// ambiente EXPO_PUBLIC_COLEIRA_API_URL (num arquivo .env na raiz do projeto)
// em vez de editar o valor abaixo:
//
//   - Emulador Android (AVD) + Wokwi no VS Code ........ http://10.0.2.2:8280   (padrão)
//   - Expo Web, na mesma máquina do Wokwi ............... http://localhost:8280
//   - Dispositivo físico (Expo Go) na mesma Wi-Fi ....... http://<IP-do-seu-PC>:8280
//   - Wokwi Web (wokwi.com), sem VS Code ................ http://<IP mostrado no LCD/Serial do ESP32>
// ─────────────────────────────────────────────────────────────────────────
export const COLEIRA_API_URL =
  process.env.EXPO_PUBLIC_COLEIRA_API_URL ?? 'http://10.0.2.2:8280';

export class ColeiraApiError extends Error {}

export async function getLeituraColeira(signal?: AbortSignal): Promise<LeituraColeira> {
  let resposta: Response;
  try {
    resposta = await fetch(`${COLEIRA_API_URL}/api/dados`, { signal });
  } catch {
    throw new ColeiraApiError(
      `Não foi possível conectar à coleira em ${COLEIRA_API_URL}. Verifique se a ` +
        'simulação Wokwi está rodando e se o endereço configurado está correto.'
    );
  }

  if (!resposta.ok) {
    throw new ColeiraApiError(`A coleira respondeu com erro (HTTP ${resposta.status}).`);
  }

  try {
    return (await resposta.json()) as LeituraColeira;
  } catch {
    throw new ColeiraApiError('Resposta inválida da coleira (JSON malformado).');
  }
}
