import apiClient from "./client";
import type {
  Quiz,
  CreateQuizDto,
  SubmitQuizDto,
  QuizSubmitResponse,
} from "../types/course";

export const quizApi = {
  // Get quiz for a lesson (student)
  getByLesson: async (lessonId: string): Promise<Quiz> => {
    const response = await apiClient.get(`/quiz/${lessonId}`);
    return response.data;
  },

  // Submit quiz answers (student)
  submit: async (
    lessonId: string,
    data: SubmitQuizDto,
  ): Promise<QuizSubmitResponse> => {
    const response = await apiClient.post(`/quiz/${lessonId}/submit`, data);
    return response.data;
  },

  // Create quiz (admin)
  create: async (data: CreateQuizDto): Promise<Quiz> => {
    const response = await apiClient.post("/quiz", data);
    return response.data;
  },

  // Update quiz (admin) - replace questions
  update: async (lessonId: string, data: CreateQuizDto): Promise<Quiz> => {
    const response = await apiClient.put(`/quiz/${lessonId}`, data);
    return response.data;
  },
};

