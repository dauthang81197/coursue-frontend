"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { LessonSidebar } from "@/components/course/LessonSidebar";
import { Button } from "@/components/base";
import { courseApi } from "@/lib/api/courses";
import { lessonApi } from "@/lib/api/lesson";
import { Lesson, CourseProgress, Section } from "@/lib/types/course";

interface CourseWithSections {
  id: string;
  title: string;
  sections?: Section[];
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseWithSections | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompletingLesson, setIsCompletingLesson] = useState(false);

  // Load course data and progress
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [courseData, progressData] = await Promise.all([
          courseApi.getCourseById(courseId),
          courseApi.getCourseProgress(courseId),
        ]);

        // Map API response to our interface
        const sections: Section[] = progressData.sections.map((sp) => ({
          id: sp.sectionId,
          title: `Section ${sp.sectionId}`,
          courseId: courseId,
          orderIndex: 0,
          lessonCount: sp.totalLessons,
          totalDuration: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        setCourse({
          id: courseData.id,
          title: courseData.title,
          sections,
        });
        setProgress(progressData);

        // Set initial lesson (last accessed or first lesson)
        if (progressData.lastAccessedLessonId) {
          const lesson = await lessonApi.getById(
            progressData.lastAccessedLessonId,
          );
          setCurrentLesson(lesson);
        } else if (sections.length > 0) {
          // Get first lesson from first section
          const firstSection = sections[0];
          if (firstSection) {
            const lessons = await lessonApi.getTree(firstSection.id);
            if (lessons.length > 0) {
              const firstLesson = await lessonApi.getById(lessons[0].id);
              setCurrentLesson(firstLesson);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load course:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load course";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  // Load lesson by ID
  const loadLesson = async (lessonId: string) => {
    try {
      const lesson = await lessonApi.getById(lessonId);
      setCurrentLesson(lesson);
    } catch (err) {
      console.error("Failed to load lesson:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load lesson";
      setError(errorMessage);
    }
  };

  // Mark lesson as complete/uncomplete
  const toggleLessonComplete = async (
    lessonId: string,
    isCompleted: boolean,
  ) => {
    try {
      setIsCompletingLesson(true);

      if (isCompleted) {
        await lessonApi.markUncomplete(lessonId);
      } else {
        await lessonApi.markComplete(lessonId);
      }

      // Refresh progress
      const newProgress = await courseApi.getCourseProgress(courseId);
      setProgress(newProgress);
    } catch (err) {
      console.error("Failed to update lesson status:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update lesson status";
      setError(errorMessage);
    } finally {
      setIsCompletingLesson(false);
    }
  };

  // Get lessons organized by section
  const lessonsBySection = React.useMemo(() => {
    if (!course || !course.sections) return {};

    const map: Record<string, Lesson[]> = {};
    // This is a simplified version - in real app, you'd fetch lessons for each section
    // For now, we'll use empty arrays as placeholder
    course.sections.forEach((section) => {
      map[section.id] = []; // TODO: Fetch actual lessons
    });
    return map;
  }, [course]);

  // Get progress map
  const progressMap = React.useMemo(() => {
    if (!progress) return {};

    const map: Record<string, boolean> = {};
    progress.sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        map[lesson.lessonId] = lesson.completed;
      });
    });
    return map;
  }, [progress]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
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
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isLessonCompleted = currentLesson
    ? progressMap[currentLesson.id]
    : false;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Lesson Sidebar */}
      <div className="w-96 shrink-0 overflow-hidden">
        <LessonSidebar
          sections={course.sections || []}
          lessons={lessonsBySection}
          currentLessonId={currentLesson?.id}
          progress={progressMap}
          onLessonSelect={loadLesson}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Course
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {course.title}
                </h1>
                {progress && (
                  <p className="text-sm text-gray-600">
                    {progress.completedLessons} / {progress.totalLessons}{" "}
                    lessons completed • {progress.progress}%
                  </p>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {progress && (
              <div className="w-48">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">
                    {progress.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video & Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Video Player */}
            {currentLesson ? (
              <>
                <VideoPlayer
                  videoUrl={
                    currentLesson.videoKey ||
                    "https://www.w3schools.com/html/mov_bbb.mp4"
                  }
                  title={currentLesson.title}
                  onEnded={() => {
                    if (!isLessonCompleted) {
                      toggleLessonComplete(currentLesson.id, false);
                    }
                  }}
                />

                {/* Lesson Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentLesson.title}
                      </h2>
                      {currentLesson.description && (
                        <p className="text-gray-600">
                          {currentLesson.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant={isLessonCompleted ? "outline" : "primary"}
                      onClick={() =>
                        toggleLessonComplete(
                          currentLesson.id,
                          isLessonCompleted,
                        )
                      }
                      disabled={isCompletingLesson}
                    >
                      {isCompletingLesson ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : isLessonCompleted ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Mark as Complete
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Lesson Content */}
                  {currentLesson.content && (
                    <div className="prose max-w-none mt-6">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentLesson.content,
                        }}
                      />
                    </div>
                  )}

                  {/* Attachments */}
                  {currentLesson.attachments &&
                    currentLesson.attachments.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Attachments
                        </h3>
                        <div className="space-y-2">
                          {currentLesson.attachments.map(
                            (attachment, index) => (
                              <a
                                key={index}
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                              >
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                Download attachment {index + 1}
                              </a>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No lesson selected
                </h3>
                <p className="text-gray-600">
                  Select a lesson from the sidebar to start learning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
