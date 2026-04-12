// ─── Course (new simplified model) ───────────────────────────────────────────
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  isPremium: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  thumbnail?: string;
  isPremium?: boolean;
  order?: number;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  thumbnail?: string;
  isPremium?: boolean;
  order?: number;
}

// ─── Legacy enums (kept for compatibility) ────────────────────────────────────
export enum CourseLevel {
  BEGINNER     = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED     = "advanced",
  ALL_LEVELS   = "all_levels",
}

export enum CourseStatus {
  DRAFT     = "draft",
  PUBLISHED = "published",
  ARCHIVED  = "archived",
}

// ─── Section (legacy, kept for compatibility) ─────────────────────────────────
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

export interface UpdateSectionDto {
  title?: string;
  description?: string;
  orderIndex?: number;
}

// ─── Lesson content blocks ────────────────────────────────────────────────────
export interface LessonMedia {
  id: string;
  url: string;
  type?: string;
  fileName?: string;
  mimeType?: string;
}

export interface LessonContent {
  id: string;
  lessonId: string;
  type: "text" | "video" | "image";
  order: number;
  textData: string | null;
  mediaId: string | null;
  media: LessonMedia | null;
  duration: number | null;
  caption: string | null;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Lesson ───────────────────────────────────────────────────────────────────
export enum LessonType {
  VIDEO    = "video",
  THEORY   = "theory",
  ARTICLE  = "article",
  QUIZ     = "quiz",
  RESOURCE = "resource",
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface CreateQuizQuestionDto {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface CreateQuizDto {
  lessonId: string;
  questions: CreateQuizQuestionDto[];
}

export interface SubmitQuizAnswerDto {
  questionId: string;
  answer: string;
}

export interface SubmitQuizDto {
  answers: SubmitQuizAnswerDto[];
}

export interface QuizSubmitResponse {
  score: number;
  total: number;
  passed: boolean;
  correctAnswers: SubmitQuizAnswerDto[];
}

// ─── Roadmap (flat structure – no sections) ───────────────────────────────────
export interface RoadmapLesson {
  id: string;
  title: string;
  type: string;
  order: number;
  xpReward: number;
  isPremium: boolean;
  locked: boolean;
  status: "in_progress" | "completed" | null;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface RoadmapResponse {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    isPremium: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
  };
  lessons: RoadmapLesson[];
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  enrolledAt: string | null;
  courseCompletedAt: string | null;
}

// legacy alias
export type RoadmapSection = RoadmapResponse;

// ─── Learning API response types ──────────────────────────────────────────────
export interface EnrollmentResponse {
  message: string;
  enrollment: {
    id: string;
    courseId: string;
    startedAt: string;
    completedAt: string | null;
  };
}

export interface LessonStartResponse {
  lessonId: string;
  status: "in_progress" | "completed";
  message: string;
}

export interface LessonCompleteResponse {
  alreadyCompleted: boolean;
  xpGained: number;
  leveledUp: boolean;
  currentXp: number;
  currentLevel: number;
  streak?: number;
  badges?: string[];
  message: string;
}

export interface NextLessonResponse {
  lesson: {
    id: string;
    title: string;
    type: string;
    order: number;
    xpReward: number;
    isPremium: boolean;
  } | null;
  message?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  contents?: LessonContent[];
  content?: string | null;
  xpReward?: number;
  isPremium?: boolean;
  isFree?: boolean;
  duration?: number;
  order?: number;
  orderIndex?: number;
  locked?: boolean;
  isCompleted?: boolean;
  videoUrl?: string;
  videoKey?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
  // Hierarchical / section-based fields (admin editor)
  sectionId?: string;
  parentId?: string | null;
  path?: string | null;
  level?: number;
  children?: Lesson[];
  childrenCount?: number;
}

export interface CreateLessonDto {
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  xpReward?: number;
  isPremium?: boolean;
  isFree?: boolean;
  duration?: number;
  orderIndex?: number;
  sectionId?: string;
  parentId?: string | null;
  courseId?: string;
  order: number;
}

export interface UpdateLessonDto {
  title?: string;
  description?: string;
  type?: LessonType;
  content?: string;
  xpReward?: number;
  isPremium?: boolean;
  isFree?: boolean;
  duration?: number;
  orderIndex?: number;
  order?: number;
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

// Transcript Types
export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptData {
  content: string;
  segments: TranscriptSegment[];
  language: string;
  source: string;
  duration: number;
  wordCount: number;
}

export interface TranscriptResponse {
  hasTranscript: boolean;
  transcript?: TranscriptData;
}

// Progress Types
export interface LessonProgress {
  lessonId: string;
  lessonName: string;
  lessonOrder: number;
  lessonType: string;
  duration: number;
  completed: boolean;
  completedAt?: string | null;
  watchedDuration: number;
}

export interface SectionProgress {
  sectionId: string;
  sectionName: string;
  sectionOrder: number;
  lessons: LessonProgress[];
  completedLessons?: number;
  totalLessons?: number;
  progress?: number;
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  sections: SectionProgress[];
  lastAccessedLessonId?: string;
  // Legacy fields for compatibility
  completedLessons?: number;
  totalLessons?: number;
  progress?: number;
}
