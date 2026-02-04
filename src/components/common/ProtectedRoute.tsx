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
  const { isAuthenticated, isLoading, checkAuth, accessToken, _hasHydrated } =
    useAuthStore();

  useEffect(() => {
    // Đợi hydration complete trước khi check auth
    if (!_hasHydrated) {
      console.log("⏳ Waiting for store hydration...");
      return;
    }

    console.log(
      "✅ Store hydrated! accessToken =",
      accessToken ? "EXISTS" : "NULL",
    );

    // Chỉ check auth nếu không có token
    if (!accessToken) {
      console.log("🔍 No token, calling checkAuth()");
      checkAuth();
    }
  }, [checkAuth, accessToken, _hasHydrated]);

  useEffect(() => {
    // Đợi hydration complete
    if (!_hasHydrated) {
      return;
    }

    // Redirect to login nếu chưa authenticated và không đang loading
    if (!isLoading && !isAuthenticated && !accessToken) {
      console.log("🚪 Redirecting to login...");
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router, accessToken, _hasHydrated]);

  // Show loading khi chưa hydrate hoặc đang loading
  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!_hasHydrated ? "Initializing..." : "Loading..."}
          </p>
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
