import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/lib/types/course";

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          {course.isPremium
            ? <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-400 text-yellow-900">⭐ Premium</span>
            : <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700">Free</span>}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
      </div>
    </Link>
  );
};
