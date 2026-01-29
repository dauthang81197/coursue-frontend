# API Integration & State Management - Complete Guide

## 📋 Overview
This document describes the complete API integration setup with Zustand state management for the Udemy-like learning platform.

## 🏗️ Architecture

### Layer Structure
```
Frontend Architecture:
├── UI Components (React)
├── State Management (Zustand Stores)
├── API Services (Axios Client)
└── Backend API (Your Existing API)
```

## 📦 Installed Packages

```bash
npm install zustand axios
```

- **Zustand**: Lightweight state management (3KB)
- **Axios**: HTTP client with interceptors

## 🔧 Configuration

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**Important**: Replace with your actual API URL.

## 📂 File Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # Axios instance & interceptors
│   │   ├── auth.ts            # Authentication API
│   │   ├── courses.ts         # Course API
│   │   └── index.ts           # Exports
│   └── store/
│       ├── useAuthStore.ts    # Auth state
│       ├── useCourseStore.ts  # Course state
│       └── index.ts           # Exports
└── components/
    └── common/
        ├── ProtectedRoute.tsx # Route protection
        └── CourseList.tsx     # Course list with API
```

## 🔐 API Client (`lib/api/client.ts`)

### Features
- **Base URL Configuration**: Centralized API endpoint
- **Request Interceptor**: Auto-inject JWT tokens
- **Response Interceptor**: Handle errors, refresh tokens
- **Token Refresh Flow**: Automatic token refresh on 401

### Key Code
```typescript
// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        // Refresh and retry request
      }
    }
    return Promise.reject(error);
  }
);
```

## 🔑 Authentication API (`lib/api/auth.ts`)

### Endpoints
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token

### Example Usage
```typescript
import { authApi } from "@/lib/api";

// Login
const response = await authApi.login({
  email: "user@example.com",
  password: "password123",
});
```

## 📚 Course API (`lib/api/courses.ts`)

### Endpoints
- `GET /courses` - Get all courses (with filters)
- `GET /courses/:id` - Get course by ID
- `POST /courses/:id/enroll` - Enroll in course
- `GET /courses/enrolled` - Get enrolled courses
- `GET /courses/:id/progress` - Get course progress

### Filters
```typescript
interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
}
```

## 🏪 Auth Store (`lib/store/useAuthStore.ts`)

### State
```typescript
{
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Actions
- `login(credentials)` - Login and save tokens
- `register(data)` - Register new user
- `logout()` - Clear session
- `checkAuth()` - Verify authentication

### Persistence
Uses `zustand/middleware` to persist tokens to `localStorage`.

### Example Usage
```typescript
"use client";
import { useAuthStore } from "@/lib/store";

function LoginForm() {
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
    // Auto-redirects on success
  };
}
```

## 📖 Course Store (`lib/store/useCourseStore.ts`)

### State
```typescript
{
  courses: Course[];           // All courses
  enrolledCourses: Course[];   // User's enrolled courses
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}
```

### Actions
- `fetchCourses(filters)` - Get all courses
- `fetchCourseById(id)` - Get single course
- `fetchEnrolledCourses()` - Get user's courses
- `enrollCourse(courseId)` - Enroll in course

### Example Usage
```typescript
"use client";
import { useEffect } from "react";
import { useCourseStore } from "@/lib/store";

function Dashboard() {
  const { enrolledCourses, isLoading, fetchEnrolledCourses } = useCourseStore();

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)
      )}
    </div>
  );
}
```

## 🛡️ Protected Routes (`components/common/ProtectedRoute.tsx`)

### Usage
```typescript
import { ProtectedRoute } from "@/components/common";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>
  );
}
```

### Features
- Checks authentication on mount
- Shows loading state
- Redirects to `/login` if not authenticated
- Preserves intended route for redirect after login

## 🎨 Updated Components

### 1. Login Page (`app/(auth)/login/page.tsx`)
- Integrated `useAuthStore`
- Form validation
- Error display
- Auto-redirect to dashboard on success

### 2. Register Page (`app/(auth)/register/page.tsx`)
- Integrated `useAuthStore`
- Password confirmation validation
- Error handling

### 3. Dashboard Layout (`components/layout/DashboardLayout.tsx`)
- Wrapped with `ProtectedRoute`
- Only accessible to authenticated users

### 4. Dashboard Page (`app/(dashboard)/dashboard/page.tsx`)
- Fetches real enrolled courses from API
- Shows loading/error states
- Displays real enrollment count

### 5. Header Component (`components/common/Header.tsx`)
- Shows user info from `useAuthStore`
- Logout functionality
- User dropdown menu

### 6. Course List Component (`components/common/CourseList.tsx`)
- Fetches courses from API
- Loading/error states
- Configurable limit

### 7. Landing Page (`app/page.tsx`)
- Uses `CourseList` component
- Shows real courses from API

## 🔄 Authentication Flow

```
1. User enters credentials on /login
2. Call useAuthStore.login()
3. API call to /auth/login
4. Store tokens in localStorage
5. Update Zustand state (user, tokens, isAuthenticated)
6. Auto-redirect to /dashboard
7. ProtectedRoute checks authentication
8. Fetch user's enrolled courses
```

## 🔄 Token Refresh Flow

```
1. API returns 401 Unauthorized
2. Response interceptor catches error
3. Get refresh_token from localStorage
4. Call /auth/refresh with refresh token
5. Get new access_token
6. Update localStorage
7. Retry original failed request
8. If refresh fails → logout user
```

## 📊 Data Flow Example

### Enrolling in a Course
```typescript
// User clicks "Enroll" button
const handleEnroll = async (courseId: string) => {
  await useCourseStore.getState().enrollCourse(courseId);
};

// Inside useCourseStore
enrollCourse: async (courseId) => {
  set({ isLoading: true, error: null });
  
  const response = await courseApi.enrollCourse(courseId);
  
  // Update enrolled courses
  set((state) => ({
    enrolledCourses: [...state.enrolledCourses, response.course],
    isLoading: false,
  }));
};
```

## 🚨 Error Handling

### Global Error Handler (API Client)
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - try refresh
    } else if (error.response?.status === 403) {
      // Forbidden - show error
    } else if (error.response?.status === 500) {
      // Server error
    }
    return Promise.reject(error);
  }
);
```

### Component-Level Error Display
```typescript
{error && (
  <div className="text-red-600 text-sm mb-4">
    {error}
  </div>
)}
```

## 🧪 Testing the Integration

### 1. Test Login
```bash
# Start your backend API
# Make sure it's running on http://localhost:8080

# In frontend
npm run dev

# Visit http://localhost:3000/login
# Enter credentials and login
```

### 2. Check Browser DevTools
- **Application Tab**: Verify tokens in localStorage
- **Network Tab**: See API requests with Bearer tokens
- **Console**: Check for errors

### 3. Test Protected Routes
- Visit `/dashboard` without logging in → redirects to `/login`
- Login → should access `/dashboard`

## 🔍 Debugging

### Common Issues

#### 1. CORS Errors
```typescript
// Backend needs to allow CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

#### 2. Token Not Sent
- Check `localStorage.getItem("access_token")`
- Verify interceptor is adding header

#### 3. 401 Errors
- Token might be expired
- Check refresh token flow
- Verify token format in backend

#### 4. API URL Wrong
- Check `.env.local` file
- Restart dev server after changing env vars
- Use `console.log(process.env.NEXT_PUBLIC_API_URL)`

## 📝 API Response Format

### Expected Response Structure

#### Login Response
```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

#### Courses Response
```json
{
  "courses": [
    {
      "id": "1",
      "title": "Course Title",
      "instructor": "Instructor Name",
      "thumbnail": "https://...",
      "rating": 4.5,
      "reviewCount": 1234,
      "price": 19.99,
      "originalPrice": 99.99,
      "category": "Development",
      "level": "Beginner",
      "duration": "10h 30m",
      "studentsEnrolled": 5000
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 12
}
```

## 🎯 Next Steps

1. **Update API URL**: Change `NEXT_PUBLIC_API_URL` in `.env.local`
2. **Test All Endpoints**: Verify all API calls work with your backend
3. **Add More Features**:
   - Course search
   - Filters (category, level, price)
   - User profile page
   - Course reviews
   - Progress tracking
4. **Error Handling**: Add toast notifications (react-hot-toast)
5. **Loading States**: Add skeleton loaders
6. **Optimization**: Add React Query for caching

## 🛠️ Customization

### Change API Endpoints
Edit `lib/api/auth.ts` and `lib/api/courses.ts`:
```typescript
// Change endpoint URLs to match your backend
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post("/your-custom-endpoint", credentials),
};
```

### Add New API Services
Create new file in `lib/api/`:
```typescript
// lib/api/payments.ts
import { apiClient } from "./client";

export const paymentApi = {
  createPayment: (data) => apiClient.post("/payments", data),
  getPaymentHistory: () => apiClient.get("/payments/history"),
};
```

Then add to `lib/api/index.ts`:
```typescript
export * from "./payments";
```

### Add New Zustand Store
Create new file in `lib/store/`:
```typescript
// lib/store/useCartStore.ts
import { create } from "zustand";

interface CartState {
  items: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (course) => set((state) => ({
    items: [...state.items, course]
  })),
  removeFromCart: (courseId) => set((state) => ({
    items: state.items.filter(item => item.id !== courseId)
  })),
}));
```

## 📚 Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## ✅ Checklist

- [x] Install Zustand & Axios
- [x] Create API client with interceptors
- [x] Create Auth API service
- [x] Create Course API service
- [x] Create Auth Store
- [x] Create Course Store
- [x] Create ProtectedRoute component
- [x] Integrate Login page
- [x] Integrate Register page
- [x] Integrate Dashboard page
- [x] Integrate Header with logout
- [x] Create CourseList component
- [x] Update Landing page
- [ ] Test with real backend API
- [ ] Add error toast notifications
- [ ] Add loading skeletons
- [ ] Add more API endpoints

---

**Last Updated**: January 2025  
**Version**: 1.0.0
