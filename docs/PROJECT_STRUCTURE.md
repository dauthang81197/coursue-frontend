# CoursUE Project Structure

## Complete Folder Tree

```
coursue-frontend/
│
├── public/                          # Static assets
│   ├── next.svg
│   └── vercel.svg
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (public)/               # Route group: Public pages
│   │   │   └── [Future: courses, about, etc.]
│   │   │
│   │   ├── (auth)/                 # Route group: Authentication
│   │   │   ├── login/
│   │   │   │   └── page.tsx       # Login page
│   │   │   └── register/
│   │   │       └── page.tsx       # Register page
│   │   │
│   │   ├── (dashboard)/           # Route group: User dashboard
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # Dashboard page
│   │   │
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage (landing)
│   │   └── globals.css           # Global styles
│   │
│   ├── components/
│   │   ├── base/                 # Primitive UI components
│   │   │   ├── Avatar.tsx       # User avatar with fallback
│   │   │   ├── Badge.tsx        # Label badges
│   │   │   ├── Button.tsx       # Button with variants
│   │   │   ├── Input.tsx        # Form input with validation
│   │   │   ├── Modal.tsx        # Overlay modal
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── common/               # Composite components
│   │   │   ├── CourseCard.tsx   # Course display card
│   │   │   ├── Footer.tsx       # Site footer
│   │   │   ├── Header.tsx       # Main navigation
│   │   │   ├── Sidebar.tsx      # Dashboard sidebar
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   └── layout/               # Layout templates
│   │       ├── AuthLayout.tsx   # Centered auth layout
│   │       ├── DashboardLayout.tsx  # Sidebar layout
│   │       ├── MainLayout.tsx   # Header + Footer layout
│   │       └── index.ts         # Barrel export
│   │
│   └── lib/                      # Utilities
│       ├── constants.ts          # App constants
│       ├── types.ts             # TypeScript types
│       └── utils.ts             # Helper functions
│
├── .gitignore
├── ARCHITECTURE.md              # This documentation
├── eslint.config.mjs           # ESLint config
├── next-env.d.ts              # Next.js types
├── next.config.ts             # Next.js config
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS config
├── README.md                  # Project readme
├── tailwind.config.ts         # Tailwind config
└── tsconfig.json             # TypeScript config
```

## Component Hierarchy

```
┌─────────────────────────────────────┐
│         LAYOUTS                     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │     MainLayout                │ │
│  ├───────────────────────────────┤ │
│  │  Header (common)              │ │
│  │  Content (children)           │ │
│  │  Footer (common)              │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   DashboardLayout             │ │
│  ├───────────────────────────────┤ │
│  │  Sidebar (common)             │ │
│  │  Content (children)           │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    AuthLayout                 │ │
│  ├───────────────────────────────┤ │
│  │  Logo                         │ │
│  │  Card (children)              │ │
│  │  Footer links                 │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         COMMON COMPONENTS           │
├─────────────────────────────────────┤
│  Header → Button, Avatar            │
│  Footer → Links                     │
│  Sidebar → Icons                    │
│  CourseCard → Badge, Stars          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         BASE COMPONENTS             │
├─────────────────────────────────────┤
│  Button, Input, Badge,              │
│  Avatar, Modal                      │
│  (No dependencies)                  │
└─────────────────────────────────────┘
```

## Import Flow

```
Pages (app/)
    ↓
Layouts (components/layout/)
    ↓
Common Components (components/common/)
    ↓
Base Components (components/base/)
    ↓
Utils (lib/)
```

## Key Files Explained

### Configuration Files

**tailwind.config.ts**
- Design tokens (colors, spacing, typography)
- Custom theme extensions
- 8px spacing system
- Udemy-inspired purple theme

**globals.css**
- Tailwind directives
- CSS variables
- Base styles
- Utility classes

### Core Components

**components/base/**
- Independent, reusable UI primitives
- No business logic
- Fully typed with TypeScript
- Variants via props

**components/common/**
- Business-specific components
- Uses base components
- Contains app logic
- Domain-specific (courses, auth, etc.)

**components/layout/**
- Page structure templates
- Wraps pages with consistent UI
- Manages common elements (header, footer, sidebar)

### Utilities

**lib/utils.ts**
- `cn()` - Merge Tailwind classes
- `formatPrice()` - Currency formatting
- `formatNumber()` - Number with K/M suffix
- `truncate()` - Text truncation

**lib/types.ts**
- Course, User, Lesson types
- Progress tracking types
- Shared interfaces

**lib/constants.ts**
- Routes
- Site config
- Categories

## Route Organization

### Route Groups (don't affect URLs)

**(public)/** - Marketing pages
- Landing
- Course catalog
- About, Contact

**(auth)/** - Authentication
- `/login`
- `/register`
- `/forgot-password`

**(dashboard)/** - User area
- `/dashboard`
- `/dashboard/courses`
- `/dashboard/settings`

## Data Flow (Future)

```
┌──────────┐
│  Server  │
│   API    │
└────┬─────┘
     │
     ↓
┌──────────┐
│  lib/api │ ← API client
└────┬─────┘
     │
     ↓
┌──────────┐
│  State   │ ← React Query / Zustand
│ Management│
└────┬─────┘
     │
     ↓
┌──────────┐
│Components│
└──────────┘
```

## Style Guide

### Naming Conventions
- **Components**: `PascalCase.tsx`
- **Utils**: `camelCase.ts`
- **Types**: `PascalCase` interfaces
- **CSS**: Tailwind utility classes

### File Organization
```
ComponentName.tsx
├── Imports
├── Types/Interfaces
├── Component definition
└── Export
```

### Component Pattern
```tsx
import React from "react";

export interface ComponentProps {
  // Props with JSDoc
}

/**
 * Component description
 * @example
 * <Component prop="value" />
 */
export const Component: React.FC<ComponentProps> = ({ prop }) => {
  return <div>{prop}</div>;
};
```

## Extension Points

### Adding a New Page
1. Create in appropriate route group
2. Choose layout
3. Import components
4. Add route to `constants.ts`

### Adding a New Component
1. Decide: base, common, or layout?
2. Create TypeScript file
3. Define props interface
4. Export from `index.ts`
5. Use in pages

### Adding Features
- Authentication → Use NextAuth.js
- State → Add Zustand store
- API → Create `lib/api/`
- Forms → Add React Hook Form
- Validation → Add Zod

---

**Last Updated**: Built with Next.js 15, TypeScript, Tailwind CSS
