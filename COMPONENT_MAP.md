# 🗺️ Component Map - Visual Guide

## Component Hierarchy & Usage

```
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYERS                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: BASE COMPONENTS (No Dependencies)                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Button  │  │  Input   │  │  Badge   │  │  Avatar  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌──────────┐                                               │
│  │  Modal   │                                               │
│  └──────────┘                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: COMMON COMPONENTS (Uses Base)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │     Header      │  │     Footer      │                  │
│  │  Uses: Button   │  │  Uses: Links    │                  │
│  │        Avatar   │  │                 │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Sidebar      │  │   CourseCard    │                  │
│  │  Uses: Icons    │  │  Uses: Badge    │                  │
│  │                 │  │        Image    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: LAYOUTS (Uses Common + Base)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │            MainLayout                         │          │
│  ├───────────────────────────────────────────────┤          │
│  │  Header (common)                              │          │
│  │  ├─ Search bar                                │          │
│  │  ├─ Navigation                                │          │
│  │  └─ User menu (Avatar)                        │          │
│  ├───────────────────────────────────────────────┤          │
│  │  Content Area (children)                      │          │
│  ├───────────────────────────────────────────────┤          │
│  │  Footer (common)                              │          │
│  │  └─ Links, social, copyright                  │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │         DashboardLayout                       │          │
│  ├───────────────────────────────────────────────┤          │
│  │  Sidebar │  Content Area                      │          │
│  │  (common)│  (children)                        │          │
│  │          │                                     │          │
│  │  ├─ Nav  │  User dashboard content            │          │
│  │  ├─ Nav  │                                     │          │
│  │  └─ Nav  │                                     │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │           AuthLayout                          │          │
│  ├───────────────────────────────────────────────┤          │
│  │  Logo                                         │          │
│  │  ┌─────────────────────────────┐             │          │
│  │  │  White Card                 │             │          │
│  │  │  (children - form content)  │             │          │
│  │  └─────────────────────────────┘             │          │
│  │  Footer links                                 │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: PAGES (Uses Layouts)                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Home Page          →  MainLayout                           │
│  Login Page         →  AuthLayout                           │
│  Register Page      →  AuthLayout                           │
│  Dashboard Page     →  DashboardLayout                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### Base Components

#### Button
```tsx
Variants: primary | outline | ghost | danger
Sizes:    sm | md | lg
States:   default | hover | loading | disabled

Usage:
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

#### Input
```tsx
Features: label | error | helperText | validation

Usage:
<Input 
  label="Email"
  type="email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

#### Badge
```tsx
Variants: default | primary | success | warning | error
Sizes:    sm | md

Usage:
<Badge variant="primary" size="sm">
  Development
</Badge>
```

#### Avatar
```tsx
Sizes:    sm | md | lg
Features: image | fallback initials

Usage:
<Avatar 
  name="John Doe"
  src="/avatar.jpg"
  size="md"
/>
```

#### Modal
```tsx
Sizes:    sm | md | lg
Features: overlay | click-outside-close | title

Usage:
<Modal isOpen={true} onClose={handleClose} title="Title">
  Content
</Modal>
```

---

### Common Components

#### Header
```
Structure:
├─ Logo
├─ Search Bar (desktop)
├─ Navigation
│  ├─ My Learning (authenticated)
│  ├─ Notifications
│  └─ User Avatar
└─ Mobile Menu (mobile)

Uses: Button, Avatar
```

#### Footer
```
Structure:
├─ Brand Column
├─ Quick Links
├─ Support Links
├─ Social Links
└─ Copyright

Uses: Links (Next.js)
```

#### Sidebar
```
Structure:
├─ Logo
├─ Overview Section
│  ├─ Dashboard
│  ├─ Lesson
│  ├─ Task
│  └─ Group
└─ Settings Section
   ├─ Settings
   └─ Logout

Uses: Icons (SVG)
```

#### CourseCard
```
Structure:
├─ Thumbnail Image
│  └─ Discount Badge
├─ Category Badge
├─ Title
├─ Instructor
├─ Rating & Reviews
├─ Meta (duration, students)
└─ Price

Uses: Badge, Image (Next.js)
```

---

### Layouts

#### MainLayout
```
Use For: Landing, Browse, Public pages

Structure:
┌─────────────────────┐
│      Header         │  ← Sticky navigation
├─────────────────────┤
│                     │
│      Content        │  ← Page content (children)
│                     │
├─────────────────────┤
│      Footer         │
└─────────────────────┘

Pages Using:
- Home (/)
```

#### DashboardLayout
```
Use For: User dashboard, Learning pages

Structure:
┌─────────┬───────────┐
│         │           │
│ Sidebar │  Content  │  ← Dashboard content
│         │           │
└─────────┴───────────┘

Pages Using:
- Dashboard (/dashboard)
```

#### AuthLayout
```
Use For: Login, Register, Auth pages

Structure:
┌─────────────────────┐
│                     │
│       Logo          │
│   ┌───────────┐     │
│   │   Card    │     │  ← Centered form
│   └───────────┘     │
│    Footer Links     │
│                     │
└─────────────────────┘

Pages Using:
- Login (/login)
- Register (/register)
```

---

## Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                    DATA FLOW                             │
└──────────────────────────────────────────────────────────┘

User Input
    ↓
Components (Base)
    ↓
Event Handlers
    ↓
State Updates (React State)
    ↓
Re-render
    ↓
UI Update


Future with API:

User Action
    ↓
Event Handler
    ↓
API Call (lib/api)
    ↓
State Management (React Query / Zustand)
    ↓
Component Re-render
    ↓
UI Update
```

---

## Import Patterns

### Pages Import Layouts
```tsx
// app/page.tsx
import { MainLayout } from '@/components/layout';

export default function Home() {
  return (
    <MainLayout>
      {/* content */}
    </MainLayout>
  );
}
```

### Layouts Import Common
```tsx
// components/layout/MainLayout.tsx
import { Header, Footer } from '@/components/common';

export const MainLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);
```

### Common Import Base
```tsx
// components/common/Header.tsx
import { Button, Avatar } from '@/components/base';

export const Header = () => (
  <header>
    <Button>Login</Button>
    <Avatar name="User" />
  </header>
);
```

### Base Import Nothing
```tsx
// components/base/Button.tsx
// No component dependencies!
// Only React and types
```

---

## File Dependencies

```
pages (app/)
  ↓ imports
layouts (components/layout/)
  ↓ imports
common (components/common/)
  ↓ imports
base (components/base/)
  ↓ imports
lib (utils, types)
  ↓ imports
Nothing (pure utilities)
```

---

## Component Composition Examples

### Example 1: Course Catalog Page
```tsx
MainLayout
└── CourseCard[] (grid)
    ├── Badge (category)
    ├── Image (thumbnail)
    └── Badge (discount)
```

### Example 2: Login Page
```tsx
AuthLayout
└── Form
    ├── Input (email)
    ├── Input (password)
    ├── Button (submit)
    └── Button[] (social login)
```

### Example 3: Dashboard
```tsx
DashboardLayout
├── Sidebar
│   └── Navigation Links
└── Content
    ├── Stats Cards
    ├── CourseCard[] (continue watching)
    └── Avatar[] (mentors)
```

---

## Styling Patterns

### All Components Follow:
```tsx
1. Base Styles (Tailwind classes)
2. Variant Styles (props-based)
3. Size Styles (props-based)
4. Custom Overrides (className prop)

Example:
<Button 
  variant="primary"      // Color variant
  size="md"             // Size variant
  className="shadow-lg" // Custom addition
/>
```

### Design Token Usage:
```tsx
// ✅ Good - Use tokens
bg-primary-600
px-4 py-2

// ❌ Avoid - Magic numbers
bg-[#8b5cf6]
px-[16px]
```

---

## Component Responsibility

### Base Components
- ✅ Pure UI primitives
- ✅ Styling logic
- ✅ Variant handling
- ❌ No business logic
- ❌ No API calls

### Common Components
- ✅ Composite UI
- ✅ Business presentation
- ✅ Uses base components
- ⚠️ Minimal state
- ❌ No API calls

### Layouts
- ✅ Page structure
- ✅ Common UI elements
- ✅ Content wrapping
- ❌ No data fetching
- ❌ No business logic

### Pages
- ✅ Data fetching
- ✅ Business logic
- ✅ State management
- ✅ Uses layouts
- ✅ Composes components

---

**This map shows the complete component architecture and how pieces fit together!**
