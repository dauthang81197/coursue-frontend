import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/lib/types/course";

interface EnrolledCourseCardProps {
  course: Course;
  progress?: number;
}

/**
 * EnrolledCourseCard component - For dashboard enrolled courses
 * Shows thumbnail, title, instructor, progress bar
 */
export const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({
  course,
  progress = 0,
}) => {
  return (
    <Link
      href={`/courses/${course.id}/learn`}
      className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 aspect-video sm:aspect-auto sm:h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <svg
                className="w-12 h-12 text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
          )}
          {/* Premium badge */}
          <div className="absolute top-2 right-2">
            {course.isPremium ? (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-400 text-yellow-900">
                ⭐ Premium
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700">
                Free
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                {course.description}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {progress}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
