import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, type AuthResponse } from "../api";

/**
 * Auth Store - Quản lý authentication state
 */

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "instructor" | "admin";
}

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response: AuthResponse = await authApi.login({
            email,
            password,
          });

          // Save tokens to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("access_token", response.accessToken);
            localStorage.setItem("refresh_token", response.refreshToken);
          }

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Login failed"
              : "Login failed";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Register
      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response: AuthResponse = await authApi.register({
            name,
            email,
            password,
          });

          // Save tokens to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("access_token", response.accessToken);
            localStorage.setItem("refresh_token", response.refreshToken);
          }

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message || "Registration failed"
              : "Registration failed";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Clear tokens from localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      // Set user
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // Set tokens
      setTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
        }
        set({ accessToken, refreshToken });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Check authentication
      checkAuth: async () => {
        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("access_token")
              : null;

          if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          const user = await authApi.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch {
          set({ isAuthenticated: false, user: null });
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
