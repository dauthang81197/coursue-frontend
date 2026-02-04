import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../base/Badge";
import { Course } from "@/lib/types";

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
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-100 to-primary-200">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Category Badge */}
            <div className="mb-2">
              <Badge variant="primary" size="sm">
                {course.category}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {course.title}
            </h3>

            {/* Instructor */}
            <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {progress}% Complete
              </span>
              <span className="text-xs text-gray-500">{course.duration}</span>
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
