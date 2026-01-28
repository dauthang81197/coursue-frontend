// Course types
export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  studentsEnrolled: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "instructor" | "admin";
}

// Lesson/Module types
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

// Progress types
export interface Progress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  lastWatched?: string;
  percentage: number;
}
