import apiClient from "./client";
import type { Course, CreateCourseDto, UpdateCourseDto } from "../types/course";

export const courseApi = {
  // Get all courses
  getAll: async (): Promise<Course[]> => {
    const response = await apiClient.get("/courses");
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
};
