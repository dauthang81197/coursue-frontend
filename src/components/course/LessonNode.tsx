"use client";

import { useState } from "react";
import type { Lesson } from "@/lib/types/course";
import { VideoUpload } from "./VideoUpload";

interface LessonNodeProps {
  lesson: Lesson;
  level?: number;
  onAddChild: (parent: Lesson) => void;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
}

export function LessonNode({
  lesson,
  level = 0,
  onAddChild,
  onEdit,
  onDelete,
}: LessonNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const hasChildren = lesson.children && lesson.children.length > 0;
  const paddingLeft = level * 24;

  const getLessonIcon = () => {
    switch (lesson.type) {
      case "video":
        return (
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case "article":
        return (
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "quiz":
        return (
          <svg
            className="w-5 h-5 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Lesson Row */}
      <div
        className="flex items-center py-3 px-4 hover:bg-gray-50 transition-colors"
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-2 p-1 hover:bg-gray-200 rounded"
          >
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {!hasChildren && <div className="w-6 mr-2" />}

        {/* Lesson Icon */}
        <div className="mr-3">{getLessonIcon()}</div>

        {/* Lesson Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {lesson.title}
            </h4>
            {lesson.isFree && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                FREE
              </span>
            )}
            {lesson.videoKey && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                HAS VIDEO
              </span>
            )}
          </div>
          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
            <span className="capitalize">{lesson.type}</span>
            {(lesson.duration ?? 0) > 0 && (
              <span>
                {Math.floor((lesson.duration ?? 0) / 60)}:
                {((lesson.duration ?? 0) % 60).toString().padStart(2, "0")}
              </span>
            )}
            {hasChildren && (
              <span>
                {lesson.childrenCount} sub-lesson
                {lesson.childrenCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {lesson.type === "video" && (
            <button
              onClick={() => setShowVideoUpload(!showVideoUpload)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Upload video"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </button>
          )}

          <button
            onClick={() => onAddChild(lesson)}
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Add child lesson"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>

          <button
            onClick={() => onEdit(lesson)}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Edit lesson"
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
            onClick={() => onDelete(lesson.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete lesson"
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

      {/* Video Upload */}
      {showVideoUpload && (
        <div
          className="px-4 py-4 bg-gray-50 border-t border-gray-200"
          style={{ paddingLeft: `${paddingLeft + 64}px` }}
        >
          <VideoUpload
            lessonId={lesson.id}
            onSuccess={() => setShowVideoUpload(false)}
          />
        </div>
      )}

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {lesson.children?.map((child) => (
            <LessonNode
              key={child.id}
              lesson={child}
              level={level + 1}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
