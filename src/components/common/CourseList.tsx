"use client";

import React, { useEffect } from "react";
import { CourseCard } from "./CourseCard";
import { useCourseStore } from "@/lib/store";

interface CourseListProps {
  title?: string;
  showSeeAll?: boolean;
  limit?: number;
}

/**
 * CourseList - Display courses from API with loading/error states
 */
export const CourseList: React.FC<CourseListProps> = ({
  title = "Featured Courses",
  showSeeAll = true,
  limit = 6,
}) => {
  const { courses, isLoading, error, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses({ page: 1, limit });
  }, [fetchCourses, limit]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading courses: {error}</p>
        <button
          onClick={() => fetchCourses({ page: 1, limit })}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (courses?.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No courses available at the moment.
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showSeeAll && (
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              See All →
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.slice(0, limit).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
