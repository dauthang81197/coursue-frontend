# Enroll Flow Implementation

Đã tích hợp đầy đủ enroll flow với các API:

- `POST /api/courses/{id}/enroll` - Đăng ký khóa học
- `GET /api/courses/enrolled` - Lấy danh sách khóa học đã đăng ký

## Các màn hình đã được tích hợp:

### 1. Trang Chi tiết Khóa học (`/courses/[id]`)

**File:** `src/app/(dashboard)/courses/[id]/page.tsx`

**Tính năng:**

- ✅ Hiển thị thông tin đầy đủ của khóa học (title, instructor, rating, price, etc.)
- ✅ Nút "Enroll Now" để đăng ký khóa học
- ✅ Tự động kiểm tra user đã đăng ký chưa
- ✅ Hiển thị trạng thái "You're enrolled" nếu đã đăng ký
- ✅ Chuyển đổi nút thành "Continue Learning" nếu đã enroll
- ✅ Loading state khi đang xử lý enroll
- ✅ Success notification sau khi enroll thành công
- ✅ Redirect đến login nếu chưa đăng nhập

**Flow:**

```
User vào /courses/[id]
→ Check enrolled status
→ Nếu chưa enroll: Hiển thị "Enroll Now" button
→ Click Enroll → Call API → Success → Refresh enrolled courses
→ Nếu đã enroll: Hiển thị "You're enrolled" + "Continue Learning" button
```

### 2. Trang Danh sách Khóa học (`/courses`)

**File:** `src/app/(dashboard)/courses/page.tsx`

**Tính năng:**

- ✅ Hiển thị tất cả courses có sẵn
- ✅ Filter theo Category (All, Development, Business, Design, Marketing, etc.)
- ✅ Filter theo Level (All, Beginner, Intermediate, Advanced)
- ✅ Search courses theo tên
- ✅ Load more pagination
- ✅ Active filters display với khả năng xóa từng filter
- ✅ Clear all filters button
- ✅ Loading và error states

**Filters:**

- Category: All, Development, Business, Design, Marketing, IT & Software, Personal Development
- Level: All, Beginner, Intermediate, Advanced
- Search: Free text search
- Pagination: Load more button

### 3. Dashboard (`/dashboard`)

**File:** `src/app/(dashboard)/dashboard/page.tsx`

**Tính năng:**

- ✅ Hiển thị enrolled courses của user
- ✅ Sử dụng `EnrolledCourseCard` component với progress bar
- ✅ Fetch enrolled courses khi component mount
- ✅ Loading state khi đang fetch
- ✅ Empty state nếu chưa có course nào
- ✅ Link đến course learning page

### 4. Components

#### EnrolledCourseCard

**File:** `src/components/common/EnrolledCourseCard.tsx`

**Tính năng:**

- ✅ Horizontal card layout với thumbnail
- ✅ Hiển thị category badge
- ✅ Progress bar (0-100%)
- ✅ Link đến `/courses/[id]/learn`

#### CourseCard

**File:** `src/components/common/CourseCard.tsx`

**Tính năng:**

- ✅ Vertical card layout
- ✅ Thumbnail với hover effect
- ✅ Discount badge nếu có
- ✅ Rating stars và review count
- ✅ Meta info (duration, students enrolled)
- ✅ Price display với original price crossed out
- ✅ Link đến course detail page

#### CourseList

**File:** `src/components/common/CourseList.tsx`

**Cập nhật:**

- ✅ "See All" button link đến `/courses`

#### Sidebar

**File:** `src/components/common/Sidebar.tsx`

**Cập nhật:**

- ✅ Thay "Lesson" thành "Courses" menu item
- ✅ Link đến `/courses`

### 5. Store & API

#### useCourseStore

**File:** `src/lib/store/useCourseStore.ts`

**Actions đã có:**

- ✅ `fetchCourses(filters)` - Lấy danh sách courses với filter
- ✅ `fetchCourseById(id)` - Lấy chi tiết 1 course
- ✅ `fetchEnrolledCourses()` - Lấy danh sách enrolled courses
- ✅ `enrollCourse(courseId)` - Đăng ký khóa học
- ✅ Error handling và loading states

#### courseApi

**File:** `src/lib/api/courses.ts`

**API endpoints:**

- ✅ `getCourses(filters)` - GET /courses
- ✅ `getCourseById(id)` - GET /courses/:id
- ✅ `getEnrolledCourses()` - GET /courses/enrolled
- ✅ `enrollCourse(courseId)` - POST /courses/:id/enroll
- ✅ `getCourseProgress(courseId)` - GET /courses/:id/progress

## User Journey

### Journey 1: Browse và Enroll Course

```
1. User vào Homepage (/)
2. Click "See All" trên CourseList → Đến /courses
3. Filter/Search courses
4. Click vào course card → Đến /courses/[id]
5. Xem thông tin chi tiết
6. Click "Enroll Now"
7. Success → Enrolled courses update
8. Click "Continue Learning" → Đến learning page
```

### Journey 2: Dashboard View

```
1. User login và vào /dashboard
2. Xem "Continue Watching" section
3. Hiển thị enrolled courses với progress
4. Click vào course → Continue learning
```

### Journey 3: Direct Course Access

```
1. User có link /courses/[id]
2. Vào page → Check enrolled status
3. Nếu chưa enroll → Hiển thị "Enroll Now"
4. Nếu đã enroll → Hiển thị "Continue Learning"
```

## Navigation Structure

```
/                        → Homepage (CourseList with featured courses)
├── /courses            → All courses page (với filters)
├── /courses/[id]       → Course detail page (với enroll button)
├── /courses/[id]/learn → Learning page (TODO - chưa implement)
└── /dashboard          → Dashboard (enrolled courses)
```

## Type Updates

**File:** `src/lib/types.ts`

- ✅ Thêm `description?: string` vào Course interface

## Styling & UX

- ✅ Tailwind v4 compatible classes
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading spinners
- ✅ Error states
- ✅ Empty states
- ✅ Success notifications
- ✅ Hover effects
- ✅ Smooth transitions
- ✅ Progress bars cho enrolled courses

## Testing Flow

Để test enroll flow:

1. **Test Browse Courses:**

   ```
   - Vào /courses
   - Thử filter category, level
   - Thử search
   - Click "Load More"
   ```

2. **Test Course Detail:**

   ```
   - Click vào 1 course card
   - Kiểm tra thông tin hiển thị đúng
   - Click "Enroll Now"
   - Kiểm tra success notification
   - Kiểm tra button chuyển thành "Continue Learning"
   ```

3. **Test Dashboard:**

   ```
   - Vào /dashboard
   - Kiểm tra enrolled courses hiển thị
   - Kiểm tra progress bar
   - Click vào course card → Redirect đúng
   ```

4. **Test Navigation:**
   ```
   - Kiểm tra sidebar có menu "Courses"
   - Click vào "Courses" → Đến /courses
   - Homepage "See All" → Đến /courses
   ```

## Next Steps (Optional)

1. **Learning Page:** Tạo `/courses/[id]/learn` để user học course
2. **Progress Tracking:** Tích hợp API progress tracking thực tế
3. **Reviews:** Thêm review và rating system
4. **Wishlist:** Thêm tính năng wishlist
5. **Payment:** Tích hợp payment gateway nếu course có phí
6. **Certificate:** Tạo certificate page sau khi hoàn thành course
7. **My Learning:** Trang riêng cho enrolled courses với filters
8. **Course Preview:** Video preview trước khi enroll

## API Requirements

Backend cần đảm bảo:

- ✅ `POST /api/courses/{id}/enroll` - Return success/error
- ✅ `GET /api/courses/enrolled` - Return array of enrolled courses
- ⏳ `GET /api/courses/{id}/progress` - Return progress data (0-100%)
- ⏳ Authorization header với token từ localStorage

## Notes

- Store đã được setup với Zustand
- API client đã có interceptor để tự động thêm auth token
- Error handling đã được implement ở store level
- Loading states được quản lý centralized trong store
- Course type đã được update để support description field
