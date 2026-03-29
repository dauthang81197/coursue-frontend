"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../base/Button";
import { Avatar } from "../base/Avatar";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/lib/store";

/**
 * Header component - Udemy-inspired navigation
 * Features: Logo, search, categories, auth buttons, user menu
 */
export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        router.push(ROUTES.HOME);
    };

    const userName = user?.name || user?.email || "User";

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={ROUTES.HOME} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">CoursUE</span>
                        </div>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search your course here..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-4">
                        {/* Virtual Piano link — always visible */}
                        <Link
                            href={ROUTES.PIANO}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 transition-colors text-sm font-medium"
                        >
                            <span className="text-base leading-none">🎹</span>
                            <span>Piano</span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={ROUTES.DASHBOARD}
                                    className="text-gray-700 hover:text-primary-600 font-medium"
                                >
                                    My Learning
                                </Link>
                                <button className="relative p-2 text-gray-700 hover:text-primary-600">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                                </button>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="relative"
                                >
                                    <Avatar name={userName} src={user?.avatar || ""} />
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={ROUTES.DASHBOARD}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            My Learning
                                        </Link>
                                        <hr className="my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href={ROUTES.LOGIN}>
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href={ROUTES.REGISTER}>
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        {isAuthenticated ? (
                            <div className="space-y-2">
                                <Link
                                    href={ROUTES.PIANO}
                                    className="flex items-center gap-2 py-2 text-primary-600 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>🎹</span> Virtual Piano
                                </Link>
                                <Link
                                    href={ROUTES.DASHBOARD}
                                    className="block py-2 text-gray-700 hover:text-primary-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Learning
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block py-2 text-gray-700 hover:text-primary-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link href={ROUTES.LOGIN} className="block">
                                    <Button variant="ghost" size="sm" className="w-full">
                                        Login
                                    </Button>
                                </Link>
                                <Link href={ROUTES.REGISTER} className="block">
                                    <Button variant="primary" size="sm" className="w-full">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};
