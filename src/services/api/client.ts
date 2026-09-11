// ─────────────────────────────────────────────────────────────────────────
// URL base da API Java (PetPulse-Api, Spring Boot), hospedada no Render:
// https://petpulse-api-j1k8.onrender.com — funciona em qualquer plataforma
// (emulador, dispositivo físico, web) sem precisar subir a API localmente.
//
// O Render free tier "dorme" a API depois de um tempo sem uso: a primeira
// chamada depois disso pode demorar ~30-50s pra responder (cold start) — não
// é bug do app, é o servidor acordando.
//
// Ajuste conforme o seu setup, de preferência definindo a variável de
// ambiente EXPO_PUBLIC_API_URL (num arquivo .env na raiz do projeto) em vez
// de editar o valor abaixo — por exemplo, pra rodar a API localmente durante
// o desenvolvimento (`./mvnw spring-boot:run`, porta 8080):
//
//   - Emulador Android (AVD) ............................ http://10.0.2.2:8080
//   - Expo Web, na mesma máquina da API .................. http://localhost:8080
//   - Dispositivo físico (Expo Go) na mesma Wi-Fi ........ http://<IP-do-seu-PC>:8080
// ─────────────────────────────────────────────────────────────────────────
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://petpulse-api-j1k8.onrender.com';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Token JWT (Bearer) da sessão atual, guardado em memória. A persistência
// entre aberturas do app (AsyncStorage) é responsabilidade do AuthContext,
// que chama setAuthToken() no login/logout/restauração de sessão — aqui é
// só o valor usado pra montar o header Authorization de cada chamada.
// ─────────────────────────────────────────────────────────────────────────
let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      `Não foi possível conectar à API em ${API_URL}. Verifique se o PetPulse-Api está rodando `
    );
  }

  if (!resposta.ok) {
    let mensagem = `A API respondeu com erro (HTTP ${resposta.status}).`;
    if (resposta.status === 401 || resposta.status === 403) {
      // O token JWT tem validade de 20 min e ainda não tem refresh token — o
      // mais comum aqui é a sessão ter expirado, não credenciais erradas.
      mensagem = 'Sua sessão expirou. Faça login novamente.';
    } else {
      try {
        const corpo = await resposta.json();
        if (corpo?.message) mensagem = corpo.message;
      } catch {
        // corpo não era JSON, mantém a mensagem genérica
      }
    }
    throw new ApiError(mensagem, resposta.status);
  }

  if (resposta.status === 204) return undefined as T;

  try {
    return (await resposta.json()) as T;
  } catch {
    throw new ApiError('Resposta inválida da API (JSON malformado).');
  }
}
