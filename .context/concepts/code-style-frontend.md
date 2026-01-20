# Code Style - Frontend (TypeScript/Next.js)

Quy chuẩn code cho frontend theo Next.js 15 + TypeScript best practices.

## Naming Conventions
- **Component File**: `PascalCase.tsx` → `UserProfile.tsx`, `DashboardLayout.tsx`
- **UI Components (shadcn)**: `lowercase.tsx` → `button.tsx`, `card.tsx`
- **Hook/Util**: `camelCase.ts` → `useAuth.ts`, `formatDate.ts`
- **Props/Interface**: `NameProps` → `UserProfileProps`, `DashboardProps`

## Component Types

**Server Components (mặc định)**:
- Không có `"use client"`
- Render ở server, tốt cho SEO
- Dùng cho: Static content, data fetching

```tsx
// ✅ Server Component
export default function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);  // Can use await
  return <div>{user.name}</div>;
}
```

**Client Components**:
- Bắt đầu với `"use client"`
- Dùng cho: Interactive UI, hooks, state

```tsx
"use client"

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Styling

**Tailwind CSS 4**:
```tsx
import { cn } from '@/lib/utils';

// Dùng cn() utility để gộp class động
function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-blue-500 text-white",
        variant === "secondary" && "bg-gray-200",
        className
      )}
      {...props}
    />
  );
}
```

**Tham khảo**: `lookup/commands-quickref.md` (thêm shadcn component)

## State Management

**Server State** (@tanstack/react-query):
```tsx
import { useQuery, useMutation } from '@tanstack/react-query';

function UserProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    }
  });
}
```

**Client State** (zustand):
```tsx
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

## TypeScript Types

**BẮT BUỘC types cho mọi component, prop, function**:

```tsx
// Component props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  // ...
}

// Function return type
async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/api/v1/users/${userId}`);
  return response.json();
}
```

## Imports Order

Sử dụng alias `@/` cho `src/`:
```tsx
// 1. React & Next
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

// 3. Local imports
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { fetchUser } from '@/lib/api/users';
import type { User } from '@/types/user';
```

Sắp xếp alphabet trong từng nhóm.

## Error Handling

```tsx
"use client"

import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
}
```

## Tham Khảo
- Backend code style: `concepts/code-style.md`
- Architecture: `concepts/architecture.md`
- Examples: `examples/api-endpoint.md`
