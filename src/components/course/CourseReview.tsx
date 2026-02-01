"use client";

import { Button } from "@/components/base/Button";
import type { Course } from "@/lib/types/course";

interface CourseReviewProps {
  course: Partial<Course>;
  onFinish: () => void;
  onBack: () => void;
}

export function CourseReview({ course, onFinish, onBack }: CourseReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Publish
        </h2>
        <p className="text-gray-600">
          Review your course details before publishing
        </p>
      </div>

      {/* Course Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Course Information
          </h3>

          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.title}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.category}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Level</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {course.level}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Language</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.language}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Price</dt>
              <dd className="mt-1 text-sm text-gray-900">${course.price}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {course.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500 mb-2">
            Description
          </dt>
          <dd className="text-sm text-gray-900">{course.description}</dd>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {course?.sections?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Sections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {course.totalLessons || 0}
            </div>
            <div className="text-sm text-gray-500">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {course.totalDuration || 0}h
            </div>
            <div className="text-sm text-gray-500">Duration</div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Course setup complete!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Your course has been created. You can continue adding more
                content or publish it now.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back to Lessons
        </Button>
        <Button onClick={onFinish}>Finish & View Course</Button>
      </div>
    </div>
  );
}
