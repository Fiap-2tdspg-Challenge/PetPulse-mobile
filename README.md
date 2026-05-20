# PetPulse Mobile

Aplicativo mobile desenvolvido em **React Native + Expo** para gerenciamento completo da saúde e bem-estar dos pets. O PetPulse centraliza o histórico clínico, alertas inteligentes, localização em tempo real e dados de dispositivos IoT em uma única plataforma.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Link do vídeo](#link-do-vídeo)
- [Dados de teste](#dados-de-teste)
- [Screens](#screens)
- [Modelos de dados](#modelos-de-dados)
- [Paleta de cores](#paleta-de-cores)

---

## Funcionalidades

- **Autenticação** — Login e cadastro de usuário com sessão persistida via AsyncStorage.
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
| Framework | React Native `0.81.5` + Expo `~54.0.33` |
| Linguagem | TypeScript `~5.9.2` |
| Navegação | React Navigation v7 (Native Stack + Bottom Tabs) |
| Persistência local | AsyncStorage `2.2.0` |
| Localização | expo-location `~19.0.8` |
| Mapas | react-native-maps `1.20.1` |
| Gradientes | expo-linear-gradient `~15.0.8` |
| Ícones | @expo/vector-icons `^15.1.1` |

---

## Estrutura do projeto

```
PetPulse-mobile/
├── App.tsx                  # Ponto de entrada — providers e navegação raiz
├── src/
│   ├── components/          # Componentes reutilizáveis (Footer, PawBackground)
│   ├── context/
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── mocks/               # Dados iniciais para semeadura do AsyncStorage
│   ├── routes/
│   │   └── Routes.tsx       # Definição das rotas (autenticado / não autenticado)
│   ├── screens/             # Telas da aplicação
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
│   │   └── storage.ts       # Camada de acesso ao AsyncStorage
│   ├── theme/
│   │   └── cores.ts         # Paleta de cores e gradientes
│   └── types/               # Interfaces TypeScript dos modelos de domínio
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

# 3. Inicie o servidor de desenvolvimento
npm expo start          # abre o Metro Bundler

# 4. Execute na plataforma desejada
npm run android    # Android
npm run ios        # iOS (requer macOS)
npm run web        # Web (experimental)
```

---


## Link do vídeo
https://youtu.be/UXRha04ULPo


---
## Dados de teste

Na primeira execução, o app semeia o AsyncStorage com dados mock prontos para uso:

| Campo | Valor |
|---|---|
| E-mail | definido em `src/mocks/usuario.ts` |
| Senha | definida em `src/mocks/usuario.ts` |

Os mocks incluem usuário, pets, histórico clínico e alertas inteligentes pré-cadastrados.

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
{ idUsuario, nome, cpf, email, senha, telefone, endereco, dtCadastro }
```

### Pet
```ts
{ idPet, idUsuario, nome, especie, raca, dtNascimento, peso, sexo, castrado, porte, dtCadastro }
// porte: 'PEQUENO' | 'MEDIO' | 'GRANDE'
// sexo:  'MACHO'   | 'FEMEA'
```

### HistoricoClinico
```ts
{ idHistorico, idPet, tipoRegistro, descricao, dtRegistro, dtRetorno, profissionalClinica, observacoes }
// tipoRegistro: 'VACINA' | 'CONSULTA' | 'EXAME' | 'MEDICACAO' | 'CIRURGIA' | 'OUTRO'
```

### AlertaInteligente
```ts
{ idAlerta, idPet, tipoAlerta, nivelRisco, origemAlerta, mensagem, recomendacao, dtGeracao, status }
// nivelRisco:   'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO'
// origemAlerta: 'IOT'   | 'SISTEMA' | 'MANUAL'
// status:       'PENDENTE' | 'LIDO' | 'RESOLVIDO'
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
