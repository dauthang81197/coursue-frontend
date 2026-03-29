import apiClient from "./client";
import type {
  Section,
  UpdateSectionDto,
} from "../types/course";

export interface CreateSectionData {
  title: string;
  description?: string;
  orderIndex: number;
}

export const sectionApi = {
  // Get sections by course
  getByCourse: async (courseId: string): Promise<{ sections: Section[] }> => {
    const response = await apiClient.get(`/courses/${courseId}/sections`);
    return response.data;
  },

  // Create section (admin) - courseId in URL path
  create: async (courseId: string, data: CreateSectionData): Promise<Section> => {
    const response = await apiClient.post(`/courses/${courseId}/sections`, data);
    return response.data;
  },

  // Update section (admin)
  update: async (id: string, data: UpdateSectionDto): Promise<Section> => {
    const response = await apiClient.put(`/sections/${id}`, data);
    return response.data;
  },

  // Delete section (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sections/${id}`);
  },
};
