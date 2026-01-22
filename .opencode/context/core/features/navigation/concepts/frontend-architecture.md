# Frontend Architecture - Navigation System

## Core Concept
AiCMR's frontend uses a **4-layout architecture** with intelligent navigation. Each layout (Public, Auth, User, Dashboard) has distinct responsibilities and components. Smart Navbar and Footer are reused globally; Breadcrumb and QuickNavigation cards provide context.

## Key Components

### Global Layout Stack
```
RootLayout (ThemeProvider, AuthProvider)
├── PublicLayout (Navbar + Footer)
├── AuthLayout (Navbar + centered form + Footer)
├── UserLayout (Navbar + UserSidebar + Footer)
└── DashboardLayout (Navbar + AdminSidebar + Footer)
```

### New Layout Components
- **Navbar**: Smart rendering based on auth state (unauthenticated/user/moderator shows different menus)
- **Footer**: Company info, quick links, contact, social, legal (on all layouts)
- **Breadcrumb**: Auto-generated from pathname with home icon
- **QuickNavigation**: Card-based action buttons with icons and descriptions

## Routes & Access Control
```
Public: / /(public)/blog /(public)/blog/[slug]
Auth: /(auth)/login /(auth)/register
User: /user/profile /user/change-password /user/posts /user/posts/new
Dashboard: /dashboard/stats /dashboard/users-manager /dashboard/posts /dashboard/settings
```

## Rank-Based Permissions
- **Rank 0-2**: User area only (/user/*)
- **Rank 3-4**: User + moderator dashboard (/dashboard/stats, /dashboard/users-manager)
- **Rank 5**: Full admin access (all /dashboard/*, /user/*)

**Dependencies**: Tailwind CSS, Lucide React icons, Next.js App Router
