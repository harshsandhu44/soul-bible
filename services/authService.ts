import * as SecureStore from 'expo-secure-store';
import { apolloClient } from '../config/apollo';
import {
  SIGN_UP,
  SIGN_IN,
  REFRESH_TOKEN,
  SIGN_OUT,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  SignUpInput,
  SignInInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthResponse,
  TokenRefreshResponse,
  SignOutResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from './graphql/auth';

// SecureStore keys for token storage
const ACCESS_TOKEN_KEY = 'soul-bible-access-token';
const ID_TOKEN_KEY = 'soul-bible-id-token';
const REFRESH_TOKEN_KEY = 'soul-bible-refresh-token';
const TOKEN_EXPIRES_AT_KEY = 'soul-bible-token-expires-at';

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInParams {
  username: string; // Will be email
  password: string;
}

export interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
}

// ==================== Token Storage Utilities ====================

/**
 * Store authentication tokens securely
 */
async function storeTokens(
  accessToken: string,
  idToken: string,
  refreshToken: string,
  expiresIn: number
) {
  try {
    const expiresAt = Date.now() + expiresIn * 1000;

    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(ID_TOKEN_KEY, idToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      SecureStore.setItemAsync(TOKEN_EXPIRES_AT_KEY, expiresAt.toString()),
    ]);
  } catch (error) {
    console.error('Failed to store tokens:', error);
    throw error;
  }
}

/**
 * Update access and ID tokens (after refresh)
 */
async function updateTokens(
  accessToken: string,
  idToken: string,
  expiresIn: number
) {
  try {
    const expiresAt = Date.now() + expiresIn * 1000;

    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(ID_TOKEN_KEY, idToken),
      SecureStore.setItemAsync(TOKEN_EXPIRES_AT_KEY, expiresAt.toString()),
    ]);
  } catch (error) {
    console.error('Failed to update tokens:', error);
    throw error;
  }
}

/**
 * Get stored access token
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

/**
 * Get stored refresh token
 */
async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}

/**
 * Get token expiration timestamp
 */
async function getTokenExpiresAt(): Promise<number | null> {
  try {
    const expiresAt = await SecureStore.getItemAsync(TOKEN_EXPIRES_AT_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  } catch (error) {
    console.error('Failed to get token expiration:', error);
    return null;
  }
}

/**
 * Check if access token is expired or expiring soon (within 5 minutes)
 */
export async function isTokenExpiring(): Promise<boolean> {
  try {
    const expiresAt = await getTokenExpiresAt();
    if (!expiresAt) return true;

    const FIVE_MINUTES = 5 * 60 * 1000;
    return Date.now() >= expiresAt - FIVE_MINUTES;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    return true;
  }
}

/**
 * Clear all stored tokens
 */
async function clearAllTokens() {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(ID_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(TOKEN_EXPIRES_AT_KEY),
    ]);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
}

// ==================== Decode JWT Utilities ====================

/**
 * Decode JWT token payload (without verification)
 * Note: This is for client-side use only. Server verifies tokens.
 */
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// ==================== Authentication Functions ====================

/**
 * Sign up a new user
 * Backend auto-generates UUID username and auto-verifies email
 */
export async function signUpUser(params: SignUpParams) {
  try {
    const input: SignUpInput = {
      email: params.email,
      password: params.password,
      firstName: params.firstName,
      lastName: params.lastName,
    };

    const result = await apolloClient.mutate<{
      signUp: AuthResponse;
    }>({
      mutation: SIGN_UP,
      variables: { input },
    });

    if (!result.data?.signUp) {
      const errorMessage = 'Sign up failed - no data returned';
      return { success: false, error: errorMessage };
    }

    // Store tokens immediately - user is auto-authenticated
    const { accessToken, idToken, refreshToken, expiresIn, user } =
      result.data.signUp;
    await storeTokens(accessToken, idToken, refreshToken, expiresIn);

    return { success: true, user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message || 'Sign up failed',
    };
  }
}

/**
 * Sign in user
 */
export async function signInUser(params: SignInParams) {
  try {
    const input: SignInInput = {
      email: params.username, // username is actually email
      password: params.password,
    };

    const result = await apolloClient.mutate<{
      signIn: AuthResponse;
    }>({
      mutation: SIGN_IN,
      variables: { input },
    });

    if (!result.data?.signIn) {
      const errorMessage = 'Sign in failed - no data returned';
      return { success: false, error: errorMessage };
    }

    // Store tokens
    const { accessToken, idToken, refreshToken, expiresIn, user } =
      result.data.signIn;
    await storeTokens(accessToken, idToken, refreshToken, expiresIn);

    return { success: true, user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message || 'Sign in failed',
    };
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken() {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return { success: false, error: 'No refresh token available' };
    }

    const input: RefreshTokenInput = { refreshToken };

    const result = await apolloClient.mutate<{
      refreshToken: TokenRefreshResponse;
    }>({
      mutation: REFRESH_TOKEN,
      variables: { input },
    });

    if (!result.data?.refreshToken) {
      const errorMessage = 'Token refresh failed - no data returned';
      return { success: false, error: errorMessage };
    }

    // Update access and ID tokens
    const { accessToken, idToken, expiresIn } = result.data.refreshToken;
    await updateTokens(accessToken, idToken, expiresIn);

    return { success: true };
  } catch (error: any) {
    console.error('Token refresh error:', error);
    // Clear tokens on refresh failure - user needs to re-authenticate
    await clearAllTokens();
    return {
      success: false,
      error: error.message || 'Token refresh failed',
    };
  }
}

/**
 * Sign out user
 */
export async function signOutUser() {
  try {
    const result = await apolloClient.mutate<{
      signOut: SignOutResponse;
    }>({
      mutation: SIGN_OUT,
    });

    // Always clear tokens locally, even if mutation fails
    await clearAllTokens();

    if (!result.data?.signOut?.success) {
      const errorMessage = 'Sign out failed on server';
      console.warn('Sign out warning:', errorMessage);
      // Still return success since we cleared local tokens
    }

    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    // Still clear tokens even on error
    await clearAllTokens();
    return { success: true }; // Return success since local state is cleared
  }
}

/**
 * Get current user information from stored ID token
 */
export async function getUserInfo(): Promise<AuthUser | null> {
  try {
    const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY);

    if (!idToken) {
      return null;
    }

    const payload = decodeJWT(idToken);

    if (!payload) {
      return null;
    }

    return {
      userId: payload.sub || payload.id,
      username: payload.username || payload['cognito:username'],
      email: payload.email,
      firstName: payload.given_name || payload.firstName,
      lastName: payload.family_name || payload.lastName,
      emailVerified: payload.email_verified || true, // GraphQL auto-verifies
    };
  } catch (error) {
    console.log('No user signed in or failed to get user info');
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  try {
    const input: ForgotPasswordInput = { email };

    const result = await apolloClient.mutate<{
      forgotPassword: ForgotPasswordResponse;
    }>({
      mutation: FORGOT_PASSWORD,
      variables: { input },
    });

    if (!result.data?.forgotPassword?.success) {
      const errorMessage = 'Password reset request failed';
      return { success: false, error: errorMessage };
    }

    return {
      success: true,
      message: result.data.forgotPassword.message,
    };
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      error: error.message || 'Password reset request failed',
    };
  }
}

/**
 * Confirm password reset with code
 */
export async function confirmPasswordReset(
  email: string,
  code: string,
  newPassword: string
) {
  try {
    const input: ResetPasswordInput = {
      email,
      code,
      newPassword,
    };

    const result = await apolloClient.mutate<{
      resetPassword: ResetPasswordResponse;
    }>({
      mutation: RESET_PASSWORD,
      variables: { input },
    });

    if (!result.data?.resetPassword?.success) {
      const errorMessage = 'Password reset confirmation failed';
      return { success: false, error: errorMessage };
    }

    return {
      success: true,
      message: result.data.resetPassword.message,
    };
  } catch (error: any) {
    console.error('Password reset confirmation error:', error);
    return {
      success: false,
      error: error.message || 'Password reset confirmation failed',
    };
  }
}

/**
 * Check authentication status and refresh token if needed
 * This replaces the old auto-signin with stored credentials
 */
export async function checkAndRefreshAuth() {
  try {
    // Check if we have tokens
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    // Check if token is expiring
    const isExpiring = await isTokenExpiring();
    if (isExpiring) {
      // Try to refresh
      return await refreshAccessToken();
    }

    // Token is still valid
    return { success: true };
  } catch (error: any) {
    console.error('Check auth error:', error);
    return { success: false, error: error.message };
  }
}
