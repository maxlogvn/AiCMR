# Optimization Techniques

Kỹ thuật tối ưu hiệu năng cho frontend Next.js.

## Code Splitting

```typescript
import dynamic from 'next/dynamic';

// Lazy load component lớn
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>
});

function Page() {
  return <HeavyComponent />;
}
```

## Debouncing (Tìm kiếm)

```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 2  // Chỉ search khi >= 3 ký tự
  });
}
```

## Memoization (Danh sách lớn)

```typescript
import { memo } from 'react';

// Memoize user row component
const UserRow = memo(({ user }: { user: User }) => {
  return <div>{user.name} - {user.email}</div>;
});

function UserList({ users }: { users: User[] }) {
  return (
    <div>
      {users.map(user => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={200}
  priority  // Load ngay cho LCP (Largest Contentful Paint)
/>

// Với dynamic images
<Image
  src={user.avatar}
  alt={user.name}
  width={100}
  height={100}
  fill={false}  // Không sử dụng object-fit
/>
```

## Server Actions

```typescript
// Tận dụng Server Components cho data fetching
export default async function UserList() {
  const users = await fetchUsers();  // Async ở server component

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

## Query Invalidation

```typescript
// Invalidate nhiều queries cùng lúc
const mutation = useMutation({
  mutationFn: updateData,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }
});
```

## Bundle Analysis

```bash
# Phân tích bundle size
docker compose exec frontend npm run build
# Xem báo cáo tại .next/analyze/
```

## Tham Chiếu
- Frontend libraries: `lookup/frontend-libraries.md`
- Frontend guide: `concepts/code-style-frontend.md`
- Performance: https://nextjs.org/docs/app/building-your-application/optimizing
