import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

/**
 * API Client Configuration
 * Base Axios instance với interceptors cho authentication và error handling
 */

// Base URL từ environment variable hoặc fallback
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://144.91.120.200:8000/api/v1";

// Tạo Axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor - Thêm token vào mọi request
apiClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Handle 403 subscription errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 403 && typeof window !== "undefined") {
            const code = (error.response.data as Record<string, unknown>)?.code as string | undefined;
            if (code === "TRIAL_EXPIRED" || code === "NO_SUBSCRIPTION") {
                window.dispatchEvent(
                    new CustomEvent("subscription-error", { detail: { code } }),
                );
            }
        }
        return Promise.reject(error);
    },
);

// Response Interceptor - Xử lý errors và refresh token
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Thử refresh token
                const refreshToken =
                    typeof window !== "undefined"
                        ? localStorage.getItem("refresh_token")
                        : null;

                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data;

                    if (typeof window !== "undefined") {
                        localStorage.setItem("access_token", accessToken);
                    }

                    // Retry request với token mới
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed - redirect to login
                if (typeof window !== "undefined") {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

/**
 * API Error Handler
 */
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return message;
    }
    return "An unexpected error occurred";
};

export default apiClient;
