# CoursUE - Clean & Scalable Udemy-like Learning Platform

A modern, production-ready Next.js starter for building online learning platforms. Built with TypeScript, Tailwind CSS, and following best practices for scalable frontend architecture.

## 🎯 Features

- ✅ **Clean Architecture** - Well-organized folder structure
- ✅ **Reusable Components** - Base & common component library
- ✅ **Layout System** - Multiple layouts for different page types
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling with design tokens
- ✅ **Mobile-First** - Responsive design out of the box
- ✅ **No UI Library** - Full control over styling

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public routes (landing pages)
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/             # Protected dashboard routes
│   │   └── dashboard/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles & Tailwind
│
├── components/
│   ├── base/                    # Atomic UI components
│   │   ├── Button.tsx          # Button with variants
│   │   ├── Input.tsx           # Input with labels & errors
│   │   ├── Badge.tsx           # Badge component
│   │   ├── Avatar.tsx          # Avatar with fallback
│   │   ├── Modal.tsx           # Modal component
│   │   └── index.ts            # Exports
│   │
│   ├── common/                  # Composite components
│   │   ├── Header.tsx          # Main navigation
│   │   ├── Footer.tsx          # Footer
│   │   ├── Sidebar.tsx         # Dashboard sidebar
│   │   ├── CourseCard.tsx      # Course display card
│   │   └── index.ts            # Exports
│   │
│   └── layout/                  # Layout wrappers
│       ├── MainLayout.tsx      # Header + Content + Footer
│       ├── DashboardLayout.tsx # Sidebar + Content
│       ├── AuthLayout.tsx      # Centered auth forms
│       └── index.ts            # Exports
│
├── lib/                         # Utilities & helpers
│   ├── utils.ts                # Helper functions (cn, formatters)
│   ├── types.ts                # TypeScript types
│   └── constants.ts            # App constants
│
└── styles/
    └── globals.css             # Already in app/
```

## 🎨 Design System

### Colors
- **Primary**: Purple theme (`primary-50` to `primary-900`)
- **Neutrals**: Gray scale for text and borders
- **Semantic**: Success, Warning, Error, Info

### Spacing
Uses **8px system** for consistent spacing:
- `space-1` = 4px
- `space-2` = 8px  
- `space-4` = 16px
- `space-8` = 32px

### Typography
- `text-xs` to `text-4xl` with defined line heights
- Default: System font stack for best performance

### Components

#### Base Components
All in `src/components/base/`:

**Button** - Multiple variants
```tsx
<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" isLoading>Loading</Button>
<Button variant="ghost">Subtle</Button>
```

**Input** - With labels and error handling
```tsx
<Input 
  label="Email" 
  type="email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

**Badge** - For tags and labels
```tsx
<Badge variant="primary">Development</Badge>
<Badge variant="success">Published</Badge>
```

**Avatar** - With fallback initials
```tsx
<Avatar name="John Doe" src="/avatar.jpg" size="md" />
```

**Modal** - Overlay modal
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Modal Title">
  {children}
</Modal>
```

### Layout System

#### 1. MainLayout
**Use for**: Public pages, landing page, course catalog
- Header (sticky)
- Content area
- Footer

```tsx
import { MainLayout } from '@/components/layout';

export default function Page() {
  return (
    <MainLayout>
      <YourContent />
    </MainLayout>
  );
}
```

#### 2. DashboardLayout
**Use for**: Authenticated user pages, learning dashboard
- Sidebar navigation
- Content area with container

```tsx
import { DashboardLayout } from '@/components/layout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <YourDashboard />
    </DashboardLayout>
  );
}
```

#### 3. AuthLayout
**Use for**: Login, register, forgot password
- Centered card
- Logo header
- Footer links

```tsx
import { AuthLayout } from '@/components/layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <YourLoginForm />
    </AuthLayout>
  );
}
```

## 🚀 Getting Started

1. **Install dependencies**
```bash
npm install
# or
yarn install
```

2. **Install missing packages** (if needed)
```bash
npm install clsx tailwind-merge
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📄 Available Pages

- `/` - Landing page (MainLayout)
- `/login` - Login page (AuthLayout)
- `/register` - Register page (AuthLayout)
- `/dashboard` - User dashboard (DashboardLayout)

## 🏗️ Architecture Decisions

### Why This Structure?

1. **Separation of Concerns**
   - `base/` = primitive UI building blocks
   - `common/` = business-specific components
   - `layout/` = page structure templates

2. **Scalability**
   - Easy to add new components
   - Clear import paths with barrel exports
   - TypeScript for type safety

3. **Maintainability**
   - Co-located files (component + types)
   - Single responsibility per component
   - Consistent naming conventions

4. **Performance**
   - No heavy UI library
   - Tree-shakeable exports
   - Next.js Image optimization

### Route Groups
Using Next.js route groups `()` for organization:
- `(public)` - Public routes, uses MainLayout
- `(auth)` - Auth routes, uses AuthLayout  
- `(dashboard)` - Protected routes, uses DashboardLayout

Route groups don't affect URL paths, just code organization.

## 🎯 Next Steps

### To Extend This Base:

1. **Add Authentication**
   - Install NextAuth.js or similar
   - Add auth state management
   - Protect dashboard routes

2. **Add State Management**
   - Zustand for global state
   - React Query for server state

3. **Add API Integration**
   - Create `/lib/api` folder
   - Add API client
   - Type API responses

4. **Add More Components**
   - Dropdown menus
   - Tabs
   - Cards
   - Tables

5. **Add Features**
   - Course detail pages
   - Video player
   - Progress tracking
   - Payments integration

## 📚 Code Style

- **Components**: PascalCase (e.g., `Button.tsx`)
- **Utilities**: camelCase (e.g., `formatPrice`)
- **Types**: PascalCase interfaces (e.g., `Course`, `User`)
- **Files**: Match component name

## 🤝 Contributing

This is a starter template. Feel free to:
- Add more components
- Improve existing components
- Add documentation
- Share feedback

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**
