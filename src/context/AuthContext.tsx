import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types/Usuario';
import { Veterinario } from '../types/Veterinario';
import { loginTutor, getTutorByEmail, deleteTutor } from '../services/api/tutorApi';
import { getTutorPhoneByTutorId } from '../services/api/tutorPhoneApi';
import { getTutorAddressByTutorId } from '../services/api/tutorAddressApi';
import { loginProfessional, getProfessionalByEmail } from '../services/api/professionalApi';
import { setAuthToken } from '../services/api/client';
import { TutorResponse } from '../types/types';

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

  useEffect(() => {
    // Nem Tutor nem Veterinário persistem sessão: os dois logam via JWT (2
    // min de validade, sem refresh token, guardado só em memória — ver
    // client.ts), então qualquer sessão salva já estaria vencida. É preciso
    // logar de novo a cada abertura do app, até o backend ganhar refresh token.
    setCarregando(false);
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
      return true;
    } catch {
      setAuthToken(null);
      return false;
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUsuario(null);
    setVeterinario(null);
  };

  // Não persiste mais nada localmente: quem chama já fez as chamadas de API
  // necessárias (PUT /tutors/{id}, POST/PUT /tutor-phones, /tutor-addresses)
  // — aqui só atualiza o estado em memória com o resultado.
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
