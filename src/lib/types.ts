// Re-export Course from canonical source
export type { Course } from "./types/course";

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "instructor" | "admin";
}

// Lesson/Module types (legacy UI shapes)
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isFree: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Progress types (legacy)
export interface Progress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  lastWatched?: string;
  percentage: number;
}
