"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { LessonSidebar } from "@/components/course/LessonSidebar";
import { Button } from "@/components/base";
import { courseApi } from "@/lib/api/courses";
import { lessonApi } from "@/lib/api/lesson";
import {
  Lesson,
  CourseProgress,
  Section,
  TranscriptData,
} from "@/lib/types/course";

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
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load transcript when showTranscript is toggled on
  useEffect(() => {
    const loadTranscript = async () => {
      if (showTranscript && currentLesson && !transcript) {
        setIsLoadingTranscript(true);
        try {
          const transcriptResponse = await lessonApi.getTranscript(
            currentLesson.id,
          );
          if (
            transcriptResponse.hasTranscript &&
            transcriptResponse.transcript
          ) {
            setTranscript(transcriptResponse.transcript);
          } else {
            setTranscript(null);
          }
        } catch (err) {
          console.error("Failed to load transcript:", err);
          setTranscript(null);
        } finally {
          setIsLoadingTranscript(false);
        }
      }
    };

    loadTranscript();
  }, [showTranscript, currentLesson, transcript]);

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
          title: sp.sectionName,
          courseId: courseId,
          orderIndex: sp.sectionOrder,
          lessonCount: sp.lessons.length,
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
        console.log(
          "Set current lesson to last accessed lesson:",
          progressData,
        );
        // Set initial lesson (last accessed or first lesson)
        if (progressData.lastAccessedLessonId) {
          const lesson = await lessonApi.getById(
            progressData.lastAccessedLessonId,
          );
          setCurrentLesson(lesson);

          // Load video URL
          if (lesson.videoKey) {
            try {
              const url = await lessonApi.getVideoUrl(
                progressData.lastAccessedLessonId,
              );
              console.log("Loaded video URL for last accessed lesson:", url);
              setVideoUrl(url);
            } catch (videoErr) {
              console.error("Failed to load video URL:", videoErr);
              setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
            }
          }
        } else if (sections.length > 0) {
          // Get first lesson from first section
          const firstSection = sections[0];
          if (firstSection) {
            const lessons = await lessonApi.getTree(firstSection.id);
            if (lessons.length > 0) {
              const firstLesson = await lessonApi.getById(lessons[0].id);
              setCurrentLesson(firstLesson);

              // Load video URL
              if (firstLesson.videoKey) {
                try {
                  const url = await lessonApi.getVideoUrl(firstLesson.id);
                  setVideoUrl(url);
                } catch (videoErr) {
                  console.error("Failed to load video URL:", videoErr);
                  setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
                }
              }
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

      // Reset transcript when changing lessons
      setTranscript(null);

      // Update last accessed lesson on server
      try {
        await courseApi.updateLastAccessedLesson(courseId, lessonId);
        console.log("Updated last accessed lesson:", lessonId);
      } catch (updateErr) {
        console.error("Failed to update last accessed lesson:", updateErr);
        // Don't block lesson loading if this fails
      }

      // Load video URL if lesson has video
      if (lesson.videoKey) {
        try {
          const url = await lessonApi.getVideoUrl(lessonId);
          setVideoUrl(url);
        } catch (videoErr) {
          console.error("Failed to load video URL:", videoErr);
          // Fallback to default video if video URL loading fails
          setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        }
      } else {
        setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
      }
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

      // Get watched duration from video if marking as complete
      const watchedDuration =
        !isCompleted && videoRef.current
          ? Math.floor(videoRef.current.currentTime)
          : undefined;

      if (isCompleted) {
        await lessonApi.markUncomplete(lessonId);
      } else {
        await lessonApi.markComplete(lessonId, watchedDuration);
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

  // Get lessons organized by section from progress data
  const lessonsBySection = React.useMemo(() => {
    if (!progress) return {};

    const map: Record<string, Lesson[]> = {};
    progress.sections.forEach((section) => {
      // Map progress lessons to Lesson type
      const lessons: Lesson[] = section.lessons.map((progressLesson: any) => ({
        id: progressLesson.lessonId,
        sectionId: section.sectionId,
        title: progressLesson.lessonName,
        description: "",
        type: progressLesson.lessonType,
        content: "",
        duration: progressLesson.duration,
        orderIndex: progressLesson.lessonOrder,
        isFree: false,
        attachments: [],
        parentId: null,
        path: null,
        level: 0,
        childrenCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        videoUrl: progressLesson.videoUrl || "",
      }));
      map[section.sectionId] = lessons;
    });
    return map;
  }, [progress]);

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

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Seek video to specific time
  const seekToTime = (seconds: number) => {
    if (videoRef.current) {
      // Set the video time
      videoRef.current.currentTime = seconds;

      // Play video if paused
      if (videoRef.current.paused) {
        videoRef.current.play().catch((err) => {
          console.error("Failed to play video:", err);
        });
      }

      // Scroll video into view if needed
      videoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

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
                    {progress.completedLessonsCount} /{" "}
                    {progress.totalLessonsCount} lessons completed •{" "}
                    {progress.progressPercent}%
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
                    {progress.progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video & Content */}
        <div className="flex-1 overflow-y-auto">
          <div className=" mx-auto p-6 space-y-6">
            {/* Video Player */}
            {currentLesson ? (
              <>
                <div className="flex gap-6">
                  <div
                    className={`transition-all ${showTranscript ? "w-2/3" : "w-full"}`}
                  >
                    <VideoPlayer
                      videoRef={videoRef}
                      videoUrl={videoUrl || ""}
                      title={currentLesson.title}
                      showTranscript={showTranscript}
                      onTranscriptToggle={() =>
                        setShowTranscript(!showTranscript)
                      }
                      onEnded={() => {
                        if (!isLessonCompleted) {
                          toggleLessonComplete(currentLesson.id, false);
                        }
                      }}
                    />
                  </div>

                  {/* Transcript Panel */}
                  {showTranscript && (
                    <div className="w-1/3 bg-white rounded-lg border border-gray-200 p-4 max-h-150 overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Transcript
                        </h3>
                        <button
                          onClick={() => setShowTranscript(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Close transcript"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {isLoadingTranscript ? (
                          <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                            <p className="text-gray-600">
                              Loading transcript...
                            </p>
                          </div>
                        ) : transcript &&
                          transcript.segments &&
                          transcript.segments.length > 0 ? (
                          transcript.segments.map((segment, index) => (
                            <div
                              key={index}
                              className="flex gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer transition-colors group"
                              onClick={() => seekToTime(segment.start)}
                            >
                              <span className="text-sm font-medium text-primary-600 shrink-0 group-hover:text-primary-700">
                                {formatTime(segment.start)}
                              </span>
                              <p className="text-sm text-gray-700 group-hover:text-gray-900">
                                {segment.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No transcript available for this lesson.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
