// ─────────────────────────────────────────────────────────────────────────
// URL base da API Java (PetPulse-Api, Spring Boot).
//
// Setup padrão deste projeto: a API roda localmente via `./mvnw spring-boot:run`
// (porta 8080). Como o app roda no emulador Android (AVD), usamos o alias
// especial 10.0.2.2, que o próprio emulador mapeia para o "localhost" do
// computador host (mesmo esquema usado em coleiraApi.ts).
//
// Ajuste conforme o seu setup, de preferência definindo a variável de
// ambiente EXPO_PUBLIC_API_URL (num arquivo .env na raiz do projeto) em vez
// de editar o valor abaixo:
//
//   - Emulador Android (AVD) ............................ http://10.0.2.2:8080   (padrão)
//   - Expo Web, na mesma máquina da API .................. http://localhost:8080
//   - Dispositivo físico (Expo Go) na mesma Wi-Fi ........ http://<IP-do-seu-PC>:8080
// ─────────────────────────────────────────────────────────────────────────
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Token JWT (Bearer) da sessão atual. Só em memória — o token expira em 2
// minutos (definido no backend, `TokenService`, sem refresh token ainda),
// então não vale a pena persistir no AsyncStorage: ao reabrir o app ele já
// estaria vencido de qualquer forma. `AuthContext` chama setAuthToken() no
// login/logout.
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
      `Não foi possível conectar à API em ${API_URL}. Verifique se o PetPulse-Api está rodando ` +
        '(./mvnw spring-boot:run) e se o endereço configurado está correto.'
    );
  }

  if (!resposta.ok) {
    let mensagem = `A API respondeu com erro (HTTP ${resposta.status}).`;
    if (resposta.status === 401 || resposta.status === 403) {
      // O token JWT dura só 2 minutos (sem refresh token ainda) — o mais
      // comum aqui é a sessão ter expirado no meio do uso, não credenciais erradas.
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
