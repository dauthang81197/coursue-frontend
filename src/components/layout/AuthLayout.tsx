import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
}

/**
 * AuthLayout - For login/register pages
 * Structure: Centered form with logo
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">CoursUE</span>
                </Link>

                {/* Auth Card */}
                <div className="bg-white rounded-xl shadow-md p-8">{children}</div>

                {/* Footer Links */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <Link href="/help" className="hover:text-primary-600">
                        Need help?
                    </Link>
                    <span className="mx-2">•</span>
                    <Link href="/privacy" className="hover:text-primary-600">
                        Privacy
                    </Link>
                    <span className="mx-2">•</span>
                    <Link href="/terms" className="hover:text-primary-600">
                        Terms
                    </Link>
                </div>
            </div>
        </div>
    );
};
