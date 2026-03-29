"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { CourseCard } from "@/components/common";
import { Button, Input } from "@/components/base";
import { useCourseStore } from "@/lib/store";
import { CourseFilters } from "@/lib/api/courses";

export default function CoursesPage() {
  const { courses, isLoading, error, total, page, limit, fetchCourses } =
    useCourseStore();

  const [premiumFilter, setPremiumFilter] = useState<
    "all" | "free" | "premium"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const filters: CourseFilters = { page: 1, limit: 12 };
    if (debouncedSearch) filters.search = debouncedSearch;
    if (premiumFilter === "premium") filters.isPremium = true;
    if (premiumFilter === "free") filters.isPremium = false;
    fetchCourses(filters);
  }, [debouncedSearch, premiumFilter, fetchCourses]);

  const handleLoadMore = () => {
    const filters: CourseFilters = { page: page + 1, limit };
    if (debouncedSearch) filters.search = debouncedSearch;
    if (premiumFilter === "premium") filters.isPremium = true;
    if (premiumFilter === "free") filters.isPremium = false;
    fetchCourses(filters);
  };

  const hasMore = courses.length < total;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">All Courses</h1>
        <p className="text-gray-500">
          Explore our courses and start learning today
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 space-y-4">
        <Input
          type="text"
          placeholder="Search courses…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <div className="flex gap-2">
          {(["all", "free", "premium"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPremiumFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                premiumFilter === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f === "all"
                ? "All"
                : f === "free"
                ? "Free"
                : "⭐ Premium"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading && courses.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No courses found</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setPremiumFilter("all");
            }}
            className="mt-3 text-primary-600 underline text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{total} courses found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center">
              <Button
                variant="primary"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading…" : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
