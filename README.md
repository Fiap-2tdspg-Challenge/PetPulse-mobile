# PetPulse Mobile

Aplicativo mobile desenvolvido em **React Native + Expo** para gerenciamento completo da saúde e bem-estar dos pets. O PetPulse centraliza o histórico clínico, alertas inteligentes, localização em tempo real e dados de dispositivos IoT em uma única plataforma.

# Membros 

Gabriel Neris Losano, RM564093, 2TDSPG

João Vitor Biribilli Ravelli, RM565594, 2TDSPG

Pedro de Matos Previtali, RM564184, 2TDSPG

Pietro Paranhos Wilhelm, RM 561378, 2TDSPG


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

- **Autenticação** — Login do Tutor e do Veterinário com JWT de verdade (Spring Security + OAuth2 Resource Server, mesmo `POST /login` pros dois — o backend resolve o papel pelo e-mail).
- **Gerenciamento de pets** — Cadastro, edição e visualização de perfil completo (espécie, raça, peso, porte, sexo, castração).
- **Histórico clínico** — Registro de vacinas, consultas, exames, medicações, cirurgias e outros eventos, com suporte a datas de retorno.
- **Alertas inteligentes** — Notificações por nível de risco (BAIXO, MÉDIO, ALTO), geradas automaticamente a partir de leituras IoT fora da faixa esperada, pelo histórico clínico, pelo sistema ou manualmente.
- **Localização do pet** — Rastreamento GPS em tempo real com mapa interativo (Google Maps) e endereço reverso.
- **Dispositivo IoT** — Exibição de dados do sensor: frequência cardíaca, nível de atividade, pressão e status do dispositivo.
- **Perfil do usuário** — Visualização, edição e exclusão de conta.
- **Painel do Veterinário** — Login próprio, busca de pets por nome/tutor e histórico clínico (visualização e cadastro de novos registros).

---

## Tecnologias

| Categoria | Biblioteca / Versão |
|---|---|
| Framework | React Native `0.86.3` + Expo `~57.0.18` |
| Linguagem | TypeScript `~6.0.3` |
| Navegação | React Navigation v7 (Native Stack + Bottom Tabs) |
| Busca/cache de dados | TanStack Query (`@tanstack/react-query`) |
| Backend | API Java real — [PetPulse-Api](../PetPulse-Api) (Spring Boot), hospedada em [Render](https://petpulse-api-j1k8.onrender.com) |
| Persistência local | AsyncStorage `2.2.0` (guarda o token JWT da sessão — Tutor e Veterinário permanecem logados ao reabrir o app) |
| Localização | expo-location `~19.0.8` |
| Mapas | react-native-maps `1.20.1` |
| Gradientes | expo-linear-gradient `~15.0.8` |
| Ícones | @expo/vector-icons `^15.1.1` |

> **Nota sobre a camada de dados**: Tutor (perfil, telefone, endereço), Veterinário (perfil), Pets, Histórico Clínico e Alertas Inteligentes vêm todos de verdade da **PetPulse-Api** (Spring Boot), via `src/services/api/` + hooks em `src/hooks/` (TanStack Query) — sem nenhum cache local: cada login busca tudo de novo da API, então nunca existe uma cópia desatualizada em relação ao banco. Veja [Integração com a API](#integração-com-a-api-petpulse-api) para detalhes.

---

## Estrutura do projeto

```
PetPulse-mobile/
├── App.tsx                  # Ponto de entrada — providers e navegação raiz
├── src/
│   ├── components/          # Componentes reutilizáveis (Footer, PawBackground, Sparkline)
│   ├── constants/
│   │   └── estadosBrasil.ts # Nomes das UFs (usado só para o POST /states, não é catálogo hardcoded de negócio)
│   ├── context/
│   │   └── AuthContext.tsx  # Contexto de autenticação (Tutor e Veterinário) e persistência de sessão
│   ├── hooks/                # Hooks de dados (TanStack Query) — usePets, useHistorico, useAlertas, useTutor, useCatalogoPet
│   ├── routes/
│   │   └── Routes.tsx       # Definição das rotas (Tutor / Veterinário / não autenticado)
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
│   │   ├── cadastraHistorico/    # Compartilhada entre Tutor e Veterinário
│   │   ├── localizaPet/
│   │   ├── coleira/
│   │   ├── painelVeterinario/    # Painel do Veterinário: busca de pets por nome/tutor
│   │   └── historicoPetVeterinario/ # Histórico clínico do pet, visto pelo Veterinário
│   ├── services/
│   │   ├── api/             # Client HTTP + DTOs para a PetPulse-Api (inclui token JWT, ver client.ts)
│   │   ├── coleiraApi.ts    # Serviço externo (dispositivo IoT/coleira, fora da PetPulse-Api)
│   │   ├── geocodingApi.ts  # Serviço externo (Google Geocoding — endereço reverso)
│   │   └── queryClient.ts   # Instância do QueryClient do TanStack Query
│   ├── theme/
│   │   └── cores.ts         # Paleta de cores e gradientes
│   ├── types/               # Interfaces TypeScript dos modelos de domínio
│   └── utils/                # Funções puras de regra de negócio
│       ├── datas.ts         # Conversão/máscara de datas (DD/MM/AAAA ↔ ISO), usado nos formulários
│       └── lembretes.ts     # Cálculo do próximo retorno clínico
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
# EXPO_PUBLIC_API_URL já vem com o padrão apontando para a API hospedada no
# Render (https://petpulse-api-j1k8.onrender.com) — não precisa subir nada
# localmente. Só troque essa variável se quiser rodar a API local durante o
# desenvolvimento (repositório irmão PetPulse-Api, `./mvnw spring-boot:run`).

# 4. Inicie o servidor de desenvolvimento
npm expo start          # abre o Metro Bundler

# 5. Execute na plataforma desejada
npm run android    # Android
npm run ios        # iOS (requer macOS)
npm run web        # Web (experimental)
```

---

## Integração com a API (PetPulse-Api)

Tutor, Pets, Histórico Clínico e Alertas Inteligentes são todos lidos/gravados na API Java real (`PetPulse-Api`, Spring Boot), via `src/services/api/`.

**Login do Tutor é JWT de verdade** (Spring Security + OAuth2 Resource Server, token RSA): `POST /login` devolve `{ token }`, e o app manda `Authorization: Bearer <token>` em toda chamada depois disso (ver `setAuthToken`/`apiFetch` em `src/services/api/client.ts`). Duas particularidades da implementação atual que o app precisa contornar:
- **O token não carrega o id do tutor** (só e-mail e role) e a resposta do login também não devolve nada além do token. O app resolve isso buscando `GET /tutors?size=200` (já autenticado) e filtrando pelo e-mail no cliente — ver `getTutorByEmail` em `src/services/api/tutorApi.ts`.
- **O token expira em 20 minutos**, sem refresh token. Ele é persistido no AsyncStorage (`@petpulse:sessao`, junto com tipo de usuário e e-mail — nunca a senha), e restaurado ao abrir o app: `AuthContext` refaz `getTutorByEmail`/`getProfessionalByEmail` com o token salvo para remontar a sessão. Se o token já tiver expirado nesse momento, a chamada cai em 401 e o app volta pra tela de Login normalmente, limpando a sessão salva — ver `restaurarSessao` em `src/context/AuthContext.tsx`.

Não existe cache local do Tutor: telefone (`GET /tutor-phones`) e endereço (`GET /tutor-addresses`) são buscados da API a cada login, filtrados por `tutorId` no cliente (mesmo padrão de filtro client-side usado pra pets/histórico/alertas) — ver `montarUsuario` em `src/context/AuthContext.tsx`. Isso evita qualquer risco de a cópia local ficar desatualizada em relação ao banco.

Ao criar uma conta, o Cadastro cria o Tutor via `POST /tutors` (esse endpoint é público) e, em seguida, faz um login "por baixo dos panos" só pra conseguir um token válido e completar o cadastro de telefone e endereço (que já exigem token) — esse token é descartado logo depois; o login "de verdade" acontece na tela de Login.

Espécie e Raça são digitadas livremente pelo tutor: o app resolve o texto para um id real via `POST /species` e `POST /breeds` na API (endpoints "buscar ou cadastrar" — retornam o registro existente com esse nome, ou criam um novo na hora), antes de enviar o cadastro/edição do pet. Porte vem de `GET /pet-sizes` (catálogo fixo, só leitura — não é "buscar ou cadastrar" como Espécie/Raça, já que os valores são um enum fechado). Ver `src/hooks/useCatalogoPet.ts`.

**Limitações conhecidas do backend atual** (não são bugs do mobile, são do estado atual da API):

- **Token JWT de 20 minutos, sem refresh**: qualquer uso do app mais longo que isso vai gerar 401 no meio do caminho, exigindo logar de novo. A sessão é persistida (ver acima), então isso só afeta uso contínuo — reabrir o app dentro da janela de 20 min não exige novo login.
- **JWT sem o id do tutor**: contornado no cliente via `getTutorByEmail` (ver acima) — o ideal seria o token carregar um claim `id`.
- **Sem filtro por tutor/pet nas listagens**: `GET /pets`, `GET /clinical-histories`, `GET /smart-alerts`, `GET /tutor-phones` e `GET /tutor-addresses` só paginam todos os registros (sem filtro por `tutorId`/`petId`). O app busca uma página grande (`size=200`) e filtra no cliente.
- **Histórico Clínico sem profissional vinculado**: `professionalId` é opcional em `ClinicalHistoryRequest`, mas não existe endpoint de listagem de profissionais na API (mesma situação de Espécie/Raça antes do `POST /species`/`POST /breeds`). Por isso, o formulário de histórico no app não coleta profissional — os registros são criados sempre com `professionalId: null`. Quando a API ganhar um endpoint de profissionais, dá pra adicionar um seletor igual ao de Espécie/Raça.
- **Cold start do Render**: a API está hospedada no plano free do Render, que "dorme" depois de um tempo sem uso — a primeira chamada depois disso pode demorar ~30-50s pra responder. Não é bug do app; se o login parecer travado na primeira tentativa, é o servidor acordando.

---

## Link do vídeo
https://youtu.be/UXRha04ULPo

---

## Link do figma
https://www.figma.com/design/azNxLqmfQtd8EnDj1zAQfV/PetPulse?node-id=92-313&t=c9dJiuZnI4zCH66f-0

---
## Dados de teste

**Tutor**: não tem usuário de teste pré-semeado — crie uma conta pela tela de Cadastro (isso já cria o Tutor de verdade na API) e faça login com o e-mail/senha usados. Lembrando que o token expira em 20 minutos (ver [Integração com a API](#integração-com-a-api-petpulse-api)).

**Veterinário**: login também já é real (mesmo `POST /login`). Não tem tela de autocadastro — use um dos profissionais já semeados no banco (`PetPulseDB/03_CARGA.sql`, `PRC_CARGA_PROFISSIONAL`):

| E-mail | Senha |
|---|---|
| `carlos.andrade@vetcare.com` | `123456` |
| `fernanda.lima@vetcare.com` | `123456` |
| `roberto.souza@petsaude.com` | `123456` |

Todos os dados (Tutor, Veterinário, Pets, Histórico Clínico, Alertas Inteligentes) vêm sempre da API real (`PetPulse-Api`, hospedada no Render).

---

## Screens

| Tela | Descrição |
|---|---|
| **Login** | Autenticação com e-mail e senha (Tutor ou Veterinário) |
| **Cadastro** | Criação de nova conta de Tutor |
| **Home** | Dashboard com pets, alertas pendentes e próximos retornos |
| **Perfil** | Dados pessoais do usuário logado, com opção de excluir a conta |
| **Edita Perfil** | Atualização dos dados do usuário |
| **Cadastra Pet** | Formulário de novo pet |
| **Perfil Pet** | Detalhes do pet com dados IoT |
| **Edita Pet** | Atualização dos dados do pet |
| **Histórico Clínico** | Lista de registros filtráveis por categoria (visão do Tutor) |
| **Cadastra Histórico** | Formulário de novo registro clínico ou edição (compartilhada entre Tutor e Veterinário) |
| **Localiza Pet** | Mapa GPS com rastreamento em tempo real |
| **Coleira** | Dados ao vivo do dispositivo IoT (frequência cardíaca, atividade, pressão) |
| **Painel Veterinário** | Busca de pets por nome ou tutor |
| **Histórico Pet Veterinário** | Histórico clínico do pet e dados do tutor, visto pelo Veterinário |

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
// idUsuario carrega o tutorId real da API; especieId/racaId resolvidos via POST /species e /breeds
// ("buscar ou cadastrar"), porteId vem de GET /pet-sizes — ver src/hooks/useCatalogoPet.ts
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
