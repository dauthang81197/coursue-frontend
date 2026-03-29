import apiClient from "./client";
import { Course, CourseProgress, RoadmapResponse } from "../types/course";

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
    const response = await apiClient.get<RoadmapResponse>(`/courses/${id}/roadmap`);
    return response.data;
  },

  getEnrolledCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>("/courses/enrolled");
    return response.data;
  },

  enrollCourse: async (courseId: string): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/enroll`);
  },

  getCourseProgress: async (courseId: string): Promise<CourseProgress> => {
    const response = await apiClient.get<CourseProgress>(`/courses/${courseId}/progress`);
    return response.data;
  },

  updateLastAccessedLesson: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/last-accessed`, { lessonId });
  },
};
