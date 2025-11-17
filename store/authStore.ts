import { create } from 'zustand';
import {
  signUpUser,
  confirmSignUpUser,
  signInUser,
  signOutUser,
  getUserInfo,
  requestPasswordReset,
  confirmPasswordReset,
  resendVerificationCode,
  autoSignInWithStoredCredentials,
  type AuthUser,
  type SignUpParams,
  type SignInParams,
} from '@/services/authService';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

interface AuthActions {
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string; userId?: string }>;
  confirmSignUp: (username: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (params: SignInParams) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (username: string) => Promise<{ success: boolean; error?: string }>;
  confirmResetPassword: (username: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resendCode: (username: string) => Promise<{ success: boolean; error?: string }>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  // Sign up action
  signUp: async (params: SignUpParams) => {
    set({ isLoading: true, error: null });

    const result = await signUpUser(params);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error });
    }

    return result;
  },

  // Confirm sign up action
  confirmSignUp: async (username: string, code: string) => {
    set({ isLoading: true, error: null });

    const result = await confirmSignUpUser(username, code);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error });
    }

    return result;
  },

  // Sign in action
  signIn: async (params: SignInParams) => {
    set({ isLoading: true, error: null });

    const result = await signInUser(params);

    if (result.success && result.user) {
      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        isLoading: false,
        error: result.error,
      });
    }

    return result;
  },

  // Sign out action
  signOut: async () => {
    set({ isLoading: true, error: null });

    await signOutUser();

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Reset password action
  resetPassword: async (username: string) => {
    set({ isLoading: true, error: null });

    const result = await requestPasswordReset(username);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error });
    }

    return result;
  },

  // Confirm reset password action
  confirmResetPassword: async (username: string, code: string, newPassword: string) => {
    set({ isLoading: true, error: null });

    const result = await confirmPasswordReset(username, code, newPassword);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error });
    }

    return result;
  },

  // Resend verification code action
  resendCode: async (username: string) => {
    set({ isLoading: true, error: null });

    const result = await resendVerificationCode(username);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error });
    }

    return result;
  },

  // Check auth status (for auto-login and session restoration)
  checkAuthStatus: async () => {
    set({ isInitializing: true });

    try {
      // First, try to get current user session
      const user = await getUserInfo();

      if (user) {
        set({
          user,
          isAuthenticated: true,
          isInitializing: false,
        });
        return;
      }

      // If no session, try auto sign-in with stored credentials
      const autoSignInResult = await autoSignInWithStoredCredentials();

      if (autoSignInResult.success && autoSignInResult.user) {
        set({
          user: autoSignInResult.user,
          isAuthenticated: true,
          isInitializing: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
        });
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      set({
        user: null,
        isAuthenticated: false,
        isInitializing: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
