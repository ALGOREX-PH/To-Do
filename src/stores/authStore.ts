import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * AUTH SYSTEM GUIDE - When to use which auth flow:
 * 
 * 1. SIGNIN ('signin'):
 *    - Default mode for returning users
 *    - Validates email/password with real-time form validation
 *    - Handles "Email not confirmed" error → switches to 'verify-email'
 *    - Handles "Invalid credentials" error → shows user-friendly message
 * 
 * 2. SIGNUP ('signup'):
 *    - For new user registration
 *    - Validates name, email, password, confirm password
 *    - Password must have uppercase, lowercase, number
 *    - On success → switches to 'verify-email' mode
 * 
 * 3. RESET PASSWORD ('reset'):
 *    - For users who forgot password
 *    - Sends reset link to email
 *    - Shows success state with instructions
 *    - Common with Supabase: "Email rate limit exceeded"
 * 
 * 4. VERIFY EMAIL ('verify-email'):
 *    - After signup or when email not confirmed
 *    - Shows resend button with 60s cooldown
 *    - Explains verification process step-by-step
 *    - Handles "Token expired" and "Invalid token" errors
 * 
 * 5. CONFIRM EMAIL ('confirm-email'):
 *    - When user clicks verification link (deep linking)
 *    - Processes email confirmation token
 *    - On success → user is signed in
 * 
 * SUPABASE INTEGRATION NOTES:
 * - Replace mock implementations with actual Supabase auth calls
 * - All common Supabase errors are mapped to user-friendly messages
 * - Storage keys use centralized config (see config/index.ts)
 * - Email verification is required before sign-in (configurable in Supabase)
 */

import { STORAGE_KEYS } from '../constants';

export type AuthMode = 'signin' | 'signup' | 'reset' | 'verify-email' | 'confirm-email';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  mode: AuthMode;
  emailForVerification: string | null;
  isEmailVerified: boolean;
}

export interface AuthActions {
  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  
  // State management
  setMode: (mode: AuthMode) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

export type AuthStore = AuthState & AuthActions;

// Common Supabase auth errors and their user-friendly messages
const getAuthErrorMessage = (error: any): string => {
  const message = error?.message || error || 'An unexpected error occurred';
  
  // Supabase specific errors
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email address before signing in.';
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (message.includes('Unable to validate email address')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('Email rate limit exceeded')) {
    return 'Too many emails sent. Please wait before requesting another.';
  }
  if (message.includes('Token has expired')) {
    return 'Verification link has expired. Please request a new one.';
  }
  if (message.includes('Invalid token')) {
    return 'Invalid verification link. Please request a new one.';
  }
  if (message.includes('Network request failed')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return message;
};

export const useAuthStore = create<AuthStore>()(persist(
  (set, get) => ({
    // Initial state
    user: null,
    isLoading: false,
    error: null,
    mode: 'signin',
    emailForVerification: null,
    isEmailVerified: false,

    // Auth actions - Mock implementation (replace with Supabase when connected)
    signIn: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        // Mock implementation - replace with Supabase auth
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate email verification check
        if (email.includes('unverified')) {
          set({ 
            isLoading: false, 
            error: 'Please verify your email address before signing in.',
            emailForVerification: email,
            mode: 'verify-email'
          });
          return;
        }
        
        const user: User = {
          id: '1',
          email,
          name: email.split('@')[0]
        };
        
        set({ user, isLoading: false, isEmailVerified: true });
      } catch (error) {
        set({ isLoading: false, error: getAuthErrorMessage(error) });
      }
    },

    signUp: async (email: string, password: string, name?: string) => {
      set({ isLoading: true, error: null });
      try {
        // Mock implementation - replace with Supabase auth
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ 
          isLoading: false,
          emailForVerification: email,
          mode: 'verify-email',
          error: null
        });
      } catch (error) {
        set({ isLoading: false, error: getAuthErrorMessage(error) });
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        // Mock implementation - replace with Supabase auth
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ 
          user: null, 
          isLoading: false, 
          error: null, 
          mode: 'signin',
          emailForVerification: null,
          isEmailVerified: false
        });
      } catch (error) {
        set({ isLoading: false, error: getAuthErrorMessage(error) });
      }
    },

    resetPassword: async (email: string) => {
      set({ isLoading: true, error: null });
      try {
        // Mock implementation - replace with Supabase auth
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ 
          isLoading: false,
          error: null,
          emailForVerification: email
        });
      } catch (error) {
        set({ isLoading: false, error: getAuthErrorMessage(error) });
      }
    },

    confirmEmail: async (token: string) => {
      set({ isLoading: true, error: null });
      try {
        // Mock implementation - replace with Supabase auth
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ 
          isLoading: false,
          isEmailVerified: true,
          mode: 'signin'
        });
      } catch (error) {
        set({ isLoading: false, error: getAuthErrorMessage(error) });
      }
    },

    resendVerification: async (email: string) => {
      set({ isLoading: true, error: null });
      try {
        // Mock implementation - replace with Supabase auth
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ isLoading: false, error: null });
      } catch (error) {
        set({ isLoading: false, error: getAuthErrorMessage(error) });
      }
    },

    // State management
    setMode: (mode: AuthMode) => set({ mode, error: null }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setUser: (user: User | null) => set({ user })
  }),
  {
    name: STORAGE_KEYS.AUTH_STORE,
    storage: {
      getItem: async (name: string) => {
        const value = await AsyncStorage.getItem(name);
        return value ? JSON.parse(value) : null;
      },
      setItem: async (name: string, value: any) => {
        await AsyncStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: async (name: string) => {
        await AsyncStorage.removeItem(name);
      }
    },
    partialize: (state) => ({
      user: state.user,
      isEmailVerified: state.isEmailVerified
    })
  }
));