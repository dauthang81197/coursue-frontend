import apiClient from "./client";
import type {
  Lesson,
  LessonCompleteResponse,
  LessonStartResponse,
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

  // Mark lesson as in_progress
  startLesson: async (courseId: string, lessonId: string): Promise<LessonStartResponse> => {
    const response = await apiClient.post<LessonStartResponse>(
      `/learning/courses/${courseId}/lessons/${lessonId}/start`,
    );
    return response.data;
  },

  // Mark lesson as completed and receive XP
  markComplete: async (
    courseId: string,
    lessonId: string,
  ): Promise<LessonCompleteResponse> => {
    const response = await apiClient.post<LessonCompleteResponse>(
      `/learning/courses/${courseId}/lessons/${lessonId}/complete`,
    );
    return response.data;
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
