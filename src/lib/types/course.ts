// Course Types
export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  ALL_LEVELS = "all_levels",
}

export enum CourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  language: string;
  tags: string[];
  status: CourseStatus;
  instructorId: string;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  totalDuration: number;
  totalLessons: number;
  sectionCount: number;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

export interface CreateCourseDto {
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  thumbnail?: string;
  price?: number;
  discountPrice?: number;
  language?: string;
  tags?: string[];
  status?: CourseStatus;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  category?: string;
  level?: CourseLevel;
  thumbnail?: string;
  price?: number;
  discountPrice?: number;
  language?: string;
  tags?: string[];
  status?: CourseStatus;
}

// Section Types
export interface Section {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessonCount: number;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionDto {
  title: string;
  description?: string;
  orderIndex: number;
  courseId: string;
}

export interface UpdateSectionDto {
  title?: string;
  description?: string;
  orderIndex?: number;
}

// Lesson Types
export enum LessonType {
  VIDEO = "video",
  ARTICLE = "article",
  QUIZ = "quiz",
  CODING_EXERCISE = "coding_exercise",
  RESOURCE = "resource",
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  duration: number;
  orderIndex: number;
  isFree: boolean;
  attachments: string[];
  parentId: string | null;
  path: string | null;
  level: number;
  childrenCount: number;
  videoKey?: string;
  videoSize?: number;
  videoFormat?: string;
  createdAt: string;
  updatedAt: string;
  children?: Lesson[];
}

export interface CreateLessonDto {
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  duration?: number;
  orderIndex: number;
  isFree?: boolean;
  sectionId: string;
  attachments?: string[];
  parentId?: string;
  videoKey?: string;
}

export interface UpdateLessonDto {
  title?: string;
  description?: string;
  type?: LessonType;
  content?: string;
  duration?: number;
  orderIndex?: number;
  isFree?: boolean;
  attachments?: string[];
  parentId?: string;
}

// API Response Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface VideoUploadResponse {
  message: string;
  lessonId: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export interface VideoUrlResponse {
  url: string;
}
