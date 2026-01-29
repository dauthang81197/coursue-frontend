# Quick Reference - API & State Management

## 🚀 Quick Start

### 1. Update API URL
```bash
# Edit .env.local
NEXT_PUBLIC_API_URL=http://your-backend-url/api
```

### 2. Import Stores
```typescript
import { useAuthStore, useCourseStore } from "@/lib/store";
```

## 🔐 Authentication Examples

### Login
```typescript
"use client";
import { useAuthStore } from "@/lib/store";

function LoginForm() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({
      email: "user@example.com",
      password: "password123"
    });
    // Auto-redirects on success
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p className="text-red-600">{error}</p>}
      <button disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
```

### Register
```typescript
const { register, isLoading, error } = useAuthStore();

await register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});
```

### Logout
```typescript
const { logout } = useAuthStore();

const handleLogout = async () => {
  await logout();
  router.push("/");
};
```

### Check Auth Status
```typescript
const { user, isAuthenticated } = useAuthStore();

if (isAuthenticated) {
  console.log("Logged in as:", user.name);
}
```

## 📚 Course Store Examples

### Fetch All Courses
```typescript
import { useEffect } from "react";
import { useCourseStore } from "@/lib/store";

function CoursePage() {
  const { courses, isLoading, error, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses({ page: 1, limit: 12 });
  }, [fetchCourses]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### Fetch Courses with Filters
```typescript
const { fetchCourses } = useCourseStore();

// Filter by category
fetchCourses({ category: "Development" });

// Filter by level
fetchCourses({ level: "Beginner" });

// Search
fetchCourses({ search: "react" });

// Combined filters
fetchCourses({
  category: "Development",
  level: "Beginner",
  page: 1,
  limit: 10
});
```

### Fetch Enrolled Courses
```typescript
const { enrolledCourses, fetchEnrolledCourses } = useCourseStore();

useEffect(() => {
  fetchEnrolledCourses();
}, [fetchEnrolledCourses]);
```

### Fetch Single Course
```typescript
const { currentCourse, fetchCourseById } = useCourseStore();

useEffect(() => {
  fetchCourseById("course-id-123");
}, [fetchCourseById]);
```

### Enroll in Course
```typescript
const { enrollCourse } = useCourseStore();

const handleEnroll = async (courseId: string) => {
  await enrollCourse(courseId);
  alert("Enrolled successfully!");
};
```

## 🛡️ Protected Routes

### Wrap Page with Protection
```typescript
import { ProtectedRoute } from "@/components/common";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Only authenticated users can see this</div>
    </ProtectedRoute>
  );
}
```

### Or Use in Layout
```typescript
import { ProtectedRoute } from "@/components/common";

export const DashboardLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <Sidebar />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
};
```

## 🎨 UI Component Examples

### Course List with API
```typescript
import { CourseList } from "@/components/common";

function HomePage() {
  return (
    <div>
      <CourseList 
        title="Featured Courses" 
        showSeeAll={true} 
        limit={6} 
      />
    </div>
  );
}
```

### Custom Loading State
```typescript
const { isLoading } = useCourseStore();

return (
  <div>
    {isLoading ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    ) : (
      <CourseList />
    )}
  </div>
);
```

### Error Handling
```typescript
const { error, clearError } = useCourseStore();

return (
  <div>
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={clearError}
          className="text-red-600 underline"
        >
          Dismiss
        </button>
      </div>
    )}
  </div>
);
```

## 🔧 Direct API Calls

### Using Auth API Directly
```typescript
import { authApi } from "@/lib/api";

// Login
const response = await authApi.login({
  email: "user@example.com",
  password: "password123"
});

// Register
const response = await authApi.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});

// Get current user
const user = await authApi.getCurrentUser();

// Logout
await authApi.logout();

// Refresh token
const newToken = await authApi.refreshToken(refreshToken);
```

### Using Course API Directly
```typescript
import { courseApi } from "@/lib/api";

// Get all courses
const response = await courseApi.getCourses({
  page: 1,
  limit: 10,
  category: "Development"
});

// Get single course
const course = await courseApi.getCourseById("course-id");

// Enroll
await courseApi.enrollCourse("course-id");

// Get progress
const progress = await courseApi.getCourseProgress("course-id");
```

## 🔄 State Access Outside Components

### Access Store State Anywhere
```typescript
import { useAuthStore, useCourseStore } from "@/lib/store";

// Get current state
const currentUser = useAuthStore.getState().user;
const courses = useCourseStore.getState().courses;

// Call actions
await useAuthStore.getState().login(credentials);
await useCourseStore.getState().fetchCourses();
```

### Subscribe to State Changes
```typescript
import { useAuthStore } from "@/lib/store";

// Subscribe to changes
const unsubscribe = useAuthStore.subscribe(
  (state) => state.user,
  (user) => {
    console.log("User changed:", user);
  }
);

// Cleanup
unsubscribe();
```

## 📊 Pagination Example

```typescript
const { 
  courses, 
  total, 
  page, 
  limit, 
  fetchCourses 
} = useCourseStore();

const totalPages = Math.ceil(total / limit);

const handlePageChange = (newPage: number) => {
  fetchCourses({ page: newPage, limit });
};

return (
  <div>
    {/* Course list */}
    {courses.map(course => <CourseCard key={course.id} course={course} />)}
    
    {/* Pagination */}
    <div className="flex gap-2">
      <button 
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button 
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  </div>
);
```

## 🔍 Search Example

```typescript
"use client";
import { useState } from "react";
import { useCourseStore } from "@/lib/store";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchCourses } = useCourseStore();

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses({ search: searchTerm, page: 1 });
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search courses..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

## ⚠️ Common Patterns

### Loading State Pattern
```typescript
const { isLoading } = useAuthStore();

return (
  <button disabled={isLoading}>
    {isLoading ? (
      <>
        <Spinner />
        Processing...
      </>
    ) : (
      "Submit"
    )}
  </button>
);
```

### Conditional Rendering by Auth
```typescript
const { isAuthenticated } = useAuthStore();

return (
  <div>
    {isAuthenticated ? (
      <UserDashboard />
    ) : (
      <GuestLanding />
    )}
  </div>
);
```

### Optimistic Updates
```typescript
const { enrollCourse, courses } = useCourseStore();

const handleEnroll = async (courseId: string) => {
  // Show optimistic UI immediately
  setIsEnrolled(true);
  
  try {
    await enrollCourse(courseId);
  } catch (error) {
    // Revert on error
    setIsEnrolled(false);
    alert("Failed to enroll");
  }
};
```

## 🚨 Error Handling Patterns

### Try-Catch Pattern
```typescript
const { login } = useAuthStore();

try {
  await login(credentials);
  router.push("/dashboard");
} catch (error) {
  console.error("Login failed:", error);
  setCustomError("Invalid credentials");
}
```

### Using Store Error
```typescript
const { error, isLoading, fetchCourses } = useCourseStore();

useEffect(() => {
  fetchCourses();
}, [fetchCourses]);

if (error) {
  return (
    <div className="text-red-600">
      Error: {error}
      <button onClick={() => fetchCourses()}>Retry</button>
    </div>
  );
}
```

## 🎯 Best Practices

1. **Use hooks in components**: Always use `useAuthStore()` and `useCourseStore()` inside React components
2. **Clean up effects**: Use proper dependency arrays in `useEffect`
3. **Handle errors**: Always show error states to users
4. **Loading states**: Show loading indicators during async operations
5. **Optimistic updates**: Update UI immediately for better UX
6. **Token management**: Tokens are automatically handled by interceptors

---

**Quick Links**:
- [Full API Guide](./API_INTEGRATION_GUIDE.md)
- [Tailwind V4 Fix](./TAILWIND_V4_FIX.md)
- [README](./README.md)
