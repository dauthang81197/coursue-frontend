# 🚀 CoursUE - Udemy-like Learning Platform

A **clean, scalable Next.js starter** for building online learning platforms. Built with TypeScript, Tailwind CSS, and following best practices for scalable frontend architecture.

## ✨ Features

- ✅ **Clean Architecture** - Well-organized folder structure
- ✅ **Reusable Components** - Base & common component library
- ✅ **Layout System** - Multiple layouts for different page types
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling with design tokens
- ✅ **Mobile-First** - Responsive design out of the box
- ✅ **No UI Library** - Full control over styling

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📦 What's Included

### Components
- **Base**: Button, Input, Badge, Avatar, Modal
- **Common**: Header, Footer, Sidebar, CourseCard
- **Layouts**: MainLayout, DashboardLayout, AuthLayout

### Pages
- `/` - Landing page
- `/login` - Authentication
- `/register` - Sign up
- `/dashboard` - User dashboard

### Design System
- Tailwind config with design tokens
- 8px spacing system
- Purple brand theme (Udemy-inspired)
- Typography scale

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Full architecture guide & API reference
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed folder structure

## 🎯 Quick Examples

### Using Components
```tsx
import { Button, Input } from '@/components/base';
import { MainLayout } from '@/components/layout';

export default function Page() {
  return (
    <MainLayout>
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </MainLayout>
  );
}
```

### Adding a New Page
1. Create file in `src/app/your-page/page.tsx`
2. Choose a layout
3. Import components

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: SVG inline
- **Fonts**: System font stack

## 📁 Project Structure

```
src/
├── app/                 # Next.js routes
│   ├── (public)/       # Landing pages
│   ├── (auth)/         # Login, register
│   └── (dashboard)/    # User dashboard
├── components/
│   ├── base/           # UI primitives
│   ├── common/         # Composite components
│   └── layout/         # Page layouts
└── lib/                # Utils & types
```

## 🚀 Next Steps

1. **Add Authentication** - NextAuth.js
2. **State Management** - Zustand or Redux
3. **API Integration** - Axios or Fetch
4. **Form Validation** - React Hook Form + Zod
5. **More Components** - Dropdown, Tabs, Cards

## 📝 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
