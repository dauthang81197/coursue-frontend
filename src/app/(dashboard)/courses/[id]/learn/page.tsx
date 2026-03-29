"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { QuizPlayer } from "@/components/course/QuizPlayer";
import { Button } from "@/components/base";
import { courseApi } from "@/lib/api/courses";
import { lessonApi } from "@/lib/api/lesson";
import { Lesson, LessonType, RoadmapLesson, RoadmapResponse, TranscriptData } from "@/lib/types/course";

export default function LearnPage() {
  const params   = useParams();
  const router   = useRouter();
  const courseId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [roadmap,        setRoadmap]        = useState<RoadmapResponse | null>(null);
  const [currentLesson,  setCurrentLesson]  = useState<Lesson | null>(null);
  const [videoUrl,       setVideoUrl]       = useState<string | null>(null);
  const [transcript,     setTranscript]     = useState<TranscriptData | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isLoading,      setIsLoading]      = useState(true);
  const [completing,     setCompleting]     = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  // ── Load roadmap ────────────────────────────────────────────────────────────
  const loadRoadmap = useCallback(async () => {
    const data = await courseApi.getCourseRoadmap(courseId);
    setRoadmap(data);
    return data;
  }, [courseId]);

  // ── Load a single lesson ────────────────────────────────────────────────────
  const loadLesson = useCallback(async (lessonId: string) => {
    const lesson = await lessonApi.getById(lessonId);
    setCurrentLesson(lesson);
    setTranscript(null);
    setShowTranscript(false);
    if (lesson.videoUrl) {
      setVideoUrl(lesson.videoUrl);
    } else if (lesson.videoKey) {
      try { setVideoUrl(await lessonApi.getVideoUrl(lessonId)); }
      catch { setVideoUrl(null); }
    } else {
      setVideoUrl(null);
    }
  }, []);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!courseId) return;
    setIsLoading(true);
    loadRoadmap()
      .then(async (data) => {
        const first = data.lessons?.[0];
        if (first) await loadLesson(first.id);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setIsLoading(false));
  }, [courseId, loadRoadmap, loadLesson]);

  // ── Transcript ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showTranscript || !currentLesson || transcript) return;
    lessonApi.getTranscript(currentLesson.id)
      .then((r) => setTranscript(r.hasTranscript ? (r.transcript ?? null) : null))
      .catch(() => setTranscript(null));
  }, [showTranscript, currentLesson, transcript]);

  // ── Mark complete ───────────────────────────────────────────────────────────
  const markComplete = async (lessonId: string) => {
    try {
      setCompleting(true);
      await lessonApi.markComplete(courseId, lessonId,
        videoRef.current ? Math.floor(videoRef.current.currentTime) : undefined);
      await loadRoadmap();
    } catch { /* non-fatal */ }
    finally { setCompleting(false); }
  };

  const isCompleted = (lessonId: string) =>
    roadmap?.lessons.find((l) => l.id === lessonId)?.isCompleted ?? false;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // ─── Loading / Error states ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-3" />
            <p className="text-gray-500">Loading course…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  if (error || !roadmap) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-red-500 font-medium">{error ?? "Course not found"}</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  const lessonCompleted = currentLesson ? isCompleted(currentLesson.id) : false;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Course title */}
        <div className="px-5 py-4 border-b border-gray-100">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 mb-2"
          >
            ← Back to course
          </button>
          <h2 className="font-bold text-gray-900 text-sm line-clamp-2">{roadmap.course.title}</h2>
          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{roadmap.completedCount}/{roadmap.totalCount} completed</span>
              <span>{roadmap.progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 bg-primary-600 rounded-full transition-all" style={{ width: `${roadmap.progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto py-2">
          {roadmap.lessons.map((rl: RoadmapLesson, idx) => {
            const active = currentLesson?.id === rl.id;
            return (
              <button
                key={rl.id}
                onClick={() => !rl.locked && loadLesson(rl.id)}
                disabled={rl.locked}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                  active ? "bg-primary-50 border-r-2 border-primary-600" : "hover:bg-gray-50"
                } ${rl.locked ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {/* status icon */}
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  rl.isCompleted ? "bg-green-500 text-white" :
                  rl.locked ? "bg-gray-200 text-gray-400" :
                  active ? "bg-primary-600 text-white" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {rl.isCompleted ? "✓" : rl.locked ? "🔒" : idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${active ? "text-primary-700" : "text-gray-800"}`}>{rl.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-gray-400 capitalize">{rl.type}</span>
                    {rl.xpReward > 0 && <span className="text-xs text-yellow-500">+{rl.xpReward}xp</span>}
                    {rl.isPremium && <span className="text-xs text-yellow-600">⭐</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="text-base font-semibold text-gray-900 truncate max-w-lg">
            {currentLesson?.title ?? "Select a lesson"}
          </h1>
          {currentLesson && currentLesson.type !== LessonType.QUIZ && (
            <Button
              size="sm"
              variant={lessonCompleted ? "outline" : "primary"}
              onClick={() => markComplete(currentLesson.id)}
              disabled={completing || lessonCompleted}
            >
              {completing ? "…" : lessonCompleted ? "✓ Completed" : "Mark Complete"}
            </Button>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentLesson ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-lg font-medium">Select a lesson to start</p>
            </div>
          ) : currentLesson.type === LessonType.QUIZ ? (
            <QuizPlayer
              lessonId={currentLesson.id}
              courseId={courseId}
              isCompleted={lessonCompleted}
              onLessonComplete={() => markComplete(currentLesson.id)}
            />
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Video */}
              {currentLesson.type === LessonType.VIDEO && (
                <div className="flex gap-4">
                  <div className={showTranscript ? "w-2/3" : "w-full"}>
                    <VideoPlayer
                      videoRef={videoRef}
                      videoUrl={videoUrl ?? ""}
                      title={currentLesson.title}
                      showTranscript={showTranscript}
                      onTranscriptToggle={() => setShowTranscript((p) => !p)}
                      onEnded={() => { if (!lessonCompleted) markComplete(currentLesson.id); }}
                    />
                  </div>
                  {showTranscript && (
                    <div className="w-1/3 bg-white rounded-xl border border-gray-200 p-4 max-h-[500px] overflow-y-auto">
                      <div className="flex justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm">Transcript</h3>
                        <button onClick={() => setShowTranscript(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
                      </div>
                      {transcript?.segments?.map((seg, i) => (
                        <div key={i} className="flex gap-2 py-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => { if (videoRef.current) { videoRef.current.currentTime = seg.start; videoRef.current.play(); }}}>
                          <span className="text-xs text-primary-500 shrink-0 font-mono">{formatTime(seg.start)}</span>
                          <p className="text-xs text-gray-700">{seg.text}</p>
                        </div>
                      )) ?? <p className="text-xs text-gray-400 text-center py-6">No transcript available</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Theory / Article content */}
              {(currentLesson.type === LessonType.THEORY || currentLesson.type === LessonType.ARTICLE) && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full uppercase">{currentLesson.type}</span>
                    {currentLesson.xpReward && <span className="text-sm text-yellow-600">+{currentLesson.xpReward} XP</span>}
                  </div>
                  {currentLesson.content ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                  ) : (
                    <p className="text-gray-400 italic">No content available.</p>
                  )}
                </div>
              )}

              {/* Lesson description / attachments */}
              {currentLesson.description && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About this lesson</h3>
                  <p className="text-gray-600 text-sm">{currentLesson.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
