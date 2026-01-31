import apiClient from "./client";
import type { Course, CreateCourseDto, UpdateCourseDto } from "../types/course";
import type { PaginatedResponse, PaginationParams } from "../types";

export const courseApi = {
  // Get all courses with pagination
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Course>> => {
    const response = await apiClient.get("/courses", { params });
    return response.data;
  },

  // Get single course
  getById: async (id: string): Promise<Course> => {
    const response = await apiClient.get(`/admin/courses/${id}`);
    return response.data;
  },

  // Create course (admin)
  create: async (data: CreateCourseDto): Promise<Course> => {
    const response = await apiClient.post("/admin/courses", data);
    return response.data;
  },

  // Update course (admin)
  update: async (id: string, data: UpdateCourseDto): Promise<Course> => {
    const response = await apiClient.put(`/admin/courses/${id}`, data);
    return response.data;
  },

  // Delete course (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/courses/${id}`);
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
      `/admin/courses/${courseId}/thumbnail`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      },
    );

    return response.data;
  },
};
