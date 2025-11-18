import { gql } from '@apollo/client';

// ==================== TypeScript Interfaces ====================

export interface SignUpInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenRefreshResponse {
  accessToken: string;
  idToken: string;
  expiresIn: number;
}

export interface SignOutResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ==================== GraphQL Mutations ====================

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      user {
        id
        email
        username
        firstName
        lastName
        role
      }
      accessToken
      idToken
      refreshToken
      expiresIn
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      user {
        id
        email
        username
        firstName
        lastName
        role
      }
      accessToken
      idToken
      refreshToken
      expiresIn
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      idToken
      expiresIn
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;
