"use client";

import React, { useState } from "react";
import { Section, Lesson } from "@/lib/types/course";

interface LessonSidebarProps {
  sections: Section[];
  lessons: Record<string, Lesson[]>;
  currentLessonId?: string;
  progress: Record<string, boolean>;
  onLessonSelect: (lessonId: string) => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  sections,
  lessons,
  currentLessonId,
  progress,
  onLessonSelect,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id)),
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getSectionProgress = (sectionId: string) => {
    const sectionLessons = lessons[sectionId] || [];
    if (sectionLessons.length === 0) return 0;

    const completed = sectionLessons.filter(
      (lesson) => progress[lesson.id],
    ).length;
    return Math.round((completed / sectionLessons.length) * 100);
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
        <p className="text-sm text-gray-600 mt-1">
          {sections.length} sections • {Object.values(lessons).flat().length}{" "}
          lessons
        </p>
      </div>

      {/* Sections List */}
      <div className="divide-y divide-gray-200">
        {sections.map((section, index) => {
          const isExpanded = expandedSections.has(section.id);
          const sectionLessons = lessons[section.id] || [];
          const sectionProgress = getSectionProgress(section.id);
          return (
            <div key={section.id}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-500">
                        Section {index + 1}
                      </span>
                      {sectionProgress === 100 && (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{sectionLessons.length} lessons</span>
                      <span>•</span>
                      <span>{formatDuration(section.totalDuration)}</span>
                    </div>
                    {sectionProgress > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{sectionProgress}% complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${sectionProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="bg-gray-50">
                  {sectionLessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = progress[lesson.id];

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson.id)}
                        className={`w-full px-4 py-3 hover:bg-gray-100 transition-colors text-left border-l-4 ${isActive
                          ? "border-primary-600 bg-primary-50"
                          : "border-transparent"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox/Icon */}
                          <div className="shrink-0 mt-0.5">
                            {isCompleted ? (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            ) : isActive ? (
                              <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className={`font-medium text-sm ${isActive
                                  ? "text-primary-600"
                                  : "text-gray-900"
                                  }`}
                              >
                                {lesson.title}
                              </h4>
                              <svg
                                className="w-4 h-4 text-gray-400 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">
                                {formatDuration(lesson.duration ?? 0)}
                              </span>
                              {lesson.isFree && (
                                <>
                                  <span className="text-xs text-gray-400">
                                    •
                                  </span>
                                  <span className="text-xs text-green-600 font-medium">
                                    Free
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
