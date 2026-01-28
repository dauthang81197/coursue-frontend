"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { CourseCard } from "@/components/common";
import { Button, Input, Badge } from "@/components/base";
import { useCourseStore } from "@/lib/store";
import { CourseFilters } from "@/lib/api/courses";

const CATEGORIES = [
  "All",
  "Development",
  "Business",
  "Design",
  "Marketing",
  "IT & Software",
  "Personal Development",
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const { courses, isLoading, error, total, page, limit, fetchCourses } =
    useCourseStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch courses when filters change
  useEffect(() => {
    const filters: CourseFilters = {
      page: 1,
      limit: 12,
    };

    if (selectedCategory !== "All") {
      filters.category = selectedCategory;
    }

    if (selectedLevel !== "All") {
      filters.level = selectedLevel;
    }

    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }

    fetchCourses(filters);
  }, [selectedCategory, selectedLevel, debouncedSearch, fetchCourses]);

  const handleLoadMore = () => {
    const filters: CourseFilters = {
      page: page + 1,
      limit,
    };

    if (selectedCategory !== "All") {
      filters.category = selectedCategory;
    }

    if (selectedLevel !== "All") {
      filters.level = selectedLevel;
    }

    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }

    fetchCourses(filters);
  };

  const hasMore = courses.length < total;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
        <p className="text-gray-600">
          Explore our wide range of courses and start learning today
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        {/* Search */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Level</h3>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedLevel === level
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "All" ||
          selectedLevel !== "All" ||
          debouncedSearch) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Active filters:
              </span>
              {selectedCategory !== "All" && (
                <Badge variant="primary" size="sm">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="ml-2 hover:text-primary-800"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedLevel !== "All" && (
                <Badge variant="primary" size="sm">
                  {selectedLevel}
                  <button
                    onClick={() => setSelectedLevel("All")}
                    className="ml-2 hover:text-primary-800"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {debouncedSearch && (
                <Badge variant="primary" size="sm">
                  Search: {debouncedSearch}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 hover:text-primary-800"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                  setSearchQuery("");
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {courses.length} of {total} courses
        </p>
      </div>

      {/* Courses Grid */}
      {isLoading && courses.length === 0 ? (
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">Failed to load courses</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button onClick={() => fetchCourses()}>Try Again</Button>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            No courses found
          </p>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search query
          </p>
          <Button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedLevel("All");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button
                variant="primary"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </span>
                ) : (
                  "Load More Courses"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
