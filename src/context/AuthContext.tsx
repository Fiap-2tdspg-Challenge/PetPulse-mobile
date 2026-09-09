import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../types/Usuario';
import { Veterinario } from '../types/Veterinario';
import { loginTutor, getTutorByEmail, deleteTutor } from '../services/api/tutorApi';
import { getTutorPhoneByTutorId } from '../services/api/tutorPhoneApi';
import { getTutorAddressByTutorId } from '../services/api/tutorAddressApi';
import { loginProfessional, getProfessionalByEmail } from '../services/api/professionalApi';
import { setAuthToken } from '../services/api/client';
import { TutorResponse } from '../types/types';

const SESSAO_KEY = '@petpulse:sessao';

interface SessaoArmazenada {
  token: string;
  tipo: 'TUTOR' | 'VETERINARIO';
  email: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  veterinario: Veterinario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  loginVeterinario: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  atualizarUsuario: (dados: Usuario) => Promise<void>;
  excluirConta: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Monta o Usuario completo combinando o Tutor com telefone/endereço, buscados
 * direto da API (GET /tutor-phones e /tutor-addresses, filtrados por tutorId
 * no cliente — a API não tem esse filtro). Sem cache local: cada login busca
 * tudo de novo, então nunca existe uma cópia desatualizada em relação ao banco.
 */
async function montarUsuario(tutor: TutorResponse): Promise<Usuario> {
  const [fone, endereco] = await Promise.all([
    getTutorPhoneByTutorId(tutor.id),
    getTutorAddressByTutorId(tutor.id),
  ]);

  return {
    ...tutor,
    telefone: fone?.phoneNumber ?? '',
    phoneId: fone?.id,
    endereco: endereco?.address ?? '',
    numero: endereco?.number ?? '',
    complemento: endereco?.complement ?? '',
    cep: endereco?.zipCode ?? '',
    bairro: endereco?.neighborhood ?? '',
    cidade: endereco?.cityName ?? '',
    estado: endereco?.stateCode ?? '',
    enderecoId: endereco?.id,
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Restaura a sessão salva ao abrir o app: guarda só o token + e-mail (o
  // suficiente pra buscar o perfil de novo na API), nunca a senha. Se o
  // token já tiver expirado, a chamada abaixo cai no catch e o usuário
  // simplesmente volta pra tela de Login — sem travar nem mostrar erro.
  useEffect(() => {
    async function restaurarSessao() {
      try {
        const raw = await AsyncStorage.getItem(SESSAO_KEY);
        if (!raw) return;

        const sessao: SessaoArmazenada = JSON.parse(raw);
        setAuthToken(sessao.token);

        if (sessao.tipo === 'TUTOR') {
          const tutor = await getTutorByEmail(sessao.email);
          if (!tutor) throw new Error('Tutor não encontrado');
          setUsuario(await montarUsuario(tutor));
        } else {
          const profissional = await getProfessionalByEmail(sessao.email);
          if (!profissional) throw new Error('Profissional não encontrado');
          setVeterinario(profissional);
        }
      } catch {
        setAuthToken(null);
        await AsyncStorage.removeItem(SESSAO_KEY);
      } finally {
        setCarregando(false);
      }
    }
    restaurarSessao();
  }, []);

  // Login do Tutor consulta a API de verdade (POST /login, JWT assinado em
  // RSA). A resposta só traz o token — sem id/nome/e-mail do tutor, e o JWT
  // também não carrega o id (só e-mail e role) — então resolvemos o tutor
  // logado com getTutorByEmail (busca a listagem já autenticada e filtra no
  // cliente), e telefone/endereço direto da API também (sem cache local).
  const login = async (email: string, senha: string): Promise<boolean> => {
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = senha.trim();
    try {
      const { token } = await loginTutor({ email: emailNormalizado, password: senhaNormalizada });
      setAuthToken(token);

      const tutor = await getTutorByEmail(emailNormalizado);
      if (!tutor) {
        setAuthToken(null);
        return false;
      }

      setUsuario(await montarUsuario(tutor));
      await AsyncStorage.setItem(SESSAO_KEY, JSON.stringify({ token, tipo: 'TUTOR', email: emailNormalizado }));
      return true;
    } catch {
      setAuthToken(null);
      return false;
    }
  };

  // Mesmo fluxo do Tutor: login de verdade via POST /login (o backend resolve
  // o papel — ROLE_TUTOR ou ROLE_PROFESSIONAL — pelo e-mail) e resolve o
  // profissional logado via getProfessionalByEmail.
  const loginVeterinario = async (email: string, senha: string): Promise<boolean> => {
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = senha.trim();
    try {
      const { token } = await loginProfessional({ email: emailNormalizado, password: senhaNormalizada });
      setAuthToken(token);

      const profissional = await getProfessionalByEmail(emailNormalizado);
      if (!profissional) {
        setAuthToken(null);
        return false;
      }

      setVeterinario(profissional);
      await AsyncStorage.setItem(
        SESSAO_KEY,
        JSON.stringify({ token, tipo: 'VETERINARIO', email: emailNormalizado })
      );
      return true;
    } catch {
      setAuthToken(null);
      return false;
    }
  };

  const logout = async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem(SESSAO_KEY);
    setUsuario(null);
    setVeterinario(null);
  };

  // Não persiste mais nada localmente além do token de sessão: quem chama já
  // fez as chamadas de API necessárias (PUT /tutors/{id}, POST/PUT
  // /tutor-phones, /tutor-addresses) — aqui só atualiza o estado em memória.
  const atualizarUsuario = async (dados: Usuario) => {
    setUsuario(dados);
  };

  // Exclui o Tutor de verdade na API (DELETE /tutors/{id} — bloqueia com 409
  // se ainda houver pets cadastrados). Erros propagam pra quem chamou, pra
  // exibir a mensagem certa (ex: "remova os pets primeiro").
  const excluirConta = async () => {
    if (!usuario) return;
    await deleteTutor(usuario.id);
    setAuthToken(null);
    await AsyncStorage.removeItem(SESSAO_KEY);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, veterinario, carregando, login, loginVeterinario, logout, atualizarUsuario, excluirConta }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
