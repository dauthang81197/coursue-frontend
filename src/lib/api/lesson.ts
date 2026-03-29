import apiClient from "./client";
import type {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  VideoUploadResponse,
  VideoUrlResponse,
  TranscriptResponse,
} from "../types/course";

export const lessonApi = {
  // Get lesson detail
  getById: async (lessonId: string): Promise<Lesson> => {
    const response = await apiClient.get(`/lessons/${lessonId}`);
    return response.data;
  },

  // Mark lesson as completed (new endpoint requires courseId)
  markComplete: async (
    courseId: string,
    lessonId: string,
    watchedDuration?: number,
  ): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/complete`, {
      watchedDuration,
    });
  },

  // Mark lesson as uncompleted
  markUncomplete: async (courseId: string, lessonId: string): Promise<void> => {
    await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}/complete`);
  },

  // Get lessons for a section
  getTree: async (sectionId: string): Promise<Lesson[]> => {
    const response = await apiClient.get(`/sections/${sectionId}/lessons`);
    return response.data;
  },

  // Create lesson (admin)
  create: async (data: CreateLessonDto): Promise<Lesson> => {
    const response = await apiClient.post("/lessons", data);
    return response.data;
  },

  // Update lesson (admin)
  update: async (id: string, data: UpdateLessonDto): Promise<Lesson> => {
    const response = await apiClient.put(`/lessons/${id}`, data);
    return response.data;
  },

  // Delete lesson (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/lessons/${id}`);
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
      `/lessons/${lessonId}/video`,
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
      `/lessons/${lessonId}/video-url`,
    );
    return response.data.url;
  },

  // Get transcript for lesson
  getTranscript: async (lessonId: string): Promise<TranscriptResponse> => {
    const response = await apiClient.get<TranscriptResponse>(
      `/lessons/${lessonId}/transcript`,
    );
    return response.data;
  },
};
