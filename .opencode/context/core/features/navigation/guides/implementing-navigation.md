# Implementing Navigation in AiCMR

## Adding Breadcrumb to Pages

**Minimal Setup**:
```tsx
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function MyPage() {
  return (
    <>
      <Breadcrumb />
      {/* Page content */}
    </>
  );
}
```

**Process**:
1. Add route to breadcrumbMap in Breadcrumb.tsx if new route
2. Import and place `<Breadcrumb />` at top of content
3. Breadcrumb auto-generates from pathname
4. Verify in browser: refresh page, breadcrumb appears

---

## Adding QuickNavigation Cards

**Setup**:
```tsx
import QuickNavigation from "@/components/layout/QuickNavigation";
import { Users, Lock, Home } from "lucide-react";

const links = [
  {
    label: "Change Password",
    href: "/user/change-password",
    icon: <Lock className="h-5 w-5" />,
    description: "Update your password"
  },
  { label: "Home", href: "/", icon: <Home />, description: "Go home" }
];

export default function Page() {
  return <QuickNavigation links={links} title="Quick Actions" />;
}
```

**Steps**:
1. Import component and icons from lucide-react
2. Define links array with label/href/icon/description
3. Render component with links and title
4. Component handles responsive grid (1/2/3 columns)

---

## Creating Layouts with Navigation Stack

**Pattern**: Import navbar, sidebars, footer in layout files.

**Example**:
```tsx
// app/user/layout.tsx
import Navbar from "@/components/layout/Navbar";
import UserSidebar from "@/components/user/UserSidebar";
import Footer from "@/components/layout/Footer";

export default function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <UserSidebar />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
```

**Steps**:
1. Import navigation components
2. Wrap children with Navbar/Sidebar/Footer
3. Use Flexbox for sidebar + main layout
4. Ensure responsive with Tailwind breakpoints
