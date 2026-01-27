"use client";

import { useState, useEffect } from "react";
import { sectionApi } from "@/lib/api/section";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import type { Section, CreateSectionDto } from "@/lib/types/course";

interface SectionManagerProps {
  courseId: string;
  onNext: () => void;
}

export function SectionManager({ courseId, onNext }: SectionManagerProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSection, setNewSection] = useState<Partial<CreateSectionDto>>({
    title: "",
    description: "",
    courseId,
  });

  useEffect(() => {
    loadSections();
  }, [courseId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await sectionApi.getByCourse(courseId);
      setSections(data?.sections || []);
    } catch (error) {
      console.error("Failed to load sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSection.title) return;

    try {
      const sectionData: CreateSectionDto = {
        title: newSection.title,
        description: newSection.description,
        orderIndex: sections.length,
        courseId,
      };

      await sectionApi.create(sectionData);
      setNewSection({ title: "", description: "", courseId });
      await loadSections();
    } catch (error) {
      alert("Failed to create section");
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (
      !confirm("Are you sure? This will delete all lessons in this section.")
    ) {
      return;
    }

    try {
      await sectionApi.delete(sectionId);
      await loadSections();
    } catch (error) {
      alert("Failed to delete section");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Course Sections
        </h2>
        <p className="text-gray-600">
          Organize your course into logical sections
        </p>
      </div>

      {/* Existing Sections */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading sections...
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600">
              No sections yet. Add your first section below.
            </p>
          </div>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {section.description}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                      <span>{section.lessonCount} lessons</span>
                      <span>{Math.floor(section.totalDuration / 60)} min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setEditingId(section.id)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Edit section"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete section"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Add New Section</h3>
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={newSection.title || ""}
            onChange={(e) =>
              setNewSection({ ...newSection, title: e.target.value })
            }
            placeholder="e.g., Introduction to React"
          />
          <Textarea
            label="Description (optional)"
            value={newSection.description || ""}
            onChange={(e) =>
              setNewSection({ ...newSection, description: e.target.value })
            }
            placeholder="Brief description of what's covered in this section"
            rows={3}
          />
          <Button onClick={handleAddSection} disabled={!newSection.title}>
            Add Section
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t">
        <Button onClick={onNext} disabled={sections.length === 0}>
          Continue to Lessons ({sections.length} section
          {sections.length !== 1 ? "s" : ""})
        </Button>
      </div>
    </div>
  );
}
