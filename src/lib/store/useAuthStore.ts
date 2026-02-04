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
  _hasHydrated: boolean; // Track hydration status

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  setHasHydrated: (state: boolean) => void; // Set hydration status
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
      _hasHydrated: false,

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

      // Set hydration status
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      // Check authentication
      checkAuth: async () => {
        try {
          set({ isLoading: true });

          // Đọc token từ localStorage hoặc từ state
          let token = useAuthStore.getState().accessToken;

          if (!token && typeof window !== "undefined") {
            // Fallback: đọc trực tiếp từ localStorage nếu state chưa sync
            token = localStorage.getItem("access_token");
            console.log(
              "🔄 Syncing token from localStorage:",
              token ? "EXISTS" : "NULL",
            );
          }

          if (!token) {
            set({ isAuthenticated: false, user: null, isLoading: false });
            return;
          }

          // Nếu có token, set authenticated = true trước
          // Để tránh bị redirect khi F5
          set({
            isAuthenticated: true,
            accessToken: token, // Sync token vào state
          });

          // Thử gọi API để verify token và lấy user data mới nhất
          try {
            const user = await authApi.getCurrentUser();
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (apiError) {
            // Nếu API lỗi nhưng không phải 401, vẫn giữ authenticated
            const isUnauthorized =
              apiError instanceof Error &&
              "response" in apiError &&
              (apiError as { response?: { status?: number } }).response
                ?.status === 401;

            if (isUnauthorized) {
              // Token invalid - logout
              set({ isAuthenticated: false, user: null, isLoading: false });
              if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
              }
            } else {
              // Lỗi khác (network, 404, 500) - giữ authenticated
              console.warn("checkAuth API error (non-401):", apiError);
              set({ isLoading: false });
            }
          }
        } catch (error) {
          console.error("checkAuth error:", error);
          set({ isLoading: false });
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
      onRehydrateStorage: () => (state) => {
        // Được gọi sau khi restore từ localStorage xong
        state?.setHasHydrated(true);
      },
    },
  ),
);
