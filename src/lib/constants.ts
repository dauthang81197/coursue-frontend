export const SITE_CONFIG = {
    name: "CoursUE",
    description: "Sharpen your skills with professional online courses",
    url: "https://coursue.com",
} as const;

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    COURSES: "/courses",
    COURSE_DETAIL: (id: string) => `/courses/${id}`,
    PROFILE: "/profile",
    SETTINGS: "/settings",
} as const;

export const CATEGORIES = [
    "Development",
    "Business",
    "Design",
    "Marketing",
    "IT & Software",
    "Personal Development",
    "Photography",
    "Music",
] as const;
