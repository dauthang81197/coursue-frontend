"use client";

import { useState, useEffect } from "react";
import { lessonApi } from "@/lib/api/lesson";
import { Button } from "@/components/base/Button";
import { LessonNode } from "./LessonNode";
import { LessonModal } from "./LessonModal";
import type { Lesson, Section } from "@/lib/types/course";

interface LessonManagerProps {
  courseId: string;
  sections: Section[];
  onNext: () => void;
  onBack: () => void;
}

export function LessonManager({
  courseId,
  sections,
  onNext,
  onBack,
}: LessonManagerProps) {
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [parentLesson, setParentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (selectedSection) {
      loadLessons();
    }
  }, [selectedSection]);

  const loadLessons = async () => {
    if (!selectedSection) return;

    try {
      setLoading(true);
      const tree = await lessonApi.getTree(selectedSection);
      setLessons(tree);
    } catch (error) {
      console.error("Failed to load lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = (parent?: Lesson) => {
    setParentLesson(parent || null);
    setEditingLesson(null);
    setShowModal(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setParentLesson(null);
    setShowModal(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this lesson? All child lessons will also be deleted.",
      )
    ) {
      return;
    }

    try {
      await lessonApi.delete(lessonId);
      await loadLessons();
    } catch (error) {
      alert("Failed to delete lesson");
    }
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingLesson(null);
    setParentLesson(null);
    loadLessons();
  };
  console.log(sections, "sections---");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Manage Lessons
        </h2>
        <p className="text-gray-600">
          Create hierarchical lesson structure with unlimited nesting
        </p>
      </div>

      {/* Section Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Section
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a section...</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSection && (
        <>
          {/* Add Root Lesson Button */}
          <div>
            <Button onClick={() => handleAddLesson()}>Add Root Lesson</Button>
          </div>

          {/* Lessons Tree */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading lessons...
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No lessons yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first lesson.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg">
              {lessons.map((lesson) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  onAddChild={handleAddLesson}
                  onEdit={handleEditLesson}
                  onDelete={handleDeleteLesson}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back to Sections
        </Button>
        <Button onClick={onNext}>Continue to Review</Button>
      </div>

      {/* Lesson Modal */}
      {showModal && (
        <LessonModal
          sectionId={selectedSection}
          lesson={editingLesson}
          parentLesson={parentLesson}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
