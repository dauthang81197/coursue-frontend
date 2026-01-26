"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "@/components/layout";
import { CourseCard } from "@/components/common";
import { Badge, Avatar } from "@/components/base";
import { useCourseStore, useAuthStore } from "@/lib/store";

// Mock mentors data (can be replaced with API later)
const mentors = [
    {
        id: "1",
        name: "Prashant Kumar Singh",
        role: "Software Developer",
        avatar: "",
    },
    {
        id: "2",
        name: "Prashant Kumar Singh",
        role: "Software Developer",
        avatar: "",
    },
    {
        id: "3",
        name: "Prashant Kumar Singh",
        role: "Software Developer",
        avatar: "",
    },
];

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { enrolledCourses, isLoading, error, fetchEnrolledCourses } = useCourseStore();

    useEffect(() => {
        // Fetch enrolled courses when component mounts
        fetchEnrolledCourses();
    }, [fetchEnrolledCourses]);

    const userName = user?.name || user?.email || "User";
    const enrolledCount = enrolledCourses.length;
    return (
        <DashboardLayout>
            {/* Welcome Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Good Morning, {userName.split(" ")[0]}
                        </h1>
                        <p className="text-gray-600">
                            Continue your journey and achieve your target
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-6 h-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-6 h-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-6 h-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium opacity-90">Progress</h3>
                        <svg className="w-5 h-5 opacity-75" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-bold">65%</span>
                            <span className="text-sm opacity-75 mb-2">completed</span>
                        </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2" style={{ width: "65%" }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Courses</h3>
                        <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">{enrolledCount}</div>
                    <p className="text-sm text-gray-500">Enrolled courses</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Certificates</h3>
                        <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                        </svg>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">5</div>
                    <p className="text-sm text-gray-500">Certificates earned</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Continue Watching */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Continue Watching
                        </h2>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                <p className="mt-2 text-gray-600">Loading courses...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-600">
                                Error: {error}
                            </div>
                        ) : enrolledCourses.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No enrolled courses yet. Start learning today!
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {enrolledCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Your Mentor */}
                <div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Your Mentor</h3>
                            <button className="text-primary-600 text-sm hover:text-primary-700">
                                See All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {mentors.map((mentor) => (
                                <div
                                    key={mentor.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={mentor.name} src={mentor.avatar} />
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">
                                                {mentor.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {mentor.role}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="primary" size="sm">
                                        Follow
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Graph Placeholder */}
                    <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                            Learning Activity
                        </h3>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {[40, 70, 50, 90, 60, 85, 75].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end">
                                    <div
                                        className="bg-primary-600 rounded-t"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
