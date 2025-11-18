import { create } from 'zustand';
import {
  signUpUser,
  signInUser,
  signOutUser,
  getUserInfo,
  requestPasswordReset,
  confirmPasswordReset,
  checkAndRefreshAuth,
  refreshAccessToken,
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
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  signIn: (params: SignInParams) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshToken: () => Promise<void>;
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

  // Sign up action - now auto-authenticates user
  signUp: async (params: SignUpParams) => {
    set({ isLoading: true, error: null });

    const result = await signUpUser(params);

    if (result.success && result.user) {
      // User is immediately authenticated after signup
      // Map GraphQL user to authStore user format
      const authUser: AuthUser = {
        userId: result.user.id,
        username: result.user.username,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      };
      set({
        user: authUser,
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

  // Sign in action
  signIn: async (params: SignInParams) => {
    set({ isLoading: true, error: null });

    const result = await signInUser(params);

    if (result.success && result.user) {
      // Map GraphQL user to authStore user format
      const authUser: AuthUser = {
        userId: result.user.id,
        username: result.user.username,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      };
      set({
        user: authUser,
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
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });

    const result = await requestPasswordReset(email);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error });
    }

    return result;
  },

  // Confirm reset password action
  confirmResetPassword: async (email: string, code: string, newPassword: string) => {
    set({ isLoading: true, error: null });

    const result = await confirmPasswordReset(email, code, newPassword);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error });
    }

    return result;
  },

  // Refresh token action
  refreshToken: async () => {
    const result = await refreshAccessToken();

    if (!result.success) {
      // Token refresh failed - force logout
      set({
        user: null,
        isAuthenticated: false,
        error: 'Session expired. Please sign in again.',
      });
    }
  },

  // Check auth status (for session restoration with refresh tokens)
  checkAuthStatus: async () => {
    set({ isInitializing: true });

    try {
      // First, check if we have tokens and refresh if needed
      const refreshResult = await checkAndRefreshAuth();

      if (refreshResult.success) {
        // Get user info from stored ID token
        const user = await getUserInfo();

        if (user) {
          set({
            user,
            isAuthenticated: true,
            isInitializing: false,
          });
          return;
        }
      }

      // No valid session
      set({
        user: null,
        isAuthenticated: false,
        isInitializing: false,
      });
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
