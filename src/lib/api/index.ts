export { apiClient, handleApiError } from "./client";
export { authApi } from "./auth";
export { courseApi } from "./courses";

export type { LoginRequest, RegisterRequest, AuthResponse } from "./auth";
export type { CoursesResponse, CourseFilters } from "./courses";
