"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { ROUTES } from "@/lib/constants";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute - Wrapper để bảo vệ routes cần authentication
 * Redirect to login nếu chưa đăng nhập
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

    useEffect(() => {
        // Check authentication status khi component mount
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        // Redirect to login nếu chưa authenticated
        if (!isLoading && !isAuthenticated) {
            router.push(ROUTES.LOGIN);
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    // Show children if authenticated
    return <>{children}</>;
};
