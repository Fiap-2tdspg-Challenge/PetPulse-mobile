# PetPulse Mobile

Aplicativo mobile desenvolvido em **React Native + Expo** para gerenciamento completo da saúde e bem-estar dos pets. O PetPulse centraliza o histórico clínico, alertas inteligentes, localização em tempo real e dados de dispositivos IoT em uma única plataforma.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Integração com a API](#integração-com-a-api-petpulse-api)
- [Link do vídeo](#link-do-vídeo)
- [Link do figma](#link-do-figma)
- [Dados de teste](#dados-de-teste)
- [Screens](#screens)
- [Modelos de dados](#modelos-de-dados)
- [Paleta de cores](#paleta-de-cores)

---

## Funcionalidades

- **Autenticação** — Login do Tutor com JWT de verdade (Spring Security + OAuth2 Resource Server); login do Veterinário ainda local, temporário.
- **Gerenciamento de pets** — Cadastro, edição e visualização de perfil completo (espécie, raça, peso, porte, sexo, castração).
- **Histórico clínico** — Registro de vacinas, consultas, exames, medicações, cirurgias e outros eventos, com suporte a datas de retorno.
- **Alertas inteligentes** — Notificações por nível de risco (BAIXO, MÉDIO, ALTO, CRÍTICO) geradas por IoT, pelo sistema ou manualmente.
- **Localização do pet** — Rastreamento GPS em tempo real com mapa interativo (Google Maps) e endereço reverso.
- **Dispositivo IoT** — Exibição de dados do sensor: frequência cardíaca, nível de atividade, pressão e status do dispositivo.
- **Perfil do usuário** — Visualização e edição de dados pessoais.

---

## Tecnologias

| Categoria | Biblioteca / Versão |
|---|---|
| Framework | React Native `0.86.3` + Expo `~57.0.18` |
| Linguagem | TypeScript `~6.0.3` |
| Navegação | React Navigation v7 (Native Stack + Bottom Tabs) |
| Busca/cache de dados | TanStack Query (`@tanstack/react-query`) |
| Backend | API Java real — [PetPulse-Api](../PetPulse-Api) (Spring Boot) |
| Persistência local (só Veterinário) | AsyncStorage `2.2.0` |
| Localização | expo-location `~19.0.8` |
| Mapas | react-native-maps `1.20.1` |
| Gradientes | expo-linear-gradient `~15.0.8` |
| Ícones | @expo/vector-icons `^15.1.1` |

> **Nota sobre a camada de dados**: Tutor (perfil, telefone, endereço), Pets, Histórico Clínico e Alertas Inteligentes vêm todos de verdade da **PetPulse-Api** (Spring Boot), via `src/services/api/` + hooks em `src/hooks/` (TanStack Query) — sem cache local: cada login busca tudo de novo da API, então nunca existe uma cópia desatualizada em relação ao banco. `src/services/storage.ts` (AsyncStorage) cuida só do login local do Veterinário (temporário, até esse perfil ganhar JWT também). Veja [Integração com a API](#integração-com-a-api-petpulse-api) para detalhes.

---

## Estrutura do projeto

```
PetPulse-mobile/
├── App.tsx                  # Ponto de entrada — providers e navegação raiz
├── src/
│   ├── components/          # Componentes reutilizáveis (Footer, PawBackground)
│   ├── constants/
│   │   └── estadosBrasil.ts # Nomes das UFs (usado só para o POST /states, não é catálogo hardcoded de negócio)
│   ├── context/
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── hooks/                # Hooks de dados (TanStack Query) — usePets, useHistorico, useAlertas, useTutor
│   ├── mocks/               # Dados de referência (não usados pelos hooks atuais)
│   ├── routes/
│   │   └── Routes.tsx       # Definição das rotas (autenticado / não autenticado)
│   ├── screens/             # Telas da aplicação (somente UI, sem lógica de dados)
│   │   ├── login/
│   │   ├── cadastro/
│   │   ├── Home/
│   │   ├── perfil/
│   │   ├── editaPerfil/
│   │   ├── cadastraPet/
│   │   ├── editaPet/
│   │   ├── perfilPet/
│   │   ├── historicoClinico/
│   │   └── localizaPet/
│   ├── services/
│   │   ├── api/             # Client HTTP + DTOs + mappers para a PetPulse-Api
│   │   ├── storage.ts       # AsyncStorage — só o login local do Veterinário
│   │   └── queryClient.ts   # Instância do QueryClient do TanStack Query
│   ├── theme/
│   │   └── cores.ts         # Paleta de cores e gradientes
│   ├── types/               # Interfaces TypeScript dos modelos de domínio
│   └── utils/                # Funções puras de regra de negócio (ex: cálculo de lembretes)
└── android/ ios/            # Projetos nativos gerados pelo Expo
```

---

## Pré-requisitos

- **Node.js** ≥ 18
- **npm** ou **yarn**
- **Expo CLI** — `npm install -g expo-cli`
- Para Android: Android Studio com emulador configurado ou dispositivo físico com Expo Go
- Para iOS: Xcode (apenas macOS) ou dispositivo físico com Expo Go

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd PetPulse-mobile

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# preencha EXPO_PUBLIC_GOOGLE_MAPS_KEY com uma chave válida do Google Maps
# EXPO_PUBLIC_API_URL já vem com o padrão para emulador Android (10.0.2.2:8080)

# 4. Suba a API localmente (repositório irmão PetPulse-Api)
cd ../PetPulse-Api && ./mvnw spring-boot:run   # (mvnw.cmd no Windows)
cd ../PetPulse-mobile

# 5. Inicie o servidor de desenvolvimento
npm expo start          # abre o Metro Bundler

# 6. Execute na plataforma desejada
npm run android    # Android
npm run ios        # iOS (requer macOS)
npm run web        # Web (experimental)
```

---

## Integração com a API (PetPulse-Api)

Tutor, Pets, Histórico Clínico e Alertas Inteligentes são todos lidos/gravados na API Java real (`PetPulse-Api`, Spring Boot), via `src/services/api/`.

**Login do Tutor é JWT de verdade** (Spring Security + OAuth2 Resource Server, token RSA): `POST /login` devolve `{ token }`, e o app manda `Authorization: Bearer <token>` em toda chamada depois disso (ver `setAuthToken`/`apiFetch` em `src/services/api/client.ts`). Duas particularidades da implementação atual que o app precisa contornar:
- **O token não carrega o id do tutor** (só e-mail e role) e a resposta do login também não devolve nada além do token. O app resolve isso buscando `GET /tutors?size=200` (já autenticado) e filtrando pelo e-mail no cliente — ver `getTutorByEmail` em `src/services/api/tutorApi.ts`.
- **O token expira em 2 minutos**, sem refresh token. Por isso ele só é guardado em memória (nunca no AsyncStorage) — reabrir o app sempre exige logar de novo.

Não existe cache local do Tutor: telefone (`GET /tutor-phones`) e endereço (`GET /tutor-addresses`) são buscados da API a cada login, filtrados por `tutorId` no cliente (mesmo padrão de filtro client-side usado pra pets/histórico/alertas) — ver `montarUsuario` em `src/context/AuthContext.tsx`. Isso evita qualquer risco de a cópia local ficar desatualizada em relação ao banco.

Ao criar uma conta, o Cadastro cria o Tutor via `POST /tutors` (esse endpoint é público) e, em seguida, faz um login "por baixo dos panos" só pra conseguir um token válido e completar o cadastro de telefone e endereço (que já exigem token) — esse token é descartado logo depois; o login "de verdade" acontece na tela de Login.

Espécie e Raça são digitadas livremente pelo tutor: o app resolve o texto para um id real via `POST /species` e `POST /breeds` na API (endpoints "buscar ou cadastrar" — retornam o registro existente com esse nome, ou criam um novo na hora), antes de enviar o cadastro/edição do pet. Porte vem de `GET /pet-sizes` (catálogo fixo, só leitura — não é "buscar ou cadastrar" como Espécie/Raça, já que os valores são um enum fechado). Ver `src/hooks/useCatalogoPet.ts`.

**Limitações conhecidas do backend atual** (não são bugs do mobile, são do estado atual da API):

- **Token JWT de 2 minutos, sem refresh**: qualquer uso do app mais longo que isso vai gerar 401 no meio do caminho, exigindo logar de novo.
- **JWT sem o id do tutor**: contornado no cliente via `getTutorByEmail` (ver acima) — o ideal seria o token carregar um claim `id`.
- **Sem filtro por tutor/pet nas listagens**: `GET /pets`, `GET /clinical-histories`, `GET /smart-alerts`, `GET /tutor-phones` e `GET /tutor-addresses` só paginam todos os registros (sem filtro por `tutorId`/`petId`). O app busca uma página grande (`size=200`) e filtra no cliente.
- **Histórico Clínico sem profissional vinculado**: `professionalId` é opcional em `ClinicalHistoryRequest`, mas não existe endpoint de listagem de profissionais na API (mesma situação de Espécie/Raça antes do `POST /species`/`POST /breeds`). Por isso, o formulário de histórico no app não coleta profissional — os registros são criados sempre com `professionalId: null`. Quando a API ganhar um endpoint de profissionais, dá pra adicionar um seletor igual ao de Espécie/Raça.

---

## Link do vídeo
https://youtu.be/UXRha04ULPo

---

## Link do figma
https://www.figma.com/design/azNxLqmfQtd8EnDj1zAQfV/PetPulse?node-id=92-313&t=c9dJiuZnI4zCH66f-0

---
## Dados de teste

**Tutor**: não tem usuário de teste pré-semeado — crie uma conta pela tela de Cadastro (isso já cria o Tutor de verdade na API) e faça login com o e-mail/senha usados. Lembrando que o token expira em 2 minutos (ver [Integração com a API](#integração-com-a-api-petpulse-api)).

**Veterinário**: login continua local/mock — dados de teste em `src/mocks/veterinario.ts`, semeados no `AsyncStorage` na primeira execução via `seedStorage()` (`src/services/storage.ts`).

Pets, Histórico Clínico e Alertas Inteligentes são sempre lidos da API real (`PetPulse-Api`, rodando localmente) — os arquivos em `src/mocks/` (exceto `veterinario.ts`) continuam no repositório só como referência.

---

## Screens

| Tela | Descrição |
|---|---|
| **Login** | Autenticação com e-mail e senha |
| **Cadastro** | Criação de nova conta |
| **Home** | Dashboard com pets, alertas pendentes e próximos retornos |
| **Perfil** | Dados pessoais do usuário logado |
| **Edita Perfil** | Atualização dos dados do usuário |
| **Cadastra Pet** | Formulário de novo pet |
| **Perfil Pet** | Detalhes do pet com dados IoT |
| **Edita Pet** | Atualização dos dados do pet |
| **Histórico Clínico** | Lista de registros filtráveis por categoria |
| **Localiza Pet** | Mapa GPS com rastreamento em tempo real |

---

## Modelos de dados

### Usuario
```ts
// Extends TutorResponse da API (id, name, cpf, email, createdAt) + campos que
// a API guarda em endpoints separados, buscados no login (sem cache local):
{ id, name, cpf, email, createdAt, telefone, endereco, numero, complemento, cep, bairro, cidade, estado, phoneId?, enderecoId? }
// phoneId/enderecoId: ids do TutorPhone/TutorAddress na API, quando existem
```

### Pet
```ts
{ idPet, idUsuario, nome, especie, raca, dtNascimento, peso, sexo, castrado, porte, dtCadastro, especieId?, racaId?, porteId? }
// porte: 'PEQUENO' | 'MEDIO' | 'GRANDE'
// sexo:  'MACHO'   | 'FEMEA'
// idUsuario carrega o tutorId real da API; especieId/racaId/porteId vêm do catálogo (src/constants/catalogoPet.ts)
```

### HistoricoClinico
```ts
{ idHistorico, idPet, tipoRegistro, descricao, dtRegistro, dtRetorno, profissionalClinica, observacoes }
// tipoRegistro: 'VACINA' | 'CONSULTA' | 'DOENCA' | 'MEDICAMENTO' | 'OBSERVACAO' | 'EXAME'  (alinhado com RecordType da API)
```

### AlertaInteligente
```ts
{ idAlerta, idPet, tipoAlerta, nivelRisco, origemAlerta, mensagem, recomendacao, dtGeracao, status }
// tipoAlerta:   string (texto livre vindo da API, ex: FREQUENCIA_CARDIACA, VACINA, CHECK_UP)
// nivelRisco:   'BAIXO' | 'MEDIO' | 'ALTO'
// origemAlerta: 'HISTORICO_CLINICO' | 'DISPOSITIVO_IOT' | 'SISTEMA' | 'USUARIO'
// status:       'ABERTO' | 'VISUALIZADO' | 'RESOLVIDO'
```

### DispositivoIoT
```ts
{ idDispositivo, idPet, dtVinculacao, intervaloColetaMinutos, frequenciaCardiaca, nivelAtividade, pressao, dtUltimaLeitura, status }
// status: 'ATIVO' | 'INATIVO' | 'MANUTENCAO'
```

---

## Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `roxoPrimario` | `#6B21A8` | Cor principal |
| `roxoMedio` | `#9333EA` | Destaques e headers |
| `roxoClaro` | `#C084FC` | Elementos secundários |
| `azulPrimario` | `#1D4ED8` | Ações e links |
| `verde` | `#06B6D4` | Destaque / cyan |
| `sucesso` | `#10B981` | Feedbacks positivos |
| `erro` | `#EF4444` | Alertas e erros |
| `aviso` | `#F59E0B` | Alertas moderados |
