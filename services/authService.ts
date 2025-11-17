import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
  autoSignIn,
} from 'aws-amplify/auth';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const CREDENTIALS_KEY = 'soul-bible-credentials';

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
}

/**
 * Sign up a new user
 */
export async function signUpUser(params: SignUpParams) {
  try {
    // Generate a unique username using UUID since the pool uses email as an alias
    const username = Crypto.randomUUID();

    const { userId } = await signUp({
      username,
      password: params.password,
      options: {
        userAttributes: {
          email: params.email,
          given_name: params.firstName,
          family_name: params.lastName,
        },
      },
    });

    return { success: true, userId, username };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message || 'Sign up failed' };
  }
}

/**
 * Confirm sign up with verification code
 */
export async function confirmSignUpUser(username: string, code: string) {
  try {
    await confirmSignUp({
      username,
      confirmationCode: code,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Confirmation error:', error);
    return { success: false, error: error.message || 'Confirmation failed' };
  }
}

/**
 * Resend verification code
 */
export async function resendVerificationCode(username: string) {
  try {
    await resendSignUpCode({ username });
    return { success: true };
  } catch (error: any) {
    console.error('Resend code error:', error);
    return { success: false, error: error.message || 'Failed to resend code' };
  }
}

/**
 * Sign in user
 */
export async function signInUser(params: SignInParams) {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username: params.username,
      password: params.password,
    });

    if (isSignedIn) {
      // Store credentials securely if rememberMe is true
      if (params.rememberMe) {
        await storeCredentials(params.username, params.password);
      }

      const user = await getUserInfo();
      return { success: true, user, nextStep };
    }

    return { success: false, nextStep, error: 'Additional step required' };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message || 'Sign in failed' };
  }
}

/**
 * Sign out user
 */
export async function signOutUser() {
  try {
    await signOut();
    await clearStoredCredentials();
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message || 'Sign out failed' };
  }
}

/**
 * Get current user information
 */
export async function getUserInfo(): Promise<AuthUser | null> {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    const attributes = idToken?.payload;

    return {
      userId: user.userId,
      username: user.username,
      email: attributes?.email as string,
      firstName: attributes?.given_name as string,
      lastName: attributes?.family_name as string,
      emailVerified: attributes?.email_verified as boolean,
    };
  } catch (error) {
    console.log('No user signed in');
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(username: string) {
  try {
    const output = await resetPassword({ username });
    return {
      success: true,
      codeDeliveryDetails: output.nextStep.codeDeliveryDetails,
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message || 'Password reset failed' };
  }
}

/**
 * Confirm password reset with code
 */
export async function confirmPasswordReset(
  username: string,
  code: string,
  newPassword: string
) {
  try {
    await confirmResetPassword({
      username,
      confirmationCode: code,
      newPassword,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Confirmation error:', error);
    return {
      success: false,
      error: error.message || 'Password reset confirmation failed',
    };
  }
}

/**
 * Store credentials securely
 */
async function storeCredentials(username: string, password: string) {
  try {
    const credentialsData = JSON.stringify({ username, password });
    await SecureStore.setItemAsync(CREDENTIALS_KEY, credentialsData);
  } catch (error) {
    console.error('Failed to store credentials:', error);
  }
}

/**
 * Get stored credentials
 */
export async function getStoredCredentials() {
  try {
    const credentialsData = await SecureStore.getItemAsync(CREDENTIALS_KEY);

    if (credentialsData) {
      const credentials = JSON.parse(credentialsData);
      return {
        username: credentials.username,
        password: credentials.password,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve credentials:', error);
    return null;
  }
}

/**
 * Clear stored credentials
 */
async function clearStoredCredentials() {
  try {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  } catch (error) {
    console.error('Failed to clear credentials:', error);
  }
}

/**
 * Auto sign-in with stored credentials
 */
export async function autoSignInWithStoredCredentials() {
  try {
    const credentials = await getStoredCredentials();
    if (!credentials) {
      return { success: false, error: 'No stored credentials' };
    }

    return await signInUser({
      username: credentials.username,
      password: credentials.password,
      rememberMe: true,
    });
  } catch (error: any) {
    console.error('Auto sign-in error:', error);
    return { success: false, error: error.message || 'Auto sign-in failed' };
  }
}
