import apiClient from "./client";
import { Course } from "../types";

/**
 * Course API Service
 */

export interface CoursesResponse {
    courses: Course[];
    total: number;
    page: number;
    limit: number;
}

export interface CourseFilters {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const courseApi = {
    /**
     * Get all courses with filters
     */
    getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
        const response = await apiClient.get<CoursesResponse>("/courses", {
            params: filters,
        });
        return response.data;
    },

    /**
     * Get course by ID
     */
    getCourseById: async (id: string): Promise<Course> => {
        const response = await apiClient.get<Course>(`/courses/${id}`);
        return response.data;
    },

    /**
     * Get enrolled courses for current user
     */
    getEnrolledCourses: async (): Promise<Course[]> => {
        const response = await apiClient.get<Course[]>("/courses/enrolled");
        return response.data;
    },

    /**
     * Enroll in a course
     */
    enrollCourse: async (courseId: string): Promise<void> => {
        await apiClient.post(`/courses/${courseId}/enroll`);
    },

    /**
     * Get course progress
     */
    getCourseProgress: async (courseId: string) => {
        const response = await apiClient.get(`/courses/${courseId}/progress`);
        return response.data;
    },
};
