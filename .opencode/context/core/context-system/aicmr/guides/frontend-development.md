# Guide: Frontend Development

**Core Idea**: Build AiCMR frontend using Next.js 16 with React 19, Tailwind CSS, shadcn/ui components, Zustand state management, and TanStack Query for server state, following established patterns for forms, API calls, and performance optimization.

**Key Points**:
1. Use Next.js App Router with async server components where possible
2. Implement Zustand stores for client-side state (theme, sidebar, etc.)
3. Apply TanStack Query for server state management with caching and background updates
4. Use React Hook Form with Zod validation for complex forms
5. Implement debouncing for search inputs and code splitting for large components

**Quick Example**:
```typescript
'use client'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/store'

export default function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers
  })
  
  const theme = useStore(state => state.theme)
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {users?.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  )
}
```

**Reference**: docs/04-frontend-guide.md

**Related**: concepts/jwt-authentication.md, concepts/upload-module.md