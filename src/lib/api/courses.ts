import apiClient from "./client";
import { Course, CourseProgress, EnrollmentResponse, NextLessonResponse, RoadmapResponse } from "../types/course";

export interface CoursesResponse {
  data: Course[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  search?: string;
  isPremium?: boolean;
  page?: number;
  limit?: number;
}

export const courseApi = {
  getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const response = await apiClient.get<CoursesResponse>("/courses", { params: filters });
    return response.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    return response.data;
  },

  getCourseRoadmap: async (id: string): Promise<RoadmapResponse> => {
    const response = await apiClient.get<RoadmapResponse>(`/learning/courses/${id}/lessons`);
    return response.data;
  },

  getEnrolledCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>("/courses/enrolled");
    return response.data;
  },

  enrollCourse: async (courseId: string): Promise<EnrollmentResponse> => {
    const response = await apiClient.post<EnrollmentResponse>(`/learning/courses/${courseId}/start`);
    return response.data;
  },

  getNextLesson: async (courseId: string): Promise<NextLessonResponse> => {
    const response = await apiClient.get<NextLessonResponse>(`/learning/courses/${courseId}/next-lesson`);
    return response.data;
  },

  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    const response = await apiClient.get<CourseProgress>(`/courses/${courseId}/progress`);
    return response.data;
  },

  updateLastAccessedLesson: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/last-accessed`, { lessonId });
  },
};
