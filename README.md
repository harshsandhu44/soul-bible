# Soul Bible

A spiritual companion app built with React Native and Expo, featuring AWS Cognito authentication and Material Design 3 theming.

## Features

- 🔐 **Complete Authentication System** - AWS Cognito integration with custom UI
- 🎨 **Material Design 3** - Beautiful, modern UI with light and dark mode
- 🔄 **Auto-Login** - Secure credential storage with react-native-keychain
- 📱 **Cross-Platform** - Runs on iOS, Android, and Web
- ⚡ **Modern Stack** - React Native Paper, Zustand, Expo Router

## Get Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the App

```bash
npx expo start
```

In the output, you'll find options to open the app in:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Authentication

### Features

- **Sign Up** - Create account with email, password, first name, and last name
- **Email Verification** - 6-digit code verification via email
- **Sign In** - Login with email and password
- **Remember Me** - Secure auto-login with stored credentials
- **Forgot Password** - Request and confirm password reset
- **Route Protection** - Automatic redirection based on auth status

### Cognito Configuration

The app is configured to use AWS Cognito with the following settings:

```typescript
User Pool ID: eu-central-1_Hk1iUXIym
Client ID: 3cdfnuv8j649iba11h5ik7rv35
Region: eu-central-1
```

### Password Requirements

- Minimum 8 characters
- Must include uppercase letter
- Must include lowercase letter
- Must include number
- Must include special character (@$!%*?&)

### Testing Authentication

1. Run the app and navigate to the welcome screen
2. Tap "Get Started" to create a new account
3. Fill out the sign up form with your details
4. Check your email for the verification code
5. Enter the code to verify your account
6. Sign in with your credentials

## Project Structure

```
soul-bible/
├── app/
│   ├── (auth)/               # Authentication screens
│   │   ├── welcome.tsx       # Onboarding screen
│   │   ├── signin.tsx        # Sign in form
│   │   ├── signup.tsx        # Sign up form
│   │   ├── verify-email.tsx  # Email verification
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.tsx
│   │   └── _layout.tsx       # Auth navigation
│   ├── _layout.tsx           # Root layout with auth protection
│   └── index.tsx             # Home screen
├── config/
│   └── amplify.ts            # AWS Amplify configuration
├── services/
│   └── authService.ts        # Authentication service layer
├── store/
│   ├── authStore.ts          # Auth state management (Zustand)
│   └── themeStore.ts         # Theme state management
└── constants/
    └── theme.ts              # Material Design 3 themes
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **Expo Router** - File-based navigation
- **React Native Paper** - Material Design 3 components
- **AWS Amplify** - Authentication and backend integration
- **Zustand** - Lightweight state management
- **TypeScript** - Type safety

## Architecture

### Service Layer
Authentication logic is abstracted in `services/authService.ts`, providing clean functions for:
- Sign up with user attributes
- Email verification and code resend
- Sign in with auto-login support
- Sign out and credential clearing
- Password reset flow

### State Management
Zustand stores handle:
- **authStore** - User state, auth status, loading states, auth actions
- **themeStore** - Theme mode, system theme sync, toggle functionality

### Route Protection
The root layout (`app/_layout.tsx`) implements:
- Auth status check on app load
- Auto-login with stored credentials
- Automatic redirects based on authentication state
- Loading screen during initialization

## Security

- **Secure Storage** - Credentials stored using iOS Keychain and Android Keystore
- **HTTPS Only** - All API communications use HTTPS
- **Password Policy** - Enforced by AWS Cognito
- **Token Management** - Handled automatically by AWS Amplify

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://reactnativepaper.com/)
- [AWS Amplify Auth](https://docs.amplify.aws/javascript/build-a-backend/auth/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## Backend

For backend API integration and authentication details, refer to the documentation in the backend repository.
