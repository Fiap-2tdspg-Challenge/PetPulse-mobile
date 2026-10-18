import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SmartAlertResponse } from "../types/types";

const ALERTAS_NOTIFICADOS_KEY = "@petpulse:alertas_notificados";

// Sem isso, o expo-notifications não mostra banner/som com o app aberto em
// primeiro plano — só registraria a notificação silenciosamente.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function solicitarPermissaoNotificacao(): Promise<boolean> {
  const { status: statusAtual } = await Notifications.getPermissionsAsync();
  if (statusAtual === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function idsJaNotificados(): Promise<Set<number>> {
  const salvo = await AsyncStorage.getItem(ALERTAS_NOTIFICADOS_KEY);
  return new Set<number>(salvo ? (JSON.parse(salvo) as number[]) : []);
}

async function marcarComoNotificado(id: number, jaNotificados: Set<number>): Promise<void> {
  jaNotificados.add(id);
  await AsyncStorage.setItem(ALERTAS_NOTIFICADOS_KEY, JSON.stringify(Array.from(jaNotificados)));
}

/**
 * Dispara uma notificação local pra cada alerta de risco ALTO ainda não
 * notificado nesta instalação do app. O evento é real — o alerta já existe
 * de verdade na API (gerado automaticamente a partir de leitura de IoT fora
 * da faixa esperada, ou manualmente pelo histórico clínico) — não é um
 * disparo manual só pra demonstração. Cada alerta notifica no máximo uma vez
 * (controlado via AsyncStorage), mesmo que a Home recarregue várias vezes.
 */
export async function notificarAlertasDeRisco(alertas: SmartAlertResponse[]): Promise<void> {
  const altos = alertas.filter((a) => a.riskLevel === "ALTO");
  if (altos.length === 0) return;

  const permitido = await solicitarPermissaoNotificacao();
  if (!permitido) return;

  const jaNotificados = await idsJaNotificados();

  for (const alerta of altos) {
    if (jaNotificados.has(alerta.id)) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Alerta de saúde: ${alerta.petName}`,
        body: alerta.message ?? "Um novo alerta de risco alto foi gerado para o seu pet.",
        data: { tipo: "alerta-risco", alertaId: alerta.id, petId: alerta.petId },
      },
      trigger: null,
    });

    await marcarComoNotificado(alerta.id, jaNotificados);
  }
}
