# Quick Start Guide - Admin UI Setup

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3000` (or configure API_URL)
- JWT authentication working

## Installation Steps

### 1. Install Dependencies

```bash
cd coursue-frontend
npm install react-hook-form
# or
yarn add react-hook-form
```

### 2. Verify API Client Configuration

Check `src/lib/api/client.ts` has correct base URL:

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  // ...
});
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Navigate to: `http://localhost:3001/admin/courses`

## File Checklist

Verify these files were created:

### Routes

- [x] `src/app/(admin)/layout.tsx`
- [x] `src/app/(admin)/admin/courses/page.tsx`
- [x] `src/app/(admin)/admin/courses/new/page.tsx`

### Components

- [x] `src/components/common/AdminSidebar.tsx`
- [x] `src/components/common/AdminHeader.tsx`
- [x] `src/components/base/Textarea.tsx`
- [x] `src/components/course/CourseCard.tsx`
- [x] `src/components/course/CourseBasicInfoForm.tsx`
- [x] `src/components/course/SectionManager.tsx`
- [x] `src/components/course/LessonManager.tsx`
- [x] `src/components/course/LessonNode.tsx`
- [x] `src/components/course/LessonModal.tsx`
- [x] `src/components/course/VideoUpload.tsx`
- [x] `src/components/course/CourseReview.tsx`

### API & Types

- [x] `src/lib/types/course.ts`
- [x] `src/lib/api/course.ts`
- [x] `src/lib/api/section.ts`
- [x] `src/lib/api/lesson.ts`

## Testing the Flow

### 1. Create a New Course

1. Go to `/admin/courses`
2. Click "Create Course"
3. Fill in basic info:
   - Title: "Test Course"
   - Description: "Test description"
   - Category: "Programming"
   - Level: "Beginner"
   - Price: 49.99
4. Click "Create Course & Continue"

### 2. Add Sections

1. Add section:
   - Title: "Introduction"
   - Description: "Getting started"
2. Click "Add Section"
3. Repeat for more sections
4. Click "Continue to Lessons"

### 3. Manage Lessons (Tree Structure)

1. Select a section from dropdown
2. Click "Add Root Lesson"
3. Fill in lesson details:
   - Title: "Welcome Video"
   - Type: "Video"
   - Duration: 300 (seconds)
   - Check "Free preview" if desired
4. Click "Create Lesson"
5. To add child lesson:
   - Click green "+" button on parent lesson
   - Child will be nested under parent
6. To upload video:
   - Click blue upload icon
   - Select video file (< 500MB)
   - Click "Upload Video"
   - Wait for progress bar
   - Click "Preview Existing" to see video

### 4. Review & Publish

1. Click "Continue to Review"
2. Verify all details
3. Click "Finish & View Course"
4. Redirected to course list

## API Endpoints Used

```
GET    /courses                                      # List courses
POST   /admin/courses                                # Create course
PUT    /admin/courses/:id                            # Update course
DELETE /admin/courses/:id                            # Delete course

POST   /admin/courses/sections                       # Create section
PUT    /admin/courses/sections/:id                   # Update section
DELETE /admin/courses/sections/:id                   # Delete section

POST   /admin/courses/lessons                        # Create lesson
PUT    /admin/courses/lessons/:id                    # Update lesson
DELETE /admin/courses/lessons/:id                    # Delete lesson
GET    /admin/courses/sections/:sectionId/lessons/tree  # Get tree

POST   /admin/courses/lessons/:id/video              # Upload video
GET    /admin/courses/lessons/:id/video-url          # Get video URL
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Common Issues & Solutions

### Issue: "Cannot find module 'react-hook-form'"

**Solution:**

```bash
npm install react-hook-form
```

### Issue: API calls failing with CORS error

**Solution:** Ensure backend has CORS configured:

```typescript
app.enableCors({
  origin: "http://localhost:3001",
  credentials: true,
});
```

### Issue: JWT token not sent

**Solution:** Check `src/lib/api/client.ts` interceptor adds Authorization header:

```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### Issue: Video upload fails

**Checklist:**

- File size < 500MB
- File type is video/\*
- Backend configured for multipart/form-data
- R2 credentials set in backend

### Issue: Lesson tree not rendering

**Solution:** Check API returns proper structure:

```json
[
  {
    "id": "uuid",
    "parentId": null,
    "children": [...]
  }
]
```

## Performance Tips

1. **Optimize Images**: Replace `<img>` with Next.js `<Image>`

```tsx
import Image from "next/image";
<Image src={thumbnail} alt={title} width={400} height={225} />;
```

2. **Add Loading States**: Already implemented
3. **Enable React Strict Mode**: Check `next.config.ts`
4. **Use Production Build**: `npm run build && npm start`

## Next Steps

1. **Add Edit Course Page**: Create `[courseId]/edit/page.tsx`
2. **Implement Drag & Drop**: Use `@dnd-kit/core` for reordering
3. **Add Rich Text Editor**: Use `@tiptap/react` for lesson content
4. **Image Upload**: For course thumbnails
5. **Bulk Operations**: Select multiple items
6. **Search & Filter**: Add course filtering

## Architecture Decisions

**Why No Global State?**

- Admin UI has simple data flow
- Each page fetches its own data
- Mutations trigger local refetch
- Simpler to maintain

**Why React Hook Form?**

- Type-safe form handling
- Built-in validation
- Minimal re-renders
- Great DX

**Why No UI Library?**

- Custom design control
- Smaller bundle size
- Tailwind CSS sufficient
- Better performance

**Why Tree Structure?**

- Matches backend data model
- Unlimited nesting support
- Better content organization
- Familiar pattern (file explorer)

## Support

For issues or questions:

1. Check `ADMIN_UI_DOCS.md` for detailed documentation
2. Review API responses in Network tab
3. Check browser console for errors
4. Verify backend is running and accessible

## Summary

You now have a complete admin UI with:

- ✅ Multi-step course creation
- ✅ Section management
- ✅ Hierarchical lesson tree (unlimited nesting)
- ✅ Video upload with progress
- ✅ Type-safe API integration
- ✅ Responsive design
- ✅ Production-ready code

Start creating courses and building your platform! 🚀
