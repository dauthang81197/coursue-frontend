"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/base";
import { useCourseStore, useAuthStore } from "@/lib/store";
import { courseApi } from "@/lib/api/courses";
import type { RoadmapLesson, RoadmapResponse } from "@/lib/types/course";

const TYPE_ICON: Record<string, string> = {
  theory: "📖",
  video: "🎬",
  quiz: "❓",
  article: "📝",
  resource: "📎",
};

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

  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollOk, setEnrollOk] = useState(false);

  const isEnrolled = enrolledCourses.some((c) => c.id === courseId);

  useEffect(() => {
    if (!courseId) return;
    fetchCourseById(courseId);
    if (user) fetchEnrolledCourses();
    courseApi.getCourseRoadmap(courseId).then(setRoadmap).catch(() => null);
  }, [courseId, fetchCourseById, fetchEnrolledCourses, user]);

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      setIsEnrolling(true);
      await enrollCourse(courseId);
      setEnrollOk(true);
      setTimeout(() => setEnrollOk(false), 3000);
    } catch {
      /* handled by store */
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading && !currentCourse) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if ((error && !currentCourse) || !currentCourse) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error ?? "Course not found"}</p>
          <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
        </div>
      </DashboardLayout>
    );
  }

  const course = currentCourse;

  return (
    <DashboardLayout>
      {/* Enroll success toast */}
      {enrollOk && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          ✓ Successfully enrolled!
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white -mx-8 -mt-8 px-8 py-14 mb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {course.isPremium ? (
                <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  ⭐ Premium
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-400 text-green-900 text-xs font-bold rounded-full">
                  Free
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-primary-100">{course.description}</p>
            {roadmap && (
              <div className="flex gap-6 mt-6 text-sm">
                <span>📚 {roadmap.totalCount} lessons</span>
                <span>✅ {roadmap.completedCount} completed</span>
                <span>📊 {roadmap.progressPercent}% done</span>
              </div>
            )}
          </div>

          {/* Right card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
              {course.thumbnail && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-5 border border-gray-100">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Progress if enrolled */}
              {isEnrolled && roadmap && (
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{roadmap.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-primary-600 rounded-full"
                      style={{ width: `${roadmap.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {isEnrolled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 text-sm font-medium">
                    ✓ You&apos;re enrolled
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push(`/courses/${courseId}/learn`)}
                  >
                    Continue Learning &rarr;
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
                  {isEnrolling
                    ? "Enrolling..."
                    : course.isPremium
                    ? "Enroll (Premium)"
                    : "Enroll for Free"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson roadmap */}
      {roadmap && roadmap.lessons.length > 0 && (
        <div className="max-w-5xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Course Content
          </h2>
          <div className="space-y-2">
            {roadmap.lessons.map((lesson: RoadmapLesson, idx) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-4 bg-white border rounded-xl px-5 py-4 ${
                  lesson.locked ? "opacity-60" : ""
                }`}
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-bold shrink-0">
                  {lesson.isCompleted ? "✓" : idx + 1}
                </span>
                <span className="text-xl">{TYPE_ICON[lesson.type] ?? "📄"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {lesson.type}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs text-gray-400">
                  <span>🏆 {lesson.xpReward} XP</span>
                  {lesson.isPremium && <span className="text-yellow-600">⭐</span>}
                  {lesson.locked && <span>🔒</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            About this course
          </h2>
          <p className="text-gray-600">{course.description}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
