import React from "react";
import { Sidebar } from "../common/Sidebar";
import { ProtectedRoute } from "../common/ProtectedRoute";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * DashboardLayout - For authenticated user pages
 * Structure: Protected Route → Sidebar + Content Area
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
}) => {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                    <div className="container-custom py-8">{children}</div>
                </main>
            </div>
        </ProtectedRoute>
    );
};
