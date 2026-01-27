import apiClient from "./client";
import type {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  VideoUploadResponse,
  VideoUrlResponse,
} from "../types/course";

export const lessonApi = {
  // Get lesson tree for section
  getTree: async (sectionId: string): Promise<Lesson[]> => {
    const response = await apiClient.get(
      `/admin/courses/sections/${sectionId}/lessons/tree`,
    );
    return response.data;
  },

  // Create lesson (admin)
  create: async (data: CreateLessonDto): Promise<Lesson> => {
    const response = await apiClient.post("/admin/courses/lessons", data);
    return response.data;
  },

  // Update lesson (admin)
  update: async (id: string, data: UpdateLessonDto): Promise<Lesson> => {
    const response = await apiClient.put(`/admin/courses/lessons/${id}`, data);
    return response.data;
  },

  // Delete lesson (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/courses/lessons/${id}`);
  },

  // Upload video for lesson
  uploadVideo: async (
    lessonId: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<VideoUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      `/admin/courses/lessons/${lessonId}/video`,
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

  // Get video URL (presigned)
  getVideoUrl: async (lessonId: string): Promise<string> => {
    const response = await apiClient.get<VideoUrlResponse>(
      `/admin/courses/lessons/${lessonId}/video-url`,
    );
    return response.data.url;
  },
};
