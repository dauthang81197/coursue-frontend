import { create } from "zustand";
import { courseApi, type CourseFilters } from "../api";
import { Course } from "../types/course";

/**
 * Course Store - Quản lý courses state
 */

interface CourseState {
  // State
  courses: Course[];
  enrolledCourses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;

  // Actions
  fetchCourses: (filters?: CourseFilters) => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  fetchEnrolledCourses: () => Promise<void>;
  enrollCourse: (courseId: string) => Promise<void>;
  clearError: () => void;
  setCurrentCourse: (course: Course | null) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  // Initial State
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 12,

  // Fetch all courses
  fetchCourses: async (filters?: CourseFilters) => {
    try {
      set({ isLoading: true, error: null });

      const response = await courseApi.getCourses(filters);

      set({
        courses: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to fetch courses"
          : "Failed to fetch courses";
      set({ error: message, isLoading: false });
    }
  },

  // Fetch course by ID
  fetchCourseById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const course = await courseApi.getCourseById(id);

      set({
        currentCourse: course,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to fetch course"
          : "Failed to fetch course";
      set({ error: message, isLoading: false, currentCourse: null });
    }
  },

  // Fetch enrolled courses
  fetchEnrolledCourses: async () => {
    try {
      set({ isLoading: true, error: null });

      const courses = await courseApi.getEnrolledCourses();

      set({
        enrolledCourses: courses,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to fetch enrolled courses"
          : "Failed to fetch enrolled courses";
      set({ error: message, isLoading: false });
    }
  },

  // Enroll in course
  enrollCourse: async (courseId: string) => {
    try {
      set({ isLoading: true, error: null });

      await courseApi.enrollCourse(courseId);

      set({ isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to enroll in course"
          : "Failed to enroll in course";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set current course
  setCurrentCourse: (course: Course | null) => {
    set({ currentCourse: course });
  },
}));
