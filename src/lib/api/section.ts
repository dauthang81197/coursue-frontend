import apiClient from "./client";
import type {
  Section,
  CreateSectionDto,
  UpdateSectionDto,
} from "../types/course";

export const sectionApi = {
  // Get sections by course
  getByCourse: async (courseId: string): Promise<Section[]> => {
    const response = await apiClient.get(`/courses/${courseId}/sections`);
    return response.data;
  },

  // Create section (admin)
  create: async (data: CreateSectionDto): Promise<Section> => {
    const response = await apiClient.post("/admin/courses/sections", data);
    return response.data;
  },

  // Update section (admin)
  update: async (id: string, data: UpdateSectionDto): Promise<Section> => {
    const response = await apiClient.put(`/admin/courses/sections/${id}`, data);
    return response.data;
  },

  // Delete section (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/courses/sections/${id}`);
  },
};
