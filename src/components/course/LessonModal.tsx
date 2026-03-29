"use client";

import { useState } from "react";
import { lessonApi } from "@/lib/api/lesson";
import { Modal } from "@/components/base/Modal";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import { VideoUpload } from "./VideoUpload";
import { QuizManager } from "./QuizManager";
import type { Lesson, CreateLessonDto, LessonType } from "@/lib/types/course";

interface LessonModalProps {
  courseId: string;
  sectionId: string;
  lesson?: Lesson | null;
  parentLesson?: Lesson | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function LessonModal({
  courseId,
  sectionId,
  lesson,
  parentLesson,
  onClose,
  onSuccess,
}: LessonModalProps) {
  const [formData, setFormData] = useState<Partial<CreateLessonDto>>({
    title: lesson?.title || "",
    description: lesson?.description || "",
    type: (lesson?.type as LessonType) || "video",
    duration: lesson?.duration || 0,
    isFree: lesson?.isFree || false,
    content: lesson?.content || "",
    sectionId,
    parentId: parentLesson?.id || lesson?.parentId || undefined,
    orderIndex: lesson?.orderIndex || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "video" | "quiz">("form");
  const [createdLessonId, setCreatedLessonId] = useState<string | null>(
    lesson?.id || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const lessonData: CreateLessonDto = {
        title: formData.title,
        description: formData.description,
        type: formData.type as LessonType,
        content: formData.content,
        duration: formData.duration || 0,
        isFree: formData.isFree || false,
        sectionId,
        orderIndex: formData.orderIndex || 0,
        order: formData.orderIndex || 0,
        parentId: formData.parentId,
        courseId,
      };

      if (lesson) {
        await lessonApi.update(lesson.id, lessonData);
        // If editing a quiz lesson, go to quiz manager
        if (formData.type === "quiz") {
          setCreatedLessonId(lesson.id);
          setStep("quiz");
        } else {
          onSuccess();
        }
      } else {
        const newLesson = await lessonApi.create(lessonData);
        setCreatedLessonId(newLesson.id);

        if (formData.type === "video") {
          setStep("video");
        } else if (formData.type === "quiz") {
          setStep("quiz");
        } else {
          onSuccess();
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save lesson";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={lesson ? "Edit Lesson" : "Create New Lesson"}
    >
      {step === "video" && createdLessonId ? (
        <div className="space-y-4">
          <VideoUpload
            lessonId={createdLessonId}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
          />
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onSuccess();
                onClose();
              }}
            >
              Skip Video Upload
            </Button>
          </div>
        </div>
      ) : step === "quiz" && createdLessonId ? (
        <QuizManager
          lessonId={createdLessonId}
          onDone={() => {
            onSuccess();
            onClose();
          }}
          onSkip={() => {
            onSuccess();
            onClose();
          }}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {parentLesson && (
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
              <p className="text-sm text-blue-800">
                This lesson will be a child of:{" "}
                <strong>{parentLesson.title}</strong>
              </p>
            </div>
          )}

          <Input
            label="Lesson Title"
            required
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Introduction to Piano Chords"
          />

          <Textarea
            label="Description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the lesson..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Type
              </label>
              <select
                value={formData.type || "video"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as LessonType,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="video">Video</option>
                <option value="theory">Theory</option>
                <option value="quiz">Quiz</option>
                <option value="article">Article</option>
                <option value="resource">Resource</option>
              </select>
            </div>

            <Input
              label="Duration (seconds)"
              type="number"
              value={formData.duration || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>

          {/* Content field for theory/article */}
          {(formData.type === "theory" || formData.type === "article") && (
            <Textarea
              label="Content"
              value={formData.content || ""}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Lesson content (supports HTML)..."
              rows={6}
            />
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFree"
              checked={formData.isFree || false}
              onChange={(e) =>
                setFormData({ ...formData, isFree: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isFree" className="ml-2 text-sm text-gray-700">
              Free preview (allow non-enrolled users to access)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : lesson
                ? "Update Lesson"
                : formData.type === "video"
                ? "Create & Upload Video"
                : formData.type === "quiz"
                ? "Create & Add Quiz"
                : "Create Lesson"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
