import apiClient from "./client";
import type { Course, CreateCourseDto, UpdateCourseDto, RoadmapResponse } from "../types/course";
import type { PaginatedResponse, PaginationParams } from "../types";

export const courseApi = {
  // Get all courses with pagination
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get("/courses", { params });
    return response.data;
  },

  // Get single course
  getById: async (id: string): Promise<Course> => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  // Create course (admin)
  create: async (data: CreateCourseDto): Promise<Course> => {
    const response = await apiClient.post("/courses", data);
    return response.data;
  },

  // Update course (admin)
  update: async (id: string, data: UpdateCourseDto): Promise<Course> => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },

  // Get course roadmap (flat lesson list with progress)
  getRoadmap: async (courseId: string): Promise<RoadmapResponse> => {
    const response = await apiClient.get(`/courses/${courseId}/roadmap`);
    return response.data;
  },

  // Attach a lesson to a course (admin)
  attachLesson: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/lessons/${lessonId}`);
  },

  // Detach a lesson from a course (admin)
  detachLesson: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
  },

  // Upload thumbnail
  uploadThumbnail: async (
    courseId: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<{ thumbnail: string; message: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(
      `/courses/${courseId}/thumbnail`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(pct);
          }
        },
      },
    );
    return response.data;
  },
};
