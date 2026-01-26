import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../base/Badge";
import { Course } from "@/lib/types";

interface CourseCardProps {
    course: Course;
}

/**
 * CourseCard component - Udemy-style course display
 * Shows thumbnail, title, instructor, rating, price
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const discount = course.originalPrice
        ? Math.round(
            ((course.originalPrice - course.price) / course.originalPrice) * 100
        )
        : 0;

    return (
        <Link
            href={`/courses/${course.id}`}
            className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100">
                <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {discount > 0 && (
                    <div className="absolute top-2 left-2">
                        <Badge variant="error" size="md">
                            {discount}% OFF
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
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

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                            {course.rating.toFixed(1)}
                        </span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(course.rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">
                        ({course.reviewCount.toLocaleString()})
                    </span>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <span>{course.studentsEnrolled.toLocaleString()} students</span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        ${course.price.toFixed(2)}
                    </span>
                    {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ${course.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};
