"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout";
import { Button, Badge } from "@/components/base";
import { useCourseStore, useAuthStore } from "@/lib/store";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { user } = useAuthStore();
  const {
    currentCourse,
    enrolledCourses,
    isLoading,
    error,
    fetchCourseById,
    fetchEnrolledCourses,
    enrollCourse,
  } = useCourseStore();

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // Check if user is already enrolled
  const isEnrolled = enrolledCourses.some((course) => course.id === courseId);

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
      if (user) {
        fetchEnrolledCourses();
      }
    }
  }, [courseId, fetchCourseById, fetchEnrolledCourses, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setIsEnrolling(true);
      await enrollCourse(courseId);
      setEnrollSuccess(true);
      setTimeout(() => setEnrollSuccess(false), 3000);
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading && !currentCourse) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !currentCourse) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-semibold">Failed to load course</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <Button onClick={() => router.push("/courses")}>
              Back to Courses
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentCourse) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Course not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const discount = currentCourse.originalPrice
    ? Math.round(
        ((currentCourse.originalPrice - currentCourse.price) /
          currentCourse.originalPrice) *
          100,
      )
    : 0;

  return (
    <DashboardLayout>
      {/* Success Message */}
      {enrollSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Successfully enrolled in course!
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary-600 to-primary-800 text-white -mx-8 -mt-8 px-8 py-12 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="primary" size="md">
                  {currentCourse.category}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{currentCourse.title}</h1>

              <p className="text-lg text-primary-100 mb-6">
                {currentCourse.description ||
                  "Learn this comprehensive course and master new skills"}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">
                    {Number(currentCourse.rating).toFixed(1)}
                  </span>
                  <span>
                    ({currentCourse.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>
                    {currentCourse.studentsEnrolled?.toLocaleString()} students
                    enrolled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm">Created by</span>
                <span className="font-semibold">
                  {currentCourse.instructor}
                </span>
              </div>
            </div>

            {/* Right: Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900">
                {/* Course Image */}
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={currentCourse.thumbnail}
                    alt={currentCourse.title}
                    fill
                    className="object-cover"
                  />
                  {discount > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="error" size="md">
                        {discount}% OFF
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">
                      ${Number(currentCourse.price).toFixed(2)}
                    </span>
                    {currentCourse.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${Number(currentCourse.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Enroll Button */}
                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-semibold">
                        You&apos;re enrolled
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => router.push(`/courses/${courseId}/learn`)}
                    >
                      Continue Learning
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enrolling...
                      </span>
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                )}

                {/* Course Info */}
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{currentCourse.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>{currentCourse.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* What you'll learn */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">
                What you&apos;ll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Master the fundamentals",
                  "Build real-world projects",
                  "Learn best practices",
                  "Get hands-on experience",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>No prior experience needed</li>
                <li>A computer with internet connection</li>
                <li>Willingness to learn</li>
              </ul>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p>
                  {currentCourse.description ||
                    "This is a comprehensive course designed to help you master the subject matter. You'll learn practical skills and gain valuable knowledge that you can apply immediately."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">This course includes:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{currentCourse.duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
