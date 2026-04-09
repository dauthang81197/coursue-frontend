import apiClient from "./client";

/**
 * Authentication API Service
 */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    /** true when the user has not yet chosen a subscription plan */
    needsPlanSelection?: boolean;
    /** current subscription status returned at login */
    subscriptionStatus?: "trialing" | "expired" | "active" | null;
    /** days remaining in the trial */
    trialDaysLeft?: number;
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role: "student" | "instructor" | "admin";
    };
}

export const authApi = {
    /**
     * Login user
     */
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
        return response.data;
    },

    /**
     * Register new user
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>("/auth/register", data);
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        await apiClient.post("/auth/logout");
    },

    /**
     * Get current user profile
     */
    getCurrentUser: async () => {
        const response = await apiClient.get("/auth/me");
        return response.data;
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
        const response = await apiClient.post("/auth/refresh", { refreshToken });
        return response.data;
    },
};
