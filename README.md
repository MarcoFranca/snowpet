
# ❄️ SnowPet – App de Cuidados para Pets

Organize os cuidados, medicamentos, vacinas e bem-estar dos seus pets.  
Desenvolvido em React Native com Expo, este app foi pensado para ser simples, eficiente e escalável.

## 🚀 Visão Geral

- 📱 App mobile (Android e iOS)
- ☁️ Suporte a dados locais (SQLite) e backup na nuvem (Firebase)
- 🌗 Suporte a Light/Dark Mode
- 🎨 Design limpo e amigável, com tipografia e cores padronizadas
- 💰 Monetização: AdMob + Planos Premium via Stripe (futuro)

## 🏗️ Tecnologias e Stack

- React Native + Expo + Expo Router
- Styled Components
- SQLite (expo-sqlite)
- Firebase (Auth + Firestore)
- AdMob
- Zustand (State Management)
- Stripe (pagamentos via API backend)
- Expo Notifications
- Typescript

## 📦 Instalação Local

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/snowpet.git
cd snowpet
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Rode o projeto no Expo
```bash
npx expo start
```

## 🔧 Dependências principais
```bash
# Navegação
expo-router

# UI
styled-components
@expo/vector-icons

# Banco local
expo-sqlite

# Firebase
@react-native-firebase/app
@react-native-firebase/auth
@react-native-firebase/firestore

# Auth
expo-auth-session (se necessário no futuro)

# Notifications
expo-notifications

# Monetização
@react-native-admob/admob

# Gerenciamento de estado
zustand

# Formulários (opcional)
react-hook-form

# Datas
dayjs

# Outras
expo-constants
expo-haptics
expo-font
expo-status-bar
expo-system-ui
react-native-webview
```

## 🔥 Setup de Serviços

### 🔥 Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Ative Authentication e Firestore Database.
3. Crie um arquivo `.env` com as credenciais:
```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```
4. Cole `google-services.json` no `/android` e `GoogleService-Info.plist` no `/ios`.

### 💰 Stripe
- Utilize a conta existente do CorretorLab.
- Crie um Product chamado `SnowPet Premium`.
- Configure Prices (mensal, anual ou vitalício).
- Use Checkout ou Payment Intents via API backend.

### 📲 EAS Build
```bash
npx eas build:configure
npx eas build --platform android
npx eas build --platform ios
```

## 🎨 Design System
- Paleta de cores em `constants/Colors.ts`
- Tipografia em `constants/Fonts.ts` e `types/theme.ts`
- ThemeProvider funcionando
- Light e Dark Mode prontos

## 🏛️ Estrutura de Pastas
```
/app
/components
/constants
/hooks
/types
/services
/context
/assets
/scripts
```

## 🗂️ Estrutura Firebase (sugestão)
- users
- pets
- cares
- history

## 🚧 Roadmap
- [x] Setup inicial
- [x] Theme e Design Tokens
- [ ] Componentes UI
- [ ] Firebase Auth + Firestore
- [ ] Lembretes e agendamentos
- [ ] AdMob
- [ ] Stripe
- [ ] Deploy nas lojas

## 💼 Licença
Projeto privado – SnowPet App.

## 🐶 Feito com ❤️ por [Autentika Digital](https://www.autentika.digital) e [Marco França](https://www.linkedin.com/in/marco-franca/)
