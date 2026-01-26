"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout";
import { Button, Input } from "@/components/base";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [validationError, setValidationError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear errors khi user typing
        if (error) clearError();
        if (validationError) setValidationError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }

        try {
            await register(formData.name, formData.email, formData.password);

            // Registration thành công - redirect to dashboard
            router.push(ROUTES.DASHBOARD);
        } catch (err) {
            // Error được handle bởi store
            console.error("Registration error:", err);
        }
    };

    return (
        <AuthLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Start your learning journey today</p>
            </div>

            {/* Error Messages */}
            {(error || validationError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error || validationError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    helperText="At least 8 characters"
                    required
                />

                <Input
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <div className="flex items-start">
                    <input
                        type="checkbox"
                        required
                        className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                            Privacy Policy
                        </Link>
                    </span>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                >
                    Create Account
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href={ROUTES.LOGIN}
                        className="font-medium text-primary-600 hover:text-primary-700"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
